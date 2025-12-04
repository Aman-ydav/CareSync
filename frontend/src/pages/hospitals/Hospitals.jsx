// src/pages/hospitals/Hospitals.jsx
import { useEffect } from "react";
import { useHospitals } from "@/hooks/useHospitals";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hospitals() {
  const { hospitals, loading, loadHospitals } = useHospitals();
  const navigate = useNavigate();

  useEffect(() => {
    loadHospitals({ limit: 50 });
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Hospitals</h1>

      <div className="grid gap-4">
        {hospitals.map((h) => (
          <Card
            key={h._id}
            className="hover:bg-muted/50 cursor-pointer"
            onClick={() => navigate(`/hospitals/${h._id}`)}
          >
            <CardHeader>
              <CardTitle>{h.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {h.address} — {h.city}, {h.state}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
