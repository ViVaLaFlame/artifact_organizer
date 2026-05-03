import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const FindDetail = () => {
    const { id } = useParams();
    const [find, setFind] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

	useEffect(() => {
		const fetchFindDetail = async () => {
			try {
				const response = await axios.get(`http://127.0.0.1:8000/api/finds/${id}/`);
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
		<div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 0' }}>
			<div style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#666' }}>
				<Link to={'/'} style={{ color: '#0066cc', textDecoration: 'none' }}>Главная</Link> /{' '}
				<Link to={'/catalog'} style={{ color: '#0066cc', textDecoration: 'none' }}>Каталог</Link> /{' '}
				<span>{find.inv_number}</span>
			</div>
			<div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
				<div style={{ flex: '1 1 300px' }}>
					<div style={{
						width: '100%',
						height: '300px',
						backgroundColor: '#eaeaea',
						borderRadius: '8px',
						display: 'flex',
						alignItems: 'center',
						color: '#888'
					}}>
						[Место для фотографии артефакта]
					</div>
				</div>
				<div style={{ flex: '2 1 400px' }}>
					<h1 style={{ marginTop: 0, marginBottom: '5px' }}>{find.title}</h1>
					<p style={{ color: '#555', fontSize: '1.1rem', marginTop: 0 }}>
						Инв. номер: <strong>{find.inv_number}</strong>
					</p>

					<div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
						<h3 style={{ marginTop: 0 }}>Паспорт находки</h3>
						<ul style={{ listStyleType: 'none', padding: 0, lineHeight: '1.8' }}>
							<li><strong>Памятник (Раскоп):</strong> {find.site_name || 'Не указан'}</li>
							<li><strong>Эпоха:</strong>{find.era_name || 'Не определена'}</li>
							{find.depth	&& <li><strong>Глубина:</strong> {find.depth} м</li>}
							{find.layer	&& <li><strong>Слой:</strong> {find.layer}</li>}
							{find.dimensiones && <li><strong>Размеры:</strong> {find.dimensiones}</li>}
							{find.weight && <li><strong>Вес:</strong> {find.weight} г</li>}
							<li><strong>Текущий статус:</strong> {find.status === 'field' ? 'В полевой лаборатории' : find.status}</li>
						</ul>
					</div>

					{find.description && (
						<div style={{ marginTop: '20px' }}>
							<h3>Описание:</h3>
							<p style={{ lineHeight: '1.6' }}>{find.description}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default FindDetail;