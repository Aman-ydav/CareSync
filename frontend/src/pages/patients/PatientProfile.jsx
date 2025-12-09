// PatientProfile.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPatientProfile } from "@/features/auth/patientSlice";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Calendar, 
  Droplets, 
  AlertCircle,
  FileText,
  Phone,
  Mail,
  MapPin,
  Activity,
  Heart,
  Pill
} from "lucide-react";

export default function PatientProfile() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { patient, loading } = useSelector(s => s.patient);

  useEffect(() => {
    dispatch(fetchPatientProfile(id));
  }, [id]);

  if (loading) return (
    <div className="mt-12 flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (!patient) return <p className="mt-12 text-center">Patient not found</p>;

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="mt-12 p-4 max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <Card className="p-6 bg-linear-to-r from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-white shadow-lg">
            <AvatarImage src={patient.avatar} alt={patient.fullName} />
            <AvatarFallback className="bg-linear-to-br from-green-400 to-green-600 text-white text-2xl">
              {getInitials(patient.fullName)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{patient.fullName}</h1>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{patient.gender}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{calculateAge(patient.dob)} years</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">Blood: {patient.bloodGroup || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                View Medical Records
              </button>
              <button className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Edit Profile
              </button>
              <button className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Add Appointment
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Visit</p>
              <p className="font-semibold">2 weeks ago</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Records</p>
              <p className="font-semibold">12 Files</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Heart className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Conditions</p>
              <p className="font-semibold">3 Active</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Pill className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Medications</p>
              <p className="font-semibold">5 Current</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Medical Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Allergies */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Allergies & Sensitivities
            </h2>
            <div className="flex flex-wrap gap-2">
              {patient.allergies?.length > 0 ? (
                patient.allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-medium"
                  >
                    {allergy}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No known allergies recorded</p>
              )}
            </div>
          </Card>

          {/* Medical History */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Medical History
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">
                  {patient.medicalHistory || "No medical history recorded"}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Last Consultation</p>
                  <p className="font-medium">Dr. Smith - Cardiology</p>
                  <p className="text-xs text-gray-500">Dec 15, 2023</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Next Appointment</p>
                  <p className="font-medium">Follow-up Checkup</p>
                  <p className="text-xs text-gray-500">Jan 20, 2024</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Contact & Quick Info */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-blue-500" />
                <span className="text-sm">+1 (555) 987-6543</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-blue-500" />
                <span className="text-sm">patient.email@example.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-blue-500 mt-1" />
                <span className="text-sm">123 Health St,<br />Bangalore, Karnataka</span>
              </div>
            </div>
          </Card>

          {/* Emergency Contacts */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Emergency Contact</h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-gray-600">Spouse</p>
                <p className="text-sm">+1 (555) 234-5678</p>
              </div>
            </div>
          </Card>

          {/* Current Medications */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Current Medications</h3>
            <div className="space-y-2">
              {['Metformin 500mg', 'Lisinopril 10mg', 'Atorvastatin 20mg'].map((med, index) => (
                <div key={index} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                  <Pill className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{med}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}