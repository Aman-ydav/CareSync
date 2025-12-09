// PatientsList.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatients } from "@/features/auth/patientSlice";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, Calendar, Phone } from "lucide-react";

export default function PatientsList() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector(s => s.patient);

  useEffect(() => {
    dispatch(fetchPatients());
  }, []);

  if (loading) return (
    <div className="mt-12 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
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
      {/* Header with Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 text-sm">Manage and view patient records</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
              + Add Patient
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Patients</p>
          <p className="text-2xl font-bold">{list.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Active Today</p>
          <p className="text-2xl font-bold">24</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">New This Month</p>
          <p className="text-2xl font-bold">12</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Follow-ups</p>
          <p className="text-2xl font-bold">8</p>
        </Card>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {list.map(pt => (
          <Link key={pt._id} to={`/dashboard/patients/${pt._id}`}>
            <Card className="p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-200">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={pt.avatar} alt={pt.fullName} />
                  <AvatarFallback className="bg-linear-to-br from-green-400 to-green-600 text-white">
                    {getInitials(pt.fullName)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{pt.fullName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {pt.bloodGroup || 'N/A'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {pt.gender || 'Unknown'} • {pt.dob ? new Date(pt.dob).getFullYear() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-3 w-3" />
                    <span>Last Visit: 2w ago</span>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    Active
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-3 w-3" />
                  <span className="truncate">+1 (555) 987-6543</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {list.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">No patients found</h3>
          <p className="text-gray-500 mt-2">Add your first patient to get started</p>
          <button className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            Add New Patient
          </button>
        </div>
      )}
    </div>
  );
}