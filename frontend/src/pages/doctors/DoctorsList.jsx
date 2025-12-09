// DoctorsList.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "@/features/auth/doctorSlice";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Star, MapPin, Award } from "lucide-react";

export default function DoctorsList() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector(s => s.doctor);

  useEffect(() => {
    dispatch(fetchDoctors());
  }, []);

  if (loading) return (
    <div className="mt-12 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gray-200"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="mt-12 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Available Doctors</h1>
        <div className="flex gap-2">
          <select className="px-4 py-2 border rounded-lg text-sm">
            <option>Sort by: Rating</option>
            <option>Sort by: Experience</option>
            <option>Sort by: Name</option>
          </select>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm">
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(doc => (
          <Link key={doc._id} to={`/dashboard/doctors/${doc._id}`}>
            <Card className="p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-200">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={doc.avatar} alt={doc.fullName} />
                  <AvatarFallback className="bg-linear-to-br from-blue-400 to-blue-600 text-white">
                    {getInitials(doc.fullName)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{doc.fullName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Award className="h-3 w-3 text-green-600" />
                        <span className="text-sm text-gray-600">{doc.specialty}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-3 w-3" />
                      <span>Bangalore, Karnataka</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm font-medium text-gray-700">
                        {doc.experienceYears || '5'}+ years exp
                      </span>
                      <span className="text-sm font-semibold text-primary">
                        Available Today
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {list.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Award className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">No doctors found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your filters or check back later</p>
        </div>
      )}
    </div>
  );
}