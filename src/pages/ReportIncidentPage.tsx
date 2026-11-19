import { useState, useRef } from 'react';
import { useApp } from '@/lib/store';
import { DEPARTMENTS, LOCATIONS, HAZARD_CATEGORIES } from '@/lib/demoData';
import type { Incident, HazardCategory, Severity } from '@/lib/types';
import {
  FilePlus,
  Image as ImageIcon,
  Mic,
  MicOff,
  Send,
  Shield,
  Brain,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { RiskBadge, SeverityBadge, PriorityBadge } from '@/components/Badges';

export function ReportIncidentPage() {
  const { addIncident, pushToast, userName } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [location, setLocation] = useState(LOCATIONS[DEPARTMENTS[0]][0]);
  const [hazardType, setHazardType] = useState<HazardCategory>('Slip/Fall');
  const [severity, setSeverity] = useState<Severity>('Medium');
  const [anonymous, setAnonymous] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [hasVoice, setHasVoice] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<Incident | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDeptChange = (dept: string) => {
    setDepartment(dept);
    setLocation(LOCATIONS[dept]?.[0] ?? '');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHasImage(true);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setHasImage(false);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setHasVoice(true);
      setTimeout(() => setIsRecording(false), 3000);
      pushToast('Voice recording captured (simulated)', 'success');
    } else {
      setIsRecording(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      pushToast('Please fill in title and description', 'warning');
      return;
    }

    setAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      const incident = addIncident({
        title: title.trim(),
        description: description.trim(),
        department,
        location,
        hazardType,
        severity,
        dateTime: new Date().toISOString(),
        anonymous,
        reporterName: anonymous ? undefined : userName || 'Demo Reporter',
        hasImage,
        hasVoice,
      });
      setResult(incident);
      setAnalyzing(false);
      pushToast('Incident submitted and AI analysis complete', 'success');

      // Reset form
      setTitle('');
      setDescription('');
      setHazardType('Slip/Fall');
      setSeverity('Medium');
      setAnonymous(false);
      setHasImage(false);
      setHasVoice(false);
      setImagePreview(null);
    }, 1800);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Report Incident</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Report a hazard, near-miss, or incident. AI analysis will be generated automatically.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setTitle('Oil leakage detected near Machine 4');
            setDescription('Hydraulic oil leaked near Machine 4. The floor is slippery and workers are passing through the area.');
            setDepartment('Machine Shop');
            setLocation('Lathe Area');
            setHazardType('Slip/Fall');
            setSeverity('High');
            setAnonymous(false);
            pushToast('Demo oil-leak scenario loaded', 'info');
          }}
          className="btn-secondary shrink-0"
        >
          Load Demo Scenario
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="card p-6 space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Incident Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="e.g., Oil spill near lathe station"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field min-h-[100px] resize-y"
              placeholder="Describe what happened, what you observed, and any contributing factors..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Department</label>
              <select value={department} onChange={(e) => handleDeptChange(e.target.value)} className="input-field">
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Location</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="input-field">
                {(LOCATIONS[department] ?? []).map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Hazard Type</label>
              <select value={hazardType} onChange={(e) => setHazardType(e.target.value as HazardCategory)} className="input-field">
                {HAZARD_CATEGORIES.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Severity</label>
              <select value={severity} onChange={(e) => setSeverity(e.target.value as Severity)} className="input-field">
                {['Low', 'Medium', 'High', 'Critical'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Image Upload</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            {imagePreview ? (
              <div className="relative rounded-xl border border-slate-700 overflow-hidden">
                <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 rounded-lg bg-slate-900/80 p-1.5 text-white hover:bg-slate-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/30 py-6 text-slate-400 hover:border-sky-500/50 hover:text-sky-400 transition-colors"
              >
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">Click to upload an image</span>
              </button>
            )}
          </div>

          {/* Voice input */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Voice Input</label>
            <button
              type="button"
              onClick={toggleRecording}
              className={`w-full flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-all ${
                isRecording
                  ? 'border-red-500/50 bg-red-500/10 text-red-400 animate-pulse-glow'
                  : hasVoice
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                  : 'border-slate-700 bg-slate-800/30 text-slate-400 hover:border-sky-500/50 hover:text-sky-400'
              }`}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              {isRecording ? 'Recording... (simulated)' : hasVoice ? 'Voice recorded' : 'Tap to record voice'}
            </button>
          </div>

          {/* Anonymous toggle */}
          <div className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/30 p-3">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-slate-400" />
              <div>
                <div className="text-sm font-medium text-white">Anonymous Report</div>
                <div className="text-xs text-slate-500">Your identity will not be recorded</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAnonymous(!anonymous)}
              className={`relative h-6 w-11 rounded-full transition-colors ${anonymous ? 'bg-sky-500' : 'bg-slate-700'}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${anonymous ? 'translate-x-5' : 'translate-x-0.5'}`}
              />
            </button>
          </div>

          <button type="submit" className="btn-primary w-full !py-3" disabled={analyzing}>
            {analyzing ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin" />
                AI analyzing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit & Analyze
              </>
            )}
          </button>
        </form>

        {/* AI Analysis Result */}
        <div className="space-y-4">
          {analyzing && (
            <div className="card p-8 flex flex-col items-center justify-center min-h-[400px]">
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-sky-500/20 to-blue-600/20 flex items-center justify-center">
                  <Brain className="h-10 w-10 text-sky-400 animate-pulse" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-sky-400 animate-pulse" />
              </div>
              <div className="mt-6 text-center">
                <div className="text-lg font-semibold text-white">AI Analysis in Progress</div>
                <div className="text-sm text-slate-400 mt-1">
                  Detecting hazards, calculating risk, identifying root causes...
                </div>
              </div>
              <div className="mt-6 w-full max-w-xs space-y-2">
                {['Hazard classification', 'Risk score calculation', 'Root cause analysis', 'Generating recommendations'].map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-400" style={{ animationDelay: `${i * 400}ms` }}>
                    <div className="h-4 w-4 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" style={{ animationDelay: `${i * 200}ms` }} />
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!analyzing && !result && (
            <div className="card p-8 flex flex-col items-center justify-center min-h-[400px]">
              <div className="h-16 w-16 rounded-2xl bg-slate-800/60 flex items-center justify-center">
                <FilePlus className="h-8 w-8 text-slate-500" />
              </div>
              <div className="mt-4 text-center">
                <div className="text-lg font-semibold text-white">AI Analysis Result</div>
                <div className="text-sm text-slate-500 mt-1">
                  Fill out the form and submit to see the AI-powered hazard analysis
                </div>
              </div>
            </div>
          )}

          {!analyzing && result && result.aiAnalysis && (
            <div className="space-y-4 animate-slide-up">
              {/* Success header */}
              <div className="card p-4 border-emerald-500/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
                    <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Incident Submitted Successfully</div>
                    <div className="text-xs text-slate-400">ID: {result.id} · AI analysis complete</div>
                  </div>
                </div>
              </div>

              {/* AI Analysis card */}
              <div className="card overflow-hidden">
                <div className="flex items-center gap-2 border-b border-slate-800/60 bg-gradient-to-r from-sky-500/10 to-blue-600/10 px-5 py-3">
                  <Brain className="h-5 w-5 text-sky-400" />
                  <span className="text-sm font-semibold text-white">AI Hazard Analysis</span>
                  <Sparkles className="h-4 w-4 text-sky-400 ml-auto" />
                </div>

                <div className="p-5 space-y-4">
                  {/* Detected hazard */}
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Detected Hazard</div>
                    <div className="text-sm text-white mt-1">{result.aiAnalysis.detectedHazard}</div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 rounded-lg bg-slate-800/50 px-3 py-1.5">
                      <span className="text-xs text-slate-400">Category:</span>
                      <span className="text-xs font-semibold text-white">{result.aiAnalysis.hazardCategory}</span>
                    </div>
                    <SeverityBadge level={result.aiAnalysis.severity} />
                    <RiskBadge level={result.aiAnalysis.riskLevel} />
                    <PriorityBadge level={result.aiAnalysis.priority} />
                  </div>

                  {/* Risk score gauge */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-800/50 bg-slate-800/30 p-3">
                      <div className="text-xs text-slate-400">Risk Score</div>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className={`text-3xl font-bold ${result.aiAnalysis.riskScore >= 8 ? 'text-red-400' : result.aiAnalysis.riskScore >= 6 ? 'text-orange-400' : result.aiAnalysis.riskScore >= 4 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {result.aiAnalysis.riskScore}
                        </span>
                        <span className="text-sm text-slate-500">/ 10</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-800/50 bg-slate-800/30 p-3">
                      <div className="text-xs text-slate-400">Probability</div>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-3xl font-bold text-sky-400">{result.aiAnalysis.probability}</span>
                        <span className="text-sm text-slate-500">/ 10</span>
                      </div>
                    </div>
                  </div>

                  {/* Root causes */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                      <span className="text-xs font-semibold text-white">Possible Root Causes</span>
                    </div>
                    <div className="space-y-2">
                      {result.aiAnalysis.rootCauses.map((rc, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-300">{rc.cause}</span>
                            <span className="text-slate-400 font-semibold">{rc.confidence}%</span>
                          </div>
                          <div className="mt-1 h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-500 transition-all duration-700"
                              style={{ width: `${rc.confidence}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Corrective action */}
                  <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Wrench className="h-4 w-4 text-orange-400" />
                      <span className="text-xs font-semibold text-orange-400">Corrective Action</span>
                    </div>
                    <p className="text-sm text-slate-300">{result.aiAnalysis.correctiveAction}</p>
                  </div>

                  {/* Preventive action */}
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-400">Preventive Action</span>
                    </div>
                    <p className="text-sm text-slate-300">{result.aiAnalysis.preventiveAction}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
