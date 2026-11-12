import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  FileText,
  Search,
  Sparkles,
  MapPin,
  Camera,
  AlertTriangle,
  CheckCircle2,
  ThumbsUp,
  Clock,
  ArrowRight,
  Flame,
  Shield,
  Layers,
  ChevronRight,
  Send,
  Eye,
  Mic,
  MicOff
} from 'lucide-react';
import CivicMap from '../components/CivicMap';
import SlaBadge from '../components/SlaBadge';
import { api } from '../services/api';

export default function CitizenPortal({
  departments = [],
  wards = [],
  grievances = [],
  onRefresh,
  onOpenGrievance
}) {
  const [activeTab, setActiveTab] = useState('lodge'); // 'lodge' | 'my' | 'community'
  const [tokenSearch, setTokenSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    wardId: wards[0]?.id || 'WARD_01',
    address: '',
    coordinates: { lat: 28.6925, lng: 77.2150 },
    citizenName: 'Deepak Saxena',
    citizenPhone: '+91 98105 44321',
    citizenEmail: 'deepak.saxena@gmail.com',
    isAnonymous: false,
    priority: '',
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [duplicateCheck, setDuplicateCheck] = useState(null);
  const [aiPreview, setAiPreview] = useState(null);
  const [isListening, setIsListening] = useState(false);

  // Voice speech-to-text dictation
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your grievance.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (!formData.title) {
          setFormData(prev => ({
            ...prev,
            title: transcript,
            description: prev.description ? `${prev.description} ${transcript}` : transcript
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            description: prev.description ? `${prev.description} ${transcript}` : transcript
          }));
        }
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  // Live Auto-Routing Prediction as user types
  useEffect(() => {
    const text = `${formData.title} ${formData.description}`.toLowerCase();
    if (text.length < 5) {
      setAiPreview(null);
      return;
    }

    let detectedDept = departments[0];
    let urgency = "MEDIUM";
    let sla = 48;

    if (text.includes('pothole') || text.includes('road') || text.includes('sinkhole')) {
      detectedDept = departments.find(d => d.id === 'DEPT_ROADS') || departments[0];
      sla = 24;
    } else if (text.includes('water') || text.includes('sewage') || text.includes('pipe') || text.includes('manhole')) {
      detectedDept = departments.find(d => d.id === 'DEPT_WATER') || departments[0];
      sla = 16;
    } else if (text.includes('wire') || text.includes('sparking') || text.includes('dark') || text.includes('light') || text.includes('electricity')) {
      detectedDept = departments.find(d => d.id === 'DEPT_ELEC') || departments[0];
      sla = 12;
    } else if (text.includes('garbage') || text.includes('trash') || text.includes('dump') || text.includes('waste')) {
      detectedDept = departments.find(d => d.id === 'DEPT_SAN') || departments[0];
      sla = 24;
    } else if (text.includes('mosquito') || text.includes('dengue') || text.includes('malaria') || text.includes('dog')) {
      detectedDept = departments.find(d => d.id === 'DEPT_HEALTH') || departments[0];
      sla = 24;
    }

    if (text.includes('danger') || text.includes('hazard') || text.includes('burst') || text.includes('emergency') || text.includes('live wire') || text.includes('open manhole')) {
      urgency = "CRITICAL";
      sla = Math.min(8, sla);
    } else if (text.includes('urgent') || text.includes('heavy') || text.includes('flood')) {
      urgency = "HIGH";
    }

    setAiPreview({
      department: detectedDept?.name || "General Civil Works",
      shortCode: detectedDept?.shortCode || "GEN",
      urgency,
      estimatedSlaHours: sla
    });
  }, [formData.title, formData.description, departments]);

  // Check for duplicates when title and ward change
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.title.length > 8) {
        try {
          const res = await api.checkDuplicates({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            wardId: formData.wardId,
            coordinates: formData.coordinates
          });
          if (res.hasDuplicates) {
            setDuplicateCheck(res.duplicates[0]);
          } else {
            setDuplicateCheck(null);
          }
        } catch (e) {
          // ignore
        }
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [formData.title, formData.wardId]);

  const handleQuickTrack = async (e) => {
    e.preventDefault();
    if (!tokenSearch.trim()) return;
    try {
      setIsSearching(true);
      setSearchError('');
      const res = await api.getGrievanceByToken(tokenSearch.trim());
      if (res.success && res.data) {
        onOpenGrievance(res.data);
        setTokenSearch('');
      }
    } catch (err) {
      setSearchError(err.message || 'Token not found. Please verify the tracking number.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        wardId: formData.wardId,
        address: formData.address || 'Selected GPS Coordinates',
        coordinates: formData.coordinates,
        citizen: {
          name: formData.isAnonymous ? 'Anonymous Citizen' : formData.citizenName,
          phone: formData.isAnonymous ? '' : formData.citizenPhone,
          email: formData.isAnonymous ? '' : formData.citizenEmail,
          isAnonymous: formData.isAnonymous
        },
        priority: formData.priority || undefined,
        attachments: formData.photoUrl ? [
          {
            id: `att-${Date.now()}`,
            url: formData.photoUrl,
            caption: 'Citizen uploaded ground evidence'
          }
        ] : []
      };

      const res = await api.lodgeGrievance(payload);
      if (res.success) {
        setSubmissionSuccess(res.data);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      alert('Error submitting grievance: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = async (grievanceId) => {
    try {
      await api.upvoteGrievance(grievanceId);
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const myGrievances = grievances.filter(g => 
    g.citizen?.email?.toLowerCase() === formData.citizenEmail.toLowerCase() ||
    g.citizen?.name?.toLowerCase() === formData.citizenName.toLowerCase()
  );

  return (
    <div className="space-y-6">
      {/* Hero & Quick Track Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 text-white p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-8 translate-y-8">
          <Shield className="w-80 h-80" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>AI-Assisted Automated Routing & Real-Time SLA Guarantees</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Citizen Grievance Redressal Portal
          </h1>
          <p className="mt-2 text-emerald-100 text-xs sm:text-sm leading-relaxed">
            Report civic defects—from hazardous potholes and water leaks to broken streetlights. Track resolution with transparent, legally-binding municipal SLAs.
          </p>

          {/* Quick Token Tracking Bar */}
          <form onSubmit={handleQuickTrack} className="mt-5 flex items-center gap-2 max-w-md bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
            <Search className="w-4 h-4 text-emerald-200 ml-2" />
            <input
              type="text"
              placeholder="Enter Grievance Token (e.g. GRV-2026-8910)..."
              value={tokenSearch}
              onChange={(e) => setTokenSearch(e.target.value)}
              className="flex-1 bg-transparent text-xs font-mono text-white placeholder:text-emerald-200/70 focus:outline-none px-2"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>{isSearching ? 'Tracking...' : 'Track'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {searchError && (
            <p className="mt-2 text-xs text-red-200 font-medium">
              ⚠️ {searchError}
            </p>
          )}
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold gap-6">
        <button
          onClick={() => setActiveTab('lodge')}
          className={`py-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'lodge'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Lodge New Grievance</span>
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`py-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'my'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>My Registered Grievances ({myGrievances.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`py-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'community'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Community Feed & Public Map ({grievances.length})</span>
        </button>
      </div>

      {/* TAB 1: LODGE GRIEVANCE FORM */}
      {activeTab === 'lodge' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Form (8 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>File a Public Complaint / Service Request</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Provide specific details. Our AI routing engine will automatically assign the designated field officer.
            </p>

            {/* Duplicate Notice Banner */}
            {duplicateCheck && (
              <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 animate-fade-in flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                      Similar Grievance Already Reported Nearby!
                    </h4>
                    <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                      "{duplicateCheck.grievance.title}" was registered in {duplicateCheck.grievance.wardName}. ({duplicateCheck.matchReason})
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleUpvote(duplicateCheck.grievance.id);
                    onOpenGrievance(duplicateCheck.grievance);
                  }}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 flex-shrink-0"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>Upvote ({duplicateCheck.grievance.upvotes})</span>
                </button>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="mt-5 space-y-4">
              {/* Title & Voice Dictation */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Grievance Title / Problem Summary *
                  </label>
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-600'
                    }`}
                    title="Dictate grievance using microphone"
                  >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{isListening ? 'Listening... Speak now' : 'Voice Dictate'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hazardous open sewer manhole outside school gate (or click Voice Dictate)..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Live AI Classification Preview Pill */}
              {aiPreview && (
                <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-wrap items-center justify-between text-xs animate-fade-in gap-2">
                  <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Auto-Identified Dept: <strong className="font-bold">{aiPreview.department}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      aiPreview.urgency === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                      aiPreview.urgency === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {aiPreview.urgency} Urgency
                    </span>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                      SLA Target: {aiPreview.estimatedSlaHours}h
                    </span>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe exact landmarks, safety hazards, duration of issue, and impact on pedestrians or traffic..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                ></textarea>
              </div>

              {/* Department / Category Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Select Specific Category (Optional)
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="">Let System Auto-Detect Category</option>
                    {departments.map((dept) => (
                      <optgroup key={dept.id} label={dept.name}>
                        {dept.categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.baseSlaHours}h SLA)
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Municipal Ward / Zone *
                  </label>
                  <select
                    value={formData.wardId}
                    onChange={(e) => setFormData({ ...formData, wardId: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {wards.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.zone})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Address / Landmark */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Street Address & Landmark *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Near Metro Pillar 142, Main Road, Block B..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Photo Evidence URL / Presets */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Photo Evidence URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                    className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="flex gap-2 mt-2 flex-wrap text-[11px]">
                  <span className="text-slate-400">Sample Photos:</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600' })}
                    className="text-emerald-600 dark:text-emerald-400 underline"
                  >
                    Pothole
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, photoUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600' })}
                    className="text-emerald-600 dark:text-emerald-400 underline"
                  >
                    Garbage Pile
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, photoUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600' })}
                    className="text-emerald-600 dark:text-emerald-400 underline"
                  >
                    Water Leak
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, photoUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600' })}
                    className="text-emerald-600 dark:text-emerald-400 underline"
                  >
                    Dark Streetlight
                  </button>
                </div>
              </div>

              {/* Citizen Details */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Citizen Contact Information
                  </span>
                  <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAnonymous}
                      onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Lodge Anonymously</span>
                  </label>
                </div>

                {!formData.isAnonymous && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.citizenName}
                      onChange={(e) => setFormData({ ...formData, citizenName: e.target.value })}
                      className="text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                    <input
                      type="tel"
                      placeholder="Mobile Phone (for SMS updates)"
                      value={formData.citizenPhone}
                      onChange={(e) => setFormData({ ...formData, citizenPhone: e.target.value })}
                      className="text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={formData.citizenEmail}
                      onChange={(e) => setFormData({ ...formData, citizenEmail: e.target.value })}
                      className="text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Routing Grievance via AI...' : 'Submit Grievance & Generate Tracking Token'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Geo-Spatial Map Picker (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <CivicMap
              grievances={grievances}
              selectedWardId={formData.wardId}
              isPickerMode={true}
              pickedLocation={formData.coordinates}
              onPickLocation={(loc) => {
                setFormData({
                  ...formData,
                  coordinates: { lat: loc.lat, lng: loc.lng },
                  wardId: loc.wardId || formData.wardId
                });
              }}
            />

            {/* SLA Commitment Highlights Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Municipal SLA Redressal Charter</span>
              </h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-[11px]">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <strong>Emergency / Safety Hazards:</strong> 4 - 12 Hours max
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  <strong>High Priority (Sewage/Potholes):</strong> 24 - 48 Hours
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <strong>Automated Escalation:</strong> Breaches escalate directly to Zonal Commissioner
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY GRIEVANCES */}
      {activeTab === 'my' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Grievances Lodged by You ({myGrievances.length})
            </h3>
            <span className="text-xs text-slate-500">
              Account: {formData.citizenEmail}
            </span>
          </div>

          {myGrievances.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                No Grievances Lodged Yet
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Lodge a complaint using the form above to track it here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myGrievances.map((g) => (
                <div
                  key={g.id}
                  onClick={() => onOpenGrievance(g)}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {g.trackingToken}
                    </span>
                    <SlaBadge grievance={g} />
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2 group-hover:text-emerald-600 transition-colors line-clamp-1">
                    {g.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {g.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {g.wardName.split(' - ')[0]}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>View Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: COMMUNITY GRIEVANCES FEED */}
      {activeTab === 'community' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Public Community Grievance Board
              </h3>
              <p className="text-xs text-slate-500">
                Civic issues in your city. Upvote existing grievances to help authorities prioritize urgent spots!
              </p>
            </div>
          </div>

          <CivicMap
            grievances={grievances}
            onSelectGrievance={onOpenGrievance}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grievances.map((g) => (
              <div
                key={g.id}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {g.trackingToken}
                    </span>
                    <SlaBadge grievance={g} compact={true} />
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-2 line-clamp-1">
                    {g.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {g.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleUpvote(g.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold hover:bg-emerald-100 transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{g.upvotes || 1} Me Too</span>
                  </button>

                  <button
                    onClick={() => onOpenGrievance(g)}
                    className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 font-bold flex items-center gap-1 text-[11px]"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submission Success Dialog */}
      {submissionSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl text-center animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Grievance Registered Successfully!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Your grievance has been auto-routed to the designated department.
            </p>

            <div className="my-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Your Tracking Token</span>
              <div className="text-xl font-mono font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {submissionSuccess.trackingToken}
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">
                SLA Guarantee: {submissionSuccess.slaHours} Hours Resolution Window
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const g = submissionSuccess;
                  setSubmissionSuccess(null);
                  onOpenGrievance(g);
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                Track Live Progress
              </button>
              <button
                onClick={() => setSubmissionSuccess(null)}
                className="px-4 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

