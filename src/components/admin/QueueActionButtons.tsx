"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { approveQueueItemAction, rejectQueueItemAction } from "@/app/admin/studio/ingestion/actions";

export default function QueueActionButtons({ 
  queueId, 
  payload, 
  duplicateOf 
}: { 
  queueId: string; 
  payload: any; 
  duplicateOf: string | null 
}) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleApprove = async () => {
    setIsApproving(true);
    setError(null);
    try {
      const res = await approveQueueItemAction(queueId, duplicateOf ? 'UPDATE' : 'NEW');
      if (res?.success) {
        setSuccess("Approved successfully");
      }
    } catch (err: any) {
      setError("Approval failed: " + (err.message || "Unknown error"));
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    setError(null);
    try {
      const res = await rejectQueueItemAction(queueId);
      if (res?.success) {
        setSuccess("Rejected successfully");
      }
    } catch (err: any) {
      setError("Rejection failed: " + (err.message || "Unknown error"));
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 flex-1 md:flex-none w-full">
      {error && <div className="text-[10px] text-rose-500 font-bold px-1">{error}</div>}
      {success ? (
        <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg text-center border border-emerald-100">
          {success}
        </div>
      ) : (
        <div className="flex gap-2 w-full">
          <button 
            onClick={handleReject} 
            disabled={isApproving || isRejecting}
            className="flex-1 text-xs font-bold bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-50 px-4 py-2 rounded-lg flex justify-center items-center gap-1 transition"
          >
            <XCircle size={14}/> {isRejecting ? 'Rejecting...' : 'Reject'}
          </button>
          <button 
            onClick={handleApprove}
            disabled={isApproving || isRejecting}
            className="flex-1 text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 px-4 py-2 rounded-lg flex justify-center items-center gap-1 shadow-sm transition"
          >
            <CheckCircle size={14}/> {isApproving ? 'Approving...' : (duplicateOf ? 'Merge' : 'Approve')}
          </button>
        </div>
      )}
    </div>
  );
}
