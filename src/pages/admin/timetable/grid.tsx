import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { useToast } from '../../../components/ui/Toast';
import { Loader2, Plus, Trash2, Send, Bot, Save, LayoutDashboard, Calendar } from 'lucide-react';
import PageLayout from '../../../components/layout/PageLayout';
import { Header } from '../../../components/layout/Header';
import api from '../../../services/api';
import {
    createTimetableGrid,
    sendGridAIChat,
    TimetableGrid,
    PeriodSlot
} from '../../../features/admin/timetable/services/timetableService';

export default function TimetableGridPage() {
    const { addToast } = useToast();
    const [departments, setDepartments] = useState<any[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('ai');

    // AI Chat State
    const [sessionId] = useState(() => crypto.randomUUID());
    const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', text: string}[]>([
        { role: 'model', text: 'Hi! I can help you configure the daily timetable grid. What are the start and end times for the college day?' }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Manual Form / Resolved Grid State
    const [gridData, setGridData] = useState<Partial<TimetableGrid>>({
        academic_year: '2025-26',
        effective_from: new Date().toISOString().split('T')[0],
        day_start: '09:00',
        day_end: '16:00',
        slots: []
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const fetchDepartments = async () => {
        try {
            const response = await api.get('/core/departments/');
            const data = response.data.departments || [];
            setDepartments(data);
            if (data.length > 0) {
                setSelectedDepartment(data[0].id.toString());
            }
        } catch (error) {
            addToast({ type: 'error', title: 'Error', message: 'Failed to fetch departments' });
        }
    };

    const handleSendChat = async () => {
        if (!chatInput.trim() || !selectedDepartment) return;

        const userMsg = chatInput;
        setChatInput('');
        setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsChatLoading(true);

        try {
            const response = await sendGridAIChat({
                session_id: sessionId,
                message: userMsg,
                department_id: parseInt(selectedDepartment)
            });

            setChatHistory(prev => [...prev, { role: 'model', text: response.reply }]);

            if (response.state === 'complete' && response.resolved_grid) {
                setGridData(response.resolved_grid);
                addToast({ type: 'success', title: 'Success', message: 'Grid configuration resolved from chat!' });
            }
        } catch (error: any) {
            const errMsg = error.response?.data?.error || 'Failed to communicate with AI';
            setChatHistory(prev => [...prev, { role: 'model', text: `Error: ${errMsg}` }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleSaveGrid = async () => {
        if (!selectedDepartment) {
            addToast({ type: 'error', title: 'Error', message: 'Please select a department' });
            return;
        }

        try {
            setIsSaving(true);
            const payload = {
                ...gridData,
                department: parseInt(selectedDepartment)
            } as TimetableGrid;

            await createTimetableGrid(payload);
            addToast({ type: 'success', title: 'Success', message: 'Timetable Grid saved successfully!' });
        } catch (error: any) {
            console.error('Save error:', error.response?.data);
            addToast({ 
                type: 'error',
                title: 'Validation Error', 
                message: JSON.stringify(error.response?.data?.slots || error.response?.data || 'Failed to save')
            });
        } finally {
            setIsSaving(false);
        }
    };

    const addSlot = () => {
        const slots = gridData.slots || [];
        setGridData({
            ...gridData,
            slots: [...slots, {
                slot_number: slots.length + 1,
                slot_type: 'class',
                start_time: '',
                end_time: '',
                label: `Period ${slots.length + 1}`
            }]
        });
    };

    const updateSlot = (index: number, field: string, value: string) => {
        const newSlots = [...(gridData.slots || [])];
        newSlots[index] = { ...newSlots[index], [field]: value };
        setGridData({ ...gridData, slots: newSlots });
    };

    const removeSlot = (index: number) => {
        const newSlots = (gridData.slots || []).filter((_, i) => i !== index)
            .map((slot, i) => ({ ...slot, slot_number: i + 1 })); // renumber
        setGridData({ ...gridData, slots: newSlots });
    };

    return (
        <PageLayout>
            <Header 
                title="Timetable Grid"
                titleIcon={
                    <span className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center">
                        <LayoutDashboard size={20} className="text-[var(--color-primary)]" />
                    </span>
                }
                actions={
                    <div className="flex gap-4 items-center">
                        <Select 
                            value={selectedDepartment} 
                            onChange={setSelectedDepartment} 
                            options={(Array.isArray(departments) ? departments : []).map(d => ({ value: d.id.toString(), label: `${d.name} (${d.code})` }))}
                            placeholder="Select Department"
                            wrapperClassName="w-64"
                        />
                        <Button onClick={handleSaveGrid} disabled={isSaving || !gridData.slots?.length} className="h-11 shadow-lg shadow-[var(--color-primary)]/20">
                            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Grid
                        </Button>
                    </div>
                }
            />

            <div className="px-4 md:px-6 lg:px-8 pb-8 space-y-6">
                <div className="mb-8">
                    <p className="text-[var(--color-foreground-secondary)] text-lg">
                        Define daily schedule structures via AI or manual entry for each department.
                    </p>
                </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left Panel: Builder (Manual / AI) */}
                <div className="flex flex-col h-[700px] bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] shadow-sm">
                    <div className="border-b border-[var(--color-border)] p-4">
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setActiveTab('ai')}
                                className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'ai' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                <Bot className="w-4 h-4 inline mr-2" />
                                AI Copilot
                            </button>
                            <button 
                                onClick={() => setActiveTab('manual')}
                                className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'manual' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                Manual Builder
                            </button>
                        </div>
                    </div>

                    {activeTab === 'ai' ? (
                        <div className="flex flex-col flex-1 p-0 overflow-hidden bg-[var(--color-background-secondary)]">
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {chatHistory.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] rounded-2xl p-4 text-sm shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200'}`}>
                                            <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                                {isChatLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 flex gap-2 shadow-sm">
                                            <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 rounded-full bg-primary/80 animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="p-4 bg-[var(--color-card)] border-t border-[var(--color-border)]">
                                <form onSubmit={(e) => { e.preventDefault(); handleSendChat(); }} className="flex gap-2 relative">
                                    <textarea
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendChat();
                                            }
                                        }}
                                        placeholder="E.g. We have 6 periods of 60 mins from 9am to 4pm, lunch at 1pm..."
                                        disabled={isChatLoading}
                                        className="w-full pr-12 py-3 px-4 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] resize-none min-h-[48px] max-h-32 scrollbar-hide"
                                        rows={1}
                                    />
                                    <Button 
                                        type="button" 
                                        onClick={handleSendChat}
                                        disabled={isChatLoading || !chatInput.trim()} 
                                        size="icon" 
                                        className="absolute right-2 bottom-2 h-8 w-8 rounded-lg shadow-sm"
                                    >
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[var(--color-text-secondary)]">Academic Year</label>
                                    <input className="w-full h-10 px-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg outline-none" value={gridData.academic_year} onChange={e => setGridData({...gridData, academic_year: e.target.value})} placeholder="2025-26" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[var(--color-text-secondary)]">Effective From</label>
                                    <input className="w-full h-10 px-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg outline-none" type="date" value={gridData.effective_from} onChange={e => setGridData({...gridData, effective_from: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[var(--color-text-secondary)]">Day Start Time</label>
                                    <input className="w-full h-10 px-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg outline-none" type="time" value={gridData.day_start || ''} onChange={e => setGridData({...gridData, day_start: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[var(--color-text-secondary)]">Day End Time</label>
                                    <input className="w-full h-10 px-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg outline-none" type="time" value={gridData.day_end || ''} onChange={e => setGridData({...gridData, day_end: e.target.value})} />
                                </div>
                            </div>
                            
                            <div className="space-y-4 pt-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-lg">Period Slots</h3>
                                    <Button size="sm" variant="outline" onClick={addSlot}><Plus className="w-4 h-4 mr-2"/> Add Slot</Button>
                                </div>
                                
                                {gridData.slots?.map((slot, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                                        <div className="font-medium text-gray-500 w-6">{slot.slot_number}</div>
                                        <Select 
                                            value={slot.slot_type} 
                                            onChange={(v) => updateSlot(idx, 'slot_type', v)}
                                            options={[
                                                {value: 'class', label: 'Class'},
                                                {value: 'lunch', label: 'Lunch'},
                                                {value: 'break', label: 'Break'}
                                            ]}
                                        />
                                        <input className="w-32 h-10 px-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg outline-none" type="time" value={slot.start_time} onChange={(e) => updateSlot(idx, 'start_time', e.target.value)} />
                                        <span className="text-gray-400">-</span>
                                        <input className="w-32 h-10 px-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg outline-none" type="time" value={slot.end_time} onChange={(e) => updateSlot(idx, 'end_time', e.target.value)} />
                                        <input className="flex-1 h-10 px-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg outline-none" placeholder="Label (e.g. Period 1)" value={slot.label} onChange={(e) => updateSlot(idx, 'label', e.target.value)} />
                                        <Button size="icon" variant="ghost" onClick={() => removeSlot(idx)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                {(!gridData.slots || gridData.slots.length === 0) && (
                                    <div className="text-center p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-gray-500">
                                        No slots defined. Add slots manually or use the AI Copilot.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel: Live Visual Preview */}
                <div className="h-[700px] flex flex-col bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] shadow-sm">
                    <div className="p-6 border-b border-[var(--color-border)]">
                        <div className="flex items-center gap-2 font-semibold text-lg">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Live Grid Preview
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Proportional timeline visualization</p>
                    </div>
                    <div className="flex-1 p-8 overflow-y-auto flex flex-col justify-center bg-[var(--color-background-secondary)]/50">
                        {gridData.slots && gridData.slots.length > 0 ? (
                            <div className="w-full flex flex-col rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800">
                                {gridData.slots.map((slot, idx) => {
                                    // Calculate height proportional to duration
                                    const start = new Date(`2000-01-01T${slot.start_time}`);
                                    const end = new Date(`2000-01-01T${slot.end_time}`);
                                    const durationMins = (end.getTime() - start.getTime()) / 60000;
                                    
                                    // Base min-height for visibility
                                    const minHeight = 60;
                                    const height = Math.max(minHeight, durationMins * 1.5);
                                    
                                    const isBreak = slot.slot_type === 'lunch' || slot.slot_type === 'break';
                                    
                                    return (
                                        <div 
                                            key={idx}
                                            style={{ height: `${height}px` }}
                                            className={`
                                                flex items-center px-6 border-b border-white/50 dark:border-gray-900/50 last:border-0 transition-all hover:brightness-95
                                                ${isBreak 
                                                    ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200' 
                                                    : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-200'}
                                            `}
                                        >
                                            <div className="w-24 text-sm font-medium opacity-80">
                                                {slot.start_time} - {slot.end_time}
                                            </div>
                                            <div className="flex-1 font-semibold pl-4 border-l border-current border-opacity-20">
                                                {slot.label}
                                                <span className="ml-2 text-xs opacity-60 font-normal">({durationMins}m)</span>
                                            </div>
                                            <div className="text-sm font-medium opacity-60 uppercase tracking-wider">
                                                {slot.slot_type}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto">
                                        <Bot className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p>Start chatting with AI or add slots manually<br/>to see the preview here.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
        </PageLayout>
    );
}
