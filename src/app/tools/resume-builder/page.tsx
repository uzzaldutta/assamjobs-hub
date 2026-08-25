"use client";

import { useState } from "react";
import { Printer, UserCircle } from "lucide-react";

export default function CVMaker() {
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    summary: "",
    education: "",
    skills: "",
    experience: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 print:bg-white pb-20">
      
      <div className="max-w-4xl mx-auto p-4 md:p-8 print:hidden">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-md border border-slate-200 dark:border-slate-800 p-6 md:p-10">
          <div className="flex items-center gap-3 mb-2">
            <UserCircle className="text-blue-600" size={28} />
            <h1 className="text-2xl md:text-3xl font-bold">Resume Builder</h1>
          </div>
          <p className="text-slate-500 mb-8">Enter your details to generate a clean, ATS-friendly resume. Click print when you are ready to save as PDF.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Full Name</label>
              <input type="text" name="name" onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Email</label>
              <input type="email" name="email" onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Phone Number</label>
              <input type="text" name="phone" onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Address / Location</label>
              <input type="text" name="address" onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">Professional Summary</label>
              <textarea name="summary" onChange={handleChange} rows={3} placeholder="A short paragraph about your career goals..." className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"></textarea>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">Education (Format: Degree - University - Year)</label>
              <textarea name="education" onChange={handleChange} rows={4} placeholder="B.A. - Gauhati University - 2022&#10;H.S.L.C - SEBA - 2017" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"></textarea>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">Work Experience (Format: Role - Company - Dates)</label>
              <textarea name="experience" onChange={handleChange} rows={4} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"></textarea>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">Key Skills (Comma separated)</label>
              <input type="text" name="skills" onChange={handleChange} placeholder="e.g. Communication, Data Entry, Microsoft Excel" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none" />
            </div>
          </div>

          <button onClick={handlePrint} className="mt-8 w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2">
            <Printer size={18} /> Print Resume / Save as PDF
          </button>
        </div>
      </div>

      {/* Printable Resume Canvas */}
      <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white p-[20mm] text-black shadow-2xl print:shadow-none print:p-0 mt-8 print:mt-0 font-sans border border-slate-200">
        
        <header className="border-b-2 border-slate-800 pb-4 mb-6">
          <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900">{data.name || "YOUR NAME"}</h1>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>• {data.phone}</span>}
            {data.address && <span>• {data.address}</span>}
          </div>
        </header>

        {data.summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 mb-2">Professional Summary</h2>
            <p className="text-sm text-slate-700 leading-relaxed">{data.summary}</p>
          </section>
        )}

        {data.experience && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 mb-2 border-b border-slate-300 pb-1">Work Experience</h2>
            <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{data.experience}</div>
          </section>
        )}

        {data.education && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 mb-2 border-b border-slate-300 pb-1">Education</h2>
            <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{data.education}</div>
          </section>
        )}

        {data.skills && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 mb-2 border-b border-slate-300 pb-1">Skills</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.skills.split(',').map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs font-semibold text-slate-700">
                  {skill.trim()}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

    </div>
  );
}
