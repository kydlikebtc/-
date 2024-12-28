import React from 'react';

interface CardProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children }) => {
  return <div className="bg-white shadow rounded-lg">{children}</div>;
};

export const CardHeader: React.FC<CardProps> = ({ children }) => {
  return <div className="px-6 py-4 border-b">{children}</div>;
};

export const CardTitle: React.FC<CardProps> = ({ children }) => {
  return <h3 className="text-lg font-medium">{children}</h3>;
};

export const CardContent: React.FC<CardProps> = ({ children }) => {
  return <div className="px-6 py-4">{children}</div>;
};
