import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
          const response = await axios.post('http://127.0.0.1:8000/api/token/', {
              username,
              password
          });
          localStorage.setItem('accessToken', response.data.access);
          localStorage.setItem('refreshToken', response.data.refresh);

          navigate('/');
          window.location.reload();
        } catch (err) {
            console.error('Ошибка авторизации:', err)
            setError('Неверный логин или пароль.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Вход для архелогов</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
    
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Имя пользователя:</label>
                    <input 
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{width: '100%', padding: '8px', boxSizing: 'border-box' }} 
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Пароль:</label>
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{width: '100%', padding: '8px', boxSizing: 'border-box' }} 
                    />
                </div>
                <button type='submit' style={{ padding: '10px', backgroundColor: '#0066cc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Войти
                </button>
            </form>
        </div>
    );
};

export default Login;
