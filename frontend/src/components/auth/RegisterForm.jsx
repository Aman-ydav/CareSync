import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser, showVerificationModal } from "@/features/auth/authSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  User,
  Mail,
  Lock,
  Loader2,
  ChevronDown,
  Stethoscope,
  BriefcaseMedical,
  UserCircle,
} from "lucide-react";

const RegisterForm = ({ switchToLogin, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});
  const [openGender, setOpenGender] = useState(false);
  const [openRole, setOpenRole] = useState(false);

  const genderRef = useRef(null);
  const roleRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genderRef.current && !genderRef.current.contains(event.target)) {
        setOpenGender(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target)) {
        setOpenRole(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.userName.trim()) newErrors.userName = "Username is required";
    if (!formData.gender) newErrors.gender = "Please select gender";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.role) newErrors.role = "Please select your role";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(
        registerUser({
          ...formData,
          confirmePassword: formData.confirmPassword,
        })
      ).unwrap();

      // Show verification modal after successful registration
      if (result.requiresVerification) {
        dispatch(showVerificationModal(result.email));
        // Don't close modal or navigate - verification modal will show
      } else {
        toast.success("Account created successfully!");
        onClose();
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err || "Registration failed. Please try again.");
    }
  };

  const roles = [
    { value: "PATIENT", label: "Patient", icon: UserCircle },
    { value: "DOCTOR", label: "Doctor", icon: Stethoscope },
    { value: "ADMIN", label: "Administrator", icon: BriefcaseMedical },
  ];

  const genders = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const getRoleIcon = (roleValue) => {
    const role = roles.find(r => r.value === roleValue);
    return role ? <role.icon className="h-4 w-4" /> : <UserCircle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-2">
          <div className="p-3 rounded-full bg-primary/10">
            <Stethoscope className="h-6 w-6 text-primary" />
          </div>
        </div>
       
        <p className="text-sm text-gray-600">
          Create an CareSync account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <Label htmlFor="userName" className="text-sm font-medium text-gray-700">Username</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="userName"
              name="userName"
              placeholder="Enter Username"
              value={formData.userName}
              onChange={handleChange}
              className="pl-9 h-10"
            />
          </div>
          {errors.userName && (
            <p className="text-xs text-red-600 mt-1">{errors.userName}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Enter Fullname"
              value={formData.fullName}
              onChange={handleChange}
              className="h-10"
            />
            {errors.fullName && (
              <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                className="pl-9 h-10"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                className="pl-9 h-10"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-9 h-10"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Gender Dropdown */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Gender</Label>
            <div className="relative" ref={genderRef}>
              <button
                type="button"
                onClick={() => setOpenGender(!openGender)}
                className={`w-full flex items-center justify-between h-10 px-3 border rounded-md bg-white text-left transition-all ${
                  openGender ? 'border-primary ring-1 ring-primary' : 'border-gray-300'
                } ${formData.gender ? 'text-gray-900' : 'text-gray-500'}`}
              >
                <span>{formData.gender || "Select gender"}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${openGender ? 'rotate-180' : ''}`} />
              </button>
              
              {openGender && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {genders.map((gender) => (
                    <button
                      key={gender.value}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, gender: gender.value }));
                        setOpenGender(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-ring text-gray-700 transition-colors"
                    >
                      {gender.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.gender && (
              <p className="text-xs text-red-600 mt-1">{errors.gender}</p>
            )}
          </div>

          {/* Role Dropdown */}
          <div>
            <Label className="text-sm font-medium text-gray-700">I am a</Label>
            <div className="relative" ref={roleRef}>
              <button
                type="button"
                onClick={() => setOpenRole(!openRole)}
                className={`w-full flex items-center justify-between h-10 px-3 border rounded-md bg-white text-left transition-all ${
                  openRole ? 'border-primary ring-1 ring-primary' : 'border-gray-300'
                } ${formData.role ? 'text-gray-900' : 'text-gray-500'}`}
              >
                <span className="flex items-center gap-2">
                  {formData.role ? (
                    <>
                      {getRoleIcon(formData.role)}
                      {roles.find(r => r.value === formData.role)?.label}
                    </>
                  ) : "Select role"}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${openRole ? 'rotate-180' : ''}`} />
              </button>
              
              {openRole && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, role: role.value }));
                        setOpenRole(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-ring text-gray-700 transition-colors"
                    >
                      <role.icon className="h-4 w-4" />
                      {role.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.role && (
              <p className="text-xs text-red-600 mt-1">{errors.role}</p>
            )}
          </div>
        </div>

       
      
        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-primary hover:bg-primary/90 text-sm font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center pt-2">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Button
            variant="link"
            className="p-0 text-primary text-sm font-medium"
            onClick={switchToLogin}
          >
            Sign in
          </Button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;