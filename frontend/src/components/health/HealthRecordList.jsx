import { FileText, Stethoscope, UserCircle, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HealthRecordList = ({ records, loading }) => {

    const navigate = useNavigate();
  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading health records...</p>;
  }

  if (!records || records.length === 0) {
    return <p className="text-sm text-muted-foreground">No health records found.</p>;
  }

  return (
    <div className="space-y-3">
      {records.map((rec) => (
        <div
          key={rec._id}
          className="flex flex-col md:flex-row md:items-center justify-between gap-3 border border-border rounded-lg p-3 bg-card"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{rec.diagnosis}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
              {rec.doctor && (
                <span className="flex items-center gap-1">
                  <Stethoscope className="w-3 h-3" />
                  Dr. {rec.doctor.fullName}
                </span>
              )}
              {rec.patient && (
                <span className="flex items-center gap-1">
                  <UserCircle className="w-3 h-3" />
                  {rec.patient.fullName}
                </span>
              )}
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3 h-3" />
                {new Date(rec.visitDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div>
            <Button size="sm" variant="outline" onClick={() => navigate(`/dashboard/records/${rec._id}`)}>
              View
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HealthRecordList;
