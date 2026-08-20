"use client";

import { useState } from "react";
import { Bell, Loader2, CheckCircle } from "lucide-react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email && !phone) {
      setStatus("error");
      setMessage("Please enter an email or phone number.");
      return;
    }

    setStatus("loading");
    
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone })
      });
      
      if (!res.ok) throw new Error("Failed to subscribe");
      
      setStatus("success");
      setEmail("");
      setPhone("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Something went wrong.");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 text-center shadow-sm">
        <CheckCircle className="mx-auto h-12 w-12 text-emerald-500 mb-3" />
        <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">You're Subscribed!</h4>
        <p className="text-emerald-700 dark:text-emerald-300 text-sm mt-1">We'll send you the latest job updates directly.</p>
        <button 
          onClick={() => setStatus("idle")}
          className="mt-4 text-emerald-600 dark:text-emerald-400 font-medium text-sm hover:underline"
        >
          Subscribe another contact
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
          <Bell size={20} />
        </div>
        <h4 className="font-bold text-slate-800 dark:text-slate-100">Get Job Alerts</h4>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Never miss an Assam Govt job. Get instant alerts via Email or WhatsApp.</p>
      
      <form onSubmit={handleSubscribe} className="space-y-3">
        <div>
          <input 
            type="email" 
            placeholder="Your Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium px-2 block w-full text-center">OR</span>
        </div>
        <div>
          <input 
            type="tel" 
            placeholder="WhatsApp Number (e.g. +91...)" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        {status === "error" && <p className="text-red-500 text-xs text-center">{message}</p>}
        
        <button 
          type="submit" 
          disabled={status === "loading"}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex justify-center items-center gap-2"
        >
          {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : "Subscribe Now"}
        </button>
      </form>
    </div>
  );
}
