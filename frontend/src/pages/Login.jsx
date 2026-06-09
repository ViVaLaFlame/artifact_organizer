import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true); 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (isLogin) {
                const response = await axios.post('/api/token/', {
                    username,
                    password
                });
                localStorage.setItem('accessToken', response.data.access);
                localStorage.setItem('refreshToken', response.data.refresh);

                navigate('/');
                window.location.reload();
            } else {
                await axios.post('api/register/', {
                    username,
                    password
                });
                
                setSuccess('Регистрация успешна! Теперь вы можете войти.');
                setIsLogin(true);
                setPassword('');
            }
        } catch (err) {
            console.error('Ошибка:', err);
            if (isLogin) {
                setError('Неверный логин или пароль.');
            } else {
                setError('Ошибка регистрации. Возможно, такое имя уже занято.');
            }
        }
    };

    return (
        <div style={{ maxWidth: '400px', width: '90%', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxSizing: 'border-box', fontFamily: 'sans-serif' }}>
            
            <h2 style={{ textAlign: 'center', marginTop: 0 }}>
                {isLogin ? 'Вход для археологов' : 'Регистрация'}
            </h2>
            
            {error && <p style={{ color: 'red', textAlign: 'center', margin: '10px 0' }}>{error}</p>}
            {success && <p style={{ color: 'green', textAlign: 'center', margin: '10px 0' }}>{success}</p>}
    
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Имя пользователя:</label>
                    <input 
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} 
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Пароль:</label>
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} 
                    />
                </div>
                <button type='submit' style={{ padding: '12px', backgroundColor: isLogin ? '#0066cc' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                    {isLogin ? 'Войти' : 'Зарегистрироваться'}
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button 
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                        setSuccess('');
                    }}
                    style={{ background: 'none', border: 'none', color: '#0066cc', textDecoration: 'underline', cursor: 'pointer', fontSize: '14px' }}
                >
                    {isLogin ? 'Нет аккаунта? Создать' : 'Уже есть аккаунт? Войти'}
                </button>
            </div>

        </div>
    );
};

export default Login;