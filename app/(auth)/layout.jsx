import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex justify-center min-h-screen pt-40 bg-one">
      {children}
    </div>
  );
};

export default AuthLayout;
