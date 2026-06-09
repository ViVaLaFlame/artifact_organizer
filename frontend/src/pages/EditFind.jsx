import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditFind = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('accessToken');

    const [materialsList, setMaterialsList] = useState([]);
    const [eras, setEras] = useState([]);
    const [cultures, setCultures] = useState([]);
    const [artifactTypes, setArtifactTypes] = useState([]);
    const [conditions, setConditions] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        status: 'field',
        discovery_date: '',
        description: '',
        era: '',
        culture: '',
        artifact_type: '',
        materials: [],
        site: '',
        excavation_area: '',
        square: '',
        depth: '',
        layer: '',
        dimensions: '',
        weight: '',
        condition: '',
        condition_notes: '',
        image: null,
        gallery: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            try {
                const [findRes, mRes, eRes, cRes, tRes, condRes] = await Promise.all([
                    axios.get(`/api/finds/${id}/`),
                    axios.get('/api/materials/'),
                    axios.get('/api/eras/'),
                    axios.get('/api/cultures/'),
                    axios.get('/api/types/'),
                    axios.get('/api/conditions/')
                ]);

                setMaterialsList(mRes.data.results || mRes.data);
                setEras(eRes.data.results || eRes.data);
                setCultures(cRes.data.results || cRes.data);
                setArtifactTypes(tRes.data.results || tRes.data);
                setConditions(condRes.data.results || condRes.data);

                const find = findRes.data;
                setFormData({
                    title: find.title || '',
                    status: find.status || 'field',
                    discovery_date: find.discovery_date || '',
                    description: find.description || '',
                    era: find.era || '',
                    culture: find.culture || '',
                    artifact_type: find.artifact_type || '',
                    materials: find.materials || [],
                    site: find.site || '',
                    excavation_area: find.excavation_area || '',
                    square: find.square || '',
                    depth: find.depth || '',
                    layer: find.layer || '',
                    dimensions: find.dimensions || '',
                    weight: find.weight || '',
                    condition: find.condition || '',
                    condition_notes: find.condition_notes || '',
                    image: null,
                    gallery: []
                });

            } catch (err) {
                console.error('Ошибка при загрузке данных:', err);
                setError('Не удалось загрузить данные для редактирования.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isAuthenticated, navigate]);

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
        setError('');

        try {
            const token = localStorage.getItem('accessToken');
            const data = new FormData();
            
            data.append('title', formData.title);
            data.append('status', formData.status);
            
            const optionalFields = [
                'description', 'discovery_date', 'site', 'excavation_area', 
                'square', 'depth', 'layer', 'dimensions', 'weight', 'condition_notes'
            ];
            optionalFields.forEach(field => {
                if (formData[field]) data.append(field, formData[field]);
            });

            if (formData.era) data.append('era', formData.era);
            if (formData.artifact_type) data.append('artifact_type', formData.artifact_type);
            if (formData.culture) data.append('culture', formData.culture);
            if (formData.condition) data.append('condition', formData.condition);

            formData.materials.forEach(materialId => data.append('materials', materialId));

            if (formData.image) {
                data.append('image', formData.image);
            }
            if (formData.gallery.length > 0) {
                formData.gallery.forEach(file => {
                    data.append('gallery', file); 
                });
            }

            await axios.patch(`/api/finds/${id}/`, data, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate(`/catalog/${id}`);

        } catch (err) {
            console.error("Ошибка при обновлении:", err.response?.data || err.message);
            setError('Ошибка сохранения. Проверьте правильность заполнения формы.');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Загрузка данных...</div>;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 0' }}>
            <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>Редактирование записи</h2>
                    <select name="status" value={formData.status} onChange={handleChange} style={{ padding: '8px', fontWeight: 'bold', borderRadius: '4px' }}>
                        <option value="field">В полевой лаборатории</option>
                        <option value="storage">В фондах</option>
                        <option value="exhibition">На экспозиции</option>
                        <option value="restoration">На реставрации</option>
                    </select>
                </div>
                
                {error && <div style={{ padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px', marginBottom: '20px' }}>{error}</div>}

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                        <label>Название предмета *</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                    </div>
                    <div>
                        <label>Дата обнаружения</label>
                        <input type="date" name="discovery_date" value={formData.discovery_date} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                    </div>
                </div>

                <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
                    <h4 style={{ margin: '0 0 15px 0', color: '#555' }}>Местоположение (Стратиграфия)</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                        <div>
                            <label>Раскоп (место):</label>
                            <input type="text" name="site" value={formData.site} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <div>
                            <label>Участок/Раскоп:</label>
                            <input type="text" name="excavation_area" value={formData.excavation_area} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <div>
                            <label>Квадрат:</label>
                            <input type="text" name="square" value={formData.square} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label>Глубина (м)</label>
                            <input type="number" step="0.01" name="depth" value={formData.depth} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <div>
                            <label>Пласт / Слой</label>
                            <input type="text" name="layer" value={formData.layer} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                        <label>Эпоха *</label>
                        <select name="era" value={formData.era} onChange={handleChange} required style={{ width: '100%', padding: '8px' }}>
                            <option value="">Выберите эпоху</option>
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
                            <option value="">Выберите тип</option>
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
                        <label>Размеры (ДxШxВ)</label>
                        <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
                        <label>Вес (г)</label>
                        <input type="number" name="weight" value={formData.weight} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                    </div>
                    <div>
                        <label>Сохранность *</label>
                        <select name="condition" value={formData.condition} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginBottom: '10px' }}>
                            <option value="">Выберите сохранность</option>
                            {conditions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <label>Заметки о сохранности</label>
                        <textarea name="condition_notes" value={formData.condition_notes} onChange={handleChange} rows="1" style={{ width: '100%', padding: '8px' }}></textarea>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 1, padding: '15px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fafafa' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Заменить главное фото</label>
                        <p style={{ fontSize: '0.85rem', color: '#666', marginTop: 0 }}>Оставьте пустым, чтобы не менять текущее фото.</p>
                        <input type="file" accept="image/*" onChange={handleMainImageChange} style={{ width: '100%', cursor: 'pointer' }} />
                    </div>
                    <div style={{ flex: 1, padding: '15px', border: '1px dashed #ccc', borderRadius: '4px', backgroundColor: '#f0f8ff' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Добавить фото в галерею</label>
                        <p style={{ fontSize: '0.85rem', color: '#666', marginTop: 0 }}>Эти фото будут добавлены к уже существующим.</p>
                        <input type="file" accept="image/*" multiple onChange={handleGalleryChange} style={{ width: '100%', cursor: 'pointer' }} />
                        {formData.gallery.length > 0 && <p style={{ fontSize: '0.9rem', color: '#0066cc', marginTop: '10px', fontWeight: 'bold' }}>Выбрано фото для загрузки: {formData.gallery.length}</p>}
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label>Общее описание артефакта</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="3" style={{ width: '100%', padding: '8px' }}></textarea>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <button type="submit" style={{ padding: '15px 30px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>
                        Сохранить изменения
                    </button>
                    <button type="button" onClick={() => navigate(-1)} style={{ padding: '15px 30px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditFind;