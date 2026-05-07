import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('accessToken');

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/');
        window.location.reload();
    };

    return (
        <header style={{ 
            padding: '15px 30px', 
            borderBottom: '1px solid #ddd', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            backgroundColor: '#fff'
        }}>
            <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none', color: '#2c3e50' }}>
                    <strong style={{ fontSize: '1.6rem', letterSpacing: '1px' }}>ArcheoDB</strong>
                </Link>
                <Link to="/catalog" style={{ textDecoration: 'none', color: '#555', fontWeight: '500' }}>
                    Каталог
                </Link>
            </nav>

            <div>
                {isAuthenticated ? (
                    <button onClick={handleLogout} style={{ 
                        padding: '8px 20px', 
                        cursor: 'pointer', 
                        backgroundColor: '#e74c3c', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        fontWeight: 'bold'
                    }}>
                        Выйти
                    </button>
                ) : (
                    <Link to="/login" style={{ 
                        padding: '8px 20px', 
                        textDecoration: 'none', 
                        backgroundColor: '#27ae60', 
                        color: 'white', 
                        borderRadius: '4px',
                        fontWeight: 'bold'
                    }}>
                        Войти
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;