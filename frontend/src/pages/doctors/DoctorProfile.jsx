// DoctorProfile.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchDoctorProfile } from "@/features/auth/doctorSlice";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Award, 
  Globe, 
  Calendar, 
  Star, 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  Shield,
  GraduationCap
} from "lucide-react";

export default function DoctorProfile() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { doctor, loading } = useSelector(s => s.doctor);

  useEffect(() => {
    dispatch(fetchDoctorProfile(id));
  }, [id]);

  if (loading) return (
    <div className="mt-12 flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (!doctor) return <p className="mt-12 text-center">Doctor not found</p>;

  // Get initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="mt-12 p-4 max-w-6xl mx-auto space-y-6">
      {/* Header Card - Like YouTube Profile */}
      <Card className="p-6 bg-linear-to-r from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-white shadow-lg">
            <AvatarImage src={doctor.avatar} alt={doctor.fullName} />
            <AvatarFallback className="bg-linear-to-br from-blue-400 to-blue-600 text-white text-2xl">
              {getInitials(doctor.fullName)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold">{doctor.fullName}</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Verified <Shield className="inline h-3 w-3 ml-1" />
              </span>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-blue-500" />
                <span className="font-semibold">{doctor.specialty}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-green-500" />
                <span>{doctor.qualification}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-500" />
                <span>{doctor.experienceYears} years experience</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <button className="px-5 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Book Appointment
              </button>
              <button className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Message
              </button>
              <button className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Share Profile
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Star className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rating</p>
              <h3 className="text-2xl font-bold">4.8/5.0</h3>
            </div>
          </div>
        </Card>

        <Card className="p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Patients Served</p>
              <h3 className="text-2xl font-bold">1.2K+</h3>
            </div>
          </div>
        </Card>

        <Card className="p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Wait Time</p>
              <h3 className="text-2xl font-bold">15 min</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - About & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              About Dr. {doctor.fullName.split(' ')[0]}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {doctor.about || "No information available about this doctor."}
            </p>
          </Card>

          {/* Languages Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-500" />
              Languages Spoken
            </h2>
            <div className="flex flex-wrap gap-2">
              {doctor.languagesSpoken?.map((lang, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {lang}
                </span>
              )) || <p className="text-gray-500">No languages specified</p>}
            </div>
          </Card>
        </div>

        {/* Right Column - Contact & Info */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-blue-500" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-blue-500" />
                <span className="text-sm">dr.{doctor.fullName.toLowerCase().replace(' ', '.')}@example.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-blue-500 mt-1" />
                <span className="text-sm">Medical Center, Suite 305<br />123 Health St, New York</span>
              </div>
            </div>
          </Card>

          {/* Office Hours */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Office Hours</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span className="font-medium">9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span className="font-medium">10:00 AM - 2:00 PM</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Sunday</span>
                <span className="font-medium">Closed</span>
              </div>
            </div>
          </Card>

          {/* Insurance Accepted */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Insurance Accepted</h3>
            <div className="flex flex-wrap gap-2">
              {['Blue Cross', 'Aetna', 'Cigna', 'UnitedHealth'].map((insurer) => (
                <span key={insurer} className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                  {insurer}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}