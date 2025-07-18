import React from 'react';
import { Settings, User, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y botón ofertas */}
          <div className="flex items-center space-x-6">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              style={{ transform: 'translateX(25px)' }}
              onClick={() => navigate('/')}
            >
              <img
                src="/lovable-uploads/6e9dc7bc-ac85-40d6-9e30-3e25368598c4.png"
                alt="Avianca"
                className="h-12 w-auto"
              />
            </div>
          </div>

          {/* Menú de navegación */}
          <nav
            className="hidden md:flex space-x-10 text-sm font-medium text-black"
            style={{ transform: 'translateX(-100px)' }}
          >
            <span
              className="cursor-pointer px-3 py-2 rounded hover:bg-[#da291c] hover:text-white transition"
              onClick={() => navigate('/destinos')}
            >
              Destinos
            </span>

            <div className="relative group px-3 py-2 rounded hover:bg-[#da291c] hover:text-white transition cursor-pointer">
              <div className="flex items-center space-x-1">
                <span>Servicios</span>
              </div>
            </div>
            <span
              className="cursor-pointer px-3 py-2 rounded hover:bg-[#da291c] hover:text-white transition"
              onClick={() => navigate('/checkin')}
            >
              Check-in
            </span>
            <span
              className="cursor-pointer px-3 py-2 rounded hover:bg-[#da291c] hover:text-white transition"
              onClick={() => navigate('/estado-vuelo')}
            >
              Estado del vuelo
            </span>
          </nav>

          {/* Controles de usuario */}
          {/* Botones visibles en escritorio, centrados en móvil */}
         <div className="flex items-center space-x-3 justify-end pr-4 md:pr-10 mt-4 md:mt-0">

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/cuenta')}
              className="text-gray-600 hover:text-gray-800 p-2"
              title="Mi cuenta"
            >
              <User className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin')}
              className="text-gray-600 hover:text-gray-800 p-2"
              title="Administrador"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
