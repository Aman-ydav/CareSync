import { useSelector } from "react-redux";
import DoctorProfileForm from "@/components/profile/DoctorProfileForm";
import PatientProfileForm from "@/components/profile/PatientProfileForm";

export default function CompleteProfilePage() {
  const { user } = useSelector(s => s.auth);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto pt-6 mt-16">
      <h2 className="text-2xl font-bold mb-6">
        Complete Your Profile
      </h2>

      {user.role === "DOCTOR" && <DoctorProfileForm />}
      {user.role === "PATIENT" && <PatientProfileForm />}
      {user.role === "ADMIN" && (
        <p>No extra fields needed for admin.</p>
      )}
    </div>
  );
}
