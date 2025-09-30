import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Programacao from './pages/Programacao';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/programacao" element={<Programacao />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
