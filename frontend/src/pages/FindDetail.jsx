import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FindDetail = () => {
    const { id } = useParams();
    const [find, setFind] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleDelete = async () => {
      const isConfirmed = window.confirm("Вы уверены, что хотите безвозвратно удалить этот артефакт?");
      
      if (isConfirmed) {
          try {
              const token = localStorage.getItem('accessToken');
              await axios.delete(`/api/finds/${find.id}/`, {
                  headers: {
                      'Authorization': `Bearer ${token}`
                  }
              });
              navigate('/catalog');
          } catch (err) {
              console.error('Ошибка при удалении:', err);
              alert('Ошибка при удалении. Убедитесь, что вы авторизованы и являетесь автором этой записи.');
          }
      }
  };

  useEffect(() => {
    const fetchFindDetail = async () => {
      try {
        const response = await axios.get(`/api/finds/${id}/`);
        setFind(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Ошибка:", err);
        setError("Не удалось загрузить данные о находке.");
        setLoading(false);
      }
    };
    fetchFindDetail();
  }, [id]);
  
  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!find) return <p>Находка не найдена в архиве.</p>;

  return (
    <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto', padding: '20px 15px', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#666' }}>
        <Link to={'/'} style={{ color: '#0066cc', textDecoration: 'none' }}>Главная</Link> /{' '}
        <Link to={'/catalog'} style={{ color: '#0066cc', textDecoration: 'none' }}>Каталог</Link> /{' '}
        <span>{find.title}</span>
      </div>
      
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', minWidth: '0' }}>
          {find.image ? (
            <a href={find.image} target="_blank" rel="noopener noreferrer" style={{ display: 'block', cursor: 'zoom-in' }}>
                <img 
                    src={find.image}
                    alt={find.title}
                    style={{
                        width: '100%',
                        maxHeight: '400px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        transition: 'opacity 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                />
            </a>
          ) : (
              <div style={{ width: '100%', height: '300px', backgroundColor: '#eaeaea', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', border: '1px dashed #ccc' }}>
                Нет фото
              </div>
          )}
          
          {find.images && find.images.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {find.images.map(imgObj => (
                  <a key={imgObj.id} href={imgObj.image} target='_blank' rel='noopener noreferrer' style={{ cursor: 'zoom-in', flex: '1 1 100px' }}>
                    <img 
                        src={imgObj.image}
                        alt="Ракурс"
                        style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd', transition: 'transform 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'} 
                      />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div style={{ flex: '2 1 350px', minWidth: '0' }}>
          <h1 style={{ marginTop: 0, marginBottom: '15px' }}>{find.title}</h1>

          <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', boxSizing: 'border-box' }}>
            <ul style={{ listStyleType: 'none', padding: 0, lineHeight: '1.8', margin: 0, wordBreak: 'break-word' }}>
              <li><strong>Памятник (Раскоп):</strong> {find.site || 'Не указан'}</li>
              <li><strong>Эпоха:</strong> {find.era_name || 'Не определена'}</li>
              {find.depth && <li><strong>Глубина:</strong> {find.depth} м</li>}
              {find.layer && <li><strong>Слой:</strong> {find.layer}</li>}
              {find.dimensions && <li><strong>Размеры:</strong> {find.dimensions}</li>}
              {find.weight && <li><strong>Вес:</strong> {find.weight} г</li>}
              <li style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', margin: '10px 0' }}>
                  <strong>Текущий статус:</strong>{' '}
                  <span style={{ backgroundColor: '#e8f4f8', padding: '4px 10px', borderRadius: '12px', fontSize: '0.9rem', color: '#2980b9' }}>
                    {find.status === 'field' ? 'В полевой лаборатории' : (find.status === 'storage' ? 'В фондах' : find.status)}
                  </span>
              </li>
              <li>
                  <strong>Автор:</strong>{' '}
                  <Link to={`/catalog?author=${find.author}`} style={{ color: '#3498db', textDecoration: 'none', fontWeight: 'bold' }}>
                      {find.author_name || 'Неизвестно'}
                  </Link>
              </li>
            </ul>
          </div>

          {find.description && (
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Описание</h3>
              <p style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{find.description}</p>
            </div>
          )}
          
          <div style={{ width: '100%', marginTop: '20px', display: 'flex', justifyContent: 'flex-start', gap: '15px' }}>
              <button style={{ width: '100%', maxWidth: '200px', height: 45, borderRadius: '4px', cursor: 'pointer', backgroundColor: '#3498db', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1rem', transition: 'background-color 0.2s'}} 
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
                      onClick={() => navigate(`/edit/${find.id}`)}>
                  Редактировать
              </button>

              <button style={{ width: '100%', maxWidth: '200px', height: 45, borderRadius: '4px', cursor: 'pointer', backgroundColor: '#e74c3c', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1rem', transition: 'background-color 0.2s'}} 
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c0392b'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e74c3c'}
                      onClick={handleDelete}>
                  Удалить
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindDetail;