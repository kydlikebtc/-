import React from 'react';

interface TableProps {
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ children }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">{children}</table>
    </div>
  );
};

export const TableHeader: React.FC<TableProps> = ({ children }) => {
  return <thead className="bg-gray-50">{children}</thead>;
};

export const TableBody: React.FC<TableProps> = ({ children }) => {
  return <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>;
};

export const TableRow: React.FC<TableProps> = ({ children }) => {
  return <tr>{children}</tr>;
};

export const TableHead: React.FC<TableProps> = ({ children }) => {
  return (
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      {children}
    </th>
  );
};

export const TableCell: React.FC<TableProps> = ({ children }) => {
  return <td className="px-6 py-4 whitespace-nowrap">{children}</td>;
};
