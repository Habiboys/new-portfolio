import { supabase } from "./supabase";

export async function loginAdmin(email: string, password: string) {
  const { data, error } = await supabase!.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function logoutAdmin() {
  const { error } = await supabase!.auth.signOut();
  if (error) throw error;
}

export async function getAdminSession() {
  const { data, error } = await supabase!.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function isAdminUser(uid: string): Promise<boolean> {
  const { data } = await supabase!
    .from("admin_users")
    .select("id")
    .eq("id", uid)
    .maybeSingle();
  return !!data;
}

export function onAuthChange(callback: (event: string, session: any) => void) {
  return supabase!.auth.onAuthStateChange(callback);
}
