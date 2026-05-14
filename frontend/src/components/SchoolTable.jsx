import React from 'react';
import { School, MapPin, GraduationCap, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SchoolTable({ schools, loading, meta, page, setPage }) {
    return (
        <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b">
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-[40%]">Informasi Sekolah</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-[15%] whitespace-nowrap">NPSN</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center w-[15%] whitespace-nowrap">Jenjang</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center w-[10%] whitespace-nowrap">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-[20%]">Lokasi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                        <p className="text-slate-500 font-medium">Mengambil data sekolah...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : schools.length > 0 ? (
                            schools.map((school) => (
                                <tr key={school.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-blue-50 p-2.5 rounded-xl group-hover:bg-primary transition-colors">
                                                <School className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{school.name}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{school.street || 'Alamat belum tersedia'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded text-slate-600">{school.npsn}</span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                                            <GraduationCap className="h-3 w-3" />
                                            {school.education_form_name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            school.status === 'Negeri' ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"
                                        }`}>
                                            {school.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1.5 text-slate-500">
                                            <MapPin className="h-4 w-4 shrink-0" />
                                            <span className="text-sm">{school.village}, {school.district_name}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-20 text-center">
                                    <p className="text-slate-400 font-medium">Data sekolah tidak ditemukan.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t bg-slate-50/30 flex items-center justify-between">
                <p className="text-sm text-slate-500 font-medium">
                    Menampilkan <span className="text-slate-800 font-bold">{schools.length}</span> dari <span className="text-slate-800 font-bold">{meta.total.toLocaleString()}</span> sekolah
                </p>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                        className="h-9 px-4 rounded-xl border bg-white hover:bg-slate-50 transition-all disabled:opacity-50 text-sm font-bold flex items-center gap-2"
                    >
                        <ChevronLeft className="h-4 w-4" /> Prev
                    </button>
                    <div className="bg-white border rounded-xl px-4 h-9 flex items-center text-sm font-bold">
                        {page} <span className="mx-1 text-slate-400">/</span> {meta.total_pages}
                    </div>
                    <button 
                        onClick={() => setPage(p => Math.min(meta.total_pages, p + 1))}
                        disabled={page === meta.total_pages || loading}
                        className="h-9 px-4 rounded-xl border bg-white hover:bg-slate-50 transition-all disabled:opacity-50 text-sm font-bold flex items-center gap-2"
                    >
                        Next <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
