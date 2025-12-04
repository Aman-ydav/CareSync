import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDispatch } from "react-redux";
import api from "@/api/axiosInterceptor";
import { updateUser } from "@/features/auth/authSlice";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import {
  Mail,
  Phone,
} from "lucide-react";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, isDoctor, isPatient } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    dob: "",
    address: "",
    specialty: "",
    experienceYears: "",
    qualification: "",
    medicalHistory: "",
    bloodGroup: "",
    allergies: ""
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      fullName: user.fullName || "",
      phone: user.phone || "",
      dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
      address: user.address || "",
      specialty: user.specialty || "",
      experienceYears: user.experienceYears || "",
      qualification: user.qualification || "",
      medicalHistory: user.medicalHistory || "",
      bloodGroup: user.bloodGroup || "",
      allergies: user.allergies?.join(", ") || ""
    });
  }, [user]);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        fullName: form.fullName,
        phone: form.phone,
        dob: form.dob,
        address: form.address,
      };

      if (isDoctor) {
        payload.specialty = form.specialty;
        payload.experienceYears = form.experienceYears;
        payload.qualification = form.qualification;
      }

      if (isPatient) {
        payload.medicalHistory = form.medicalHistory;
        payload.bloodGroup = form.bloodGroup;
        payload.allergies = form.allergies.split(",").map(s => s.trim());
      }

      const res = await api.patch("/users/update-account", payload);
      dispatch(updateUser(res.data.data));
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadge = () => {
    const r = user?.role;
    const colors = {
      DOCTOR: "bg-blue-500",
      PATIENT: "bg-green-500",
      ADMIN: "bg-purple-500"
    };
    return (
      <Badge className={`${colors[r]} text-white`}>
        {r.charAt(0) + r.slice(1).toLowerCase()}
      </Badge>
    );
  };

  return (
    <div className="mt-16 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold">Profile</h1>
          <p className="text-xs text-muted-foreground">
            Manage your personal information and account preferences.
          </p>
        </div>

        <Button size="sm" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={user?.avatar} alt={user?.fullName}/>
                <AvatarFallback>
                  {user?.fullName?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <h2 className="text-lg font-semibold">{user?.fullName}</h2>
              <div className="mt-2">{getRoleBadge()}</div>

              <div className="mt-4 text-sm text-muted-foreground space-y-2">
                <div className="flex items-center gap-2 justify-center">
                  <Mail className="h-4 w-4"/>
                  {user?.email}
                </div>
                {user?.phone && (
                  <div className="flex items-center gap-2 justify-center">
                    <Phone className="h-4 w-4"/>
                    {user?.phone}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="medical">Details</TabsTrigger>
            </TabsList>

            {/* Personal */}
            <TabsContent value="personal" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Edit your personal data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input
                        type="date"
                        name="dob"
                        value={form.dob}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>

                  </div>

                </CardContent>
              </Card>

            </TabsContent>

            {/* Medical / Professional */}
            <TabsContent value="medical" className="space-y-4 mt-4">

              {/* Doctor */}
              {isDoctor && (
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <div className="space-y-2">
                        <Label>Specialty</Label>
                        <Input
                          name="specialty"
                          value={form.specialty}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Experience (Years)</Label>
                        <Input
                          name="experienceYears"
                          value={form.experienceYears}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Qualification</Label>
                        <Input
                          name="qualification"
                          value={form.qualification}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>

                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Patient */}
              {isPatient && (
                <Card>
                  <CardHeader>
                    <CardTitle>Medical Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <div className="space-y-2">
                        <Label>Blood Group</Label>
                        <Input
                          name="bloodGroup"
                          value={form.bloodGroup}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Allergies</Label>
                        <Input
                          name="allergies"
                          value={form.allergies}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>

                    </div>

                    <div className="space-y-2">
                      <Label>Medical History</Label>
                      <Textarea
                        name="medicalHistory"
                        value={form.medicalHistory}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>

                  </CardContent>
                </Card>
              )}

              {isEditing && (
                <div className="flex justify-end">
                  <Button size="sm" disabled={saving} onClick={handleSave}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </div>
  );
}
