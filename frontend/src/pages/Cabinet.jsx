import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Cabinet = () => {
    const [user, setUser] = useState(null);
    const [myFinds, setMyFinds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCabinetData = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                const [userRes, findsRes] = await Promise.all([
                    axios.get('/api/users/me/', config),
                    axios.get('/api/finds/my/', config)
                ]);

                setUser(userRes.data);
                const findsData = findsRes.data;
                if (Array.isArray(findsData)) {
                    setMyFinds(findsData);
                } else if (findsData && Array.isArray(findsData.results)) {
                    setMyFinds(findsData.results);
                } else {
                    console.error("Внимание! Бэкенд прислал непредсказуемый формат:", findsData);
                    setMyFinds([]);
                }
            } catch (err) {
                console.error('Ошибка загрузки данных пользователя:', err)
            } finally {
                setLoading(false);
            }
        };

        fetchCabinetData();
    }, []);
    
    if (loading) return <p>Копаем....</p>;

    return (
        <div style={{ maxWidth: '1000px', width: '100%', margin: '30px auto', padding: '0 15px', boxSizing: 'border-box' }}>
            <h1 style={{ marginTop: 0 }}>Личный кабинет</h1>

            {user && (
                <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #eee' }}>
                    <p style={{ margin: '0 0 10px 0' }}><strong>Имя пользователя: </strong>{user.username}</p>
                    <p style={{ margin: 0 }}><strong>Дата регистрации: </strong>{user.date_joined ? new Date(user.date_joined).toLocaleDateString() : ''}</p>
                </div>
            )}

            <h2>Артефакты: ({myFinds.length})</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {myFinds.map(item => (
                    <div key={item.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ marginTop: 0, wordBreak: 'break-word' }}>{item.title}</h3>
                        <p style={{ fontSize: '0.9rem', color: '#666', margin: '5px 0' }}>№: <strong>{item.inv_number || 'В процессе'}</strong></p>
                        <p style={{ fontSize: '0.9rem', color: '#666', margin: '5px 0 15px 0' }}>Статус: {item.status}</p>
                        <Link to={`/catalog/${item.id}`} style={{ color: '#0066cc', textDecoration: 'none', fontWeight: 'bold' }}>
                            Подробнее →
                        </Link>
                    </div>
                ))}
            </div>

            {myFinds.length === 0 && (
                <p style={{ color: '#666', marginTop: '20px' }}>Вы еще ничего не откопали.</p>
            )}
        </div>
    );
};

export default Cabinet;