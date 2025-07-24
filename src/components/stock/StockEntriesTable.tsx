import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Table } from 'lucide-react';

const StockEntriesTable: React.FC = () => {
  const { stockEntries } = useData();

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex items-center space-x-3 mb-6">
        <Table className="text-orange-500" />
        <h2 className="text-xl font-semibold text-white">Stock History</h2>
      </div>

      <div className="overflow-x-auto bg-black border border-gray-800 rounded-xl p-6">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="bg-gray-900 text-gray-400">
            <tr>
              <th className="text-left px-4 py-2">Product</th>
              <th className="text-left px-4 py-2">Quantity</th>
              <th className="text-left px-4 py-2">Added By</th>
              <th className="text-left px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {stockEntries.map(entry => (
              <tr key={entry.id} className="border-t border-gray-800">
                <td className="px-4 py-3">{entry.product_name}</td>
                <td className="px-4 py-3">{entry.quantity}</td>
                <td className="px-4 py-3">{entry.added_by}</td>
                <td className="px-4 py-3">{new Date(entry.date).toLocaleString()}</td>
              </tr>
            ))}
            {stockEntries.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-4">
                  No stock entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockEntriesTable;
