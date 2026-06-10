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
            padding: '15px 20px', 
            borderBottom: '1px solid #ddd', 
            display: 'flex', 
            flexWrap: 'wrap',
            justifyContent: 'space-between', 
            alignItems: 'center',
            backgroundColor: '#fff',
            gap: '15px'
        }}>
            <nav style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '15px', 
                alignItems: 'center',
                flex: '1 1 auto' 
            }}>
                <Link to="/" style={{ textDecoration: 'none', color: '#2c3e50', marginRight: '10px' }}>
                    <strong style={{ fontSize: '1.5rem', letterSpacing: '1px' }}>ArcheoDB</strong>
                </Link>
                <Link to="/catalog" style={{ textDecoration: 'none', color: '#0066cc', fontWeight: '500' }}>
                    Каталог
                </Link>
                {isAuthenticated && (
                    <Link to={'/cabinet'} style={{ textDecoration: 'none', color: '#0066cc', fontWeight: '500'}}>
                      Личный кабинет
                    </Link>
                )}
            </nav>

            <div style={{ flexShrink: 0 }}>
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
                        display: 'inline-block',
                        padding: '8px 20px', 
                        textDecoration: 'none', 
                        backgroundColor: '#27ae60', 
                        color: 'white', 
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>
                        Войти
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;