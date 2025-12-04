import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/api/axiosInterceptor";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function PatientProfileForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    medicalHistory: "",
    bloodGroup: "",
    allergies: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: ""
  });

  // Prefill existing values
  useEffect(() => {
    if (user) {
      setForm({
        medicalHistory: user.medicalHistory || "",
        bloodGroup: user.bloodGroup || "",
        allergies: (user.allergies || []).join(", "),
        emergencyName: user.emergencyContact?.name || "",
        emergencyPhone: user.emergencyContact?.phone || "",
        emergencyRelation: user.emergencyContact?.relationship || ""
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
        medicalHistory: form.medicalHistory,
        bloodGroup: form.bloodGroup,
        allergies: form.allergies.split(",").map(s => s.trim()),
        emergencyContact: {
          name: form.emergencyName,
          phone: form.emergencyPhone,
          relationship: form.emergencyRelation
        }
      };

      const res = await api.patch("/users/update-account", payload);
      dispatch(updateUser(res.data.data));

      toast.success("Profile updated!");
      navigate("/dashboard");

      setForm({
        medicalHistory: "",
        bloodGroup: "",
        allergies: "",
        emergencyName: "",
        emergencyPhone: "",
        emergencyRelation: ""
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
        <Label>Medical History</Label>
        <textarea
          name="medicalHistory"
          value={form.medicalHistory}
          onChange={handleChange}
          className="w-full border rounded-md p-3 h-24"
        />
      </div>

      <div className="space-y-1.5">
        <Label>Blood Group</Label>
        <Input name="bloodGroup" value={form.bloodGroup} onChange={handleChange}/>
      </div>

      <div className="space-y-1.5">
        <Label>Allergies (comma separated)</Label>
        <Input name="allergies" value={form.allergies} onChange={handleChange}/>
      </div>

      <h4 className="font-semibold mt-4">Emergency Contact</h4>

      <div className="space-y-1.5">
        <Label>Name</Label>
        <Input name="emergencyName" value={form.emergencyName} onChange={handleChange}/>
      </div>

      <div className="space-y-1.5">
        <Label>Phone</Label>
        <Input name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange}/>
      </div>

      <div className="space-y-1.5">
        <Label>Relationship</Label>
        <Input name="emergencyRelation" value={form.emergencyRelation} onChange={handleChange}/>
      </div>

      <Button type="submit" disabled={loading} className="w-full h-11">
        {loading ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  );
}
