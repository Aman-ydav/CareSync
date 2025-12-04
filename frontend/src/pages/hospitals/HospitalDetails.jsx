import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHospitals } from "@/hooks/useHospitals";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, Phone, MapPin, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function HospitalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hospital, loading, loadHospitalById } = useHospitals();

  // Load hospital details
useEffect(() => {
  // if navigating away, do nothing
  if (!id || id === "undefined" || id === "null") return;

  let cancelled = false;

  loadHospitalById(id)
    .catch(() => {})
  
  return () => {
    cancelled = true;
  };
}, [id]);


  // Loading State
  if (loading || !hospital) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin w-7 h-7 text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      className="container max-w-4xl mx-auto py-10 px-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/hospitals")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Hospital Card */}
      <Card className="mb-8 shadow-sm hover:shadow-md transition">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold flex items-center gap-3">
            {hospital.name}
            {hospital.isActive ? (
              <Badge className="bg-green-600 text-white">Active</Badge>
            ) : (
              <Badge variant="destructive">Inactive</Badge>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-sm space-y-6">
          {/* Location */}
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-1" />
            <div>
              <div className="font-medium">
                {hospital.city}, {hospital.state}, {hospital.country}
              </div>
              <div className="text-muted-foreground">{hospital.address}</div>
            </div>
          </div>

          <Separator />

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <a
                href={`mailto:${hospital.contactEmail}`}
                className="text-primary font-medium hover:underline"
              >
                {hospital.contactEmail}
              </a>
            </div>

            {hospital.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <a
                  href={`tel:${hospital.phone}`}
                  className="text-primary font-medium hover:underline"
                >
                  {hospital.phone}
                </a>
              </div>
            )}
          </div>

          <Separator />

          {/* Description */}
          {hospital.description && (
            <div>
              <div className="text-base font-semibold mb-1">About</div>
              <p className="text-muted-foreground leading-relaxed">
                {hospital.description}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-3">
            <Button
              className="w-full sm:w-auto"
              onClick={() => toast("Book Appointment Coming Soon")}
            >
              Book Appointment
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                toast("Show doctors list. (Feature coming soon)")
              }
            >
              View Doctors
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Future Section: Doctors List (optional)
      <DoctorsList hospitalId={id} />
      */}
    </motion.div>
  );
}
