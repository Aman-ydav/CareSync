import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/api/axiosInterceptor";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function DoctorProfileForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    specialty: "",
    experienceYears: "",
    qualification: "",
    languagesSpoken: "",
    about: "",
    start: "",
    end: ""
  });

  // Prefill existing user data
  useEffect(() => {
    if (user) {
      setForm({
        specialty: user.specialty || "",
        experienceYears: user.experienceYears || "",
        qualification: user.qualification || "",
        languagesSpoken: (user.languagesSpoken || []).join(", "),
        about: user.about || "",
        start: user.consultationHours?.start || "",
        end: user.consultationHours?.end || ""
      });
    }
  }, [user]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        specialty: form.specialty,
        experienceYears: form.experienceYears,
        qualification: form.qualification,
        languagesSpoken: form.languagesSpoken.split(",").map(s => s.trim()),
        about: form.about,
        consultationHours: {
          start: form.start,
          end: form.end
        }
      };

      const res = await api.patch("/users/update-account", payload);
      dispatch(updateUser(res.data.data));

      toast.success("Profile updated!");
      navigate("/dashboard"); // redirect user
      setForm({
        specialty: "",
        experienceYears: "",
        qualification: "",
        languagesSpoken: "",
        about: "",
        start: "",
        end: ""
      });

    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">

      <div className="space-y-1.5">
        <Label>Specialty</Label>
        <Input name="specialty" value={form.specialty} onChange={handleChange}/>
      </div>

      <div className="space-y-1.5">
        <Label>Experience (Years)</Label>
        <Input name="experienceYears" value={form.experienceYears} onChange={handleChange}/>
      </div>

      <div className="space-y-1.5">
        <Label>Qualification</Label>
        <Input name="qualification" value={form.qualification} onChange={handleChange}/>
      </div>

      <div className="space-y-1.5">
        <Label>Languages Spoken (comma separated)</Label>
        <Input name="languagesSpoken" value={form.languagesSpoken} onChange={handleChange}/>
      </div>

      <div className="space-y-1.5">
        <Label>About</Label>
        <textarea
          name="about"
          value={form.about}
          onChange={handleChange}
          className="w-full border rounded-md p-3 h-28"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <Label>Consultation Start</Label>
          <Input type="time" name="start" value={form.start} onChange={handleChange}/>
        </div>

        <div className="space-y-1.5">
          <Label>Consultation End</Label>
          <Input type="time" name="end" value={form.end} onChange={handleChange}/>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full h-11">
        {loading ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  );
}
