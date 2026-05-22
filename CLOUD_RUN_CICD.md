# CI/CD GitHub Actions ke Cloud Run (Metode Paling Gampang: Service Account JSON Key)

Dokumen ini menjelaskan langkah lengkap dari nol: mulai setup project di GCP, setup IAM, setup Artifact Registry, setup secrets GitHub, sampai verifikasi deploy.

> Catatan: metode ini sengaja pakai JSON key karena paling cepat diimplementasikan. Setelah stabil, disarankan migrasi ke Workload Identity Federation agar lebih aman.

## Arsitektur Singkat

Alur deploy:
1. Push ke branch `main`.
2. GitHub Actions build image Docker aplikasi.
3. Image di-push ke Artifact Registry.
4. GitHub Actions deploy image tersebut ke Cloud Run.

Workflow yang digunakan: `.github/workflows/deploy-cloud-run.yml`.

---

## 1) Prasyarat

Pastikan kamu punya:
- Akun Google Cloud dengan billing aktif.
- Project GCP (baru atau existing).
- Repository GitHub untuk project ini.
- Akses Owner/Editor ke project GCP (minimal saat setup awal).

Tools lokal (opsional, tapi sangat membantu):
- `gcloud` CLI
- Docker

---

## 2) Setup Project di GCP (dari nol)

### 2.1 Buat / pilih project

Di Google Cloud Console:
- Buka **Select Project** → **New Project** (atau pilih project existing).
- Simpan `PROJECT_ID` karena akan dipakai terus.

Contoh nilai:
- `PROJECT_ID=my-portfolio-prod`

### 2.2 Set project aktif di CLI

```bash
gcloud config set project PROJECT_ID
```

### 2.3 Pilih region

Pilih region Cloud Run, misalnya:
- `asia-southeast2` (Jakarta)

Contoh:
- `GCP_REGION=asia-southeast2`

### 2.4 Aktifkan API yang dibutuhkan

```bash
gcloud services enable run.googleapis.com artifactregistry.googleapis.com iamcredentials.googleapis.com cloudbuild.googleapis.com
```

Keterangan:
- `run.googleapis.com` → Cloud Run
- `artifactregistry.googleapis.com` → registry image Docker
- `iamcredentials.googleapis.com` → kredensial IAM
- `cloudbuild.googleapis.com` → sering dipakai dependensi build/deploy di ekosistem GCP

---

## 3) Buat Artifact Registry (Docker)

Buat repository image:

```bash
gcloud artifacts repositories create REPO_NAME \
  --repository-format=docker \
  --location=GCP_REGION \
  --description="Docker images for portfolio"
```

Contoh:
- `REPO_NAME=web-images`

Nanti image akan punya host:
- `asia-southeast2-docker.pkg.dev/PROJECT_ID/REPO_NAME/...`

---

## 4) Buat Service Account untuk GitHub Actions

### 4.1 Buat service account

```bash
gcloud iam service-accounts create github-deployer \
  --display-name="GitHub Actions Deployer"
```

Email service account biasanya jadi:
- `github-deployer@PROJECT_ID.iam.gserviceaccount.com`

### 4.2 Beri IAM roles minimal

```bash
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:github-deployer@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:github-deployer@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:github-deployer@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"
```

Role ini cukup untuk:
- deploy Cloud Run
- push image ke Artifact Registry
- bertindak sebagai service account saat deploy

### 4.3 Buat JSON key

```bash
gcloud iam service-accounts keys create key-github-deployer.json \
  --iam-account="github-deployer@PROJECT_ID.iam.gserviceaccount.com"
```

Simpan file ini dengan aman. Isinya akan dimasukkan ke GitHub Secret.

---

## 5) Setup GitHub Secrets

Buka:
**GitHub Repo → Settings → Secrets and variables → Actions → New repository secret**

Tambahkan secret berikut:

- `GCP_PROJECT_ID` = `PROJECT_ID`
- `GCP_REGION` = `asia-southeast2` (atau region pilihanmu)
- `ARTIFACT_REGISTRY_REPO` = `REPO_NAME` (contoh `web-images`)
- `CLOUD_RUN_SERVICE` = nama service Cloud Run (contoh `portfolio-web`)
- `GCP_SA_KEY` = **isi seluruh konten** file `key-github-deployer.json`

Penting untuk `GCP_SA_KEY`:
- Paste seluruh JSON apa adanya (termasuk `{}` dan newline).
- Jangan diubah formatnya.

---

## 6) Workflow GitHub Actions yang dipakai

Workflow berada di:
- `.github/workflows/deploy-cloud-run.yml`

Trigger:
- push ke `main`
- manual trigger (`workflow_dispatch`)

Proses utama:
1. Checkout kode.
2. Auth ke GCP pakai `credentials_json` (`GCP_SA_KEY`).
3. Setup gcloud.
4. Docker auth ke Artifact Registry.
5. Build image dengan tag commit SHA.
6. Push image.
7. Deploy ke Cloud Run port `8080`.

---

## 7) First Deploy (uji awal)

1. Commit perubahan ke repository.
2. Push ke branch `main`.
3. Buka tab **Actions** di GitHub.
4. Pantau job `Deploy to Cloud Run` sampai selesai.

Jika sukses, step terakhir akan print URL Cloud Run.

---

## 8) Verifikasi setelah deploy

Cek hal berikut:

1. Job Actions sukses (semua step hijau).
2. Image baru muncul di Artifact Registry dengan tag commit SHA.
3. Revisi baru muncul di Cloud Run service target.
4. URL Cloud Run bisa diakses.
5. Routing SPA aman saat refresh route non-root (tidak 404).
6. Endpoint health check opsional berfungsi:
   - `GET /healthz` → `200 ok`

---

## 9) Troubleshooting cepat

### A) Auth gagal di step `Authenticate to Google Cloud`
- Pastikan secret `GCP_SA_KEY` berisi JSON valid (tidak kepotong).
- Pastikan key berasal dari service account yang sama dengan IAM role deploy.

### B) Push image gagal
- Pastikan role `roles/artifactregistry.writer` sudah benar.
- Pastikan host registry sesuai region: `${GCP_REGION}-docker.pkg.dev`.
- Pastikan nama repo Artifact Registry (`ARTIFACT_REGISTRY_REPO`) benar.

### C) Deploy Cloud Run gagal
- Pastikan role `roles/run.admin` ada.
- Pastikan `roles/iam.serviceAccountUser` ada bila deploy menggunakan service account runtime.
- Pastikan `CLOUD_RUN_SERVICE` valid (nama service boleh baru atau existing).

### D) Aplikasi 404 saat reload route
- Pastikan Nginx config memakai:
  - `try_files $uri $uri/ /index.html;`

---

## 10) Rekomendasi keamanan setelah sudah stabil

Karena metode JSON key lebih mudah tapi kurang aman:
- Rotasi key service account secara berkala.
- Batasi akses service account seminimal mungkin.
- Pertimbangkan migrasi ke Workload Identity Federation (tanpa static key) saat pipeline sudah stabil.
