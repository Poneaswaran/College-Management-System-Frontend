
import {
    FileText,
    Bell,
    Mail,
    ChevronDown,
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';

export default function StudentDashboard() {

    return (
        <div className="flex bg-[var(--color-background-secondary)] min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Dashboard Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Student Dashboard</h1>
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
                                SN
                            </div>
                            <span className="text-sm font-medium text-[var(--color-foreground)]">Student Name</span>
                            <ChevronDown size={16} className="text-[var(--color-foreground-muted)]" />
                        </div>
                    </div>
                </div>

                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">Welcome, [Student Name]</h2>
                    <p className="text-[var(--color-foreground-secondary)]">Summary dashboard with a year so under your tatarlant studen.</p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* GPA Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)] hover:border-[var(--color-primary-light)] transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-[var(--color-foreground)]">Current GPA</h3>
                        </div>
                        <div className="text-5xl font-bold text-[var(--color-foreground)] mb-2">3.8</div>
                    </div>

                    {/* Upcoming Assignments Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-semibold text-[var(--color-foreground)]">Upcoming Assignments</h3>
                                <p className="text-sm text-[var(--color-foreground-muted)]">(2 due this week)</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-[var(--color-foreground-secondary)]">
                                <FileText size={16} className="text-[var(--color-primary)]" />
                                <span>Learning Assignment 1</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[var(--color-foreground-secondary)]">
                                <FileText size={16} className="text-[var(--color-primary)]" />
                                <span>Learning Assignment 2</span>
                            </div>
                        </div>
                    </div>

                    {/* Course Progress Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-semibold text-[var(--color-foreground)]">Course Progress</h3>
                                <p className="text-sm text-[var(--color-foreground-muted)]">(85% complete)</p>
                            </div>
                        </div>
                        <div className="mb-2">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-[var(--color-foreground-secondary)]">Course Progress</span>
                            </div>
                            <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2.5">
                                <div className="bg-[var(--color-primary)] h-2.5 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Second Row Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)] md:col-span-1">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-semibold text-[var(--color-foreground)]">Course Progress</h3>
                                <p className="text-sm text-[var(--color-foreground-muted)]">(85% complete)</p>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-[var(--color-foreground-secondary)]">Course Progress</span>
                            </div>
                            <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2.5">
                                <div className="bg-[var(--color-primary)] h-2.5 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                        <button className="w-full py-2 bg-[var(--color-background-secondary)] text-[var(--color-foreground-secondary)] rounded-lg text-sm font-medium hover:bg-[var(--color-border)] transition-colors">
                            Learn more
                        </button>
                    </div>
                </div>


                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
                    <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="mt-1 p-2 bg-[var(--color-background-secondary)] rounded-lg h-fit text-[var(--color-foreground-muted)]">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-[var(--color-foreground)]">Submitted Math Homework</h4>
                                <p className="text-sm text-[var(--color-foreground-muted)] mt-1">Submitted 2 minutes ago</p>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
