import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Navbar from './components/Navbar';
import FilterSection from './components/FilterSection';
import SchoolTable from './components/SchoolTable';
import ApiDocs from './components/ApiDocs';
import { useSchoolData } from './hooks/useSchoolData';

const App = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const {
        provinces, cities, districts, villages, eduForms, schools,
        selectedProv, selectedCity, selectedDist, selectedVillage, selectedForm,
        search, page, meta,
        loading, initialLoading,
        setSelectedProv, setSelectedCity, setSelectedDist, setSelectedVillage, setSelectedForm,
        setSearch, setPage,
        fetchSchools
    } = useSchoolData();

    if (initialLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#f8fafc]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-slate-500 font-medium animate-pulse">Memuat Data Referensi...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
            <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="max-w-[1600px] mx-auto px-4 py-8">
                {activeTab === 'dashboard' ? (
                    <>
                        <div className="mb-10">
                            <h1 className="text-3xl font-black tracking-tight text-slate-800 mb-2">Master Data Sekolah</h1>
                            <p className="text-slate-500">Telusuri data referensi satuan pendidikan di seluruh Indonesia secara real-time.</p>
                        </div>

                        <FilterSection 
                            filters={{ selectedProv, selectedCity, selectedDist, selectedVillage, selectedForm, search }}
                            setFilters={{ setSelectedProv, setSelectedCity, setSelectedDist, setSelectedVillage, setSelectedForm, setSearch }}
                            data={{ provinces, cities, districts, villages, eduForms }}
                            onSearch={fetchSchools}
                        />

                        <SchoolTable 
                            schools={schools}
                            loading={loading}
                            meta={meta}
                            page={page}
                            setPage={setPage}
                        />
                    </>
                ) : (
                    <ApiDocs />
                )}
            </main>
        </div>
    );
};

export default App;
