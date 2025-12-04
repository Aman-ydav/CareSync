// src/pages/appointments/NewAppointmentPage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "@/layout/DashboardLayout";
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

  // Fetch doctors once
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const res = await api.get("/users/doctors");
        setDoctors(res.data.data); // <-- this is correct
      } catch (error) {
        console.error(error);
        toast.error("Failed to load doctors");
      }
    };

    loadDoctors();

    // cleanup slots on unmount
    return () => {
      dispatch(clearSlots());
    };
  }, [dispatch]);

  // Fetch available slots whenever doctor/date/consultationType changes
  useEffect(() => {
    if (!doctorId || !date) return;

    dispatch(
      fetchAvailableSlots({
        doctorId,
        date,
        consultationType,
      })
    );
  }, [doctorId, date, consultationType, dispatch]);

  const handleCreate = async () => {
    if (!user?._id) {
      toast.error("You must be logged in as a patient");
      return;
    }

    if (!doctorId || !date || !time || !reason.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        doctor: doctorId,
        patient: user._id, // must match req.user._id on backend for PATIENT
        date,
        time,
        reason: reason.trim(),
        consultationType,
      };

      const result = await dispatch(createAppointment(payload));

      if (createAppointment.fulfilled.match(result)) {
        navigate("/appointments");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const availableSlots =
    slots.data?.availableSlots && Array.isArray(slots.data.availableSlots)
      ? slots.data.availableSlots
      : [];

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Book a New Appointment
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Choose a doctor, date, and time slot that suits you.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Doctor */}
            <div className="space-y-1">
              <label className="text-xs font-medium">Doctor</label>
              <Select
                value={doctorId || "select"}
                onValueChange={(val) => {
                  setDoctorId(val === "select" ? "" : val);
                  setTime("");
                }}
              >
                <SelectTrigger >
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent className="bg-accent-foreground">
                  <SelectItem value="select" disabled>
                    Select doctor
                  </SelectItem>
                  {doctors.map((doc) => (
                    <SelectItem key={doc._id} value={doc._id}>
                      {doc.fullName} {doc.specialty ? `— ${doc.specialty}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Consultation Type */}
            <div className="space-y-1">
              <label className="text-xs font-medium">Consultation Type</label>
              <Select
                value={consultationType}
                onValueChange={(val) => {
                  setConsultationType(val);
                  setTime("");
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In-Person">In-Person</SelectItem>
                  <SelectItem value="Video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-1">
              <label className="text-xs font-medium">Date</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setTime("");
                }}
              />
            </div>

            {/* Available Slots */}
            {doctorId && date && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium">Available Slots</label>
                  {slots.loading && (
                    <span className="text-[10px] text-muted-foreground">
                      Loading...
                    </span>
                  )}
                </div>

                {!slots.loading && availableSlots.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No slots available for this day.
                  </p>
                )}

                {availableSlots.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        type="button"
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

            {/* Reason */}
            <div className="space-y-1">
              <label className="text-xs font-medium">Reason for Visit</label>
              <Textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe your symptoms or reason for the visit..."
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate("/appointments")}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleCreate}
                disabled={submitting || !time}
              >
                {submitting ? "Booking..." : "Confirm Appointment"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NewAppointmentPage;
