"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  currentPage: number;
  hasNextPage: boolean;
};

export default function SleepPagination({ currentPage, hasNextPage }: Props) {
  const router = useRouter();

  return (
    <div className="flex justify-between">
      {currentPage > 1 ? (
        <Button
          variant="outline"
          onClick={() => router.push(`/sleep?page=${currentPage - 1}`)}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          ＜＜（新しい）
        </Button>
      ) : (
        <div />
      )}

      {hasNextPage && (
        <Button
          variant="outline"
          onClick={() => router.push(`/sleep?page=${currentPage + 1}`)}
          className="flex items-center gap-1"
        >
        ＞＞（古い）
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
