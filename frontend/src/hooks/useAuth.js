import { useSelector } from "react-redux";

export const useAuth = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const role = user?.role || null;

  return {
    user,
    role,
    isAuthenticated,
    loading,
    isAdmin: role === "ADMIN",
    isDoctor: role === "DOCTOR",
    isPatient: role === "PATIENT",
  };
};
