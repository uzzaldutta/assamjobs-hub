"use client";

import { useState, useRef } from "react";
import { Printer, Upload, Camera, PenTool, Trash2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";

export default function CVMaker() {
  const [data, setData] = useState({
    name: "JONATHAN DOE",
    title: "Software Engineer",
    email: "jonathan@example.com",
    phone: "+91 9876543210",
    address: "Guwahati, Assam",
    linkedin: "linkedin.com/in/jonathan",
    summary: "Dedicated and detail-oriented professional with a passion for building excellent web applications. Proven ability to work in team environments and deliver high-quality results.",
    education: "B.Tech in Computer Science\nGauhati University (2018 - 2022)\nCGPA: 8.5",
    experience: "Frontend Developer\nABC Tech Solutions, Guwahati (2022 - Present)\n• Developed responsive web applications using React.\n• Collaborated with backend teams to integrate APIs.\n• Improved website performance by 20%.",
    skills: "JavaScript, React, Next.js, Node.js, Tailwind CSS, SQL, Git",
    languages: "English, Assamese, Hindi",
    projects: "E-commerce Dashboard\n• Built a full-stack dashboard for tracking sales.\n• Used React, Node.js, and MongoDB."
  });

  const [photo, setPhoto] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const sigInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPhoto(url);
    }
  };

  const handleSigUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setSignature(url);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 print:bg-white">
      <div className="print:hidden">
        <PageHeader 
          title="Standard CV Maker" 
          subtitle="Generate a professional, printable CV with photo and signature." 
          theme="purple" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col xl:flex-row gap-8 items-start">
        
        {/* Editor (Hidden on Print) */}
        <div className="w-full xl:w-[400px] shrink-0 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 print:hidden sticky top-24 max-h-[85vh] overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Edit Details</h2>
            <button onClick={handlePrint} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-lg transition flex items-center gap-2">
              <Printer size={16} /> Print PDF
            </button>
          </div>

          <div className="space-y-4">
            {/* Photo & Sig Upload */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Passport Photo</label>
                <div className="flex gap-2">
                  <button onClick={() => photoInputRef.current?.click()} className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2">
                    <Camera size={14} /> Upload
                  </button>
                  {photo && (
                    <button onClick={() => setPhoto(null)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <input type="file" accept="image/*" ref={photoInputRef} onChange={handlePhotoUpload} className="hidden" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Signature</label>
                <div className="flex gap-2">
                  <button onClick={() => sigInputRef.current?.click()} className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2">
                    <PenTool size={14} /> Upload
                  </button>
                  {signature && (
                    <button onClick={() => setSignature(null)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <input type="file" accept="image/*" ref={sigInputRef} onChange={handleSigUpload} className="hidden" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Full Name</label>
              <input type="text" name="name" value={data.name} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Job Title / Objective</label>
              <input type="text" name="title" value={data.title} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Email</label>
                <input type="email" name="email" value={data.email} onChange={handleChange} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Phone</label>
                <input type="text" name="phone" value={data.phone} onChange={handleChange} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Address</label>
              <input type="text" name="address" value={data.address} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">LinkedIn / Website</label>
              <input type="text" name="linkedin" value={data.linkedin} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Professional Summary</label>
              <textarea name="summary" value={data.summary} onChange={handleChange} rows={3} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"></textarea>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Experience</label>
              <textarea name="experience" value={data.experience} onChange={handleChange} rows={5} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"></textarea>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Education</label>
              <textarea name="education" value={data.education} onChange={handleChange} rows={4} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"></textarea>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Projects</label>
              <textarea name="projects" value={data.projects} onChange={handleChange} rows={4} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"></textarea>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Skills</label>
              <input type="text" name="skills" value={data.skills} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Languages</label>
              <input type="text" name="languages" value={data.languages} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none" />
            </div>
          </div>
        </div>

        {/* Live Preview / Print Canvas */}
        <div className="flex-1 w-full flex justify-center">
          {/* A4 Size Print Canvas */}
          {/* 
            Standard A4 size is 210mm x 297mm.
            We use a scaling trick or just raw dimensions so it prints perfectly at 100% scale.
          */}
          <div 
            className="bg-white text-black shadow-2xl print:shadow-none font-sans relative overflow-hidden" 
            style={{ width: '210mm', minHeight: '297mm' }}
          >
            {/* Header / Top Bar */}
            <div className="bg-slate-800 text-white p-8 flex justify-between items-center print:bg-slate-800 !print:text-white" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
              <div>
                <h1 className="text-4xl font-black uppercase tracking-wider mb-2">{data.name || 'YOUR NAME'}</h1>
                <h2 className="text-lg font-medium text-purple-300 tracking-widest uppercase">{data.title || 'YOUR TITLE'}</h2>
              </div>
              {photo ? (
                <div className="w-24 h-32 bg-slate-200 border-2 border-white shadow-md overflow-hidden shrink-0">
                  <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-32 border-2 border-dashed border-slate-600 flex items-center justify-center text-slate-500 text-xs text-center shrink-0">
                  <p>Passport<br/>Photo</p>
                </div>
              )}
            </div>

            {/* Main Content Two-Column Grid */}
            <div className="flex p-8 gap-8">
              
              {/* Left Column (Main Info) */}
              <div className="flex-1 space-y-6">
                
                {data.summary && (
                  <section>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b-2 border-purple-600 pb-1 mb-3">Profile</h3>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{data.summary}</p>
                  </section>
                )}

                {data.experience && (
                  <section>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b-2 border-purple-600 pb-1 mb-3">Experience</h3>
                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{data.experience}</div>
                  </section>
                )}

                {data.education && (
                  <section>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b-2 border-purple-600 pb-1 mb-3">Education</h3>
                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{data.education}</div>
                  </section>
                )}

                {data.projects && (
                  <section>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b-2 border-purple-600 pb-1 mb-3">Projects</h3>
                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{data.projects}</div>
                  </section>
                )}
                
              </div>

              {/* Right Column (Sidebar Info) */}
              <div className="w-[220px] shrink-0 space-y-6">
                
                <section>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b-2 border-purple-600 pb-1 mb-3">Contact</h3>
                  <ul className="text-sm text-slate-700 space-y-3">
                    {data.phone && <li><span className="font-semibold block text-slate-900 text-xs">Phone</span>{data.phone}</li>}
                    {data.email && <li><span className="font-semibold block text-slate-900 text-xs">Email</span>{data.email}</li>}
                    {data.address && <li><span className="font-semibold block text-slate-900 text-xs">Address</span>{data.address}</li>}
                    {data.linkedin && <li><span className="font-semibold block text-slate-900 text-xs">LinkedIn</span>{data.linkedin}</li>}
                  </ul>
                </section>

                {data.skills && (
                  <section>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b-2 border-purple-600 pb-1 mb-3">Skills</h3>
                    <ul className="text-sm text-slate-700 list-disc list-inside leading-loose">
                      {data.skills.split(',').map((skill, i) => (
                        <li key={i}>{skill.trim()}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {data.languages && (
                  <section>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b-2 border-purple-600 pb-1 mb-3">Languages</h3>
                    <ul className="text-sm text-slate-700 list-disc list-inside leading-loose">
                      {data.languages.split(',').map((lang, i) => (
                        <li key={i}>{lang.trim()}</li>
                      ))}
                    </ul>
                  </section>
                )}

              </div>
            </div>

            {/* Signature Area at the bottom */}
            <div className="absolute bottom-8 right-12 w-48 text-center flex flex-col items-center">
              {signature ? (
                <div className="h-16 w-full mb-2">
                  <img src={signature} alt="Signature" className="h-full w-full object-contain" />
                </div>
              ) : (
                <div className="h-16 w-full mb-2 border-b-2 border-slate-300"></div>
              )}
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{data.name}</p>
            </div>

          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
