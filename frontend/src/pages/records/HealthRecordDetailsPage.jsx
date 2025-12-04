import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/axiosInterceptor";
import DashboardLayout from "@/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, UserCircle, Stethoscope, FileText } from "lucide-react";
import { useSelector } from "react-redux";

export default function HealthRecordDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return; 
    api.get(`/health-records/${id}`)
      .then(res => setRecord(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!record) return <div>Record not found</div>;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-4">

        <Card>
          <CardHeader>
            <CardTitle>Health Record</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            <div className="flex flex-col gap-2">

              <p className="text-lg font-medium flex gap-2 items-center">
                <FileText className="w-5 h-5 text-primary"/>
                {record.diagnosis}
              </p>

              <div className="flex gap-2 items-center">
                <UserCircle className="w-4 h-4" />
                <span>{record.patient.fullName}</span>
              </div>

              <div className="flex gap-2 items-center">
                <Stethoscope className="w-4 h-4" />
                <span>Dr. {record.doctor.fullName}</span>
              </div>

              <div className="flex gap-2 items-center">
                <CalendarDays className="w-4 h-4" />
                <span>{new Date(record.visitDate).toLocaleDateString()}</span>
              </div>

              {record.vitalSigns && (
                <div className="border p-2 rounded">
                  <p className="text-xs font-semibold">Vitals</p>
                  <p className="text-xs">{record.vitalSigns}</p>
                </div>
              )}

              {record.notes && (
                <div className="border p-2 rounded">
                  <p className="text-xs font-semibold">Notes</p>
                  <p className="text-xs">{record.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">

              <Button variant="outline" onClick={() => navigate("/records")}>
                Back
              </Button>

            </div>

          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}
