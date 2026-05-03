import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('accessToken');
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/')
        window.location.reload();
    }
    return (
        <header style={{ padding: '20px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
            <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <strong style={{ fontSize: '1.5rem' }}>ArcheoDB</strong>
                </Link>
                <Link to={"/catalog"}>Каталог артефактов</Link>
            </nav>
            <div>
                {isAuthenticated ? (
                    <button onClick={handleLogout} style={{ padding: '5px 15px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}>
                        Выйти
                    </button>
                ) : (
                    <Link to="/login" style={{ padding: '5px 15px', textDecoration: 'none', backgroundColor: '#4CAF50', color: 'white', borderRadius: '4px' }} >
                        Войти
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;