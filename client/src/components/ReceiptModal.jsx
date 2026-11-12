import React from 'react';
import { Printer, X, ShieldCheck, QrCode, FileText } from 'lucide-react';

export default function ReceiptModal({ grievance, onClose }) {
  if (!grievance) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-fade-in my-8">
        {/* Modal Controls (Hidden in Print) */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Official Grievance Acknowledgement Certificate
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Content */}
        <div id="printable-receipt" className="p-8 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 font-sans">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 dark:border-slate-100 pb-5 mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 mb-2 border border-emerald-300">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-lg font-black tracking-wide uppercase">
              MUNICIPAL CORPORATION CITIZEN REDRESSAL PORTAL
            </h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">
              NagarSeva e-Governance & SLA Monitoring Directorate
            </p>
            <div className="mt-2 inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-bold rounded-md">
              ACKNOWLEDGEMENT RECEIPT & SLA COMMITMENT DEED
            </div>
          </div>

          {/* Tracking Token & QR Block */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 mb-6 items-center">
            <div className="col-span-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Unique Tracking Token:</span>
              <div className="text-xl font-mono font-black text-emerald-600 dark:text-emerald-400 tracking-wider">
                {grievance.trackingToken}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Preserve this token for live status inquiries via Web, SMS or Toll-Free 1800-NAGAR-SEVA.
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-lg p-1.5 flex items-center justify-center border border-slate-400">
                <QrCode className="w-16 h-16 text-slate-800 dark:text-slate-200" />
              </div>
              <span className="text-[9px] font-mono text-slate-400 mt-1">DIGITAL TOKEN REF</span>
            </div>
          </div>

          {/* Grievance Details Grid */}
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Grievant Name</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {grievance.citizen?.name || 'Verified Citizen'}
                </span>
                <span className="text-slate-500 block text-[11px]">{grievance.citizen?.phone || 'Confidential'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Registration Date & Time</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {new Date(grievance.createdAt).toLocaleString()}
                </span>
                <span className="text-slate-500 block text-[11px]">System Timestamp Ref: #{grievance.id}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Department Responsible</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {grievance.departmentName}
                </span>
                <span className="text-slate-500 block text-[11px]">Category: {grievance.categoryName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Ward / Administrative Zone</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {grievance.wardName}
                </span>
                <span className="text-slate-500 block text-[11px]">Location: {grievance.address}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Assigned Field Officer</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {grievance.assignedOfficer?.name || 'Departmental Engineer'}
                </span>
                <span className="text-slate-500 block text-[11px]">
                  {grievance.assignedOfficer?.title} | {grievance.assignedOfficer?.phone}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Legally Binding SLA Target</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  {grievance.slaHours} Hours Resolution Window
                </span>
                <span className="text-slate-500 block text-[11px]">
                  Target Resolution: {new Date(grievance.slaDeadline).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Subject & Summary</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-xs mt-0.5">
                {grievance.title}
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 leading-relaxed">
                {grievance.description}
              </p>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="mt-6 pt-4 border-t border-slate-300 dark:border-slate-700 text-[10px] text-slate-500 flex justify-between items-end">
            <div>
              <p className="font-bold text-slate-700 dark:text-slate-300">
                CITIZEN SERVICE CHARTER GUARANTEE
              </p>
              <p className="mt-0.5">
                Failure to resolve within the stipulated SLA triggers automated multi-tier administrative escalation.
              </p>
            </div>
            <div className="text-right">
              <div className="w-24 border-b border-slate-400 mb-1"></div>
              <span>Digital Registry Seal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

