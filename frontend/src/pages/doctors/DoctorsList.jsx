import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "@/features/auth/doctorSlice";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

export default function DoctorsList() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector(s => s.doctor);

  useEffect(() => {
    dispatch(fetchDoctors());
  }, []);

  if (loading) return <p className="text-sm">Loading...</p>;

  return (
    <div className="space-y-4 mt-4">
      <h2 className="text-md font-semibold">Available Doctors</h2>

      <div className="grid gap-3">
        {list.map(doc => (
          <Link key={doc._id} to={`/dashboard/doctors/${doc._id}`}>
            <Card className="flex items-center gap-3 p-3 hover:bg-muted">
              <Avatar>
                <AvatarImage src={doc.avatar} />
              </Avatar>
              <div>
                <p className="font-medium">{doc.fullName}</p>
                <p className="text-xs text-muted-foreground">{doc.specialty}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
