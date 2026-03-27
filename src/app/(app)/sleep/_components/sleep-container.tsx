import SleepForm from "@/app/(app)/sleep/_components/sleep-form";
import SleepList from "@/app/(app)/sleep/_components/sleep-list";
import SleepPagination from "@/app/(app)/sleep/_components/sleep-pagination";
import { fetchSleepLogs, fetchHasNextPage } from "@/app/(app)/sleep/_lib/fetcher";

type Props = {
  page: number;
};

export default async function SleepContainer({ page }: Props) {
  const [sleepLogs, hasNextPage] = await Promise.all([
    fetchSleepLogs(page),
    fetchHasNextPage(page),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <SleepForm />
      <SleepList sleepLogs={sleepLogs} />
      <SleepPagination currentPage={page} hasNextPage={hasNextPage} />
    </div>
  );
}
