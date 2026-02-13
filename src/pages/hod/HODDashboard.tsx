import {
    Bell,
    Mail,
    ChevronDown,
    Users,
    BookOpen,
    TrendingUp,
    ClipboardCheck,
    FileCheck,
    AlertCircle,
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';

export default function HODDashboard() {

    return (
        <div className="flex bg-[var(--color-background-secondary)] min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Dashboard Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-[var(--color-foreground)]">HOD Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-full hover:bg-[var(--color-background-tertiary)] text-[var(--color-foreground-secondary)] relative">
                            <Mail size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-error)] rounded-full border-2 border-[var(--color-background)]"></span>
                        </button>
                        <button className="p-2 rounded-full hover:bg-[var(--color-background-tertiary)] text-[var(--color-foreground-secondary)] relative">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-error)] rounded-full border-2 border-[var(--color-background)]"></span>
                        </button>
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-[var(--color-background-tertiary)] px-3 py-1.5 rounded-lg transition-colors">
                            <div className="w-8 h-8 rounded-full bg-[var(--color-primary-light)] text-white flex items-center justify-center font-bold">
                                HD
                            </div>
                            <span className="text-sm font-medium text-[var(--color-foreground)]">HOD Name</span>
                            <ChevronDown size={16} className="text-[var(--color-foreground-muted)]" />
                        </div>
                    </div>
                </div>

                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">Welcome, [HOD Name]</h2>
                    <p className="text-[var(--color-foreground-secondary)]">Computer Science & Engineering Department - Overview and Analytics</p>
                </div>

                {/* Department Overview Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Students Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)] hover:border-[var(--color-primary-light)] transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-[var(--color-foreground)]">Total Students</h3>
                            <div className="p-2 bg-[var(--color-background-secondary)] rounded-lg text-[var(--color-primary)]">
                                <Users size={20} />
                            </div>
                        </div>
                        <div className="text-4xl font-bold text-[var(--color-foreground)] mb-2">486</div>
                        <p className="text-sm text-[var(--color-success)]">↑ 12 from last semester</p>
                    </div>

                    {/* Total Faculty Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)] hover:border-[var(--color-primary-light)] transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-[var(--color-foreground)]">Total Faculty</h3>
                            <div className="p-2 bg-[var(--color-background-secondary)] rounded-lg text-[var(--color-primary)]">
                                <Users size={20} />
                            </div>
                        </div>
                        <div className="text-4xl font-bold text-[var(--color-foreground)] mb-2">24</div>
                        <p className="text-sm text-[var(--color-foreground-muted)]">Teaching Staff</p>
                    </div>

                    {/* Ongoing Courses Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)] hover:border-[var(--color-primary-light)] transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-[var(--color-foreground)]">Ongoing Courses</h3>
                            <div className="p-2 bg-[var(--color-background-secondary)] rounded-lg text-[var(--color-primary)]">
                                <BookOpen size={20} />
                            </div>
                        </div>
                        <div className="text-4xl font-bold text-[var(--color-foreground)] mb-2">38</div>
                        <p className="text-sm text-[var(--color-foreground-muted)]">This semester</p>
                    </div>

                    {/* Pending Approvals Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)] hover:border-[var(--color-warning)] transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-[var(--color-foreground)]">Pending Approvals</h3>
                            <div className="p-2 bg-[var(--color-background-secondary)] rounded-lg text-[var(--color-warning)]">
                                <AlertCircle size={20} />
                            </div>
                        </div>
                        <div className="text-4xl font-bold text-[var(--color-warning)] mb-2">7</div>
                        <p className="text-sm text-[var(--color-foreground-muted)]">Requires attention</p>
                    </div>
                </div>

                {/* Second Row - Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Attendance Overview */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-semibold text-[var(--color-foreground)]">Department Attendance</h3>
                                <p className="text-sm text-[var(--color-foreground-muted)]">Current month average</p>
                            </div>
                            <ClipboardCheck size={20} className="text-[var(--color-primary)]" />
                        </div>
                        <div className="mb-4">
                            <div className="text-3xl font-bold text-[var(--color-foreground)] mb-2">87.5%</div>
                            <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-3">
                                <div className="bg-[var(--color-success)] h-3 rounded-full transition-all duration-300" style={{ width: '87.5%' }}></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-[var(--color-foreground-muted)]">Year 1</p>
                                <p className="font-bold text-[var(--color-foreground)]">92%</p>
                            </div>
                            <div>
                                <p className="text-[var(--color-foreground-muted)]">Year 2</p>
                                <p className="font-bold text-[var(--color-foreground)]">88%</p>
                            </div>
                            <div>
                                <p className="text-[var(--color-foreground-muted)]">Year 3</p>
                                <p className="font-bold text-[var(--color-foreground)]">85%</p>
                            </div>
                            <div>
                                <p className="text-[var(--color-foreground-muted)]">Year 4</p>
                                <p className="font-bold text-[var(--color-foreground)]">84%</p>
                            </div>
                        </div>
                    </div>

                    {/* Pass Percentage */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-semibold text-[var(--color-foreground)]">Pass Percentage</h3>
                                <p className="text-sm text-[var(--color-foreground-muted)]">Last semester results</p>
                            </div>
                            <TrendingUp size={20} className="text-[var(--color-success)]" />
                        </div>
                        <div className="mb-4">
                            <div className="text-3xl font-bold text-[var(--color-foreground)] mb-2">91.3%</div>
                            <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-3">
                                <div className="bg-[var(--color-success)] h-3 rounded-full transition-all duration-300" style={{ width: '91.3%' }}></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-[var(--color-foreground-muted)]">First Class</p>
                                <p className="font-bold text-[var(--color-success)]">45%</p>
                            </div>
                            <div>
                                <p className="text-[var(--color-foreground-muted)]">Second Class</p>
                                <p className="font-bold text-[var(--color-foreground)]">35%</p>
                            </div>
                            <div>
                                <p className="text-[var(--color-foreground-muted)]">Pass Class</p>
                                <p className="font-bold text-[var(--color-foreground)]">11.3%</p>
                            </div>
                            <div>
                                <p className="text-[var(--color-foreground-muted)]">Arrears</p>
                                <p className="font-bold text-[var(--color-error)]">8.7%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Third Row - Pending Approvals & Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Pending Approvals List */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-[var(--color-foreground)]">Pending Approvals</h3>
                            <span className="px-2 py-1 bg-[var(--color-warning)] text-white text-xs rounded-full">7 Pending</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-[var(--color-background-secondary)] rounded-lg hover:bg-[var(--color-background-tertiary)] transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <FileCheck size={18} className="text-[var(--color-primary)]" />
                                    <div>
                                        <p className="font-medium text-[var(--color-foreground)] text-sm">Faculty Leave Request</p>
                                        <p className="text-xs text-[var(--color-foreground-muted)]">Dr. Rajesh Kumar - 3 days</p>
                                    </div>
                                </div>
                                <span className="text-xs text-[var(--color-warning)]">2 hrs ago</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-[var(--color-background-secondary)] rounded-lg hover:bg-[var(--color-background-tertiary)] transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <FileCheck size={18} className="text-[var(--color-primary)]" />
                                    <div>
                                        <p className="font-medium text-[var(--color-foreground)] text-sm">Timetable Change</p>
                                        <p className="text-xs text-[var(--color-foreground-muted)]">CS 301 - Lab allocation</p>
                                    </div>
                                </div>
                                <span className="text-xs text-[var(--color-warning)]">5 hrs ago</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-[var(--color-background-secondary)] rounded-lg hover:bg-[var(--color-background-tertiary)] transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <FileCheck size={18} className="text-[var(--color-primary)]" />
                                    <div>
                                        <p className="font-medium text-[var(--color-foreground)] text-sm">Project Approval</p>
                                        <p className="text-xs text-[var(--color-foreground-muted)]">Final Year - IoT Project</p>
                                    </div>
                                </div>
                                <span className="text-xs text-[var(--color-warning)]">1 day ago</span>
                            </div>
                        </div>
                        <button className="w-full mt-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors">
                            View All Approvals
                        </button>
                    </div>

                    {/* Faculty Performance Snapshot */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-[var(--color-foreground)]">Faculty Performance</h3>
                            <TrendingUp size={20} className="text-[var(--color-success)]" />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-[var(--color-foreground-secondary)]">Dr. Rajesh Kumar</span>
                                    <span className="font-medium text-[var(--color-success)]">Excellent</span>
                                </div>
                                <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2">
                                    <div className="bg-[var(--color-success)] h-2 rounded-full" style={{ width: '95%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-[var(--color-foreground-secondary)]">Prof. Anitha Sharma</span>
                                    <span className="font-medium text-[var(--color-success)]">Very Good</span>
                                </div>
                                <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2">
                                    <div className="bg-[var(--color-success)] h-2 rounded-full" style={{ width: '88%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-[var(--color-foreground-secondary)]">Dr. Priya Menon</span>
                                    <span className="font-medium text-[var(--color-primary)]">Good</span>
                                </div>
                                <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2">
                                    <div className="bg-[var(--color-primary)] h-2 rounded-full" style={{ width: '82%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-[var(--color-foreground-secondary)]">Prof. Vikram Singh</span>
                                    <span className="font-medium text-[var(--color-primary)]">Good</span>
                                </div>
                                <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2">
                                    <div className="bg-[var(--color-primary)] h-2 rounded-full" style={{ width: '79%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
                    <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="mt-1 p-2 bg-[var(--color-background-secondary)] rounded-lg h-fit text-[var(--color-foreground-muted)]">
                                <FileCheck size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-[var(--color-foreground)]">Approved Timetable Changes</h4>
                                <p className="text-sm text-[var(--color-foreground-muted)] mt-1">CS 301 Lab allocation updated • 2 hours ago</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1 p-2 bg-[var(--color-background-secondary)] rounded-lg h-fit text-[var(--color-foreground-muted)]">
                                <Users size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-[var(--color-foreground)]">Department Meeting Scheduled</h4>
                                <p className="text-sm text-[var(--color-foreground-muted)] mt-1">All faculty - Tomorrow at 10:00 AM • 5 hours ago</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1 p-2 bg-[var(--color-background-secondary)] rounded-lg h-fit text-[var(--color-foreground-muted)]">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-[var(--color-foreground)]">Semester Results Published</h4>
                                <p className="text-sm text-[var(--color-foreground-muted)] mt-1">Overall pass percentage: 91.3% • Yesterday</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
