"use client";

import { useState, useEffect } from "react";
import { X, Car, CheckCircle } from "lucide-react";
import { Button } from "./button";
import { useRouter } from "next/navigation";

const WelcomeModal = ({ 
  isVisible = false, 
  onClose, 
  dealershipName = "Your Dealership" 
}) => {
  const router = useRouter();
  const [isVisibleState, setIsVisibleState] = useState(isVisible);

  useEffect(() => {
    setIsVisibleState(isVisible);
  }, [isVisible]);

  if (!isVisibleState) return null;

  const handleGoToDashboard = () => {
    router.push('/dealership');
    onClose?.();
  };

  const handleClose = () => {
    setIsVisibleState(false);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🎉 Welcome to Gadi Ghar!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Congratulations! Your dealership <strong>{dealershipName}</strong> has been approved. 
            You're now ready to start selling cars on our platform.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-semibold text-blue-800 mb-2">Next Steps:</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Complete your dealership profile</li>
              <li>• Add your first car listing</li>
              <li>• Set up business hours</li>
              <li>• Start receiving customer inquiries</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleGoToDashboard}
              className="w-full bg-car-red hover:bg-car-red-dark"
            >
              <Car className="w-4 h-4 mr-2" />
              Go to Dealership Dashboard
            </Button>
            
            <Button 
              onClick={handleClose}
              variant="outline"
              className="w-full"
            >
              I'll do this later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
