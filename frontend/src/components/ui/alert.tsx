import React from 'react';

interface AlertProps {
  variant?: 'default' | 'destructive';
  children: React.ReactNode;
}

interface AlertDescriptionProps {
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ variant = 'default', children }) => {
  const variantClasses = {
    default: 'bg-blue-100 text-blue-800',
    destructive: 'bg-red-100 text-red-800'
  };

  return (
    <div className={`p-4 rounded-lg ${variantClasses[variant]}`} role="alert">
      {children}
    </div>
  );
};

export const AlertDescription: React.FC<AlertDescriptionProps> = ({ children }) => {
  return <div className="mt-2 text-sm">{children}</div>;
};
