import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo-tv-metropole.png';

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-white shadow-lg border-b-2 border-green-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center py-3 md:py-4">
          {/* Logo e título - Clicável para Home */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 hover:opacity-80 transition-opacity group"
          >
            <img 
              src={logo} 
              alt="TV Metrópole" 
              className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 object-contain group-hover:scale-105 transition-transform"
            />
            <div className="hidden xs:block">
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-green-800 group-hover:text-green-600 transition-colors">
                TV Metrópole
              </h1>
              <p className="text-xs sm:text-sm text-green-600 hidden sm:block">
                Sua TV Digital
              </p>
            </div>
          </Link>

          {/* Botões de navegação */}
          <nav className="flex space-x-2 sm:space-x-3 md:space-x-4">
            <Link
              to="/"
              className={`px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm md:text-base ${
                location.pathname === '/'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
              }`}
            >
              <span className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-sm sm:text-base md:text-lg">📡</span>
                <span className="hidden sm:inline">Ao Vivo</span>
                <span className="sm:hidden">Live</span>
              </span>
            </Link>
            
            <Link
              to="/programacao"
              className={`px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm md:text-base ${
                location.pathname === '/programacao'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
              }`}
            >
              <span className="hidden sm:inline">Programação</span>
              <span className="sm:hidden">📅</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
