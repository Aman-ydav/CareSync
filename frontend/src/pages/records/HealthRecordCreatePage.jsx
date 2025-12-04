import { useEffect, useState } from "react";
import api from "@/api/axiosInterceptor";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createHealthRecord } from "@/features/healthRecords/healthRecordSlice";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function HealthRecordCreatePage() {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointment");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [appointment, setAppointment] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [vitals, setVitals] = useState("");

  useEffect(() => {
    api
      .get(`/appointments/${appointmentId}`)
      .then((res) => setAppointment(res.data.data))
      .catch(() => toast.error("Failed to load appointment"));
  }, [appointmentId]);

  const handleCreate = async () => {
    if (!diagnosis.trim()) {
      toast.error("Diagnosis required");
      return;
    }

    const result = await dispatch(
      createHealthRecord({
        patient: appointment.patient._id,
        doctor: user._id,
        diagnosis,
        notes,
        vitalSigns: vitals,
        visitDate: appointment.date,
      })
    );

    if (createHealthRecord.fulfilled.match(result)) {
      toast.success("Record created");
      navigate("/dashboard/records");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-16">
      <Card>
        <CardHeader>
          <CardTitle>Create Health Record</CardTitle>
          {appointment && (
            <p className="text-xs text-muted-foreground">
              Patient: {appointment.patient.fullName} • Date:{" "}
              {new Date(appointment.date).toLocaleDateString()}
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium">Diagnosis *</label>
            <Input value={diagnosis} onChange={(e)=>setDiagnosis(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium">Vitals</label>
            <Textarea rows={2} value={vitals} onChange={(e)=>setVitals(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium">Notes</label>
            <Textarea rows={4} value={notes} onChange={(e)=>setNotes(e.target.value)} />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={()=>navigate(-1)}>Cancel</Button>
            <Button onClick={handleCreate}>Create</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
