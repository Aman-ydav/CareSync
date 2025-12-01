import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "@/features/auth/authSlice";
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
  Camera
} from "lucide-react";

const RegisterForm = ({ switchToLogin, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genderRef.current && !genderRef.current.contains(event.target)) {
        setOpenGender(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target)) {
        setOpenRole(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  
  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    const fd = new FormData();
    fd.append("userName", formData.userName);
    fd.append("fullName", formData.fullName);
    fd.append("email", formData.email);
    fd.append("password", formData.password);
    fd.append("confirmPassword", formData.confirmPassword);
    fd.append("role", formData.role);
    fd.append("gender", formData.gender);

    if (avatar) fd.append("avatar", avatar);

    const result = await dispatch(registerUser(fd)).unwrap();

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
    { value: "ADMIN", label: "Administrator", icon: BriefcaseMedical },
  ];

  const genders = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const getRoleIcon = (roleValue) => {
    const role = roles.find((r) => r.value === roleValue);
    return role ? <role.icon className="h-4 w-4" /> : <UserCircle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">Create a CareSync account</p>
      </div>

      {/* AVATAR UPLOAD */}
      <div className="w-full flex justify-center">
        <label className="relative group cursor-pointer">
          <div className="w-24 h-24 rounded-full border border-border bg-muted flex items-center justify-center overflow-hidden">
            {avatarPreview ? (
              <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-8 h-8 text-muted-foreground" />
            )}
          </div>

          <input type="file"  name="avatar" accept="image/*" className="hidden" onChange={handleAvatar} />

          <span className="absolute bottom-1 right-1 bg-primary text-white p-1 rounded-full">
            <Camera className="w-4 h-4" />
          </span>
        </label>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Username */}
        <div>
          <Label>Username</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              name="userName"
              placeholder="Enter Username"
              value={formData.userName}
              onChange={handleChange}
              className="pl-9"
            />
          </div>
          {errors.userName && <p className="text-xs text-destructive">{errors.userName}</p>}
        </div>

        {/* Name + Email + Passwords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div>
            <Label>Full Name</Label>
            <Input
              name="fullName"
              placeholder="Enter Fullname"
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
          </div>

          <div>
            <Label>Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="email"
                type="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                className="pl-9"
              />
            </div>
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          <div>
            <Label>Password</Label>
            <Input
              name="password"
              type="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
          </div>

          <div>
            <Label>Confirm Password</Label>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <Label>Gender</Label>
            <div className="relative" ref={genderRef}>
              <button
                type="button"
                onClick={() => setOpenGender(!openGender)}
                className="w-full h-10 px-3 border rounded-md flex items-center justify-between"
              >
                {formData.gender || "Select gender"}
                <ChevronDown className="h-4 w-4" />
              </button>
              {openGender && (
                <div className="absolute w-full bg-white border rounded-md mt-1 shadow">
                  {genders.map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-muted"
                      onClick={() => {
                        setFormData((p) => ({ ...p, gender: g.value }));
                        setOpenGender(false);
                      }}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.gender && <p className="text-xs text-destructive">{errors.gender}</p>}
          </div>

          {/* Role */}
          <div>
            <Label>I am a</Label>
            <div className="relative" ref={roleRef}>
              <button
                type="button"
                onClick={() => setOpenRole(!openRole)}
                className="w-full h-10 px-3 border rounded-md flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  {formData.role ? (
                    <>
                      {getRoleIcon(formData.role)}
                      {roles.find((r) => r.value === formData.role)?.label}
                    </>
                  ) : (
                    "Select role"
                  )}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {openRole && (
                <div className="absolute w-full bg-white border rounded-md mt-1 shadow">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      className="w-full px-3 py-2 flex items-center gap-2 hover:bg-muted"
                      onClick={() => {
                        setFormData((p) => ({ ...p, role: role.value }));
                        setOpenRole(false);
                      }}
                    >
                      <role.icon className="h-4 w-4" />
                      {role.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.role && <p className="text-xs text-destructive">{errors.role}</p>}
          </div>
        </div>

        {/* SUBMIT */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-primary text-white"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      {/* FOOTER */}
      <div className="text-center pt-2">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button variant="link" onClick={switchToLogin} className="p-0 text-primary">
            Sign in
          </Button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
