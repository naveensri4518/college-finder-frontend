export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const left = Math.max(0, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  for (let i = left; i <= right; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button
        className="page-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        aria-label="Previous page"
      >
        ‹
      </button>

      {left > 0 && (
        <>
          <button className="page-btn" onClick={() => onPageChange(0)}>1</button>
          {left > 1 && <span style={{ color: 'var(--text-muted)', padding: '0 4px' }}>…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          className={`page-btn ${p === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(p)}
          aria-current={p === currentPage ? 'page' : undefined}
        >
          {p + 1}
        </button>
      ))}

      {right < totalPages - 1 && (
        <>
          {right < totalPages - 2 && <span style={{ color: 'var(--text-muted)', padding: '0 4px' }}>…</span>}
          <button className="page-btn" onClick={() => onPageChange(totalPages - 1)}>
            {totalPages}
          </button>
        </>
      )}

      <button
        className="page-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        aria-label="Next page"
      >
        ›
      </button>
    </div>
  );
}
