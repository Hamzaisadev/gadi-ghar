import React from 'react';

const LoadingSpinner = ({ size = "md", className, text }) => {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-8 w-8 border-2", 
    lg: "h-12 w-12 border-2",
    xl: "h-16 w-16 border-2"
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div 
        className={`animate-spin rounded-full border-b-2 border-car-red ${sizeClasses[size]} ${className || ''}`}
      />
      {text && (
        <p className="text-sm text-gray-600 text-center">{text}</p>
      )}
    </div>
  );
};

const FullScreenSpinner = ({ text = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="xl" text={text} />
    </div>
  );
};

const InlineSpinner = ({ size = "sm", className }) => {
  return <LoadingSpinner size={size} className={className} />;
};

const PageSpinner = ({ text = "Loading page..." }) => {
  return (
    <div className="flex items-center justify-center min-h-64">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
};


export { FullScreenSpinner, InlineSpinner, PageSpinner ,LoadingSpinner };
