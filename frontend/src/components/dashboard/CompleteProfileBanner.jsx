import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function CompleteProfileBanner() {
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  const isDoctor = user.role === "DOCTOR";
  const isPatient = user.role === "PATIENT";

  // DOCTOR Missing fields
  if (isDoctor && (
    !user.specialty ||
    !user.experienceYears ||
    !user.qualification ||
    !user.languagesSpoken?.length
  )) {
    return (
      <div className="mb-4 p-4  border border-yellow-600 rounded-lg bg-yellow-100">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <AlertTriangle className="text-yellow-800"/>
            <div>
              <h3 className="font-medium text-yellow-900">
                Complete your professional profile
              </h3>
              <p className="text-sm text-yellow-800">
                Add your specialty, experience, qualifications.
              </p>
            </div>
          </div>

          <Link to="/dashboard/complete-profile">
            <Button size="sm" className="bg-yellow-700 text-white">
              Complete Profile
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // PATIENT Missing fields
  if (isPatient && (
    !user.medicalHistory ||
    !user.bloodGroup ||
    !user.emergencyContact
  )) {
    return (
      <div className="mb-4 p-4 border border-blue-600 rounded-lg bg-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <AlertTriangle className="text-blue-800"/>
            <div>
              <h3 className="font-medium text-blue-900">
                Complete your medical profile
              </h3>
              <p className="text-sm text-blue-800">
                Add your health details to access complete features.
              </p>
            </div>
          </div>

          <Link to="/dashboard/complete-profile">
            <Button size="sm" className="bg-blue-700 text-white">
              Complete Profile
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
