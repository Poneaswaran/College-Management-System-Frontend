import { useState, useCallback, useEffect } from 'react';
import { ShieldCheck, RefreshCw, AlertCircle, AlertTriangle, Info, ChevronRight, Sparkles, Filter, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../../components/layout/PageLayout';
import { Header } from '../../../components/layout/Header';
import { useToast } from '../../../components/ui/Toast';
import { HODTimeTableService, type Finding } from '../../../services/HODTimeTableAssignment';

export default function ScheduleAudit() {
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [score, setScore] = useState<number | null>(null);
    const [findings, setFindings] = useState<Finding[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [semesterId, setSemesterId] = useState<number | null>(null);

    // Fetch semester context on mount
    useEffect(() => {
        const init = async () => {
            try {
                const data = await HODTimeTableService.fetchClasses('', undefined);
                if (data.current_semester_id) {
                    setSemesterId(data.current_semester_id);
                }
            } catch (err) {
                console.error("Failed to load audit context", err);
            }
        };
        init();
    }, []);

    const runAudit = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await HODTimeTableService.runAudit(semesterId);
            setScore(data.score);
            setFindings(data.findings);
            addToast({
                type: 'success',
                title: 'Audit Complete',
                message: 'Your schedule has been scanned for sub-optimal patterns.'
            });
        } catch (err) {
            console.error('Audit failed:', err);
            addToast({
                type: 'error',
                title: 'Audit Failed',
                message: 'Failed to complete schedule health check.'
            });
        } finally {
            setIsLoading(false);
        }
    }, [addToast]);

    const getScoreColor = (s: number) => {
        if (s <= 40) return 'var(--color-error)';
        if (s <= 70) return 'var(--color-warning)';
        return 'var(--color-success)';
    };

    const getScoreLabel = (s: number) => {
        if (s <= 40) return 'Critical Issues';
        if (s <= 70) return 'Needs Attention';
        return 'Healthy Schedule';
    };

    const handleFixWithAI = (finding: Finding) => {
        const message = `Fix this issue: ${finding.title} — ${finding.description}`;
        const encodedMessage = encodeURIComponent(message);
        navigate(`/hod/academic/ai-copilot?context=${encodedMessage}`);
    };

    return (
        <PageLayout>
            <div className="space-y-8">
                <Header 
                    title="Schedule Health Audit" 
                    icon={<ShieldCheck className="h-6 w-6 text-[var(--color-primary)]" />}
                    description="AI-powered analysis of soft-preference constraints"
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Score Section */}
                    <div className="lg:col-span-1 space-y-6">
                        <section className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 flex flex-col items-center text-center shadow-sm">
                            <h3 className="text-sm font-semibold mb-8 text-[var(--color-foreground-secondary)] uppercase tracking-widest">
                                Health Score
                            </h3>
                            
                            <div className="relative h-48 w-48 mb-6">
                                <svg className="h-full w-full transform -rotate-90">
                                    {/* Background Circle */}
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        fill="none"
                                        stroke="var(--color-background-tertiary)"
                                        strokeWidth="12"
                                    />
                                    {/* Progress Circle */}
                                    {score !== null && (
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            fill="none"
                                            stroke={getScoreColor(score)}
                                            strokeWidth="12"
                                            strokeDasharray={2 * Math.PI * 88}
                                            strokeDashoffset={2 * Math.PI * 88 * (1 - score / 100)}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000 ease-out"
                                        />
                                    )}
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-black text-[var(--color-foreground)]">
                                        {score ?? '--'}
                                    </span>
                                    <span className="text-[10px] font-bold text-[var(--color-foreground-tertiary)] uppercase tracking-tighter">
                                        Optimization
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 w-full">
                                {score !== null ? (
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-bold" style={{ color: getScoreColor(score) }}>
                                            {getScoreLabel(score)}
                                        </h4>
                                        <p className="text-xs text-[var(--color-foreground-tertiary)]">
                                            Based on {findings.length} findings across all sections
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-xs text-[var(--color-foreground-tertiary)] py-2">
                                        No audit data yet. Run an audit to see your health score.
                                    </p>
                                )}
                                
                                <button
                                    onClick={runAudit}
                                    disabled={isLoading}
                                    className="w-full py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-[var(--color-primary-light)]"
                                >
                                    {isLoading ? (
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Activity className="h-4 w-4" />
                                    )}
                                    <span>{isLoading ? 'Analyzing...' : 'Run Audit Now'}</span>
                                </button>
                            </div>
                        </section>

                        <div className="bg-[var(--color-background-tertiary)] rounded-2xl p-6 border border-[var(--color-border)] space-y-4">
                            <div className="flex items-center gap-2">
                                <Info className="h-4 w-4 text-[var(--color-primary)]" />
                                <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--color-foreground-secondary)]">About Audit</h4>
                            </div>
                            <p className="text-xs leading-relaxed text-[var(--color-foreground-secondary)]">
                                Artificial Intelligence scans for "soft" preference violations like faculty exhaustion (too many consecutive hours), unfair period distributions, and classroom movement inefficiencies.
                            </p>
                        </div>
                    </div>

                    {/* Findings Section */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center gap-2">
                                 <h3 className="text-sm font-bold text-[var(--color-foreground)]">Key Audit Findings</h3>
                                 {findings.length > 0 && <span className="px-2 py-0.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-primary)] text-[10px] font-bold">{findings.length}</span>}
                             </div>
                        </div>

                        {findings.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center bg-[var(--color-background-tertiary)] rounded-2xl border-2 border-dashed border-[var(--color-border)] py-12 text-center">
                                <div className="h-12 w-12 rounded-full bg-[var(--color-surface)] flex items-center justify-center mb-4">
                                    <Sparkles className="h-6 w-6 text-[var(--color-foreground-tertiary)]" />
                                </div>
                                <p className="text-sm text-[var(--color-foreground-tertiary)] max-w-xs">
                                    {isLoading ? 'Rethinking scheduling constraints...' : 'Run an audit to see detailed findings about your schedule quality.'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {findings.map(finding => {
                                    const severityConfig = {
                                        critical: { icon: <AlertCircle className="h-4 w-4" />, color: 'var(--color-error)', bg: 'var(--color-error-light)' },
                                        warning: { icon: <AlertTriangle className="h-4 w-4" />, color: 'var(--color-warning)', bg: 'var(--color-warning-light)' },
                                        info: { icon: <Info className="h-4 w-4" />, color: 'var(--color-primary)', bg: 'var(--color-primary-light)' }
                                    };
                                    const config = severityConfig[finding.severity];

                                    return (
                                        <div key={finding.id} className="group relative bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] border-l-4 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300" style={{ borderLeftColor: config.color }}>
                                            <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex gap-4">
                                                    <div className="mt-1 h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: config.bg, color: config.color }}>
                                                        {config.icon}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-bold text-sm text-[var(--color-foreground)]">{finding.title}</h4>
                                                            <span className="text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded" style={{ backgroundColor: config.bg, color: config.color }}>
                                                                {finding.severity}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-[var(--color-foreground-secondary)] leading-relaxed max-w-lg">
                                                            {finding.description}
                                                        </p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleFixWithAI(finding)}
                                                    className="shrink-0 flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-lg border border-[var(--color-border)] bg-[var(--color-background-tertiary)] hover:bg-[var(--color-surface)] text-[var(--color-primary)] transition-all active:scale-95"
                                                >
                                                    <Sparkles className="h-3 w-3" />
                                                    <span>Fix with AI</span>
                                                    <ChevronRight className="h-3 w-3 opacity-50" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
