import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/axiosInterceptor";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, UserCircle, Stethoscope, FileText } from "lucide-react";

export default function HealthRecordDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/health-records/${id}`)
      .then((res) => setRecord(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="mt-16">Loading...</p>;
  if (!record) return <p className="mt-16">Record not found</p>;

  return (
    <div className="max-w-2xl mx-auto mt-16 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Health Record</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <p className="text-lg font-medium flex gap-2 items-center">
            <FileText className="w-5 h-5 text-primary" />
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

          <div className="flex justify-end">
            <Button variant="outline" onClick={()=>navigate(-1)}>Back</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
