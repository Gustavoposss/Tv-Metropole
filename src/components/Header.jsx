import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo-tv-metropole.png';

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-white shadow-lg border-b-2 border-green-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo e título */}
          <div className="flex items-center space-x-4">
            <img 
              src={logo} 
              alt="TV Metrópole" 
              className="h-16 w-16 md:h-20 md:w-20 object-contain"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-green-800">TV Metrópole</h1>
              <p className="text-xs md:text-sm text-green-600">Sua TV Digital</p>
            </div>
          </div>

          {/* Botões de navegação */}
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                location.pathname === '/'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg">📡</span>
                <span>Ao Vivo</span>
              </span>
            </Link>
            
            <Link
              to="/programacao"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                location.pathname === '/programacao'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
              }`}
            >
              Programação
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
