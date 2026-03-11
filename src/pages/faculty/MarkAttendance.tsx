import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import {
    Camera,
    RefreshCw,
    ArrowLeft,
    Check,
    MapPin,
    AlertCircle,
    LogIn,
    LogOut,
    MessageSquare,
} from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { Header } from '../../components/layout/Header';
import { facultyPunchIn, facultyPunchOut, fetchFacultyAttendanceHistory } from '../../features/attendance/api';
import { convertToWebP, getBase64Size } from '../../lib/imageCompression';
import { SERVER_URL } from '../../config/constant';
import type { FacultyAttendanceHistory } from '../../features/attendance/types';

interface LocationCoords {
    latitude: number;
    longitude: number;
}

type PunchMode = 'IN' | 'OUT';

// Helper to convert base64 to File
const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};

export default function MarkAttendance() {
    const navigate = useNavigate();

    const webcamRef = useRef<Webcam>(null);
    const [punchMode, setPunchMode] = useState<PunchMode>('IN');
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
    const [notes, setNotes] = useState('');
    
    const [locationError, setLocationError] = useState<string | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [isCompressing, setIsCompressing] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [todayRecord, setTodayRecord] = useState<FacultyAttendanceHistory | null>(null);

    // Get user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setLocationError('Unable to get location. Location is required for attendance.');
                }
            );
        } else {
            setLocationError('Geolocation is not supported by this browser.');
        }
    }, []);

    // Check today's status on mount
    useEffect(() => {
        const checkTodayStatus = async () => {
            try {
                setInitialLoading(true);
                const today = new Date().toISOString().split('T')[0];
                const history = await fetchFacultyAttendanceHistory(undefined, today, today);
                
                // If there's a record for today
                if (history && history.length > 0) {
                    const record = history[0];
                    setTodayRecord(record);
                    if (record.punchInTime && !record.punchOutTime) {
                        setPunchMode('OUT');
                    } else {
                        setPunchMode('IN');
                    }
                } else {
                    setPunchMode('IN');
                    setTodayRecord(null);
                }
            } catch (error) {
                console.error('Error checking today status:', error);
            } finally {
                setInitialLoading(false);
            }
        };
        checkTodayStatus();
    }, []);

    const captureImage = useCallback(async () => {
        if (webcamRef.current) {
            try {
                setIsCompressing(true);
                
                // Capture image from webcam
                const imageSrc = webcamRef.current.getScreenshot();
                
                if (!imageSrc) {
                    alert('Failed to capture image. Please try again.');
                    return;
                }

                // Convert to WebP and compress
                const compressedWebP = await convertToWebP(imageSrc, {
                    quality: 0.8,
                    maxWidth: 1280,
                    maxHeight: 720
                });

                // Log compression stats (for debugging)
                const originalSize = getBase64Size(imageSrc);
                const compressedSize = getBase64Size(compressedWebP);
                console.log(`Image compressed: ${originalSize}KB → ${compressedSize}KB (${Math.round((1 - compressedSize / originalSize) * 100)}% reduction)`);

                setCapturedImage(compressedWebP);
            } catch (error) {
                console.error('Error compressing image:', error);
                alert('Failed to process image. Please try again.');
            } finally {
                setIsCompressing(false);
            }
        }
    }, [webcamRef]);

    const handleCameraError = useCallback((error: string | DOMException) => {
        console.error('Camera error:', error);
        setCameraError('Unable to access camera. Please grant camera permissions and try again.');
    }, []);

    const handleSubmit = async () => {
        if (!capturedImage) {
            alert('Please capture your photo first');
            return;
        }

        if (!userLocation) {
            alert('Location is required to mark attendance');
            return;
        }

        try {
            setIsSubmitting(true);
            const photoFile = dataURLtoFile(capturedImage, `punch_${punchMode.toLowerCase()}.webp`);
            
            let result;
            // Round coordinates to 6 decimal places to ensure total digits don't exceed backend limits
            const roundedLat = parseFloat(userLocation.latitude.toFixed(6));
            const roundedLng = parseFloat(userLocation.longitude.toFixed(6));

            if (punchMode === 'IN') {
                result = await facultyPunchIn({
                    punch_in_photo: photoFile,
                    latitude: roundedLat,
                    longitude: roundedLng,
                    notes
                });
            } else {
                result = await facultyPunchOut({
                    punch_out_photo: photoFile,
                    latitude: roundedLat,
                    longitude: roundedLng,
                    notes
                });
            }

            alert(result.message || `Punched ${punchMode === 'IN' ? 'in' : 'out'} successfully!`);
            navigate('/faculty/attendance');
        } catch (error: unknown) {
            console.error('Punch failed:', error);
            let errorMessage = `Failed to punch ${punchMode === 'IN' ? 'in' : 'out'}`;
            
            if (error instanceof Error) {
                errorMessage = error.message;
                // Safely check for axios response data
                const axiosError = error as { response?: { data?: { message?: string } } };
                if (axiosError.response?.data?.message) {
                    errorMessage = axiosError.response.data.message;
                }
            }
            
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (initialLoading) {
        return (
            <PageLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <RefreshCw size={48} className="text-[var(--color-primary)] animate-spin" />
                        <p className="text-[var(--color-foreground-secondary)] font-medium">Checking attendance status...</p>
                    </div>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <Header title="Mark Attendance" />
            <main className="p-4 md:p-6 lg:p-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/faculty/attendance')}
                    className="flex items-center gap-2 text-[var(--color-foreground-secondary)] hover:text-[var(--color-primary)] mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>

                <div className="max-w-2xl mx-auto">
                    {/* Header Info */}
                    <div className="text-center mb-8">
                        <p className="text-[var(--color-foreground-secondary)]">
                            Mark your daily work attendance
                        </p>
                    </div>

                    {/* Attendance Completed View */}
                    {todayRecord && todayRecord.punchInTime && todayRecord.punchOutTime ? (
                        <div className="space-y-6">
                            <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl text-center">
                                <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                                    <Check size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-green-500 mb-1">Attendance Completed</h2>
                                <p className="text-[var(--color-foreground-secondary)]">You have successfully punched in and out for today.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Punch In Card */}
                                <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
                                    <div className="aspect-video relative bg-black">
                                        <img 
                                            src={`${SERVER_URL}${todayRecord.punchInPhotoUrl}`} 
                                            alt="Punch In" 
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-4 left-4 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                                            Punch In
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-sm font-bold text-[var(--color-foreground)] mb-1">Punch In Time</p>
                                        <p className="text-lg text-[var(--color-primary)] font-semibold">
                                            {new Date(todayRecord.punchInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </p>
                                    </div>
                                </div>

                                {/* Punch Out Card */}
                                <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
                                    <div className="aspect-video relative bg-black">
                                        <img 
                                            src={`${SERVER_URL}${todayRecord.punchOutPhotoUrl}`} 
                                            alt="Punch Out" 
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-4 left-4 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                                            Punch Out
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-sm font-bold text-[var(--color-foreground)] mb-1">Punch Out Time</p>
                                        <p className="text-lg text-orange-500 font-semibold">
                                            {new Date(todayRecord.punchOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {todayRecord.notes && (
                                <div className="bg-[var(--color-card)] p-6 rounded-2xl border border-[var(--color-border)]">
                                    <h4 className="text-sm font-bold text-[var(--color-foreground-secondary)] uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <MessageSquare size={16} />
                                        Your Notes
                                    </h4>
                                    <p className="text-[var(--color-foreground)] italic">"{todayRecord.notes}"</p>
                                </div>
                            )}

                            <div className="text-center pt-4">
                                <p className="text-sm text-[var(--color-foreground-muted)]">
                                    Date: {new Date(todayRecord.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Punch Mode Toggle */}
                            <div className="flex p-1 bg-[var(--color-background-tertiary)] rounded-xl mb-6 shadow-sm border border-[var(--color-border)]">
                                <button
                                    onClick={() => { setPunchMode('IN'); setCapturedImage(null); }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
                                        punchMode === 'IN' 
                                        ? 'bg-green-500 text-white shadow-md' 
                                        : 'text-[var(--color-foreground-secondary)] hover:text-[var(--color-foreground)]'
                                    }`}
                                >
                                    <LogIn size={20} />
                                    Punch In
                                </button>
                                <button
                                    onClick={() => { setPunchMode('OUT'); setCapturedImage(null); }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
                                        punchMode === 'OUT' 
                                        ? 'bg-orange-500 text-white shadow-md' 
                                        : 'text-[var(--color-foreground-secondary)] hover:text-[var(--color-foreground)]'
                                    }`}
                                >
                                    <LogOut size={20} />
                                    Punch Out
                                </button>
                            </div>

                            {/* Location & Status Info */}
                            <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)] mb-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${userLocation ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-[var(--color-foreground-secondary)]">Location Status</p>
                                            <p className={`font-semibold ${userLocation ? 'text-green-500' : 'text-red-500'}`}>
                                                {userLocation ? 'Location Captured' : locationError || 'Capturing location...'}
                                            </p>
                                        </div>
                                    </div>
                                    {userLocation && (
                                        <div className="text-right text-xs text-[var(--color-foreground-muted)]">
                                            <p>{userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Camera Section */}
                            <div className="bg-[var(--color-card)] rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden mb-6">
                                {cameraError ? (
                                    <div className="p-12 text-center">
                                        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                                        <p className="text-red-600 font-medium">{cameraError}</p>
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="mt-6 px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                ) : !capturedImage ? (
                                    // Camera View
                                    <div>
                                        <div className="relative bg-black aspect-video max-h-[400px]">
                                            <Webcam
                                                audio={false}
                                                ref={webcamRef}
                                                screenshotFormat="image/jpeg"
                                                className="w-full h-full object-cover"
                                                videoConstraints={{
                                                    facingMode: "user",
                                                    width: 1280,
                                                    height: 720
                                                }}
                                                onUserMediaError={handleCameraError}
                                            />

                                            {/* Overlay */}
                                            <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none flex items-center justify-center">
                                                <div className="w-64 h-64 border-2 border-white/50 rounded-full border-dashed" />
                                            </div>
                                            <div className="absolute bottom-6 left-0 right-0 text-center">
                                                <p className="text-white text-sm bg-black/60 px-4 py-1.5 rounded-full inline-block backdrop-blur-sm">
                                                    Position your face within the circle
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <button
                                                onClick={captureImage}
                                                disabled={isCompressing || !userLocation}
                                                className="w-full py-4 bg-[var(--color-primary)] text-white rounded-xl font-bold hover:bg-[var(--color-primary-hover)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg shadow-[var(--color-primary)]/20"
                                            >
                                                {isCompressing ? (
                                                    <>
                                                        <RefreshCw size={24} className="animate-spin" />
                                                        Processing Image...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Camera size={24} />
                                                        Capture Punch {punchMode} Photo
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // Preview & Submit
                                    <div>
                                        <div className="relative bg-black aspect-video max-h-[400px]">
                                            <img
                                                src={capturedImage}
                                                alt="Captured"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-6 right-6 px-4 py-2 bg-green-500 text-white rounded-full text-sm font-bold flex items-center gap-2 shadow-lg shadow-black/20">
                                                <Check size={18} />
                                                Photo Captured
                                            </div>
                                        </div>

                                        <div className="p-8 space-y-6">
                                            {/* Notes Field */}
                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-bold text-[var(--color-foreground-secondary)] mb-3 uppercase tracking-wider">
                                                    <MessageSquare size={16} />
                                                    Additional Notes
                                                </label>
                                                <textarea
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                    placeholder="Optional: Enter any comments about your attendance..."
                                                    className="w-full px-4 py-3 bg-[var(--color-background-tertiary)] border border-[var(--color-border)] rounded-xl text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none resize-none h-24 transition-all"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    onClick={() => setCapturedImage(null)}
                                                    className="py-4 border-2 border-[var(--color-border)] text-[var(--color-foreground)] rounded-xl font-bold hover:bg-[var(--color-background-tertiary)] transition-all flex items-center justify-center gap-2"
                                                >
                                                    <RefreshCw size={20} />
                                                    Retake
                                                </button>
                                                <button
                                                    onClick={handleSubmit}
                                                    disabled={isSubmitting}
                                                    className={`py-4 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 ${
                                                        punchMode === 'IN' 
                                                        ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20' 
                                                        : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'
                                                    }`}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <RefreshCw size={20} className="animate-spin" />
                                                            Pinching...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <LogIn size={20} />
                                                            Submit Punch {punchMode}
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Guidelines */}
                            <div className="p-6 bg-[var(--color-primary-light)]/10 rounded-2xl border border-[var(--color-primary)]/20">
                                <h3 className="font-bold text-[var(--color-primary)] mb-3 flex items-center gap-2">
                                    <AlertCircle size={18} />
                                    Attendance Guidelines
                                </h3>
                                <ul className="text-sm text-[var(--color-foreground-secondary)] space-y-2">
                                    <li className="flex gap-2">
                                        <span className="text-[var(--color-primary)] font-bold">•</span>
                                        <span>Ensure your location is properly captured before submitting.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-[var(--color-primary)] font-bold">•</span>
                                        <span>Your face should be clearly visible in the punch photo.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-[var(--color-primary)] font-bold">•</span>
                                        <span>Double check if you are selecting the correct mode (Punch In or Punch Out).</span>
                                    </li>
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </PageLayout>
    );
}

