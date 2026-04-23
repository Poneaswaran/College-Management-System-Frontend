import { useState, useCallback, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, CheckCircle2, RefreshCw, Layers, MessageSquare } from 'lucide-react';
import PageLayout from '../../../components/layout/PageLayout';
import { Header } from '../../../components/layout/Header';
import { useToast } from '../../../components/ui/Toast';
import { 
    HODTimeTableService, 
    type Proposal, 
    type HODClass 
} from '../../../services/HODTimeTableAssignment';

type ChatMessage = {
    id: string;
    role: "user" | "ai";
    content: string;
    proposals?: Proposal[];
    timestamp: Date;
};

export default function AICopilot() {
    const { addToast } = useToast();
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'ai',
            content: "Hello! I'm your Timetable Copilot. Ask me anything about the current schedule — I can suggest changes, explain conflicts, or audit your timetable.",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedClass, setSelectedClass] = useState<HODClass | null>(null);
    const [semesterId, setSemesterId] = useState<number | null>(null);
    const [classes, setClasses] = useState<HODClass[]>([]);
    const [appliedProposals, setAppliedProposals] = useState<Set<number>>(new Set());
    const [processingProposal, setProcessingProposal] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'chat' | 'proposals'>('chat'); // For mobile

    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial class fetch
    useEffect(() => {
        const fetchAllClasses = async () => {
            try {
                const data = await HODTimeTableService.fetchClasses('', undefined);
                setClasses(data.results);
                if (data.current_semester_id) {
                    setSemesterId(data.current_semester_id);
                }
            } catch (err) {
                console.error('Failed to load classes:', err);
            }
        };
        fetchAllClasses();
    }, []);

    // Auto-scroll chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = useCallback(async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsLoading(true);

        try {
            const data = await HODTimeTableService.sendCopilotMessage(userMsg.content, semesterId, selectedClass?.id || null);
            
            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: data.reply,
                proposals: data.proposals || [],
                timestamp: new Date()
            };
            
            setMessages(prev => [...prev, aiMsg]);
            if (data.proposals && data.proposals.length > 0) {
                setActiveTab('proposals');
            }
        } catch (err) {
            console.error('Copilot error:', err);
            addToast({
                type: 'error',
                title: 'AI Service Error',
                message: 'Failed to get response from the Copilot. Please try again later.'
            });
        } finally {
            setIsLoading(false);
        }
    }, [inputValue, isLoading, selectedClass, addToast]);

    const handleApproveProposal = useCallback(async (proposal: Proposal) => {
        if (processingProposal !== null) return;
        
        setProcessingProposal(proposal.slot_id);
        try {
            const res = await HODTimeTableService.commitProposal(proposal);
            if (res.success) {
                addToast({
                    type: 'success',
                    title: 'Proposal Applied',
                    message: res.detail
                });
                setAppliedProposals(prev => new Set(prev).add(proposal.slot_id));
            } else {
                throw new Error(res.detail);
            }
        } catch (err: unknown) {
            console.error('Proposal failed:', err);
            const error = err as { message?: string };
            addToast({
                type: 'error',
                title: 'Application Failed',
                message: error.message || 'Failed to apply the proposed change.'
            });
        } finally {
            setProcessingProposal(null);
        }
    }, [processingProposal, addToast]);

    // Current proposals across all messages
    const currentProposals = messages.reduce<Proposal[]>((acc, msg) => {
        if (msg.proposals) {
            return [...acc, ...msg.proposals];
        }
        return acc;
    }, []);

    return (
        <PageLayout>
            <div className="flex-1 flex flex-col h-[calc(100vh-12rem)] min-h-[600px] gap-6">
                <Header 
                    title="AI Timetable Copilot" 
                    titleIcon={<Bot className="h-6 w-6 text-[var(--color-primary)]" />}
                />

                <div className="flex-1 flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
                    {/* Left: Chat Interface (40%) */}
                    <div className={`lg:w-[40%] flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm overflow-hidden ${activeTab === 'proposals' ? 'hidden lg:flex' : 'flex'}`}>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-background-tertiary)] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-[var(--color-primary)]" />
                                <span className="font-semibold text-sm">Conversation</span>
                            </div>
                            <select 
                                className="text-xs bg-[var(--color-surface)] border border-[var(--color-border)] rounded px-2 py-1 outline-none text-[var(--color-foreground)]"
                                onChange={(e) => {
                                    const id = parseInt(e.target.value);
                                    setSelectedClass(classes.find(c => c.id === id) || null);
                                }}
                            >
                                <option value="">Global Assistant</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
                                ))}
                            </select>
                        </div>

                        {/* Messages Thread */}
                        <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 scroll-smooth">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm transition-all duration-200 ${
                                        msg.role === 'user' 
                                            ? 'bg-[var(--color-primary)] text-white' 
                                            : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-foreground)]'
                                    }`}>
                                        {msg.content}
                                        <div className={`text-[10px] mt-1 opacity-60 ${msg.role === 'user' ? 'text-white' : 'text-[var(--color-foreground-tertiary)]'}`}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-3 flex gap-1 items-center">
                                        <div className="w-1 h-1 bg-[var(--color-foreground-tertiary)] rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1 h-1 bg-[var(--color-foreground-tertiary)] rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1 h-1 bg-[var(--color-foreground-tertiary)] rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Tab Switcher */}
                        <div className="lg:hidden p-2 border-t border-[var(--color-border)] flex gap-2">
                             <button 
                                onClick={() => setActiveTab('proposals')}
                                className="flex-1 py-2 text-xs font-medium rounded-lg bg-[var(--color-background-tertiary)] text-[var(--color-foreground)] border border-[var(--color-border)]"
                             >
                                 View Proposals ({currentProposals.length})
                             </button>
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-[var(--color-background-tertiary)] flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Type your request here..."
                                disabled={isLoading}
                                className="flex-1 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] text-[var(--color-foreground)] placeholder-[var(--color-foreground-tertiary)]"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isLoading}
                                className="bg-[var(--color-primary)] text-white p-2 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center min-w-[40px]"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </form>
                    </div>

                    {/* Right: Proposals Viewer (60%) */}
                    <div className={`lg:w-[60%] flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm overflow-hidden ${activeTab === 'chat' ? 'hidden lg:flex' : 'flex'}`}>
                        <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-background-secondary)] flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <Layers className="h-4 w-4 text-[var(--color-primary)]" />
                                <span>Proposed Changes</span>
                            </div>
                            <div className="lg:hidden">
                                <button 
                                    onClick={() => setActiveTab('chat')}
                                    className="p-1 hover:bg-[var(--color-background-tertiary)] rounded"
                                >
                                    <RefreshCw className="h-4 w-4 text-[var(--color-foreground-tertiary)]" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto space-y-6">
                            {currentProposals.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                                    <div className="h-16 w-16 rounded-full bg-[var(--color-background-tertiary)] flex items-center justify-center">
                                        <Sparkles className="h-8 w-8 text-[var(--color-foreground-tertiary)]" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-semibold text-[var(--color-foreground)]">No AI proposals yet</h3>
                                        <p className="text-xs text-[var(--color-foreground-tertiary)] max-w-xs mx-auto">
                                            Ask the Copilot to suggest schedule changes, fix conflicts, or optimize periods.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentProposals.map((proposal, idx) => {
                                        const isApplied = appliedProposals.has(proposal.slot_id);
                                        const isProcessing = processingProposal === proposal.slot_id;
                                        
                                        return (
                                            <div key={idx} className={`relative flex flex-col p-4 rounded-xl border transition-all duration-200 ${
                                                isApplied 
                                                    ? 'bg-[var(--color-success-light)] border-[var(--color-success)] opacity-75' 
                                                    : 'bg-[var(--color-card)] border-[var(--color-border)] hover:border-[var(--color-primary-light)] shadow-sm'
                                            }`}>
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="space-y-0.5">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-foreground-tertiary)]">
                                                            {proposal.day} • {proposal.period_label}
                                                        </span>
                                                        <h4 className="font-semibold text-sm text-[var(--color-foreground)]">
                                                            {proposal.subject_name}
                                                        </h4>
                                                    </div>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                                        proposal.action === 'assign' 
                                                            ? 'bg-[var(--color-success-light)] text-[var(--color-success)]' 
                                                            : proposal.action === 'unassign'
                                                            ? 'bg-[var(--color-error-light)] text-[var(--color-error)]'
                                                            : 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                                                    }`}>
                                                        {proposal.action}
                                                    </span>
                                                </div>

                                                <div className="flex-1 mb-4 flex items-center gap-2 text-xs text-[var(--color-foreground-secondary)] bg-[var(--color-background-tertiary)] p-2 rounded-lg">
                                                    <div className="h-6 w-6 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)] text-[10px] font-bold">
                                                        {proposal.faculty_name[0]}
                                                    </div>
                                                    <span>{proposal.faculty_name}</span>
                                                </div>

                                                <button
                                                    onClick={() => handleApproveProposal(proposal)}
                                                    disabled={isApplied || isProcessing || processingProposal !== null}
                                                    className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                                                        isApplied
                                                            ? 'bg-transparent text-[var(--color-success)] cursor-default'
                                                            : 'bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-50 active:scale-[0.98]'
                                                    }`}
                                                >
                                                    {isProcessing ? (
                                                        <RefreshCw className="h-3 w-3 animate-spin" />
                                                    ) : isApplied ? (
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    ) : null}
                                                    <span>{isApplied ? 'Applied Successfully' : isProcessing ? 'Applying...' : 'Approve Change'}</span>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
