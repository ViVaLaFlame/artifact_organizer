import { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";

const Catalog = () => {
    const [finds, setFinds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eras, setEras] = useState([]);

    const [filters, setFilters] = useState({
        search: '',
        era: '',
        site: '',
        status: ''
    });

    useEffect(() => {
        const fetchFiltersData = async () => {
            try {
                const [eRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/eras/'),
                ]);
                setEras(eRes.data.results || eRes.data);
            } catch (error) {
                console.log("Ошибка загрузки фильтров:", error);
            }
        };
        fetchFiltersData();
    }, []);

    useEffect(() => {
        const fetchFinds = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (filters.search) params.append('search', filters.search);
                if (filters.era) params.append('era', filters.era);
                if (filters.site) params.append('site', filters.site);
                if (filters.status) params.append('status', filters.status);

                const response = await axios.get(`http://127.0.0.1:8000/api/finds/?${params.toString()}`);
                setFinds(response.data.results || response.data);
            } catch (error) {
                console.log("Ошибка при получении данных:", error);
            } finally {
                setLoading(false);
            }
        };
        
        const delayDebounceFn = setTimeout(() => {
            fetchFinds();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: '30px', marginTop: '20px' }}>
                <aside style={{ width: '250px' , backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', height: 'fit-content' }}>
                    <h3>Поиск</h3>

                    <div style={{ marginBottom: '15px' }}>
                        <input 
                            type="text"
                            name="search"
                            placeholder="Название"
                            value={filters.search}
                            onChange={handleFilterChange}
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} 
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Эпоха</label>
                        <select name="era" value={filters.era} onChange={handleFilterChange} style={{width: '100%', padding: '8px' }}>
                            <option value="">Все эпохи</option>
                            {eras.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Раскоп</label>
                        <input 
                            type="text"
                            name="site"
                            placeholder="Введите место..."
                            value={filters.site || ''}
                            onChange={handleFilterChange}
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} 
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Статус</label>
                        <select name="status" value={filters.status} onChange={handleFilterChange} style={{ width: '100%', padding: '8px' }}>
                            <option value="">Любой статус</option>
                            <option value="field">В полевой лаб.</option>
                            <option value="restoration">На реставрации</option>
                            <option value="storage">В фондах</option>
                        </select>
                    </div>
                    
                    <button
                        onClick={() => setFilters({search: '', era: '', site: '', status: ''})}
                        style={{ width: '100%', padding: '8px', cursor: 'pointer', backgroundColor: '#ddd', border: 'none', borderRadius: '4px' }}
                    >
                        Сбросить
                    </button>
                </aside>

                <main style={{ flex: 1 }}>
                    <h1>Архив находок</h1>
                    
                    {loading ? (
                        <p>Поиск в архивах...</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                            {finds.map(item => (
                                <div key={item.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        {item.image ? (
                                            <img 
                                                src={item.image} 
                                                alt={item.title} 
                                                style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '6px', marginBottom: '12px' }} 
                                            />
                                        ) : (
                                            <div style={{ width: '100%', height: '160px', backgroundColor: '#f0f0f0', borderRadius: '6px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '0.9rem' }}>
                                                Нет фото
                                            </div>
                                        )}
                                        
                                        <h3 style={{ marginTop: 0, marginBottom: '10px', color: '#2c3e50' }}>{item.title}</h3>
                                        <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
                                            <p style={{ margin: '4px 0' }}>Эпоха: {item.era_name || 'Не указана'}</p>
                                            <p style={{ margin: '4px 0' }}>Место: {item.site || 'Не указано'}</p>
                                        </div>
                                    </div>
                                    <Link to={`/catalog/${item.id}`} style={{ color: '#0066cc', textDecoration: 'none', fontWeight: 'bold', alignSelf: 'flex-start' }}>
                                        Подробнее →
                                    </Link>
                                </div>
                            ))}
                            {finds.length === 0 && <p>Ничего не найдено по вашему запросу.</p>}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Catalog;