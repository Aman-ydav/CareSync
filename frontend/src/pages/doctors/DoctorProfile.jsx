import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchDoctorProfile } from "@/features/auth/doctorSlice";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function DoctorProfile() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { doctor, loading } = useSelector(s => s.doctor);

  useEffect(() => {
    dispatch(fetchDoctorProfile(id));
  }, [id]);

  if (loading || !doctor) return <p>Loading...</p>;

  return (
    <div className="mt-4 space-y-4">
      <Card className="p-4 flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={doctor.avatar} />
        </Avatar>

        <div>
          <h2 className="text-xl font-semibold">{doctor.fullName}</h2>
          <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
          <p className="text-sm text-muted-foreground">{doctor.qualification}</p>
        </div>
      </Card>

      <Card className="p-4 text-sm">
        <p><strong>Experience:</strong> {doctor.experienceYears} years</p>
        <p><strong>Languages:</strong> {doctor.languagesSpoken?.join(", ")}</p>
        <p><strong>About:</strong> {doctor.about}</p>
      </Card>
    </div>
  );
}
