import React from 'react';
import { Filter, Search } from 'lucide-react';

export default function FilterSection({ 
    filters, 
    setFilters, 
    data, 
    onSearch 
}) {
    return (
        <div className="bg-white border rounded-3xl p-6 shadow-sm mb-8">
            <div className="flex items-center gap-2 mb-6">
                <Filter className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-slate-700">Filter Pencarian</h2>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); onSearch(); }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {/* Province Select */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Provinsi</label>
                    <select 
                        className="w-full h-11 bg-slate-50 border rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                        value={filters.selectedProv}
                        onChange={(e) => setFilters.setSelectedProv(e.target.value)}
                    >
                        <option value="">Semua Provinsi</option>
                        {data.provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>

                {/* City Select */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Kota/Kabupaten</label>
                    <select 
                        className="w-full h-11 bg-slate-50 border rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer disabled:opacity-50"
                        value={filters.selectedCity}
                        onChange={(e) => setFilters.setSelectedCity(e.target.value)}
                        disabled={!filters.selectedProv}
                    >
                        <option value="">Semua Kota</option>
                        {data.cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                {/* District Select */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Kecamatan</label>
                    <select 
                        className="w-full h-11 bg-slate-50 border rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer disabled:opacity-50"
                        value={filters.selectedDist}
                        onChange={(e) => setFilters.setSelectedDist(e.target.value)}
                        disabled={!filters.selectedCity}
                    >
                        <option value="">Semua Kecamatan</option>
                        {data.districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>

                {/* Village Select */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Desa / Kelurahan</label>
                    <select 
                        className="w-full h-11 bg-slate-50 border rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer disabled:opacity-50"
                        value={filters.selectedVillage}
                        onChange={(e) => setFilters.setSelectedVillage(e.target.value)}
                        disabled={!filters.selectedDist}
                    >
                        <option value="">Semua Desa</option>
                        {data.villages.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
                    </select>
                </div>

                {/* Group/Form Select */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Kelompok Sekolah</label>
                    <select 
                        className="w-full h-11 bg-slate-50 border rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                        value={filters.selectedForm}
                        onChange={(e) => setFilters.setSelectedForm(e.target.value)}
                    >
                        <option value="">Semua Jenjang</option>
                        {data.eduForms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                </div>

                {/* Search Input */}
                <div className="space-y-1.5 lg:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Cari Nama / NPSN</label>
                    <div className="relative">
                        <input 
                            type="text"
                            placeholder="Masukkan nama sekolah atau NPSN..."
                            className="w-full h-11 bg-slate-50 border rounded-xl pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            value={filters.search}
                            onChange={(e) => setFilters.setSearch(e.target.value)}
                        />
                        <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    </div>
                </div>
            </form>
        </div>
    );
}
