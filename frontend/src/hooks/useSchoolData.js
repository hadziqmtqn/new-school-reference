import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = '/api';

export function useSchoolData() {
    // Data States
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);
    const [eduForms, setEduForms] = useState([]);
    const [schools, setSchools] = useState([]);
    
    // Filter States
    const [selectedProv, setSelectedProv] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDist, setSelectedDist] = useState('');
    const [selectedVillage, setSelectedVillage] = useState('');
    const [selectedForm, setSelectedForm] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ total: 0, total_pages: 0 });
    
    // Loading States
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // Initial Data Fetch
    useEffect(() => {
        const fetchInitial = async () => {
            try {
                const [provRes, formRes] = await Promise.all([
                    axios.get(`${API_BASE}/provinces`),
                    axios.get(`${API_BASE}/education-forms`)
                ]);
                setProvinces(provRes.data);
                setEduForms(formRes.data);
                setInitialLoading(false);
            } catch (err) {
                console.error("Failed to fetch initial data", err);
                setInitialLoading(false);
            }
        };
        fetchInitial();
    }, []);

    // Cascading City Fetch
    useEffect(() => {
        if (selectedProv) {
            axios.get(`${API_BASE}/cities?province_id=${selectedProv}`).then(res => setCities(res.data));
            setSelectedCity('');
            setSelectedDist('');
        } else {
            setCities([]);
        }
    }, [selectedProv]);

    // Cascading District Fetch
    useEffect(() => {
        if (selectedCity) {
            axios.get(`${API_BASE}/districts?city_id=${selectedCity}`).then(res => setDistricts(res.data));
            setSelectedDist('');
            setSelectedVillage('');
        } else {
            setDistricts([]);
        }
    }, [selectedCity]);

    // Cascading Village Fetch
    useEffect(() => {
        if (selectedDist) {
            axios.get(`${API_BASE}/villages?district_id=${selectedDist}`).then(res => setVillages(res.data));
            setSelectedVillage('');
        } else {
            setVillages([]);
        }
    }, [selectedDist]);

    // Fetch Schools on filter/page change
    useEffect(() => {
        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchSchools();
        }, search ? 500 : 0); // Delay 500ms jika mengetik, instan jika filter lain

        return () => clearTimeout(timeoutId);
    }, [selectedProv, selectedCity, selectedDist, selectedVillage, selectedForm, search, page]);

    // Reset page to 1 when filters or search change
    useEffect(() => {
        setPage(1);
    }, [selectedProv, selectedCity, selectedDist, selectedVillage, selectedForm, search]);

    const fetchSchools = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page,
                province_id: selectedProv,
                city_id: selectedCity,
                district_id: selectedDist,
                village: selectedVillage,
                form_id: selectedForm,
                search
            });
            const res = await axios.get(`${API_BASE}/schools?${params.toString()}`);
            setSchools(res.data.data);
            setMeta(res.data.meta);
        } catch (err) {
            console.error("Failed to fetch schools", err);
        } finally {
            setLoading(false);
        }
    };

    return {
        // States
        provinces, cities, districts, villages, eduForms, schools,
        selectedProv, selectedCity, selectedDist, selectedVillage, selectedForm,
        search, page, meta,
        loading, initialLoading,
        // Setters
        setSelectedProv, setSelectedCity, setSelectedDist, setSelectedVillage, setSelectedForm,
        setSearch, setPage,
        // Methods
        fetchSchools
    };
}
