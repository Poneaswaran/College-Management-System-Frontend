import React from 'react';
import { BookOpen, MapPin, Mail, Phone, Hash } from 'lucide-react';

interface IDCardProps {
    type: 'student' | 'faculty';
    data: any;
    institutionName?: string;
}

const IDCard: React.FC<IDCardProps> = ({ type, data, institutionName = "COLLEGE MANAGEMENT SYSTEM" }) => {
    const isStudent = type === 'student';
    const name = isStudent ? `${data.first_name} ${data.last_name || ''}` : data.full_name;
    const idNumber = isStudent ? data.register_number : (data.email || 'FACULTY');
    const department = data.department_name || "General";
    const subInfo = isStudent ? `Year ${data.year} | Sem ${data.semester}` : data.designation;
    const photo = data.profile_photo;

    return (
        <div className="id-card-container w-full max-w-[350px] aspect-[2.125/3.375] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col relative group hover:-translate-y-2 transition-all duration-500">
            {/* Top Wave/Header */}
            <div className={`h-24 ${isStudent ? 'bg-gradient-to-br from-blue-600 to-indigo-700' : 'bg-gradient-to-br from-emerald-600 to-teal-700'} relative`}>
                <div className="absolute inset-0 opacity-20 flex items-center justify-center pointer-events-none">
                    <BookOpen size={100} className="text-white transform -rotate-12" />
                </div>
                <div className="p-4 flex flex-col items-center justify-center text-white h-full">
                    <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-center">{institutionName}</h2>
                    <div className="h-0.5 w-12 bg-white/50 mt-1 rounded-full"></div>
                    <span className="text-[10px] font-medium mt-1 tracking-widest opacity-80 uppercase">
                        {isStudent ? 'Student Identity Card' : 'Faculty Identity Card'}
                    </span>
                </div>
            </div>

            {/* Photo Section */}
            <div className="flex flex-col items-center -mt-12 px-6 relative z-10">
                <div className="w-28 h-28 rounded-2xl border-4 border-white bg-gray-50 shadow-xl overflow-hidden">
                    {photo ? (
                        <img src={photo} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                            <Hash size={32} />
                        </div>
                    )}
                </div>
                
                <h3 className="mt-4 text-lg font-bold text-gray-800 text-center leading-tight uppercase">
                    {name}
                </h3>
                <p className={`text-sm font-semibold mt-1 px-3 py-0.5 rounded-full ${isStudent ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {subInfo}
                </p>
            </div>

            {/* Details Section */}
            <div className="flex-1 p-6 space-y-4">
                <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${isStudent ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            <Hash size={14} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ID Number</span>
                            <span className="text-xs font-bold text-gray-700">{idNumber}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${isStudent ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            <MapPin size={14} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Department</span>
                            <span className="text-xs font-bold text-gray-700">{department}</span>
                        </div>
                    </div>

                    {!isStudent && data.email && (
                         <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-lg bg-emerald-50 text-emerald-600`}>
                                <Mail size={14} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</span>
                                <span className="text-xs font-bold text-gray-700 truncate w-40">{data.email}</span>
                            </div>
                        </div>
                    )}

                    {isStudent && data.phone && (
                         <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-lg bg-blue-50 text-blue-600`}>
                                <Phone size={14} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact</span>
                                <span className="text-xs font-bold text-gray-700">{data.phone}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer / QR Area (Aesthetic) */}
            <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
                 <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Validity</span>
                    <span className="text-[10px] font-bold text-gray-600">2024 - 2028</span>
                 </div>
                 <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-0.5 opacity-50">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="w-1 h-1 bg-gray-800 rounded-[1px]"></div>
                        ))}
                    </div>
                 </div>
            </div>

            {/* Print Overlay */}
            <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="px-4 py-2 bg-white rounded-full text-xs font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    Preview Mode
                </span>
            </div>
        </div>
    );
};

export default IDCard;
