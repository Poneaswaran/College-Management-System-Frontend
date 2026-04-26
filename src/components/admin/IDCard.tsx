import React from 'react';
import { BookOpen, MapPin, Mail, Phone, Hash, GraduationCap } from 'lucide-react';

export interface IDCardColors {
    primary: string;
    headerText: string;
    background: string;
    text: string;
    label: string;
}

const DEFAULT_STUDENT_COLORS: IDCardColors = {
    primary: '#2563eb',
    headerText: '#ffffff',
    background: '#f8fafc',
    text: '#111827',
    label: '#6b7280',
};

const DEFAULT_FACULTY_COLORS: IDCardColors = {
    primary: '#059669',
    headerText: '#ffffff',
    background: '#f8fafc',
    text: '#111827',
    label: '#6b7280',
};

interface IDCardProfile {
    id: number;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    register_number?: string;
    roll_number?: string | null;
    email?: string | null;
    phone?: string | null;
    department_name?: string;
    year?: number;
    semester?: number;
    designation?: string;
    profile_photo?: string | null;
}

interface IDCardProps {
    type: 'student' | 'faculty';
    data: IDCardProfile;
    institutionName?: string;
    colors?: IDCardColors;
}

const IDCard: React.FC<IDCardProps> = ({
    type,
    data,
    institutionName = 'COLLEGE MANAGEMENT SYSTEM',
    colors,
}) => {
    const isStudent = type === 'student';
    const clr = colors ?? (isStudent ? DEFAULT_STUDENT_COLORS : DEFAULT_FACULTY_COLORS);

    const name = isStudent
        ? `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim()
        : (data.full_name ?? '');
    const idNumber = isStudent ? (data.register_number ?? '') : (data.email ?? 'FACULTY');
    const department = data.department_name ?? 'General';
    const subInfo = isStudent
        ? `Year ${data.year ?? ''} | Sem ${data.semester ?? ''}`
        : (data.designation ?? '');
    const photo = data.profile_photo;

    // Derived hex helpers for subtle backgrounds
    const primaryHex = clr.primary;
    const primaryBg = `${primaryHex}18`;   // ~10% opacity tint
    const primaryBgMid = `${primaryHex}28`; // ~16% opacity tint

    return (
        <div
            className="id-card-container w-full max-w-[350px] aspect-[2.125/3.375] rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col relative group hover:-translate-y-2 transition-all duration-500"
            style={{ backgroundColor: clr.background }}
        >
            {/* ── HEADER ── */}
            <div
                className="relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${primaryHex}ee, ${primaryHex})` }}
            >
                {/* Decorative watermark icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <BookOpen size={110} className="text-white -rotate-12" />
                </div>

                {/* Institution branding */}
                <div className="relative z-10 px-5 py-4 flex flex-col items-center gap-1">
                    {/* Logo placeholder — circle with graduation cap */}
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center mb-1 shadow-lg"
                        style={{ backgroundColor: `${clr.headerText}22` }}
                    >
                        <GraduationCap size={20} style={{ color: clr.headerText }} />
                    </div>

                    <h2
                        className="text-[11px] font-black tracking-[0.18em] uppercase text-center leading-tight"
                        style={{ color: clr.headerText }}
                    >
                        {institutionName}
                    </h2>

                    <div
                        className="h-px w-16 rounded-full mt-0.5"
                        style={{ backgroundColor: `${clr.headerText}55` }}
                    />

                    <span
                        className="text-[9px] font-semibold tracking-[0.2em] uppercase opacity-85"
                        style={{ color: clr.headerText }}
                    >
                        {isStudent ? 'Student Identity Card' : 'Faculty Identity Card'}
                    </span>
                </div>
            </div>

            {/* ── PHOTO ── */}
            <div className="flex flex-col items-center -mt-10 px-6 relative z-10">
                <div
                    className="w-24 h-24 rounded-2xl border-4 shadow-xl overflow-hidden"
                    style={{ borderColor: clr.background, backgroundColor: primaryBg }}
                >
                    {photo ? (
                        <img src={photo} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ backgroundColor: primaryBg }}
                        >
                            <Hash size={30} style={{ color: primaryHex }} />
                        </div>
                    )}
                </div>

                <h3
                    className="mt-3 text-base font-black text-center leading-tight uppercase tracking-wide"
                    style={{ color: clr.text }}
                >
                    {name}
                </h3>

                <span
                    className="text-[11px] font-semibold mt-1 px-3 py-0.5 rounded-full"
                    style={{ backgroundColor: primaryBg, color: primaryHex }}
                >
                    {subInfo}
                </span>
            </div>

            {/* ── DETAILS ── */}
            <div className="flex-1 px-6 pt-4 pb-2 space-y-3">
                {/* ID Number */}
                <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg" style={{ backgroundColor: primaryBg }}>
                        <Hash size={13} style={{ color: primaryHex }} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span
                            className="text-[9px] font-bold uppercase tracking-widest"
                            style={{ color: clr.label }}
                        >
                            {isStudent ? 'Reg. Number' : 'Staff ID'}
                        </span>
                        <span className="text-xs font-bold truncate" style={{ color: clr.text }}>
                            {idNumber}
                        </span>
                    </div>
                </div>

                {/* Department */}
                <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg" style={{ backgroundColor: primaryBg }}>
                        <MapPin size={13} style={{ color: primaryHex }} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span
                            className="text-[9px] font-bold uppercase tracking-widest"
                            style={{ color: clr.label }}
                        >
                            Department
                        </span>
                        <span className="text-xs font-bold truncate" style={{ color: clr.text }}>
                            {department}
                        </span>
                    </div>
                </div>

                {/* Faculty email */}
                {!isStudent && data.email && (
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg" style={{ backgroundColor: primaryBg }}>
                            <Mail size={13} style={{ color: primaryHex }} />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span
                                className="text-[9px] font-bold uppercase tracking-widest"
                                style={{ color: clr.label }}
                            >
                                Email
                            </span>
                            <span className="text-xs font-bold truncate w-36" style={{ color: clr.text }}>
                                {data.email}
                            </span>
                        </div>
                    </div>
                )}

                {/* Student phone */}
                {isStudent && data.phone && (
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg" style={{ backgroundColor: primaryBg }}>
                            <Phone size={13} style={{ color: primaryHex }} />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span
                                className="text-[9px] font-bold uppercase tracking-widest"
                                style={{ color: clr.label }}
                            >
                                Contact
                            </span>
                            <span className="text-xs font-bold" style={{ color: clr.text }}>
                                {data.phone}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* ── FOOTER ── */}
            <div
                className="px-6 py-3 border-t flex items-center justify-between"
                style={{ borderColor: primaryBgMid }}
            >
                <div className="flex flex-col">
                    <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: clr.label }}>
                        Validity
                    </span>
                    <span className="text-[10px] font-bold" style={{ color: clr.text }}>
                        2024 – 2028
                    </span>
                </div>

                {/* QR placeholder */}
                <div
                    className="w-9 h-9 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: primaryBg }}
                >
                    <div className="grid grid-cols-3 gap-px">
                        {[...Array(9)].map((_, i) => (
                            <div
                                key={i}
                                className="w-1.5 h-1.5 rounded-[1px]"
                                style={{ backgroundColor: primaryHex, opacity: i % 3 === 1 ? 0.4 : 0.85 }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Hover overlay ── */}
            <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span
                    className="px-4 py-2 bg-white rounded-full text-xs font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform"
                    style={{ color: primaryHex }}
                >
                    Preview Mode
                </span>
            </div>
        </div>
    );
};

export default IDCard;
