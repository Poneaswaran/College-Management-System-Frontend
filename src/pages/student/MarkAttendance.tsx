import { useState, useRef, useEffect, useCallback } from 'react';
import { useMutation } from '@apollo/client/react';
import { useLocation, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import {
    Camera,
    RefreshCw,
    ArrowLeft,
    Check,
    Clock,
    MapPin,
    AlertCircle
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import { MARK_ATTENDANCE, GET_ACTIVE_SESSIONS } from '../../features/students/graphql/attendance';
import { convertToWebP, getBase64Size } from '../../lib/imageCompression';

interface LocationCoords {
    latitude: number;
    longitude: number;
}

interface Session {
    id: number;
    subjectName: string;
    sectionName: string;
    periodTime: string;
    facultyName: string;
    timeRemaining: number;
}

interface MarkAttendanceResponse {
    markAttendance: {
        success: boolean;
        message: string;
    };
}

export default function MarkAttendance() {
    const location = useLocation();
    const navigate = useNavigate();
    const session = location.state?.session as Session;

    const webcamRef = useRef<Webcam>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [isCompressing, setIsCompressing] = useState<boolean>(false);

    const [markAttendance, { loading }] = useMutation<MarkAttendanceResponse>(MARK_ATTENDANCE, {
        onCompleted: (data: MarkAttendanceResponse) => {
            alert(data.markAttendance.message || 'Attendance marked successfully!');
            navigate('/student/attendance');
        },
        onError: (error: Error) => {
            alert('Failed to mark attendance: ' + error.message);
        },
        refetchQueries: [{ query: GET_ACTIVE_SESSIONS }]
    });

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
                    setLocationError('Unable to get location. Attendance will be marked without location.');
                }
            );
        } else {
            // Using setTimeout to avoid synchronous setState in effect
            setTimeout(() => {
                setLocationError('Geolocation is not supported by this browser.');
            }, 0);
        }
    }, []);

    // Redirect if no session
    useEffect(() => {
        if (!session) {
            navigate('/student/attendance');
        }
    }, [session, navigate]);

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
                    quality: 0.8, // 80% quality for good balance
                    maxWidth: 1280, // Max width for attendance photo
                    maxHeight: 720 // Max height for attendance photo
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

    const submitAttendance = () => {
        if (!capturedImage) {
            alert('Please capture your photo first');
            return;
        }

        if (!session) {
            alert('No session selected');
            return;
        }

        markAttendance({
            variables: {
                sessionId: session.id,
                imageData: capturedImage,
                latitude: userLocation?.latitude,
                longitude: userLocation?.longitude
            }
        });
    };

    if (!session) {
        return null;
    }

    return (
        <div className="flex bg-[var(--color-background-secondary)] min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/student/attendance')}
                    className="flex items-center gap-2 text-[var(--color-foreground-secondary)] hover:text-[var(--color-primary)] mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Attendance
                </button>

                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">Mark Attendance</h1>
                        <p className="text-[var(--color-foreground-secondary)]">Capture your photo to mark attendance</p>
                    </div>

                    {/* Session Info Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)] mb-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-[var(--color-foreground)]">{session.subjectName}</h2>
                                <p className="text-[var(--color-foreground-secondary)] mt-1">
                                    {session.sectionName} • {session.facultyName}
                                </p>
                            </div>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                {session.periodTime}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--color-border)]">
                            <div className="flex items-center gap-2 text-orange-600">
                                <Clock size={18} />
                                <span className="font-semibold">{session.timeRemaining} min remaining</span>
                            </div>
                            {userLocation && (
                                <div className="flex items-center gap-2 text-green-600">
                                    <MapPin size={18} />
                                    <span className="text-sm">Location captured</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Location Warning */}
                    {locationError && (
                        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                            <AlertCircle className="text-yellow-600" size={20} />
                            <p className="text-yellow-700 text-sm">{locationError}</p>
                        </div>
                    )}

                    {/* Camera Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
                        {cameraError ? (
                            <div className="p-8 text-center">
                                <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                                <p className="text-red-600">{cameraError}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)]"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : !capturedImage ? (
                            // Camera View
                            <div>
                                <div className="relative bg-black aspect-video">
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        className="w-full h-full object-cover"
                                        videoConstraints={{
                                            facingMode: "user",
                                            width: 720,
                                            height: 480
                                        }}
                                        onUserMediaError={handleCameraError}
                                    />

                                    {/* Face guide overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-48 h-48 border-4 border-white/50 rounded-full flex items-center justify-center">
                                            <p className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                                                Position your face here
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <button
                                        onClick={captureImage}
                                        disabled={isCompressing}
                                        className="w-full py-4 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:bg-[var(--color-primary-hover)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isCompressing ? (
                                            <>
                                                <RefreshCw size={24} className="animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Camera size={24} />
                                                Capture Photo
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Preview & Submit
                            <div>
                                <div className="relative bg-black aspect-video">
                                    <img
                                        src={capturedImage}
                                        alt="Captured"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium flex items-center gap-1">
                                        <Check size={16} />
                                        Photo Captured
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setCapturedImage(null)}
                                            className="py-3 border-2 border-[var(--color-border)] text-[var(--color-foreground)] rounded-xl font-semibold hover:bg-[var(--color-background-secondary)] transition-colors flex items-center justify-center gap-2"
                                        >
                                            <RefreshCw size={20} />
                                            Retake Photo
                                        </button>
                                        <button
                                            onClick={submitAttendance}
                                            disabled={loading}
                                            className="py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Check size={20} />
                                                    Submit Attendance
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Instructions */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h3 className="font-semibold text-blue-800 mb-2">Instructions</h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Position your face clearly within the circle</li>
                            <li>• Ensure good lighting for best results</li>
                            <li>• Remove any face coverings or accessories</li>
                            <li>• Your location may be captured for verification</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
