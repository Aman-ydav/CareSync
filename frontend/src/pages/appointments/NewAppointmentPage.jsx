import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAvailableSlots,
  createAppointment,
  clearSlots,
} from "@/features/appointments/appointmentSlice";
import { useNavigate } from "react-router-dom";

import api from "@/api/axiosInterceptor";
import { toast } from "sonner";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const NewAppointmentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { slots } = useSelector((state) => state.appointments);

  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [consultationType, setConsultationType] = useState("In-Person");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/users/doctors").then((res) => setDoctors(res.data.data)).catch(() => {
      toast.error("Failed to load doctors");
    });
    return () => dispatch(clearSlots());
  }, []);

  useEffect(() => {
    if (!doctorId || !date) return;
    dispatch(fetchAvailableSlots({ doctorId, date, consultationType }));
  }, [doctorId, date, consultationType]);

  const handleCreate = async () => {
    if (!doctorId || !date || !time || !reason.trim()) {
      toast.error("Fill all required fields");
      return;
    }

    setSubmitting(true);

    const result = await dispatch(
      createAppointment({
        doctor: doctorId,
        patient: user._id,
        date,
        time,
        reason: reason.trim(),
        consultationType,
      })
    );

    if (createAppointment.fulfilled.match(result)) {
      navigate("/dashboard/appointments");
    }

    setSubmitting(false);
  };

  const availableSlots = slots.data?.availableSlots ?? [];

  return (
    <div className="max-w-2xl mx-auto mt-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Book a New Appointment
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Choose a doctor, date, and time.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">

          <div className="space-y-1">
            <label className="text-xs font-medium">Doctor</label>
            <Select value={doctorId} onValueChange={(v)=>{setDoctorId(v); setTime("")}}>
              <SelectTrigger>
                <SelectValue placeholder="Select doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doc) => (
                  <SelectItem key={doc._id} value={doc._id}>
                    {doc.fullName} {doc.specialty && `— ${doc.specialty}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Consultation Type</label>
            <Select value={consultationType} onValueChange={(v)=>{setConsultationType(v);setTime("")}}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In-Person">In-Person</SelectItem>
                <SelectItem value="Video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Date</label>
            <Input type="date" value={date} onChange={(e)=>{setDate(e.target.value);setTime("")}}/>
          </div>

          {doctorId && date && (
            <div className="space-y-2">
              <label className="text-xs font-medium">Available Slots</label>

              {slots.loading && <p className="text-xs">Loading...</p>}

              {!slots.loading && availableSlots.length === 0 && (
                <p className="text-xs">No slots available</p>
              )}

              {availableSlots.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      size="sm"
                      variant={time === slot.time ? "default" : "outline"}
                      className="text-xs"
                      onClick={() => setTime(slot.time)}
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium">Reason</label>
            <Textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreate}
              disabled={submitting || !time}
            >
              {submitting ? "Booking..." : "Confirm"}
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default NewAppointmentPage;
