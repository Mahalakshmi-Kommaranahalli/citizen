import React, { useState } from 'react';
import {
  X,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  Bot,
  AlertTriangle,
  RotateCcw,
  Star,
  Printer,
  ChevronRight,
  ExternalLink,
  Phone,
  Mail,
  ThumbsUp,
  Image as ImageIcon
} from 'lucide-react';
import SlaBadge from '../components/SlaBadge';
import Timeline from '../components/Timeline';
import ReceiptModal from '../components/ReceiptModal';
import { api } from '../services/api';

export default function TrackGrievanceModal({ grievance, onClose, onRefresh }) {
  if (!grievance) return null;

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'timeline' | 'resolution'
  const [showReceipt, setShowReceipt] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Reopen State
  const [showReopenForm, setShowReopenForm] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [isReopening, setIsReopening] = useState(false);

  const { status, slaMetrics, assignedOfficer, citizen, priority } = grievance;
  const isResolvedOrClosed = ["RESOLVED", "CLOSED"].includes(status);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmittingFeedback(true);
      await api.submitFeedback(grievance.id, {
        rating,
        comment: feedbackComment,
        citizenName: citizen?.name
      });
      setFeedbackSuccess(true);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleReopenSubmit = async (e) => {
    e.preventDefault();
    if (!reopenReason.trim()) return;
    try {
      setIsReopening(true);
      await api.reopenGrievance(grievance.id, {
        reason: reopenReason,
        citizenName: citizen?.name
      });
      setShowReopenForm(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsReopening(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden animate-fade-in my-6 max-h-[92vh] flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                  {grievance.trackingToken}
                </span>
                <SlaBadge grievance={grievance} />
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  priority === 'CRITICAL' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' :
                  priority === 'HIGH' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' :
                  'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                }`}>
                  {priority} Priority
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                {grievance.title}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowReceipt(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                title="Print Acknowledgement Slip"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Receipt</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 bg-white dark:bg-slate-900 text-xs font-bold gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Overview & Evidence
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'timeline'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Audit Timeline ({grievance.timeline?.length || 0})
            </button>
            {isResolvedOrClosed && (
              <button
                onClick={() => setActiveTab('resolution')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'resolution'
                    ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Resolution Proof & Feedback
              </button>
            )}
          </div>

          {/* Body Content */}
          <div className="p-5 overflow-y-auto flex-1 space-y-5">
            {activeTab === 'overview' && (
              <>
                {/* Live SLA Progress Meter */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                      <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      SLA Resolution Guarantee: {grievance.slaHours} Hours
                    </span>
                    <span className={slaMetrics?.isBreached ? 'text-red-600 font-black' : 'text-slate-500'}>
                      {slaMetrics?.elapsedPercentage}% Elapsed
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        slaMetrics?.isBreached ? 'bg-red-500' :
                        slaMetrics?.isWarning ? 'bg-amber-500' :
                        'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, slaMetrics?.elapsedPercentage || 0)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-mono">
                    <span>Filed: {new Date(grievance.createdAt).toLocaleString()}</span>
                    <span>Deadline: {new Date(grievance.slaDeadline).toLocaleString()}</span>
                  </div>
                </div>

                {/* AI / Automated Routing Explanation */}
                <div className="p-4 rounded-xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800">
                  <div className="flex items-center gap-2 text-cyan-800 dark:text-cyan-300 font-bold text-xs">
                    <Bot className="w-4 h-4" />
                    <span>Intelligent Automated Routing Diagnostics</span>
                  </div>
                  <p className="text-xs text-cyan-900/90 dark:text-cyan-200 mt-1 leading-relaxed">
                    {grievance.routingReason}
                  </p>
                </div>

                {/* Complaint Summary & Location */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Grievance Description
                  </h4>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    {grievance.description}
                  </p>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Location & Ward</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      {grievance.wardName}
                    </span>
                    <span className="text-slate-500 text-[11px] mt-1 block">{grievance.address}</span>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Field Officer</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-blue-500" />
                      {assignedOfficer?.name || 'Department Officer'}
                    </span>
                    <span className="text-slate-500 text-[11px] mt-1 flex items-center gap-2">
                      {assignedOfficer?.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{assignedOfficer.phone}</span>}
                    </span>
                  </div>
                </div>

                {/* Citizen Photo Attachments */}
                {grievance.attachments && grievance.attachments.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                      Photo Evidence Attached by Citizen
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {grievance.attachments.map((att, idx) => (
                        <div key={idx} className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 aspect-video">
                          <img
                            src={att.url}
                            alt={att.caption || "Grievance evidence"}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          {att.caption && (
                            <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-xs text-white p-1.5 text-[11px]">
                              {att.caption}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'timeline' && (
              <Timeline timeline={grievance.timeline} />
            )}

            {activeTab === 'resolution' && (
              <div className="space-y-5">
                {/* Resolution Summary */}
                <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Redressal Completed & Documented</span>
                  </div>
                  <p className="text-xs text-emerald-950 dark:text-emerald-200 mt-1.5 leading-relaxed">
                    {grievance.resolution?.summary || "Field team verified ground action and restored public infrastructure."}
                  </p>
                  <div className="mt-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                    Resolved by {grievance.resolution?.resolvedBy || assignedOfficer?.name} on {grievance.resolution?.resolvedAt ? new Date(grievance.resolution.resolvedAt).toLocaleString() : ''}
                  </div>
                </div>

                {/* Before vs After Visual Comparison */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Before vs. After Ground Verification Proof
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                      <div className="p-2 bg-slate-200 dark:bg-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        Before (Issue Reported)
                      </div>
                      <div className="aspect-video">
                        <img
                          src={grievance.attachments?.[0]?.url || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600"}
                          alt="Before redressal"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/60 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                        After (Resolution Proof)
                      </div>
                      <div className="aspect-video">
                        <img
                          src={grievance.resolution?.proofImage || "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600"}
                          alt="After redressal"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Citizen Rating & Feedback Section */}
                {grievance.feedback ? (
                  <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                    <span className="text-[10px] text-purple-700 dark:text-purple-300 font-bold uppercase">
                      Citizen Feedback Recorded
                    </span>
                    <div className="flex items-center gap-1 mt-1 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${s <= grievance.feedback.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                        />
                      ))}
                      <span className="text-xs font-bold text-purple-900 dark:text-purple-200 ml-2">
                        {grievance.feedback.rating} / 5 Stars
                      </span>
                    </div>
                    <p className="text-xs text-purple-950 dark:text-purple-100 mt-1 italic">
                      "{grievance.feedback.comment}"
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Rate Redressal Quality & Citizen Satisfaction
                    </h4>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setRating(s)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-6 h-6 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      placeholder="Share your feedback regarding the resolution..."
                      rows={2}
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    ></textarea>
                    <button
                      type="submit"
                      disabled={isSubmittingFeedback}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                    >
                      {isSubmittingFeedback ? 'Submitting...' : 'Submit Citizen Feedback'}
                    </button>
                  </form>
                )}

                {/* Reopen Action */}
                {!showReopenForm ? (
                  <div className="pt-2 text-center">
                    <button
                      onClick={() => setShowReopenForm(true)}
                      className="text-xs text-slate-500 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-center gap-1 mx-auto"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Issue not resolved properly? Reopen this complaint
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleReopenSubmit} className="p-4 rounded-xl border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/30 space-y-2">
                    <h5 className="text-xs font-bold text-red-800 dark:text-red-300">
                      State reason for reopening:
                    </h5>
                    <textarea
                      required
                      placeholder="Describe what is still broken or unresolved on the ground..."
                      value={reopenReason}
                      onChange={(e) => setReopenReason(e.target.value)}
                      rows={2}
                      className="w-full text-xs p-2 rounded-lg border border-red-200 dark:border-red-800 bg-white dark:bg-slate-900"
                    ></textarea>
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setShowReopenForm(false)}
                        className="px-3 py-1.5 text-xs text-slate-600 rounded-lg hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isReopening}
                        className="px-3 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg"
                      >
                        {isReopening ? 'Reopening...' : 'Confirm Reopen & Escalate'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Official Receipt Modal */}
      {showReceipt && (
        <ReceiptModal
          grievance={grievance}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </>
  );
}

