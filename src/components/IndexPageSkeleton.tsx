import { Skeleton } from "@/components/ui/skeleton";

function SectionTitleSkeleton() {
  return <Skeleton className="mx-auto h-10 w-48 bg-gray-200" />;
}

export function IndexPageSkeleton() {
  return (
    <>
      {/* Hero — mirror Index.tsx layout */}
      <section className="min-h-[90vh] sm:min-h-screen flex items-center justify-center px-4 sm:px-6 pt-28 sm:pt-32 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="flex justify-center">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[340px] mx-auto">
              <Skeleton className="aspect-[3/4] w-full rounded-2xl bg-gray-200" />
            </div>
          </div>

          <div className="space-y-4 max-w-xl mx-auto lg:mx-0 w-full">
            <Skeleton className="h-10 sm:h-12 w-full max-w-md mx-auto lg:mx-0 bg-gray-200" />
            <Skeleton className="h-7 sm:h-8 w-2/3 max-w-sm mx-auto lg:mx-0 bg-gray-200" />
            <Skeleton className="h-16 sm:h-20 w-full max-w-xl mx-auto lg:mx-0 bg-gray-200" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <Skeleton className="h-11 w-full sm:w-32 bg-gray-200" />
              <Skeleton className="h-11 w-full sm:w-36 bg-gray-200" />
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-12 md:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <SectionTitleSkeleton />
          <div className="space-y-4">
            <Skeleton className="h-5 w-full bg-gray-200" />
            <Skeleton className="h-5 w-full bg-gray-200" />
            <Skeleton className="h-5 w-11/12 bg-gray-200" />
            <Skeleton className="h-5 w-full bg-gray-200" />
            <Skeleton className="h-5 w-10/12 bg-gray-200" />
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="py-12 md:py-20 bg-gray-50 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-10">
          <SectionTitleSkeleton />
          <div className="flex justify-center gap-6 sm:gap-8 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-xl bg-gray-200" />
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-12 md:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Skeleton className="h-10 w-56 bg-gray-200" />
            <Skeleton className="h-10 w-24 bg-gray-200" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl bg-gray-200" />
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="py-12 md:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Skeleton className="h-10 w-52 bg-gray-200" />
            <Skeleton className="h-10 w-24 bg-gray-200" />
          </div>
          <Skeleton className="h-[280px] sm:h-[420px] w-full rounded-2xl bg-gray-200" />
        </div>
      </section>

      {/* Blog */}
      <section className="py-12 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Skeleton className="h-10 w-44 bg-gray-200" />
            <Skeleton className="h-10 w-24 bg-gray-200" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-video w-full rounded-xl bg-gray-200" />
                <Skeleton className="h-5 w-3/4 bg-gray-200" />
                <Skeleton className="h-16 w-full bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 md:py-20 px-4 sm:px-6">
        <Skeleton className="h-64 sm:h-80 w-full rounded-2xl bg-gray-300" />
      </section>
    </>
  );
}

export function BlogPreviewSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
          <Skeleton className="aspect-video w-full rounded-none bg-gray-200" />
          <div className="p-6 space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 bg-gray-200" />
              <Skeleton className="h-6 w-16 bg-gray-200" />
            </div>
            <Skeleton className="h-6 w-full bg-gray-200" />
            <Skeleton className="h-14 w-full bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
