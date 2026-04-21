import { useState, useCallback, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, AlertCircle, CheckCircle2, RefreshCw, Layers, Layout, ChevronRight, MessageSquare, X, MinusSquare, Maximize2, Minimize2 } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { 
    HODTimeTableService, 
    type Proposal, 
    type HODClass 
} from '../../services/HODTimeTableAssignment';

type ChatMessage = {
    id: string;
    role: "user" | "ai";
    content: string;
    proposals?: Proposal[];
    timestamp: Date;
};

interface AICopilotPanelProps {
    selectedClass: HODClass | null;
    semesterId: number | null;
    onProposalApplied?: () => void;
}

export default function AICopilotPanel({ selectedClass, semesterId, onProposalApplied }: AICopilotPanelProps) {
    const { addToast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'ai',
            content: "Hello! I'm your Timetable Copilot. How can I help you with scheduling today?",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [appliedProposals, setAppliedProposals] = useState<Set<number>>(new Set());
    const [processingProposal, setProcessingProposal] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'chat' | 'proposals'>('chat');

    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isMinimized, isOpen]);

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
                message: 'Failed to get response from the Copilot.'
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
                onProposalApplied?.();
            } else {
                throw new Error(res.detail);
            }
        } catch (err: any) {
            addToast({
                type: 'error',
                title: 'Application Failed',
                message: err.message || 'Failed to apply the proposed change.'
            });
        } finally {
            setProcessingProposal(null);
        }
    }, [processingProposal, addToast, onProposalApplied]);

    const currentProposals = messages.reduce<Proposal[]>((acc, msg) => {
        if (msg.proposals) {
            return [...acc, ...msg.proposals];
        }
        return acc;
    }, []);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary-light)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group"
            >
                <Bot className="h-7 w-7" />
                <span className="absolute right-full mr-3 px-3 py-1 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg text-xs font-bold text-[var(--color-foreground)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-sm">
                    AI Timetable Copilot
                </span>
            </button>
        );
    }

    return (
        <div 
            className={`fixed bottom-6 right-6 w-[400px] bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl z-40 flex flex-col transition-all duration-300 ${
                isMinimized ? 'h-14' : 'h-[600px] max-h-[80vh]'
            }`}
        >
            {/* Header */}
            <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-primary)] rounded-t-2xl text-white">
                <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    <span className="font-bold text-sm">Timetable Copilot</span>
                    {selectedClass && (
                        <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-medium">
                            {selectedClass.name}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <button 
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                        {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                    </button>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Tabs */}
                    <div className="flex border-b border-[var(--color-border)] bg-[var(--color-background-secondary)]">
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                                activeTab === 'chat' ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-[var(--color-foreground-muted)]'
                            }`}
                        >
                            <MessageSquare size={14} />
                            Chat
                        </button>
                        <button
                            onClick={() => setActiveTab('proposals')}
                            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors relative ${
                                activeTab === 'proposals' ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-[var(--color-foreground-muted)]'
                            }`}
                        >
                            <Layers size={14} />
                            Proposals
                            {currentProposals.length > 0 && !appliedProposals.size && (
                                <span className="absolute top-2 right-8 h-2 w-2 rounded-full bg-[var(--color-error)] animate-pulse" />
                            )}
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-hidden flex flex-col bg-[var(--color-background-tertiary)]/30">
                        {activeTab === 'chat' ? (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                                    {messages.map(msg => (
                                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[90%] rounded-2xl p-3 text-sm shadow-sm ${
                                                msg.role === 'user' 
                                                    ? 'bg-[var(--color-primary)] text-white font-medium' 
                                                    : 'bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-foreground)]'
                                            }`}>
                                                {msg.content}
                                                <div className={`text-[9px] mt-1 opacity-60 ${msg.role === 'user' ? 'text-white' : 'text-[var(--color-foreground-muted)]'}`}>
                                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-3 flex gap-1 items-center shadow-sm">
                                                <div className="w-1 h-1 bg-[var(--color-primary)] rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                <div className="w-1 h-1 bg-[var(--color-primary)] rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                <div className="w-1 h-1 bg-[var(--color-primary)] rounded-full animate-bounce" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <form onSubmit={handleSendMessage} className="p-4 bg-[var(--color-card)] border-t border-[var(--color-border)] flex gap-2">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder={selectedClass ? `Ask about ${selectedClass.name}...` : "Ask me anything..."}
                                        className="flex-1 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] text-[var(--color-foreground)]"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!inputValue.trim() || isLoading}
                                        className="bg-[var(--color-primary)] text-white p-2 rounded-xl hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center min-w-[40px]"
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                {currentProposals.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-60 py-12">
                                        <Sparkles className="h-10 w-10 text-[var(--color-foreground-muted)]" />
                                        <div>
                                            <p className="text-sm font-bold">No Proposals</p>
                                            <p className="text-xs">Ask me to suggest changes!</p>
                                        </div>
                                    </div>
                                ) : (
                                    currentProposals.map((proposal, idx) => {
                                        const isApplied = appliedProposals.has(proposal.slot_id);
                                        const isProcessing = processingProposal === proposal.slot_id;
                                        
                                        return (
                                            <div key={idx} className={`p-3 rounded-xl border transition-all ${
                                                isApplied ? 'bg-[var(--color-success-light)] border-[var(--color-success)]' : 'bg-[var(--color-card)] border-[var(--color-border)] shadow-sm'
                                            }`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-[var(--color-foreground-muted)] uppercase italic">
                                                            {proposal.day} • {proposal.period_label}
                                                        </p>
                                                        <h4 className="font-bold text-sm">{proposal.subject_name}</h4>
                                                    </div>
                                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                                                        proposal.action === 'assign' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                        {proposal.action}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-[var(--color-foreground-secondary)] mb-3 bg-[var(--color-background-tertiary)] p-1.5 rounded">
                                                    {proposal.faculty_name}
                                                </p>
                                                <button
                                                    onClick={() => handleApproveProposal(proposal)}
                                                    disabled={isApplied || isProcessing || processingProposal !== null}
                                                    className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                                                        isApplied
                                                            ? 'text-[var(--color-success)]'
                                                            : 'bg-[var(--color-primary)] text-white hover:brightness-110 shadow-sm'
                                                    }`}
                                                >
                                                    {isProcessing ? <RefreshCw className="h-3 w-3 animate-spin" /> : isApplied ? <CheckCircle2 size={14} /> : null}
                                                    {isApplied ? 'Applied' : 'Approve'}
                                                </button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
