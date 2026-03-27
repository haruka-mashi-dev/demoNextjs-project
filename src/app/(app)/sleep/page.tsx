import AppHeader from "@/app/(app)/_components/app-header";
import SleepContainer from "@/app/(app)/sleep/_components/sleep-container";

export default async function SleepPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  return (
    <>
      <AppHeader title="Sleep Log" backHref="/" />
      <main className="min-h-screen bg-slate-50 px-4 py-8">
        <SleepContainer page={page} />
      </main>
    </>
  );
}
