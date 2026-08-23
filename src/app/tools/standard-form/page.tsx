"use client";

import { useState } from "react";
import { Printer, FileText } from "lucide-react";

export default function StandardForm() {
  const [formData, setFormData] = useState({
    postName: "",
    department: "",
    advertisement: "",
    name: "",
    address: "",
    fatherName: "",
    fatherAddress: "",
    placeOfBirth: "",
    citizenInfo: "By Birth",
    qualification: "",
    otherQualification: "",
    community: "",
    religion: "",
    age: "",
    occupation: "",
    previousAppt: "",
    retrenched: "No",
    ncc: "No",
    exchangeNo: "",
    assembly: "",
    challan: "",
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
          <p className="text-slate-500 mb-8">Fill in your details below and click Print. The output will perfectly match the Assam Gazette Part IX.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="department" onChange={handleChange} placeholder="To (Department Name)" className="w-full p-2 rounded border" />
            <input type="text" name="postName" onChange={handleChange} placeholder="Post Applied For" className="w-full p-2 rounded border" />
            <input type="text" name="advertisement" onChange={handleChange} placeholder="Advertisement Reference" className="w-full p-2 rounded border" />
            <input type="text" name="name" onChange={handleChange} placeholder="1. Full Name (Block Letters)" className="w-full p-2 rounded border uppercase" />
            <textarea name="address" onChange={handleChange} placeholder="2. Present Address" className="w-full p-2 rounded border"></textarea>
            <input type="text" name="fatherName" onChange={handleChange} placeholder="3. Father's Name" className="w-full p-2 rounded border" />
            <input type="text" name="placeOfBirth" onChange={handleChange} placeholder="4. Place of birth (Police St. & District)" className="w-full p-2 rounded border" />
            <input type="text" name="qualification" onChange={handleChange} placeholder="6. Educational Qualification" className="w-full p-2 rounded border" />
            <input type="text" name="community" onChange={handleChange} placeholder="8. Community (SC/ST/OBC)" className="w-full p-2 rounded border" />
            <input type="text" name="age" onChange={handleChange} placeholder="9. Age on 1st January (HSLC)" className="w-full p-2 rounded border" />
            <input type="text" name="exchangeNo" onChange={handleChange} placeholder="14. Employment Exchange Reg No" className="w-full p-2 rounded border" />
            <input type="text" name="challan" onChange={handleChange} placeholder="Treasury Challan Amount (if any)" className="w-full p-2 rounded border" />
          </div>

          <button onClick={handlePrint} className="mt-8 w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2">
            <Printer size={18} /> Print Form
          </button>
        </div>
      </div>

      {/* Printable Area - EXACTLY MATCHING GAZETTE PART IX */}
      <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white p-[15mm] text-black shadow-2xl print:shadow-none print:p-0 print:m-0 mt-8 print:mt-0 font-serif leading-tight print-container">
        
        <div className="text-center font-bold text-lg mb-1">STANDARD FORM OF APPLICATION</div>
        <div className="text-center font-bold text-md mb-6">(ASSAM GAZETTE PART IX)</div>

        <div className="mb-4">
          <div>To</div>
          <div className="ml-8 w-3/4 border-b border-dotted border-black min-h-[20px] font-semibold">{formData.department}</div>
          <div className="ml-8 w-3/4 border-b border-dotted border-black min-h-[20px]"></div>
        </div>

        <div className="flex mb-1">
          <div className="whitespace-nowrap">Sub:- Application for the post of</div>
          <div className="flex-grow border-b border-dotted border-black ml-2 font-semibold uppercase">{formData.postName}</div>
        </div>
        <div className="flex mb-4">
          <div className="whitespace-nowrap">Ref:- Your Advertisement</div>
          <div className="flex-grow border-b border-dotted border-black ml-2 font-semibold">{formData.advertisement}</div>
        </div>

        <div className="mb-2">Sir</div>
        <div className="indent-8 mb-6 text-justify">
          In response to your advertisement quoted above on the subject I have the honour to offer myself as a candidate for the same with the particulars furnished in the prescribed form.
        </div>

        <table className="w-full text-[15px] border-none mb-6">
          <tbody>
            <tr className="align-bottom">
              <td className="py-2 w-2/3">1. Name in full(block letters)</td>
              <td className="py-2 w-4 text-center">:</td>
              <td className="py-2 border-b border-dotted border-black font-bold uppercase tracking-wide">{formData.name}</td>
            </tr>
            <tr className="align-bottom">
              <td className="py-2">2. Present Address</td>
              <td className="py-2 text-center">:</td>
              <td className="py-2 border-b border-dotted border-black uppercase leading-tight min-h-[2rem]">{formData.address}</td>
            </tr>
            <tr className="align-bottom">
              <td className="py-2">3. Father's Name & Present address</td>
              <td className="py-2 text-center">:</td>
              <td className="py-2 border-b border-dotted border-black uppercase">{formData.fatherName}</td>
            </tr>
            <tr className="align-bottom">
              <td className="py-2">4. Place of birth including Police St. and District</td>
              <td className="py-2 text-center">:</td>
              <td className="py-2 border-b border-dotted border-black">{formData.placeOfBirth}</td>
            </tr>
            <tr className="align-bottom">
              <td className="py-2 pr-4 leading-snug">5. Are you a citizen of India if so, how (Copy of citizenship certificates should be enclosed where necessary)</td>
              <td className="py-2 text-center align-bottom">:</td>
              <td className="py-2 border-b border-dotted border-black align-bottom">{formData.citizenInfo}</td>
            </tr>
            <tr className="align-bottom">
              <td className="py-2 pr-4 leading-snug">6. Educational qualification and also the name & full address of the education institution (which read last copies of certificate should be enclosed)</td>
              <td className="py-2 text-center align-bottom">:</td>
              <td className="py-2 border-b border-dotted border-black align-bottom uppercase">{formData.qualification}</td>
            </tr>
            <tr className="align-bottom">
              <td className="py-2">7. Other Qualification</td>
              <td className="py-2 text-center">:</td>
              <td className="py-2 border-b border-dotted border-black">{formData.otherQualification}</td>
            </tr>
            <tr className="align-bottom">
              <td className="py-2 pr-4 leading-snug">8. Community (a) State your religion (b) Are you member of SC/ST (Answer 'yes' or 'No' if yes state particular's by a copy of certificate)</td>
              <td className="py-2 text-center align-bottom">:</td>
              <td className="py-2 border-b border-dotted border-black align-bottom">{formData.community}</td>
            </tr>
            <tr className="align-bottom">
              <td className="py-2 pr-4 leading-snug">9. Age on the 1st. January 200 (according to H.S.L.C. Examination copy of which should be enclosed)</td>
              <td className="py-2 text-center align-bottom">:</td>
              <td className="py-2 border-b border-dotted border-black align-bottom">{formData.age}</td>
            </tr>
            <tr className="align-bottom">
              <td className="py-2">10. Present occupation, if any</td>
              <td className="py-2 text-center">:</td>
              <td className="py-2 border-b border-dotted border-black">{formData.occupation}</td>
            </tr>
            <tr className="align-bottom">
              <td className="py-2">11. Previous appointment held, if any</td>
              <td className="py-2 text-center">:</td>
              <td className="py-2 border-b border-dotted border-black">{formData.previousAppt}</td>
            </tr>
            <tr className="align-bottom">
              <td className="py-2 pr-4 leading-snug">12. Are you a temporary or retrenched personal of a temporary Deptt. of the Govt. of Assam ? Answer 'yes' or 'No' if yes state Particulars</td>
              <td className="py-2 text-center align-bottom">:</td>
              <td className="py-2 border-b border-dotted border-black align-bottom">{formData.retrenched}</td>
            </tr>
            <tr className="align-bottom">
              <td className="py-2 pr-4 leading-snug">13. re you trained in a member of the N.C.C.or Territorial army, or trained Home Guards and civil defence volunteer's if so, give particulars</td>
              <td className="py-2 text-center align-bottom">:</td>
              <td className="py-2 border-b border-dotted border-black align-bottom">{formData.ncc}</td>
            </tr>
            <tr className="align-bottom">
              <td className="py-2">14. Name of Employment Exchange & Regd. No</td>
              <td className="py-2 text-center">:</td>
              <td className="py-2 border-b border-dotted border-black font-semibold">{formData.exchangeNo}</td>
            </tr>
            <tr className="align-bottom">
              <td className="py-2">15. The Name of the Assembly or Constitution</td>
              <td className="py-2 text-center">:</td>
              <td className="py-2 border-b border-dotted border-black">{formData.assembly}</td>
            </tr>
          </tbody>
        </table>

        <div className="mb-4 leading-relaxed text-justify">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I am a candidate for the post of <span className="border-b border-dotted border-black font-semibold inline-block min-w-[200px] text-center uppercase">{formData.postName}</span> and the fact state above are true to the best of my knowledge and belief. In case of a false statement, I am liable to any action Govt. may deem fit and proper.<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A treasury challan of Rs. <span className="border-b border-dotted border-black font-semibold inline-block min-w-[100px] text-center">{formData.challan}</span> is attached herewith
        </div>

        <div className="flex justify-between items-end mt-12 text-[15px]">
          <div>
            <p>Date.................................</p>
          </div>
          <div className="text-right">
            <p>Signature of the Applicant</p>
          </div>
        </div>

      </div>

    </div>
  );
}
