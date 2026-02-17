import { useState } from 'react';

import {
    Folder,
    FileText,
    Download,
    Upload,
    Search,
    Filter,
    MoreVertical,
    Clock
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';

// Mock Data
const MOCK_MATERIALS = [
    {
        id: 1,
        title: 'Advanced Data Structures - Lecture Notes',
        subject: 'Data Structures and Algorithms',
        type: 'PDF',
        size: '2.4 MB',
        date: '2023-10-15',
        downloads: 45,
        status: 'Published'
    },
    {
        id: 2,
        title: 'Database Management Systems - Lab Manual',
        subject: 'Database Systems',
        type: 'DOCX',
        size: '1.8 MB',
        date: '2023-10-12',
        downloads: 32,
        status: 'Published'
    },
    {
        id: 3,
        title: 'Software Engineering - Unit 3 Question Bank',
        subject: 'Software Engineering',
        type: 'PDF',
        size: '450 KB',
        date: '2023-10-10',
        downloads: 128,
        status: 'Published'
    },
    {
        id: 4,
        title: 'Operating Systems - Process Scheduling',
        subject: 'Operating Systems',
        type: 'PPTX',
        size: '5.2 MB',
        date: '2023-10-08',
        downloads: 15,
        status: 'Draft'
    },
    {
        id: 5,
        title: 'Computer Networks - OSI Model Diagram',
        subject: 'Computer Networks',
        type: 'PNG',
        size: '1.1 MB',
        date: '2023-10-05',
        downloads: 89,
        status: 'Published'
    },
    {
        id: 6,
        title: 'Web Development - HTML/CSS Cheatsheet',
        subject: 'Web Technologies',
        type: 'PDF',
        size: '890 KB',
        date: '2023-10-01',
        downloads: 210,
        status: 'Published'
    }
];

const StudyMaterials = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    const filteredMaterials = MOCK_MATERIALS.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'All' || item.type === filterType;
        return matchesSearch && matchesFilter;
    });

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'PDF': return <FileText className="text-red-500" />;
            case 'DOCX': return <FileText className="text-blue-500" />;
            case 'PPTX': return <FileText className="text-orange-500" />;
            case 'PNG': return <FileText className="text-purple-500" />;
            default: return <FileText className="text-gray-500" />;
        }
    };

    return (
        <div className="flex bg-[var(--color-background-secondary)] min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                <div className="space-y-6 animate-fade-in">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-[var(--color-foreground)]">Study Materials</h1>
                            <p className="text-[var(--color-foreground-muted)]">Manage and distribute course resources to students</p>
                        </div>

                        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors shadow-md">
                            <Upload />
                            <span>Upload Material</span>
                        </button>
                    </div>

                    {/* Filters and Search */}
                    <div className="flex flex-col md:flex-row gap-4 bg-[var(--color-card)] p-4 rounded-xl shadow-sm border border-[var(--color-border)]">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)]" />
                            <input
                                type="text"
                                placeholder="Search materials by title or subject..."
                                className="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-foreground)]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Filter className="text-[var(--color-foreground-muted)]" />
                            <select
                                className="px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-foreground)] min-w-[150px]"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="All">All Types</option>
                                <option value="PDF">PDF Documents</option>
                                <option value="DOCX">Word Documents</option>
                                <option value="PPTX">Presentations</option>
                                <option value="PNG">Images</option>
                            </select>
                        </div>
                    </div>

                    {/* Materials Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMaterials.map((item) => (
                            <div
                                key={item.id}
                                className="group relative bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-5 hover:shadow-lg transition-all duration-300 hover:border-[var(--color-primary)] overflow-hidden"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 rounded-lg bg-[var(--color-background-secondary)] text-2xl group-hover:scale-110 transition-transform">
                                            {getFileIcon(item.type)}
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--color-background-secondary)] text-[var(--color-foreground-muted)]">
                                                {item.type}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]">
                                        <MoreVertical />
                                    </button>
                                </div>

                                <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-1 line-clamp-1" title={item.title}>
                                    {item.title}
                                </h3>
                                <p className="text-sm text-[var(--color-foreground-muted)] mb-4">{item.subject}</p>

                                <div className="flex items-center justify-between text-xs text-[var(--color-foreground-muted)] border-t border-[var(--color-border)] pt-4">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{item.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Download className="w-4 h-4" />
                                        <span>{item.downloads} downloads</span>
                                    </div>
                                    <div>
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${item.status === 'Published'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Hover Overlay Action */}
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-[var(--color-card)]/95 backdrop-blur-sm rounded-b-xl border-t border-[var(--color-border)] translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-between opacity-0 group-hover:opacity-100">
                                    <button className="flex-1 text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors">
                                        Preview
                                    </button>
                                    <div className="w-px bg-[var(--color-border)] mx-2"></div>
                                    <button className="flex-1 text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors">
                                        Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredMaterials.length === 0 && (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-background-secondary)] text-[var(--color-foreground-muted)] mb-4">
                                <Folder className="text-3xl w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-medium text-[var(--color-foreground)]">No materials found</h3>
                            <p className="text-[var(--color-foreground-muted)] mt-1">Try adjusting your search or filters</p>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default StudyMaterials;
