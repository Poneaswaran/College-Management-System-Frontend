import React, { useState, useEffect } from 'react';
import { 
    Settings, Shield, Building2, School, Landmark, 
    Plus, Edit2, Trash2, Check, X, AlertTriangle, 
    Info, Save, Clock, FileText, ArrowRight
} from 'lucide-react';
import { leavePolicyApi, getLeaveTypes, type LeaveType, type LeavePolicy } from '../../services/leave.service';
import { departmentService } from '../../services/department.service';
import api from '../../services/api';

interface Policy extends LeavePolicy {
    scope_display: string;
    leave_type_detail: {
        id: number;
        name: string;
        code: string;
    };
    tenant_name?: string;
    school_name?: string;
    department_name?: string;
    school?: number;
    school_name_info?: string;
}

interface SchoolInfo {
    id: number;
    name: string;
}

interface TenantInfo {
    id: number;
    name: string;
}

interface DeptInfo {
    id: number;
    name: string;
    school: number;
    school_name: string;
}

const LeavePolicyConfig: React.FC = () => {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
    const [departments, setDepartments] = useState<DeptInfo[]>([]);
    const [schools, setSchools] = useState<SchoolInfo[]>([]);
    const [tenants, setTenants] = useState<TenantInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Policy>>({
        scope: 'department',
        leave_type: 0,
        tenant: undefined,
        school: undefined,
        department: undefined,
        annual_quota: undefined,
        carry_forward: false,
        max_carry_forward: undefined,
        allows_half_day: true,
        requires_attachment: false,
        min_notice_days: 0,
        max_consecutive_days: undefined,
        effective_from: new Date().toISOString().split('T')[0],
        effective_to: '',
        is_active: true
    });

    useEffect(() => {
        void fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [policiesRes, typesRes, deptsRes] = await Promise.all([
                leavePolicyApi.list(),
                getLeaveTypes(),
                departmentService.getDepartments()
            ]);
            setPolicies(policiesRes.data);
            setLeaveTypes(typesRes);
            const depts = (deptsRes as any).departments as DeptInfo[];
            setDepartments(depts);
            
            const uniqueSchools = Array.from(new Set(depts.map((d: DeptInfo) => d.school))).map(id => ({
                id,
                name: depts.find((d: DeptInfo) => d.school === id)?.school_name || `School ${id}`
            }));
            setSchools(uniqueSchools);
            
            const tenantRes = await api.get('/tenants/current/');
            setTenants([tenantRes.data]);

        } catch (error) {
            console.error("Error fetching policy data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                    type === 'number' ? parseFloat(value) : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { ...formData } as any;
            if (payload.scope === 'tenant') { payload.school = null; payload.department = null; }
            if (payload.scope === 'school') { payload.tenant = null; payload.department = null; }
            if (payload.scope === 'department') { payload.tenant = null; payload.school = null; }

            if (editingPolicy) {
                await leavePolicyApi.update(editingPolicy.id, payload);
            } else {
                await leavePolicyApi.create(payload);
            }
            setShowForm(false);
            setEditingPolicy(null);
            void fetchData();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Error saving policy";
            alert(errorMessage);
        }
    };

    const deletePolicy = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this policy override?")) return;
        try {
            await leavePolicyApi.delete(id);
            void fetchData();
        } catch {
            alert("Error deleting policy");
        }
    };

    const getScopeIcon = (scope: string) => {
        switch (scope) {
            case 'tenant': return <Landmark className="w-4 h-4 text-purple-500" />;
            case 'school': return <School className="w-4 h-4 text-blue-500" />;
            case 'department': return <Building2 className="w-4 h-4 text-emerald-500" />;
            default: return <Shield className="w-4 h-4 text-gray-500" />;
        }
    };

    if (loading) return <div className="p-8 text-center">Loading policies...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen">
            <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Leave Policy Configuration</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage hierarchical leave rules and overrides</p>
                    </div>
                </div>
                <button 
                    onClick={() => {
                        setEditingPolicy(null);
                        setFormData({
                            scope: 'department',
                            leave_type: 0,
                            tenant: tenants[0]?.id || 0,
                            school: 0,
                            department: 0,
                            annual_quota: 0,
                            carry_forward: false,
                            max_carry_forward: 0,
                            allows_half_day: true,
                            requires_attachment: false,
                            min_notice_days: 0,
                            max_consecutive_days: 0,
                            effective_from: new Date().toISOString().split('T')[0],
                            effective_to: '',
                            is_active: true
                        });
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-indigo-200"
                    data-testid="add-policy-btn"
                >
                    <Plus className="w-5 h-5" />
                    Add Policy Override
                </button>
            </header>

            {showForm && (
                <section className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-100 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            {editingPolicy ? <Edit2 className="w-5 h-5 text-indigo-600" /> : <Plus className="w-5 h-5 text-indigo-600" />}
                            {editingPolicy ? 'Edit Policy Override' : 'Create New Policy Override'}
                        </h2>
                        <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700">Target Scope</label>
                            <div className="flex bg-gray-100 p-1 rounded-xl">
                                {['tenant', 'school', 'department'].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setFormData({...formData, scope: s as any})}
                                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium capitalize transition-all ${
                                            formData.scope === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>

                            {formData.scope === 'tenant' && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Select Tenant</label>
                                    <select name="tenant" value={formData.tenant} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                                        <option value="">Select Tenant...</option>
                                        {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </div>
                            )}

                            {formData.scope === 'school' && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Select School</label>
                                    <select name="school" value={formData.school} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                                        <option value="">Select School...</option>
                                        {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                            )}

                            {formData.scope === 'department' && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Select Department</label>
                                    <select name="department" value={formData.department} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                                        <option value="">Select Department...</option>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Leave Type</label>
                                <select name="leave_type" value={formData.leave_type} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required>
                                    <option value="">Select Leave Type...</option>
                                    {leaveTypes.map(t => <option key={t.id} value={t.id}>{t.name} ({t.code})</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:col-span-2">
                            <div className="bg-indigo-50/30 p-4 rounded-xl border border-indigo-100 space-y-4">
                                <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-2">
                                    <Settings className="w-3.5 h-3.5" /> Quotas & Roll-overs
                                </h3>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Annual Quota (Days)</label>
                                    <input type="number" step="0.5" name="annual_quota" value={formData.annual_quota} onChange={handleInputChange} className="w-full p-2 border rounded-lg" placeholder="Inherit..." />
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                    <input type="checkbox" id="carry_forward" name="carry_forward" checked={formData.carry_forward} onChange={handleInputChange} className="w-4 h-4 text-indigo-600" />
                                    <label htmlFor="carry_forward" className="text-sm text-gray-700">Allow Carry Forward</label>
                                </div>
                                {formData.carry_forward && (
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Max Carry Forward</label>
                                        <input type="number" step="0.5" name="max_carry_forward" value={formData.max_carry_forward} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                                    </div>
                                )}
                            </div>

                            <div className="bg-amber-50/30 p-4 rounded-xl border border-amber-100 space-y-4">
                                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                                    <AlertTriangle className="w-3.5 h-3.5" /> Rules & Constraints
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" name="allows_half_day" checked={formData.allows_half_day} onChange={handleInputChange} className="w-4 h-4" />
                                        <label className="text-xs text-gray-700">Allow Half-Day</label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" name="requires_attachment" checked={formData.requires_attachment} onChange={handleInputChange} className="w-4 h-4" />
                                        <label className="text-xs text-gray-700">Require Attachment</label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-3 pt-1">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Min Notice (Days)</label>
                                        <input type="number" name="min_notice_days" value={formData.min_notice_days} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Max Consecutive (Days)</label>
                                        <input type="number" name="max_consecutive_days" value={formData.max_consecutive_days} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm" placeholder="Unlimited" />
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-medium">Cancel</button>
                                <button type="submit" className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-2 rounded-xl hover:bg-indigo-700 font-semibold shadow-lg shadow-indigo-100" data-testid="save-policy-btn">
                                    <Save className="w-4 h-4" />
                                    {editingPolicy ? 'Update Policy' : 'Create Policy'}
                                </button>
                            </div>
                        </div>
                    </form>
                </section>
            )}

            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        Active Policy Overrides
                    </h2>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-400">
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span> Tenant
                            <span className="w-2 h-2 rounded-full bg-blue-500 ml-2"></span> School
                            <span className="w-2 h-2 rounded-full bg-emerald-500 ml-2"></span> Dept
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Scope Hierarchy</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Leave Type</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Annual Quota</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Carry Fwd</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Notice/Consec</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Effective Date</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {policies.map((p) => (
                                <tr key={p.id} className="hover:bg-indigo-50/10 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${
                                                p.scope === 'tenant' ? 'bg-purple-50' : 
                                                p.scope === 'school' ? 'bg-blue-50' : 'bg-emerald-50'
                                            }`}>
                                                {getScopeIcon(p.scope)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900 capitalize">{p.scope_display}</p>
                                                <p className="text-[10px] text-gray-500 truncate max-w-[150px]">
                                                    {p.tenant_name || p.school_name || p.department_name}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-[10px] font-bold">
                                            {p.leave_type_detail?.code}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm font-semibold text-gray-700">{p.annual_quota ?? '—'}</span>
                                            {p.annual_quota && <span className="text-[10px] text-gray-400">days</span>}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {p.carry_forward === null ? (
                                            <span className="text-[10px] text-gray-400">Inherited</span>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                {p.carry_forward ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-rose-400" />}
                                                {p.carry_forward && <span className="text-[10px] font-medium text-gray-500">Max {p.max_carry_forward}</span>}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-600 flex items-center gap-1">
                                                <Clock className="w-3 h-3 text-gray-400" /> {p.min_notice_days ?? 0}d notice
                                            </p>
                                            <p className="text-[10px] text-gray-600 flex items-center gap-1">
                                                <ArrowRight className="w-3 h-3 text-gray-400" /> {p.max_consecutive_days ? `${p.max_consecutive_days}d max` : 'Unlimited'}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-medium text-gray-700">{p.effective_from}</span>
                                            <span className="text-[10px] text-gray-400 italic">{p.effective_to || 'Indefinite'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => {
                                                    setEditingPolicy(p);
                                                    setFormData({ ...p });
                                                    setShowForm(true);
                                                }}
                                                className="p-1.5 hover:bg-white hover:text-indigo-600 hover:shadow-sm rounded-lg text-gray-400 transition-all"
                                                data-testid={`edit-policy-btn-${p.id}`}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => deletePolicy(p.id)}
                                                className="p-1.5 hover:bg-rose-50 hover:text-rose-500 rounded-lg text-gray-400 transition-all"
                                                data-testid={`delete-policy-btn-${p.id}`}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {policies.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Info className="w-8 h-8 text-gray-200" />
                                            <p className="text-gray-400 text-sm">No policy overrides found. Institutional defaults apply.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default LeavePolicyConfig;
