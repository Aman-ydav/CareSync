import { useState, useEffect } from "react";
import api from "@/api/axiosInterceptor";
import { useAppointments } from "@/hooks/useAppointments";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CreateAppointment() {
  const { user } = useAuth();
  const { slots, loading, fetchSlots, createAppointment } = useAppointments();

  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [hospital, setHospital] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  // Load hospitals
  useEffect(() => {
    api.get("/hospitals").then((res) => {
      const list = res?.data?.data?.hospitals || [];
      setHospitals(list);
    });
  }, []);

  useEffect(() => {
    if (!hospital) return;
    api.get(`/users/doctors?hospitalId=${hospital}`).then((res) => {
      const list = res?.data?.data || [];
      setDoctors(list);
    });
  }, [hospital]);

  // Load slots
  useEffect(() => {
    if (doctor && date) {
      fetchSlots({ doctorId: doctor, date });
    }
  }, [doctor, date]);

  const handleSubmit = async () => {
    if (!hospital || !doctor || !date || !time || !reason) {
      toast.error("Fill all fields");
      return;
    }

    try {
      await createAppointment({
        doctor,
        patient: user?._id,
        hospital,
        hospitalName: hospitals.find((h) => h._id === hospital)?.name,
        date,
        time,
        reason,
      });

      toast.success("Appointment booked!");
    } catch (err) {
      toast.error(err?.message || "Failed to book appointment");
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Book Appointment</h1>

      <Card className="rounded-2xl shadow-sm p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hospital */}
          <div>
            <label className="text-sm font-medium">Hospital</label>
            <Select value={hospital} onValueChange={setHospital}>
              <SelectTrigger>
                <SelectValue placeholder="Select hospital" />
              </SelectTrigger>
              <SelectContent>
                {hospitals.map((h) => (
                  <SelectItem key={h._id} value={h._id}>
                    {h.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Doctor */}
          <div>
            <label className="text-sm font-medium">Doctor</label>
            <Select
              value={doctor}
              onValueChange={setDoctor}
              disabled={!hospital}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((d) => (
                  <SelectItem key={d._id} value={d._id}>
                    {d.fullName} — {d.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div>
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Time Slot */}
          <div>
            <label className="text-sm font-medium">Time Slot</label>
            {loading ? (
              <Loader2 className="animate-spin mt-2" />
            ) : (
              <Select onValueChange={setTime} disabled={!doctor || !date}>
                <SelectTrigger>Select time</SelectTrigger>
                <SelectContent>
                  {slots.map((s) => (
                    <SelectItem key={s.time} value={s.time}>
                      {s.time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Reason for visit</label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <Button onClick={handleSubmit} disabled={loading}>
          {loading && <Loader2 className="animate-spin mr-2" />} Book
          Appointment
        </Button>
      </Card>
    </div>
  );
}
