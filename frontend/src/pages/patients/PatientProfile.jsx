import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPatientProfile } from "@/features/auth/patientSlice";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function PatientProfile() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { patient, loading } = useSelector(s => s.patient);

  useEffect(() => {
    dispatch(fetchPatientProfile(id));
  }, [id]);

  if (loading || !patient) return <p>Loading...</p>;

  return (
    <div className="mt-4 space-y-4">
      <Card className="p-4 flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={patient.avatar} />
        </Avatar>

        <div>
          <h2 className="text-xl font-semibold">{patient.fullName}</h2>
          <p className="text-sm text-muted-foreground">{patient.gender}</p>
          <p className="text-sm text-muted-foreground">{patient.dob}</p>
        </div>
      </Card>

      <Card className="p-4 text-sm space-y-2">
        <p><strong>Blood Group:</strong> {patient.bloodGroup}</p>
        <p><strong>Allergies:</strong> {patient.allergies?.join(", ")}</p>
        <p><strong>History:</strong> {patient.medicalHistory}</p>
      </Card>
    </div>
  );
}
