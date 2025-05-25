import React from 'react';

interface TableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T;
    cell?: (value: T[keyof T], item: T) => React.ReactNode;
  }[];
  className?: string;
}

export function Table<T extends Record<string, any>>({
  data,
  columns,
  className = '',
}: TableProps<T>) {
  return (
    <div className="w-full overflow-hidden">
      {/* Desktop view */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${className}`}>
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {data.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                    >
                      {column.cell
                        ? column.cell(item[column.accessor], item)
                        : item[column.accessor]?.toString()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 space-y-3"
          >
            {columns.map((column, colIndex) => (
              <div key={colIndex} className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {column.header}
                </span>
                <span className="text-sm text-gray-900 dark:text-gray-100 text-right">
                  {column.cell
                    ? column.cell(item[column.accessor], item)
                    : item[column.accessor]?.toString()}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
} 