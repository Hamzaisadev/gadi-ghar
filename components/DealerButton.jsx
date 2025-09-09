import { Car, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import TransitionLink from "./utils/TransitionLink";

const DealerButton = ({ applicationStatus }) => {
  const getDealerButtonInfo = () => {
    if (!applicationStatus) return { text: "Become a Dealer", href: "/dealership-signup", icon: Car };
    
    switch (applicationStatus) {
      case 'PENDING':
        return { text: "Check Application Status", href: "/dealership-signup", icon: Clock };
      case 'UNDER_REVIEW':
        return { text: "Application Under Review", href: "/dealership-signup", icon: Clock };
      case 'REQUIRES_CHANGES':
        return { text: "Update Application", href: "/dealership-signup", icon: AlertCircle };
      case 'REJECTED':
        return { text: "Resubmit Application", href: "/dealership-signup", icon: AlertCircle };
      case 'APPROVED':
        return { text: "My Dealership", href: "/dealership", icon: CheckCircle };
      default:
        return { text: "Become a Dealer", href: "/dealership-signup", icon: Car };
    }
  };

  const dealerButtonInfo = getDealerButtonInfo();
  const IconComponent = dealerButtonInfo.icon;

  return (
    <TransitionLink href={dealerButtonInfo.href}>
      <Button 
        variant="outline" 
        className="bg-car-red border-car-red text-white hover:bg-car-red-dark"
        title={dealerButtonInfo.text} // Add tooltip for accessibility
      >
        <IconComponent size={18} />
        <span className="hidden lg:inline">{dealerButtonInfo.text}</span>
      </Button>
    </TransitionLink>
  );
};

export default DealerButton;


