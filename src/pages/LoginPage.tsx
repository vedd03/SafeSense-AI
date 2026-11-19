import { useState } from 'react';
import { ShieldCheck, HardHat, ClipboardCheck, Briefcase, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useApp } from '@/lib/store';
import type { Role } from '@/lib/types';

const ROLES: {
  id: Role;
  label: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  features: string[];
}[] = [
  {
    id: 'employee',
    label: 'Employee',
    desc: 'Report incidents, near-misses, and hazards',
    icon: HardHat,
    color: 'from-sky-500 to-blue-600',
    features: ['Report incidents', 'Voice & image input', 'Anonymous reporting', 'Track submissions'],
  },
  {
    id: 'safety_officer',
    label: 'Safety Officer',
    desc: 'Analyze hazards and manage corrective actions',
    icon: ClipboardCheck,
    color: 'from-amber-500 to-orange-600',
    features: ['Safety dashboard', 'AI hazard analysis', 'CAPA tracking', 'Alert management'],
  },
  {
    id: 'manager',
    label: 'Manager',
    desc: 'Monitor analytics and predictive insights',
    icon: Briefcase,
    color: 'from-emerald-500 to-teal-600',
    features: ['Safety analytics', 'Department performance', 'Risk trends', 'Predictive insights'],
  },
];

const DEFAULT_NAMES: Record<Role, string> = {
  employee: 'Rajesh Kumar',
  safety_officer: 'Anil Verma',
  manager: 'Meera Joshi',
};

export function LoginPage() {
  const { setRole } = useApp();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setName(DEFAULT_NAMES[role]);
    setEmail(`${role.replace('_', '.')}@safesense.ai`);
    setPassword('demo1234');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole && name.trim()) {
      setRole(selectedRole, name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row">
      {/* Left Panel - Branding */}
      <div className="relative flex-1 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-8 lg:p-12 flex flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-sky-500 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-blue-600 blur-3xl" />
        </div>

        <div className="relative flex items-center gap-3">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-500/30">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-2xl leading-none">SafeSense AI</div>
            <div className="text-sky-400 text-xs font-medium tracking-widest mt-1">PREDICTIVE WORKSHOP SAFETY INTELLIGENCE</div>
          </div>
        </div>

        <div className="relative my-12 lg:my-0">
          <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
            Transform safety from<br />
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">reactive to predictive</span>
          </h1>
          <p className="mt-4 text-slate-400 text-base lg:text-lg max-w-md">
            AI-powered hazard detection, risk prediction, and proactive prevention for modern manufacturing environments.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {['REPORT', 'UNDERSTAND', 'PREDICT', 'RECOMMEND', 'PREVENT'].map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <span className="flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-800/40 px-3 py-1.5 text-xs font-semibold text-sky-300">
                  <span className="h-5 w-5 flex items-center justify-center rounded-full bg-sky-500/20 text-sky-400 text-[10px]">{i + 1}</span>
                  {step}
                </span>
                {i < 4 && <ArrowRight className="h-3 w-3 text-slate-600 hidden sm:block" />}
              </div>
            ))}
          </div>
        </div>

        <div className="relative grid grid-cols-3 gap-4 max-w-md">
          <div>
            <div className="text-2xl font-bold text-white">AI-Powered</div>
            <div className="text-xs text-slate-500 mt-1">Hazard Analysis</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">Real-time</div>
            <div className="text-xs text-slate-500 mt-1">Risk Prediction</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">Proactive</div>
            <div className="text-xs text-slate-500 mt-1">Prevention</div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login */}
      <div className="lg:w-[520px] p-8 lg:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          {!selectedRole ? (
            <>
              <h2 className="text-2xl font-bold text-white">Select your role</h2>
              <p className="text-slate-400 mt-2 text-sm">Choose how you want to access the platform</p>

              <div className="mt-8 space-y-3">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleRoleSelect(r.id)}
                      className="group w-full flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-left transition-all hover:border-sky-500/50 hover:bg-slate-800/60 card-hover"
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${r.color} shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-semibold text-base">{r.label}</div>
                        <div className="text-slate-400 text-xs mt-0.5">{r.desc}</div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-sky-400 transition-colors" />
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setSelectedRole(null)}
                className="text-sm text-slate-400 hover:text-sky-400 transition-colors mb-6"
              >
                ← Back to role selection
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${ROLES.find((r) => r.id === selectedRole)?.color} shadow-lg`}>
                  {(() => {
                    const Icon = ROLES.find((r) => r.id === selectedRole)?.icon;
                    return Icon ? <Icon className="h-5 w-5 text-white" /> : null;
                  })()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Sign in as {ROLES.find((r) => r.id === selectedRole)?.label}</h2>
                  <p className="text-slate-400 text-xs mt-0.5">Demo credentials are pre-filled</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="you@company.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field pr-10"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                  <div className="text-xs font-medium text-slate-400 mb-2">Role capabilities:</div>
                  <div className="flex flex-wrap gap-2">
                    {ROLES.find((r) => r.id === selectedRole)?.features.map((f) => (
                      <span key={f} className="rounded-md bg-slate-700/40 px-2 py-1 text-[11px] text-slate-300">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full !py-3 text-base">
                  Access Dashboard
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
