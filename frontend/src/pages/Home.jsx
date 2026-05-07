import { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const isAuthenticated = !!localStorage.getItem('accessToken');
    const [sites, setSites] = useState([]);
    const [materialsList, setMaterialsList] = useState([]);
    const [eras, setEras] = useState([]);
    const [cultures, setCultures] = useState([]);
    const [artifactTypes, setArtifactTypes] = useState([]);

    const [formData, setFormData] = useState({
      title: '',
      inv_number: '',
      status: 'field',
      description: '',
      site: '',
      era: '',
      culture: '',
      artifact_type: '',
      materials: [],
      depth: '',
      layer: '',
      dimensions: '',
      weight: '',
      conditon: ''
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            const fetchData = async () => {
                try {
                    const [sRes, mRes, eRes, cRes, tRes] = await Promise.all([
                        axios.get('http://127.0.0.1:8000/api/sites/'),
                        axios.get('http://127.0.0.1:8000/api/materials/'),
                        axios.get('http://127.0.0.1:8000/api/eras/'),
                        axios.get('http://127.0.0.1:8000/api/cultures/'),
                        axios.get('http://127.0.0.1:8000/api/types/'),
                    ]);

                    setSites(sRes.data.results || sRes.data);
                    setMaterialsList(mRes.data.results || mRes.data);
                    setEras(eRes.data.results || eRes.data);
                    setCultures(cRes.data.results || cRes.data);
                    setArtifactTypes(tRes.data.results || tRes.data);

                    const firstSite = (sRes.data.results || sRes.data)[0]?.id || '';
                    const firstEra = (eRes.data.results || eRes.data)[0]?.id || '';
                    const firstType = (tRes.data.results || tRes.data)[0]?.id || '';

                    setFormData(prev => ({
                        ...prev,
                        site: firstSite,
                        era: firstEra,
                        artifact_type: firstType
                    }));

                } catch (err) {
                    console.error('Ошибка загрузки данных:', err);
                }
            };
            fetchData();
        }
    }, [isAuthenticated]);

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleMultipleSelect = (e) => {
        const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({
            ...formData,
            [e.target.name]: selectedValues
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('accessToken');
            await axios.post('http://127.0.0.1:8000/api/finds/', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('Артефакт добавлен');
            setFormData(prev => ({ 
                ...prev, 
                title: '', 
                inv_number: '', 
                status: 'field', 
                description: '',
                depth: '',
                layer: '',
                dimensions: '',
                weight: '',
                materials: [],
                conditon: ''
            }));
        } catch (err) {
            console.error("Ошибка при отправке:", err.response?.data || err.message);
            setError('Ошибка при добавлении артефакта. Свертесь с данными');
        }
    };

      return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 0' }}>
            <div style={{ backgroundColor: '#2c3e50', color: 'white', padding: '40px', borderRadius: '8px', marginBottom: '30px', textAlign: 'center' }}>
                <h1>ArcheoDB: Полевая регистрация</h1>
                <p>Единая база данных для артефактов</p>
            </div>

            {isAuthenticated ? (
                <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <h2 style={{ borderBottom: '2px solid #eee', pb: '10px' }}>Новая запись</h2>
                    
                    {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    {/* Секция 1: Основная информация */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label>Название артефакта *</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <div>
                            <label>Инвентарный номер *</label>
                            <input type="text" name="inv_number" value={formData.inv_number} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                        </div>
                    </div>

                    {/* Секция 2: Стратиграфия и Место */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px', padding: '15px', background: '#f9f9f9' }}>
                        <div>
                            <label>Раскоп/Памятник *</label>
                            <select name="site" value={formData.site} onChange={handleChange} required style={{ width: '100%', padding: '8px' }}>
                                {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label>Глубина (м)</label>
                            <input type="number" step="0.01" name="depth" value={formData.depth} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <div>
                            <label>Пласт / Слой</label>
                            <input type="text" name="layer" value={formData.layer} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                        </div>
                    </div>

                    {/* Секция 3: Классификация */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label>Эпоха *</label>
                            <select name="era" value={formData.era} onChange={handleChange} required style={{ width: '100%', padding: '8px' }}>
                                {eras.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label>Культура</label>
                            <select name="culture" value={formData.culture} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                                <option value="">--- Не указана ---</option>
                                {cultures.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label>Тип артефакта *</label>
                            <select name="artifact_type" value={formData.artifact_type} onChange={handleChange} required style={{ width: '100%', padding: '8px' }}>
                                {artifactTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Секция 4: Материалы и Физика */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label>Материал/лы (Ctrl + клик) *</label>
                            <select name="materials" multiple value={formData.materials} onChange={handleMultipleSelect} required style={{ width: '100%', height: '80px' }}>
                                {materialsList.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label>Размеры (см)</label>
                            <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} placeholder="напр. 10х5х2" style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <div>
                            <label>Вес (г)</label>
                            <input type="number" name="weight" value={formData.weight} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label>Описание и особенности</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="3" style={{ width: '100%', padding: '8px' }}></textarea>
                    </div>

                    <button type="submit" style={{ padding: '15px 30px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem' }}>
                        Сохранить
                    </button>
                </form>
            ) : (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <h2>ArcheoDB</h2>
                    <p>Для внесения данных необходимо авторизоваться в системе.</p>
                    <Link to="/catalog" style={{ color: '#3498db' }}>Все артефакты</Link>
                </div>
            )}
        </div>
      );
};

export default Home;