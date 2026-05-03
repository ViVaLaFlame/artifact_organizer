import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import FindDetail from './pages/FindDetail';
import Login from './pages/Login';

function App() {
    return (
        <BrowserRouter>
            <Header />
            <div style={{ padding: '0 20px' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/catalog/:id" element={<FindDetail />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;