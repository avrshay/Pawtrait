import "./Table.css";
export default function Table({ data, columns, renderActions }) {
  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  return (
    <table border="1">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col}>{col}</th>
          ))}
          {renderActions && <th>Actions</th>}
        </tr>
      </thead>

      <tbody>
        {data.map((row, index) => (
          <tr key={row.id || row.orderId}>
            {columns.map((col) => (
              <td key={col}>{row[col]}</td>
            ))}

            {renderActions && (
              <td>{renderActions(row)}</td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}