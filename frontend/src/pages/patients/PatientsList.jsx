import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatients } from "@/features/auth/patientSlice";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function PatientsList() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector(s => s.patient);

  useEffect(() => {
    dispatch(fetchPatients());
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-4 mt-4">
      <h2 className="text-md font-semibold">Patients</h2>

      <div className="grid gap-3">
        {list.map(pt => (
          <Link key={pt._id} to={`/dashboard/patients/${pt._id}`}>
            <Card className="flex items-center gap-3 p-3 hover:bg-muted">
              <Avatar>
                <AvatarImage src={pt.avatar} />
              </Avatar>
              <div>
                <p className="font-medium">{pt.fullName}</p>
                <p className="text-xs text-muted-foreground">{pt.bloodGroup}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
