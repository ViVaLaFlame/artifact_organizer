import { useState, useEffect } from 'react';
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
        condition: '',
        image: null,
        gallery: []
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            const fetchAllData = async () => {
                try {
                    const [sRes, mRes, eRes, cRes, tRes] = await Promise.all([
                        axios.get('http://127.0.0.1:8000/api/sites/'),
                        axios.get('http://127.0.0.1:8000/api/materials/'),
                        axios.get('http://127.0.0.1:8000/api/eras/'),
                        axios.get('http://127.0.0.1:8000/api/cultures/'),
                        axios.get('http://127.0.0.1:8000/api/types/')
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
                    console.error("Ошибка загрузки данных:", err);
                }
            };
            fetchAllData();
        }
    }, [isAuthenticated]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleMultipleSelect = (e) => {
        const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({ ...formData, [e.target.name]: selectedValues });
    };

    const handleMainImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleGalleryChange = (e) => {
        const filesArray = Array.from(e.target.files);
        setFormData({ ...formData, gallery: filesArray });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('accessToken');
            const data = new FormData();
            
            data.append('title', formData.title);
            data.append('inv_number', formData.inv_number);
            data.append('status', formData.status);
            data.append('description', formData.description);
            data.append('site', formData.site);
            data.append('era', formData.era);
            data.append('artifact_type', formData.artifact_type);
            
            if (formData.culture) data.append('culture', formData.culture);
            if (formData.depth) data.append('depth', formData.depth);
            if (formData.layer) data.append('layer', formData.layer);
            if (formData.dimensions) data.append('dimensions', formData.dimensions);
            if (formData.weight) data.append('weight', formData.weight);
            if (formData.condition) data.append('condition', formData.condition);

            formData.materials.forEach(id => data.append('materials', id));

            if (formData.image) {
                data.append('image', formData.image);
            }

            formData.gallery.forEach(file => {
                data.append('gallery', file); 
            });

            await axios.post('http://127.0.0.1:8000/api/finds/', data, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('Находка и фотогалерея успешно занесены в реестр!');
            
            setFormData(prev => ({
                ...prev,
                title: '', inv_number: '', description: '', depth: '', 
                layer: '', dimensions: '', weight: '', materials: [], condition: '', image: null, gallery: []
            }));
            
            document.getElementById('mainImageInput').value = '';
            document.getElementById('galleryInput').value = '';

        } catch (err) {
            console.error("Ошибка при отправке:", err.response?.data || err.message);
            setError('Ошибка сохранения. Проверьте заполнение формы.');
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 0' }}>
            <div style={{ backgroundColor: '#2c3e50', color: 'white', padding: '40px', borderRadius: '8px', marginBottom: '30px', textAlign: 'center' }}>
                <h1>ArcheoDB: Полевая регистрация</h1>
                <p>Автоматизированное рабочее место археолога</p>
            </div>

            {isAuthenticated ? (
                <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <h2 style={{ borderBottom: '2px solid #eee', pb: '10px' }}>Новая запись</h2>
                    
                    {message && <div style={{ padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px', marginBottom: '20px' }}>{message}</div>}
                    {error && <div style={{ padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px', marginBottom: '20px' }}>{error}</div>}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label>Название предмета *</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <div>
                            <label>Инвентарный номер *</label>
                            <input type="text" name="inv_number" value={formData.inv_number} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                        </div>
                    </div>

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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label>Материалы (Ctrl + клик) *</label>
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

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                        <div style={{ flex: 1, padding: '15px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fafafa' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Главное фото (Обложка)</label>
                            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: 0 }}>Будет отображаться в каталоге.</p>
                            <input 
                                id="mainImageInput"
                                type="file" 
                                accept="image/*"
                                onChange={handleMainImageChange} 
                                style={{ width: '100%', cursor: 'pointer' }}
                            />
                        </div>
                        <div style={{ flex: 1, padding: '15px', border: '1px dashed #ccc', borderRadius: '4px', backgroundColor: '#f0f8ff' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Дополнительные ракурсы (Галерея)</label>
                            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: 0 }}>Зажмите Ctrl, чтобы выбрать несколько файлов.</p>
                            <input 
                                id="galleryInput"
                                type="file" 
                                accept="image/*"
                                multiple
                                onChange={handleGalleryChange} 
                                style={{ width: '100%', cursor: 'pointer' }}
                            />
                            {formData.gallery.length > 0 && (
                                <p style={{ fontSize: '0.9rem', color: '#0066cc', marginTop: '10px', fontWeight: 'bold' }}>
                                    Выбрано дополнительных фото: {formData.gallery.length}
                                </p>
                            )}
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label>Описание и особенности</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="3" style={{ width: '100%', padding: '8px' }}></textarea>
                    </div>

                    <button type="submit" style={{ padding: '15px 30px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>
                        Сохранить в реестр
                    </button>
                </form>
            ) : (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <h2>Добро пожаловать в ArcheoDB</h2>
                    <p>Для внесения данных необходимо авторизоваться в системе.</p>
                    <Link to="/catalog" style={{ color: '#3498db' }}>Перейти к просмотру каталога</Link>
                </div>
            )}
        </div>
    );
};

export default Home;