export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() =>
          onPageChange(currentPage - 1)
        }
      >
        Prev
      </button>

      <span>
        {currentPage} / {totalPages}
      </span>

      <button
        onClick={() =>
          onPageChange(currentPage + 1)
        }
      >
        Next
      </button>
    </div>
  );
}