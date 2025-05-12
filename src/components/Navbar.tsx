import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronDown, Menu, Package, Plus } from 'lucide-react';
const Navbar: React.FC = () => {
  const {
    user,
    logout,
    isLoading
  } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  return <header className="sticky top-0 z-50 flex items-center h-16 px-4 md:px-6 w-full backdrop-blur-md bg-background/50 border-b">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center gap-2">
            <img alt="Logo" className="h-8 object-contain" src="/lovable-uploads/504e8cd6-db66-42f5-82aa-d26d2da4a099.png" />
            {/* Removido o texto FastTracker, mantendo apenas a logo */}
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          {user ? <>
              {isMobile ? <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/orders">Meus Pedidos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/order/new">Novo Pedido</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/tracking">Rastrear Pedido</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()}>
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> : <>
                  <Button variant="ghost" asChild>
                    <Link to="/orders">
                      <Package className="mr-2 h-4 w-4" />
                      Pedidos
                    </Link>
                  </Button>
                  
                  <Button variant="ghost" asChild>
                    <Link to="/tracking">
                      Rastrear
                    </Link>
                  </Button>
                  
                  <Button variant="default" className="hidden md:flex" asChild>
                    <Link to="/order/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Pedido
                    </Link>
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-1">
                        {user.name?.split(' ')[0] || user.email?.split('@')[0] || 'Usuário'}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem disabled>
                        {user.email}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => logout()}>
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>}
            </> : !isLoading && <Button variant="default" onClick={() => navigate('/login')} className="bg-sky-800 hover:bg-sky-700">Login</Button>}
        </div>
      </div>
    </header>;
};
export default Navbar;