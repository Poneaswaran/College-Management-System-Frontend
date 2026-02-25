import {
    FileText,
    Mail,
    ChevronDown,
    Users,
    BookOpen,
    ClipboardCheck,
    Sun,
    Moon,
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import NotificationBell from '../../components/notifications/NotificationBell';
import { useTheme } from '../../theme';

export default function FacultyDashboard() {
    const { isDark, setMode } = useTheme();

    const toggleTheme = () => {
        setMode(isDark ? 'light' : 'dark');
    };

    return (
        <div className="flex bg-[var(--color-background-secondary)] min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Dashboard Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Faculty Dashboard</h1>
                    <div className="flex items-center gap-4">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-[var(--color-background-tertiary)] text-[var(--color-foreground-secondary)] hover:text-[var(--color-primary)] transition-all"
                            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button className="p-2 rounded-full hover:bg-[var(--color-background-tertiary)] text-[var(--color-foreground-secondary)] relative">
                            <Mail size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-error)] rounded-full border-2 border-[var(--color-background)]"></span>
                        </button>
                        <NotificationBell />
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-[var(--color-background-tertiary)] px-3 py-1.5 rounded-lg transition-colors">
                            <div className="w-8 h-8 rounded-full bg-[var(--color-primary-light)] text-white flex items-center justify-center font-bold">
                                FN
                            </div>
                            <span className="text-sm font-medium text-[var(--color-foreground)]">Faculty Name</span>
                            <ChevronDown size={16} className="text-[var(--color-foreground-muted)]" />
                        </div>
                    </div>
                </div>

                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">Welcome, [Faculty Name]</h2>
                    <p className="text-[var(--color-foreground-secondary)]">Manage your courses, students, and academic activities from your dashboard.</p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Total Students Card */}
                    <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)] hover:border-[var(--color-primary-light)] transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-[var(--color-foreground)]">Total Students</h3>
                            <div className="p-2 bg-[var(--color-background-secondary)] rounded-lg text-[var(--color-primary)]">
                                <Users size={20} />
                            </div>
                        </div>
                        <div className="text-5xl font-bold text-[var(--color-foreground)] mb-2">156</div>
                        <p className="text-sm text-[var(--color-foreground-muted)]">Across all courses</p>
                    </div>

                    {/* Active Courses Card */}
                    <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)] hover:border-[var(--color-primary-light)] transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-[var(--color-foreground)]">Active Courses</h3>
                            <div className="p-2 bg-[var(--color-background-secondary)] rounded-lg text-[var(--color-primary)]">
                                <BookOpen size={20} />
                            </div>
                        </div>
                        <div className="text-5xl font-bold text-[var(--color-foreground)] mb-2">5</div>
                        <p className="text-sm text-[var(--color-foreground-muted)]">This semester</p>
                    </div>

                    {/* Pending Assignments Card */}
                    <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)] hover:border-[var(--color-primary-light)] transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-[var(--color-foreground)]">Pending Reviews</h3>
                            <div className="p-2 bg-[var(--color-background-secondary)] rounded-lg text-[var(--color-primary)]">
                                <FileText size={20} />
                            </div>
                        </div>
                        <div className="text-5xl font-bold text-[var(--color-foreground)] mb-2">23</div>
                        <p className="text-sm text-[var(--color-foreground-muted)]">Assignments to grade</p>
                    </div>
                </div>

                {/* Second Row Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Today's Classes */}
                    <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-semibold text-[var(--color-foreground)]">Today's Classes</h3>
                                <p className="text-sm text-[var(--color-foreground-muted)]">(3 scheduled)</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-[var(--color-background-secondary)] rounded-lg">
                                <div>
                                    <p className="font-medium text-[var(--color-foreground)]">Data Structures</p>
                                    <p className="text-sm text-[var(--color-foreground-muted)]">CS 201 - Room 301</p>
                                </div>
                                <span className="text-sm font-medium text-[var(--color-primary)]">9:00 AM</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-[var(--color-background-secondary)] rounded-lg">
                                <div>
                                    <p className="font-medium text-[var(--color-foreground)]">Algorithm Design</p>
                                    <p className="text-sm text-[var(--color-foreground-muted)]">CS 301 - Room 205</p>
                                </div>
                                <span className="text-sm font-medium text-[var(--color-primary)]">2:00 PM</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-[var(--color-background-secondary)] rounded-lg">
                                <div>
                                    <p className="font-medium text-[var(--color-foreground)]">Database Systems</p>
                                    <p className="text-sm text-[var(--color-foreground-muted)]">CS 202 - Room 401</p>
                                </div>
                                <span className="text-sm font-medium text-[var(--color-primary)]">4:00 PM</span>
                            </div>
                        </div>
                    </div>

                    {/* Attendance Overview */}
                    <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-semibold text-[var(--color-foreground)]">Attendance Overview</h3>
                                <p className="text-sm text-[var(--color-foreground-muted)]">This week</p>
                            </div>
                            <ClipboardCheck size={20} className="text-[var(--color-primary)]" />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-[var(--color-foreground-secondary)]">Data Structures</span>
                                    <span className="font-medium text-[var(--color-foreground)]">92%</span>
                                </div>
                                <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2.5">
                                    <div className="bg-[var(--color-success)] h-2.5 rounded-full" style={{ width: '92%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-[var(--color-foreground-secondary)]">Algorithm Design</span>
                                    <span className="font-medium text-[var(--color-foreground)]">88%</span>
                                </div>
                                <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2.5">
                                    <div className="bg-[var(--color-success)] h-2.5 rounded-full" style={{ width: '88%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-[var(--color-foreground-secondary)]">Database Systems</span>
                                    <span className="font-medium text-[var(--color-foreground)]">85%</span>
                                </div>
                                <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2.5">
                                    <div className="bg-[var(--color-primary)] h-2.5 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-[var(--color-card)] rounded-xl shadow-sm border border-[var(--color-border)] p-6">
                    <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="mt-1 p-2 bg-[var(--color-background-secondary)] rounded-lg h-fit text-[var(--color-foreground-muted)]">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-[var(--color-foreground)]">Graded Assignment - Data Structures</h4>
                                <p className="text-sm text-[var(--color-foreground-muted)] mt-1">Graded 15 submissions • 2 hours ago</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1 p-2 bg-[var(--color-background-secondary)] rounded-lg h-fit text-[var(--color-foreground-muted)]">
                                <ClipboardCheck size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-[var(--color-foreground)]">Marked Attendance - Algorithm Design</h4>
                                <p className="text-sm text-[var(--color-foreground-muted)] mt-1">45 students present • 4 hours ago</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1 p-2 bg-[var(--color-background-secondary)] rounded-lg h-fit text-[var(--color-foreground-muted)]">
                                <BookOpen size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-[var(--color-foreground)]">Uploaded Study Materials</h4>
                                <p className="text-sm text-[var(--color-foreground-muted)] mt-1">Added 3 files to Database Systems • Yesterday</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
