"use client";

import { useState } from "react";
import { Printer, FileText } from "lucide-react";

export default function StandardForm() {
  const [formData, setFormData] = useState({
    postName: "",
    department: "",
    name: "",
    fatherName: "",
    motherName: "",
    dob: "",
    age: "",
    address: "",
    mobile: "",
    email: "",
    caste: "",
    exchangeNo: "",
    qualification: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 print:bg-white pb-20">
      {/* Non-printable UI Controls */}
      <div className="max-w-4xl mx-auto p-4 md:p-8 print:hidden">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-md border border-slate-200 dark:border-slate-800 p-6 md:p-10">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="text-indigo-600" size={28} />
            <h1 className="text-2xl md:text-3xl font-bold">Assam Standard Form Generator</h1>
          </div>
          <p className="text-slate-500 mb-8">Fill in your details below and click Print. The output will automatically format itself exactly like the official Assam Standard Form of Application for Govt jobs.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Name of the Post applied for</label>
              <input type="text" name="postName" onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Department / Office</label>
              <input type="text" name="department" onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Full Name (In Block Letters)</label>
              <input type="text" name="name" onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none uppercase" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Father's Name</label>
              <input type="text" name="fatherName" onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none uppercase" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Date of Birth</label>
              <input type="date" name="dob" onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Age (as on date of advt)</label>
              <input type="text" name="age" onChange={handleChange} placeholder="e.g. 24 Yrs 2 M" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">Present Address (With PIN Code)</label>
              <textarea name="address" onChange={handleChange} rows={3} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none uppercase"></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Mobile Number</label>
              <input type="text" name="mobile" onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Employment Exchange Reg. No</label>
              <input type="text" name="exchangeNo" onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">Educational Qualifications</label>
              <input type="text" name="qualification" onChange={handleChange} placeholder="e.g. B.A. from Gauhati University" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none uppercase" />
            </div>
          </div>

          <button onClick={handlePrint} className="mt-8 w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2">
            <Printer size={18} /> Print Form
          </button>
        </div>
      </div>

      {/* Printable Area - Only visible when printing, or we can make it look like a paper on screen */}
      <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white p-[20mm] text-black shadow-2xl print:shadow-none print:p-0 mt-8 print:mt-0 font-serif border border-slate-200">
        
        <div className="text-center font-bold text-lg underline mb-6 tracking-wide">
          STANDARD FORM OF APPLICATION
        </div>

        <div className="flex justify-between items-start mb-6">
          <div className="text-sm w-3/4">
            <p>To,</p>
            <p className="ml-4 min-h-[1.5rem] border-b border-dotted border-black w-3/4 font-semibold">{formData.department}</p>
            <p className="ml-4 min-h-[1.5rem] border-b border-dotted border-black w-3/4"></p>
          </div>
          <div className="w-[35mm] h-[45mm] border border-black flex items-center justify-center text-[10px] text-center text-gray-400 p-2">
            Paste recent passport size photograph
          </div>
        </div>

        <table className="w-full text-sm border-collapse">
          <tbody>
            <tr>
              <td className="py-2 w-1/3">1. Name of the post applied for</td>
              <td className="py-2 border-b border-dotted border-black font-semibold uppercase">{formData.postName}</td>
            </tr>
            <tr>
              <td className="py-2">2. Name of Candidate (in BLOCK letters)</td>
              <td className="py-2 border-b border-dotted border-black font-bold uppercase tracking-widest">{formData.name}</td>
            </tr>
            <tr>
              <td className="py-2">3. Father's / Husband's Name</td>
              <td className="py-2 border-b border-dotted border-black uppercase">{formData.fatherName}</td>
            </tr>
            <tr>
              <td className="py-2">4. Date of Birth</td>
              <td className="py-2 border-b border-dotted border-black font-semibold">{formData.dob}</td>
            </tr>
            <tr>
              <td className="py-2">5. Age (As on date of advt)</td>
              <td className="py-2 border-b border-dotted border-black">{formData.age}</td>
            </tr>
            <tr>
              <td className="py-2 align-top">6. Present Address</td>
              <td className="py-2 border-b border-dotted border-black uppercase min-h-[3rem]">{formData.address}</td>
            </tr>
            <tr>
              <td className="py-2">7. Mobile Number</td>
              <td className="py-2 border-b border-dotted border-black">{formData.mobile}</td>
            </tr>
            <tr>
              <td className="py-2">8. Employment Exchange Reg No.</td>
              <td className="py-2 border-b border-dotted border-black font-semibold">{formData.exchangeNo}</td>
            </tr>
            <tr>
              <td className="py-2">9. Educational Qualification</td>
              <td className="py-2 border-b border-dotted border-black uppercase">{formData.qualification}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-12 text-sm leading-relaxed text-justify">
          <p className="indent-8">
            I do hereby declare that all the statements made in the application are true, complete and correct to the best of my knowledge and belief. I understand that in the event of any particulars or information given herein being found false or incorrect, my candidature for the examination/interview is liable to be rejected or cancelled.
          </p>
        </div>

        <div className="flex justify-between items-end mt-20 text-sm">
          <div>
            <p>Date: ........................</p>
            <p className="mt-4">Place: ........................</p>
          </div>
          <div className="text-center">
            <div className="w-48 border-b border-black mb-1"></div>
            <p>Signature of the Candidate</p>
          </div>
        </div>

      </div>

    </div>
  );
}
