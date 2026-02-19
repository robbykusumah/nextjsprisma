"use client";

import { useRouter, useSearchParams } from "next/navigation";

const Pagination = ({ totalPages }: { totalPages: number }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="join">
      <button
        className="join-item btn"
        disabled={currentPage <= 1}
        onClick={() => createPageURL(currentPage - 1)}
      >
        «
      </button>
      <button className="join-item btn">Page {currentPage} of {totalPages}</button>
      <button
        className="join-item btn"
        disabled={currentPage >= totalPages}
        onClick={() => createPageURL(currentPage + 1)}
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
