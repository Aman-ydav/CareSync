import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "@/features/auth/authSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Camera,
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  Loader2,
  ChevronDown,
  Stethoscope,
  Briefcase,
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
    phone: "",
    dob: "",
    gender: "",
  });

  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [errors, setErrors] = useState({});
  const [openGender, setOpenGender] = useState(false);
  const [openRole, setOpenRole] = useState(false);

  const genderRef = useRef(null);
  const roleRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      setPreviewAvatar(URL.createObjectURL(file));
    }
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
      await dispatch(
        registerUser({
          ...formData,
          confirmePassword: formData.confirmPassword, // map spelling mismatch
        })
      ).unwrap();

      toast.success("Account created successfully!");
      onClose();
      navigate("/dashboard");
    } catch (err) {
      toast.error(err || "Registration failed. Please try again.");
    }
  };

  const roles = [
    { value: "PATIENT", label: "Patient", icon: UserCircle },
    { value: "DOCTOR", label: "Doctor", icon: Stethoscope },
    { value: "ADMIN", label: "Administrator", icon: Briefcase },
  ];

  const genders = ["Male", "Female", "Other"];

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-2">
          <div className="p-3 rounded-full bg-primary/10">
            <Stethoscope className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
          Join CareSync
        </h2>
        <p className="text-muted-foreground">Create your healthcare account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar Upload */}
        <div className="flex justify-center">
          <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage src={previewAvatar} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <label
              htmlFor="avatar"
              className="absolute -bottom-1 -right-1 p-1 bg-primary rounded-full cursor-pointer"
            >
              <Camera className="h-3 w-3 text-white" />
            </label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                className="pl-9"
              />
            </div>
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <Label htmlFor="userName">Username</Label>
            <Input
              id="userName"
              name="userName"
              placeholder="Choose a username"
              value={formData.userName}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="pl-9"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Gender Selection */}
          <div>
            <Label htmlFor="gender">Gender</Label>
            <div className="relative" ref={genderRef}>
              <button
                type="button"
                onClick={() => setOpenGender(!openGender)}
                className="w-full flex items-center justify-between p-2 border rounded-md bg-background text-left"
              >
                {formData.gender || "Select gender"}
                <ChevronDown className="h-4 w-4" />
              </button>

              {openGender && (
                <div className="absolute z-10 w-full mt-1 bg-card border rounded-md shadow-lg">
                  {["Male", "Female", "Other"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, gender: g }));
                        setOpenGender(false);
                      }}
                      className="w-full p-2 hover:bg-accent text-left"
                    >
                      {g}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.gender && (
              <p className="text-sm text-destructive">{errors.gender}</p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <Label htmlFor="role">I am a</Label>
            <div className="relative" ref={roleRef}>
              <button
                type="button"
                onClick={() => setOpenRole(!openRole)}
                className="w-full flex items-center justify-between p-2 border rounded-md bg-background text-left"
              >
                <span className="flex items-center gap-2">
                  {formData.role ? (
                    <>
                      {(() => {
                        const role = roles.find(
                          (r) => r.value === formData.role
                        );
                        const Icon = role?.icon;
                        return Icon ? <Icon className="h-4 w-4" /> : null;
                      })()}
                      {roles.find((r) => r.value === formData.role)?.label}
                    </>
                  ) : (
                    "Select role"
                  )}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {openRole && (
                <div className="absolute z-10 w-full mt-1 bg-card border rounded-md shadow-lg">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, role: role.value }));
                        setOpenRole(false);
                      }}
                      className="w-full flex items-center gap-2 p-2 hover:bg-accent text-left"
                    >
                      <role.icon className="h-4 w-4" />
                      {role.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="pl-9"
              />
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-9"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full medical-gradient"
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
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button
            variant="link"
            className="p-0 text-primary"
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
