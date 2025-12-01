import { useSelector, useDispatch } from "react-redux";
import { showVerificationModal } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { AlertCircle, Mail, Timer } from "lucide-react";
import { Link } from "react-router-dom";


const DashboardHeader = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleVerifyClick = () => {
    if (user?.email) {
      dispatch(showVerificationModal(user.email));
    }
  };

 
  if (!user || user.isVerified) return null;

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-800">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h3 className="font-medium text-yellow-800 dark:text-yellow-300">
              Verify your email address
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              Please verify your email ({user.email}) to access all features
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleVerifyClick}
            variant="outline"
            size="sm"
            className="border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-800"
          >
            <Mail className="h-4 w-4 mr-2" />
            Verify Now
          </Button>
         
         <Link to="/dashboard">
          <Button
            variant="outline"
            size="sm"
            className="border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-800"
          >
            <Timer className="h-4 w-4 mr-2" />
            Do it Later
          </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;