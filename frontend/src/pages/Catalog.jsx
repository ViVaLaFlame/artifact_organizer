import { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";


const Catalog = () => {
    const [finds, setFinds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFinds = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/finds/');
                setFinds(response.data.results || response.data);
                setLoading(false);
            } catch (error) {
                console.log("Ошибка при получении данных:", error)
            }
        };
        fetchFinds();
    }, []);
    if (loading) return <p>Загрузка...</p>

    return (
        <div>
            <h1>Каталог артефактов</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat (auto-fill, minmax(250px, 1fr))', gap: '20px'}}>
                {finds.map(item => (
                    <div key={item.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                        <h3>{item.title}</h3>
                        <p><strong>№:</strong> {item.inv_number}</p>
                        <p><strong>Эпоха:</strong>{item.era_name}</p>
                        <Link to={`/catalog/${item.id}`}>Подробнее</Link>
                    </div>
                ))}
            </div>
            {finds.length === 0 && <p>Находок пока нет</p>}
        </div>
    )
};

export default Catalog;