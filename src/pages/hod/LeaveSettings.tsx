import { useState, useEffect } from 'react';
import { Calendar, Save, Clock, AlertCircle } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { Header } from '../../components/layout/Header';
import { useToast } from '../../components/ui/Toast';
import { getWeekendSettings, updateWeekendSettings, type WeekendSetting } from '../../services/leave.service';

const DAYS = [
    { value: 0, label: 'Monday' },
    { value: 1, label: 'Tuesday' },
    { value: 2, label: 'Wednesday' },
    { value: 3, label: 'Thursday' },
    { value: 4, label: 'Friday' },
    { value: 5, label: 'Saturday' },
    { value: 6, label: 'Sunday' },
];

export default function LeaveSettings() {
    const [selectedWeekends, setSelectedWeekends] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await getWeekendSettings();
            const weekendDays = data.filter((s: WeekendSetting) => s.is_weekend).map((s: WeekendSetting) => s.day);
            setSelectedWeekends(weekendDays);
        } catch (error) {
            console.error('Error fetching settings:', error);
            addToast({ type: 'error', title: 'Error', message: 'Failed to load weekend settings.' });
        } finally {
            setLoading(false);
        }
    };

    const toggleDay = (day: number) => {
        if (selectedWeekends.includes(day)) {
            setSelectedWeekends(selectedWeekends.filter(d => d !== day));
        } else {
            setSelectedWeekends([...selectedWeekends, day]);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateWeekendSettings(selectedWeekends);
            addToast({ type: 'success', title: 'Success', message: 'Weekend settings updated successfully.' });
        } catch (error) {
            console.error('Error saving settings:', error);
            addToast({ type: 'error', title: 'Error', message: 'Failed to update settings.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <PageLayout>
            <Header title="Leave Management Settings" />
            <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
                <div className="bg-[var(--color-card)] rounded-2xl shadow-theme-md border border-[var(--color-border)] overflow-hidden">
                    <div className="p-6 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-background-secondary)] to-transparent">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[var(--color-foreground)]">Weekend Configuration</h2>
                                <p className="text-sm text-[var(--color-foreground-muted)]">Define which days are considered weekends for leave calculation in your department.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <div className="w-10 h-10 border-4 border-[var(--color-primary)]/30 border-t-[var(--color-primary)] rounded-full animate-spin" />
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {DAYS.map(day => (
                                        <button
                                            key={day.value}
                                            onClick={() => toggleDay(day.value)}
                                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                                                selectedWeekends.includes(day.value)
                                                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)] shadow-theme-sm'
                                                    : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)] text-[var(--color-foreground-muted)]'
                                            }`}
                                        >
                                            <span className="font-bold">{day.label}</span>
                                            {selectedWeekends.includes(day.value) ? (
                                                <span className="text-[10px] font-black uppercase tracking-widest bg-[var(--color-primary)] text-white px-2 py-0.5 rounded">Weekend</span>
                                            ) : (
                                                <span className="text-[10px] font-black uppercase tracking-widest bg-[var(--color-background-tertiary)] text-[var(--color-foreground-muted)] px-2 py-0.5 rounded">Working</span>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <div className="bg-[var(--color-background-secondary)] p-4 rounded-xl flex items-start gap-3">
                                    <AlertCircle size={20} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
                                    <p className="text-sm text-[var(--color-foreground-secondary)]">
                                        Changing these settings will affect all future leave applications. It will not retroactively change already approved or pending leaves.
                                    </p>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="px-8 py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold hover:bg-[var(--color-primary-hover)] transition-all shadow-theme-md flex items-center gap-2 disabled:opacity-50"
                                        data-testid="save-weekend-settings-btn"
                                    >
                                        {saving ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={20} />
                                                Save Settings
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Placeholder for Leave Type Config (Future Expansion) */}
                <div className="bg-[var(--color-card)] rounded-2xl shadow-theme-md border border-[var(--color-border)] p-8 opacity-50 grayscale cursor-not-allowed">
                     <div className="flex items-center gap-3 mb-4">
                        <Clock size={24} className="text-[var(--color-foreground-muted)]" />
                        <h2 className="text-xl font-bold text-[var(--color-foreground)]">Advanced Leave Rules</h2>
                    </div>
                    <p className="text-[var(--color-foreground-muted)]">Configure carry-forward rules, probation periods, and notification preferences. (Coming Soon)</p>
                </div>
            </div>
        </PageLayout>
    );
}
