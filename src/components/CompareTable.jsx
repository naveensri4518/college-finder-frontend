const formatFees = (fees) => {
  if (!fees) return '—';
  if (fees >= 100000) return `₹${(fees / 100000).toFixed(1)}L/yr`;
  return `₹${fees.toLocaleString()}/yr`;
};

const formatPlacement = (p) => {
  if (!p) return '—';
  if (p >= 100000) return `₹${(p / 100000).toFixed(1)}L avg`;
  return `₹${p.toLocaleString()}`;
};

export default function CompareTable({ colleges }) {
  if (!colleges || colleges.length === 0) return null;

  const bestRating = Math.max(...colleges.map((c) => c.rating || 0));
  const bestPlacement = Math.max(...colleges.map((c) => c.placements || 0));
  const lowestFees = Math.min(...colleges.map((c) => c.fees || Infinity));

  const rows = [
    {
      label: '📍 Location',
      getValue: (c) => c.location || '—',
      isBest: () => false,
    },
    {
      label: '⭐ Rating',
      getValue: (c) => `${c.rating?.toFixed(1) || '—'} / 5.0`,
      isBest: (c) => c.rating === bestRating,
    },
    {
      label: '💰 Annual Fees',
      getValue: (c) => formatFees(c.fees),
      isBest: (c) => c.fees === lowestFees,
    },
    {
      label: '🏆 Avg Placement',
      getValue: (c) => formatPlacement(c.placements),
      isBest: (c) => c.placements === bestPlacement,
    },
    {
      label: '📚 Courses',
      getValue: (c) => c.courses ? c.courses.split(',')[0].trim() + '...' : '—',
      isBest: () => false,
    },
    {
      label: '🏛️ Facilities',
      getValue: (c) => c.facilities ? c.facilities.split(',').slice(0, 2).join(', ') + '...' : '—',
      isBest: () => false,
    },
  ];

  return (
    <div className="compare-table-wrapper">
      <table className="compare-table">
        <thead>
          <tr>
            <th>Feature</th>
            {colleges.map((c) => (
              <th key={c.id}>{c.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td>{row.label}</td>
              {colleges.map((c) => (
                <td key={c.id} className={row.isBest(c) ? 'compare-best' : ''}>
                  {row.getValue(c)}
                  {row.isBest(c) && <span style={{ marginLeft: 6, fontSize: '0.75rem' }}>✓ Best</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
