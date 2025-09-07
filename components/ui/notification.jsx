"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Clock, Info } from "lucide-react";
import { Button } from "./button";

const Notification = ({ 
  type = "info", 
  title, 
  message, 
  isVisible = false, 
  onClose, 
  autoHide = true,
  autoHideDelay = 5000 
}) => {
  const [isVisibleState, setIsVisibleState] = useState(isVisible);

  useEffect(() => {
    setIsVisibleState(isVisible);
    
    if (autoHide && isVisible) {
      const timer = setTimeout(() => {
        setIsVisibleState(false);
        onClose?.();
      }, autoHideDelay);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHide, autoHideDelay, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "pending":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  if (!isVisibleState) return null;

  return (
    <div className={`fixed top-20 right-4 z-50 max-w-sm w-full ${getBgColor()} border rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <p className="text-sm font-medium text-gray-900 mb-1">
              {title}
            </p>
          )}
          {message && (
            <p className="text-sm text-gray-600">
              {message}
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsVisibleState(false);
              onClose?.();
            }}
            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
