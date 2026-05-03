import { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const isAuthenticated = !!localStorage.getItem('accessToken');
    const [sites, setSites] = useState([]);
    const [materialsList, setMaterialsList] = useState([]);

    const [formData, setFormData] = useState({
      title: '',
      inv_number: '',
      status: 'field',
      description: '',
      site: '',
      materials: [],
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            const fetchData = async () => {
                try {
                    const sitesRes = await axios.get('http://127.0.0.1:8000/api/sites/');
                    const sitesData = sitesRes.data.results || sitesRes.data;
                    setSites(sitesData);

                    const materialsRes = await axios.get('http://127.0.0.1:8000/api/materials/');
                    const materialsData = materialsRes.data.results || materialsRes.data;
                    setMaterialsList(materialsData);

                    if (sitesData.length > 0) {
                        setFormData(prev => ({ ...prev, site: sitesData[0].id }));
                    }
                } catch (err) {
                    console.error('Ощибка загрузки справочников:', err);
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
            setFormData(prev => ({ ...prev, title: '', inv_number: '', status: 'field', description: '', materials: '' }));
        } catch (err) {
            console.error("Ошибка при отправке:", err.response?.data || err.message);
            setError('Ошибка при добавлении артефакта. Свертесь с данными');
        }
    };

      return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 0' }}>
              <div style={{ backgroundColor: '#f0f4f8', padding: '40px', borderRadius: '8px', marginBottom: '30px', textAlign: 'center' }}>
                    <h1 style={{ color: '#004080', fontSize: '2.5rem', marginTop: 0 }}>ArcheoDB</h1>
                    <p style={{ fontSize: '1.2rem', color: '#555' }}>
                        Единая информационная система учета археологических находок.
                    </p>
                    {!isAuthenticated && (
                        <Link to="/catalog" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 20px', backgroundColor: '#0066cc', color: 'white', textDecoration: 'none', borderRadius: '5px', fontSize: '1.1rem' }}>
                            Перейти в каталог находок
                        </Link>
                    )}
              </div>

              {isAuthenticated && (
                  <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #e1e8ed', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ marginTop: 0, color: '#333' }}>Добавьте свой артефакт</h2>
                        <p style={{ color: '#666', marginBottom: '20px' }}>Заполнение полевой описи. Авторство будет присвоено автоматически.</p>

                        {message && <div style={{ padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px', marginBottom: '20px' }}>{message}</div>}
                        {error && <div style={{ padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px', marginBottom: '20px' }}>{error}</div>}

                      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
                          <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Название находки *</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Например: Бронзовая фибула" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                          </div>

                          <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Инв. номер *</label>
                                        <input type="text" name="inv_number" value={formData.inv_number} onChange={handleChange} required placeholder="GNZ-2026-01" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                </div>
                              <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Статус</label>
                                  <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
                                      <option value="field">В полевой лаборатории</option>
                                      <option value="restoration">На реставрации</option>
                                      <option value="storage">В фондах (Архив)</option>
                                  </select>
                              </div>
                          </div>

                          <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Памятник / Раскоп *</label>
                                    <select name="site" value={formData.site} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
                                        <option value="" disabled>-- Выберите раскоп --</option>
                                        {sites.map(site => (
                                            <option key={site.id} value={site.id}>{site.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Материал *</label>
                                    <select 
                                        name="materials"
                                        multiple
                                        value={formData.materials}
                                        onChange={handleMultipleSelect}
                                        required
                                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', height: '100px' }}
                                    >
                                        {materialsList.map(mat => (
                                            <option key={mat.id} value={mat.id}>{mat.name}</option>
                                        ))}
                                    </select>
                                </div>
                          </div>
                          <div>
                              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Описание</label>
                              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Опишите состояние, орнамент, особенности..." style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}></textarea>
                          </div>

                          <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1.1rem', cursor: 'pointer', alignSelf: 'flex-start' }}>
                              Зарегистрировать находку
                          </button>
                      </form>
                  </div>
              )}
          </div>
      );
};

export default Home;