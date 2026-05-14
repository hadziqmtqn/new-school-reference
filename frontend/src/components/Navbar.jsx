import React from 'react';
import { GraduationCap, Globe } from 'lucide-react';

export default function Navbar({ activeTab, onTabChange }) {
    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange('dashboard')}>
                    <div className="bg-primary p-2 rounded-xl">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tight text-slate-800">
                        SCHOOL<span className="text-primary">REF</span>
                    </span>
                </div>
                
                <div className="hidden md:flex items-center gap-8">
                    <button 
                        onClick={() => onTabChange('dashboard')}
                        className={`text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'text-primary border-b-2 border-primary pb-1' : 'text-slate-500 hover:text-primary'}`}
                    >
                        Dashboard
                    </button>
                    <button className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors">Peta Sekolah</button>
                    <button className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors">Statistik</button>
                    <button 
                        onClick={() => onTabChange('docs')}
                        className={`text-sm font-bold transition-all ${activeTab === 'docs' ? 'text-primary border-b-2 border-primary pb-1' : 'text-slate-500 hover:text-primary'}`}
                    >
                        API Docs
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <button className="bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors">
                        <Globe className="h-5 w-5 text-slate-600" />
                    </button>
                </div>
            </div>
        </nav>
    );
}
