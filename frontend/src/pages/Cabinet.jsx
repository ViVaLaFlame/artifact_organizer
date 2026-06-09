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
        <div style={{ maxWidth: '1000px', margin: '30px auto' }}>
            <h1>Моя яма</h1>

            {user && (
                <div style={{ backgroundClip: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                    <h3>Это я</h3>
                    <p><strong>Зовут:</strong>{user.username}</p>
                    <p><strong>Почта:</strong>{user.email}</p>
                    <p><strong>Дата регистрации:</strong>{user.date_joined}</p>
                </div>
            )}

            <h2>Непонятные штуки что я выкопал, всего: ({myFinds.length})</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {myFinds.map(item => (
                    <div key={item.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ marginTop: 0 }}>{item.title}</h3>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>№: <strong>{item.inv_number}</strong></p>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>Статус: {item.status}</p>
                        <Link to={`/catalog/${item.id}`} style={{ color: '#0066cc', textDecoration: 'none', fontWeight: 'bold' }}>
                            Подробнее →
                        </Link>
                    </div>
                ))}
            </div>

            {myFinds.length === 0 && (
                <p style={{ color: '#666' }}>Вы еще ничего не накопали</p>
            )}
        </div>
    );
};

export default Cabinet;