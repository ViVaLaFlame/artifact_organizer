import { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useSearchParams } from "react-router-dom";

const Catalog = () => {
    const [finds, setFinds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eras, setEras] = useState([]);
    const [searchParams] = useSearchParams();
    const [initialAuthor] = searchParams.get('author') || '';

    const [filters, setFilters] = useState({
        search: '',
        era: '',
        site: '',
        status: '',
        author: initialAuthor,
        author__username: ''
    });

    useEffect(() => {
        const fetchFiltersData = async () => {
            try {
                const [eRes] = await Promise.all([
                    axios.get('/api/eras/'),
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
                if (filters.author) params.append('author', filters.author);
                if (filters.author__username) params.append('author__username', filters.author__username);

                const response = await axios.get(`/api/finds/?${params.toString()}`);
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
        <div style={{ width: '100%', boxSizing: 'border-box', padding: '0 15px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', marginTop: '20px', maxWidth: '1200px', margin: '20px auto 0' }}>
                <aside style={{ flex: '1 1 250px', width: '100%', maxWidth: '100%', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', height: 'fit-content', boxSizing: 'border-box' }}>
                    <h3 style={{ marginTop: 0 }}>Поиск</h3>

                    <div style={{ marginBottom: '15px' }}>
                        <input type="text" name="search" placeholder="Название" value={filters.search} onChange={handleFilterChange} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Эпоха</label>
                        <select name="era" value={filters.era} onChange={handleFilterChange} style={{width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}>
                            <option value="">Все эпохи</option>
                            {eras.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Раскоп</label>
                        <input type="text" name="site" placeholder="Введите место..." value={filters.site || ''} onChange={handleFilterChange} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Статус</label>
                        <select name="status" value={filters.status} onChange={handleFilterChange} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}>
                            <option value="">Любой статус</option>
                            <option value="field">В полевой лаб.</option>
                            <option value="restoration">На реставрации</option>
                            <option value="storage">В фондах</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Автор (Логин)</label>
                        <input type="text" name="author__username" value={filters.author__username || ''} onChange={handleFilterChange} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </div>
                    
                    <button onClick={() => setFilters({search: '', era: '', site: '', status: '', author__username: ''})} style={{ width: '100%', padding: '10px', cursor: 'pointer', backgroundColor: '#ddd', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                        Сбросить
                    </button>
                </aside>

                <main style={{ flex: '3 1 300px', minWidth: '0' }}>
                    <h1 style={{ marginTop: 0 }}>Архив находок</h1>
                    
                    {loading ? (
                        <p>Поиск в архивах...</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                            {finds.map(item => (
                                <div key={item.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        {item.image ? (
                                            <img src={item.image} alt={item.title} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '6px', marginBottom: '12px' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '160px', backgroundColor: '#f0f0f0', borderRadius: '6px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '0.9rem' }}>
                                                Нет фото
                                            </div>
                                        )}
                                        
                                        <h3 style={{ marginTop: 0, marginBottom: '10px', color: '#2c3e50', wordBreak: 'break-word' }}>{item.title}</h3>
                                        <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
                                            <p style={{ margin: '4px 0' }}>Эпоха: {item.era_name || 'Не указана'}</p>
                                            <p style={{ margin: '4px 0', wordBreak: 'break-word' }}>Место: {item.site || 'Не указано'}</p>
                                        </div>
                                    </div>
                                    <Link to={`/catalog/${item.id}`} style={{ color: '#0066cc', textDecoration: 'none', fontWeight: 'bold', alignSelf: 'flex-start', padding: '5px 0' }}>
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