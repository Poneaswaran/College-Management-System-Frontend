import { useState, useCallback } from 'react';
import { Sparkles, Loader2, Info, ChevronDown, ChevronUp, CheckCircle2, XCircle } from 'lucide-react';
import { HODTimeTableService, type Alternative } from '../../services/HODTimeTableAssignment';

type AIConflictExplainerProps = {
    errorMessage: string;
    slotContext: {
        day: string;
        period_label: string;
        faculty_name: string;
        subject_name: string;
    };
    onClose: () => void;
};

export function AIConflictExplainer({ errorMessage, slotContext, onClose }: AIConflictExplainerProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [explanation, setExplanation] = useState<string | null>(null);
    const [alternatives, setAlternatives] = useState<Alternative[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleExplain = useCallback(async () => {
        if (explanation) {
            setIsExpanded(!isExpanded);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const data = await HODTimeTableService.explainConflict(errorMessage, slotContext);
            setExplanation(data.explanation);
            setAlternatives(data.alternatives);
            setIsExpanded(true);
        } catch (err) {
            console.error('AI Explanation failed:', err);
            setError('Failed to load AI explanation. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [errorMessage, slotContext, explanation, isExpanded]);

    return (
        <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-background-secondary)] overflow-hidden transition-all duration-200">
            <button
                onClick={handleExplain}
                disabled={isLoading}
                className="flex w-full items-center justify-between p-3 text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-surface)] transition-colors"
            >
                <div className="flex items-center gap-2">
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Sparkles className="h-4 w-4" />
                    )}
                    <span>{isLoading ? 'Consulting AI...' : 'Explain with AI ✦'}</span>
                </div>
                {explanation && (
                    isExpanded ? <ChevronUp className="h-4 w-4 text-[var(--color-foreground-tertiary)]" /> : <ChevronDown className="h-4 w-4 text-[var(--color-foreground-tertiary)]" />
                )}
            </button>

            {isExpanded && (explanation || error) && (
                <div className="border-t border-[var(--color-border)] p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    {error ? (
                        <div className="flex items-center gap-2 text-[var(--color-error)] text-sm">
                            <Info className="h-4 w-4" />
                            <span>{error}</span>
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md bg-[var(--color-surface)] p-3 shadow-sm">
                                <p className="text-sm leading-relaxed text-[var(--color-foreground)]">
                                    {explanation}
                                </p>
                            </div>

                            {alternatives.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-foreground-tertiary)]">
                                        Suggested Alternatives
                                    </h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-[var(--color-border)]">
                                                    <th className="pb-2 font-medium">Day</th>
                                                    <th className="pb-2 font-medium">Period</th>
                                                    <th className="pb-2 font-medium">Status</th>
                                                    <th className="pb-2 font-medium text-right">Recommendation</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[var(--color-border)]">
                                                {alternatives.map((alt, idx) => (
                                                    <tr key={idx} className="hover:bg-[var(--color-surface)] transition-colors">
                                                        <td className="py-2">{alt.day}</td>
                                                        <td className="py-2">{alt.period_label}</td>
                                                        <td className="py-2">
                                                            <div className="flex items-center gap-1">
                                                                {alt.is_free ? (
                                                                    <CheckCircle2 className="h-3 w-3 text-[var(--color-success)]" />
                                                                ) : (
                                                                    <XCircle className="h-3 w-3 text-[var(--color-error)]" />
                                                                )}
                                                                <span className={alt.is_free ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}>
                                                                    {alt.is_free ? 'Available' : 'Occupied'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="py-2 text-right italic text-[var(--color-foreground-secondary)]">
                                                            {alt.suggestion}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="text-xs font-medium text-[var(--color-foreground-tertiary)] hover:text-[var(--color-foreground)] underline decoration-dotted transition-colors"
                                >
                                    Dismiss Analysis
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
