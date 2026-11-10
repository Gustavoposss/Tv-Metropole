import { Button } from './ui';
import BarraSuperior from './layout/BarraSuperior';
import { IconePlay } from './layout/icones';
import LogoPossi from './layout/LogoPossi';
import MenuPrincipal from './layout/MenuPrincipal';
import NavegacaoInferior from './layout/NavegacaoInferior';

const Header = () => {
  return (
    <>
      <BarraSuperior />
      <header className="sticky top-0 z-40 border-b border-outline bg-surface-container/95 pt-[env(safe-area-inset-top)] shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:h-20 md:gap-6 md:px-6">
          <LogoPossi />
          <MenuPrincipal />
          <div className="hidden md:block">
            <Button to="/" variant="live" icon={<IconePlay />} className="shrink-0">
              Assistir 16.1 HD
            </Button>
          </div>
        </div>
      </header>
      <NavegacaoInferior />
    </>
  );
};

export default Header;
