import React from 'react';
import { Book, Code, Globe, Lock, Play, Copy } from 'lucide-react';

const endpoints = [
    {
        method: 'GET',
        path: '/api/provinces',
        desc: 'Mengambil daftar seluruh provinsi di Indonesia.',
        params: [],
        response: '[ { "id": 1, "name": "D.K.I. Jakarta", "code": "010000" }, ... ]'
    },
    {
        method: 'GET',
        path: '/api/cities',
        desc: 'Mengambil daftar kota/kabupaten berdasarkan ID provinsi.',
        params: [
            { name: 'province_id', type: 'integer', desc: 'ID unik dari provinsi' }
        ],
        response: '[ { "id": 10, "name": "Jakarta Selatan", "code": "010100" }, ... ]'
    },
    {
        method: 'GET',
        path: '/api/villages',
        desc: 'Mengambil daftar desa/kelurahan unik berdasarkan ID kecamatan.',
        params: [
            { name: 'district_id', type: 'integer', desc: 'ID unik dari kecamatan' }
        ],
        response: '[ { "name": "Kelapa Gading Barat" }, { "name": "Kelapa Gading Timur" } ]'
    },
    {
        method: 'GET',
        path: '/api/schools',
        desc: 'Pencarian data sekolah dengan filter lengkap dan pagination.',
        params: [
            { name: 'search', type: 'string', desc: 'Nama sekolah atau NPSN' },
            { name: 'province_id', type: 'integer', desc: 'Filter per provinsi' },
            { name: 'form_id', type: 'integer', desc: 'Filter per jenjang (SD, SMP, dll)' },
            { name: 'page', type: 'integer', desc: 'Nomor halaman (default: 1)' }
        ],
        response: '{ "data": [...], "meta": { "total": 400000, "page": 1, ... } }'
    }
];

export default function ApiDocs() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-indigo-600 p-2 rounded-xl">
                        <Book className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-800">API Documentation</h1>
                </div>
                <p className="text-slate-500 text-lg">Gunakan REST API kami untuk mengintegrasikan data referensi sekolah ke aplikasi Anda.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: General Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white border rounded-3xl p-6 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Globe className="h-4 w-4 text-primary" /> Base URL
                        </h3>
                        <code className="block bg-slate-50 p-3 rounded-xl text-sm text-primary font-mono border">
                            {window.location.origin}
                        </code>
                    </div>

                    <div className="bg-white border rounded-3xl p-6 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Lock className="h-4 w-4 text-orange-500" /> Authentication
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Saat ini API tersedia untuk publik (Public Access). Tidak diperlukan API Key untuk penggunaan dasar di lingkungan lokal.
                        </p>
                    </div>
                </div>

                {/* Right: Endpoints List */}
                <div className="lg:col-span-2 space-y-8">
                    {endpoints.map((ep, i) => (
                        <div key={i} className="bg-white border rounded-3xl overflow-hidden shadow-sm">
                            <div className="p-6 border-b flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-lg">{ep.method}</span>
                                    <span className="font-mono text-slate-700 font-bold">{ep.path}</span>
                                </div>
                                <button className="text-slate-400 hover:text-primary transition-colors">
                                    <Copy className="h-4 w-4" />
                                </button>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Deskripsi</h4>
                                    <p className="text-slate-600">{ep.desc}</p>
                                </div>

                                {ep.params.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Query Parameters</h4>
                                        <div className="border rounded-2xl overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead className="bg-slate-50 border-b">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left font-bold text-slate-600">Param</th>
                                                        <th className="px-4 py-2 text-left font-bold text-slate-600">Type</th>
                                                        <th className="px-4 py-2 text-left font-bold text-slate-600">Description</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                    {ep.params.map((p, pi) => (
                                                        <tr key={pi}>
                                                            <td className="px-4 py-3 font-mono text-primary font-bold">{p.name}</td>
                                                            <td className="px-4 py-3 text-slate-500">{p.type}</td>
                                                            <td className="px-4 py-3 text-slate-600">{p.desc}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Contoh Response</h4>
                                    <pre className="bg-[#1e293b] text-blue-300 p-4 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed">
                                        {ep.response}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
