
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Package, Search } from 'lucide-react';

const Index: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trackingCode, setTrackingCode] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingCode.trim()) {
      navigate(`/tracking?code=${trackingCode}`);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <div className="flex flex-col items-center justify-center text-center py-12">
        <img 
          src="/lovable-uploads/048c0548-c909-453f-9fcc-95a63daf7f3e.png" 
          alt="FastTracker Logo" 
          className="h-24 mb-6"
        />
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Sistema de Gerenciamento de Entregas
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          Plataforma completa para cadastro, gerenciamento e rastreamento de pedidos
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-12">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Rastreamento de Pedido</CardTitle>
              <CardDescription>
                Acompanhe seu pedido em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex space-x-2">
                <Input
                  placeholder="Digite o código de rastreio"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                />
                <Button type="submit">
                  <Search className="mr-2 h-4 w-4" />
                  Rastrear
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Área do Usuário</CardTitle>
              <CardDescription>
                {user ? "Gerencie seus pedidos" : "Acesse sua conta para gerenciar pedidos"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center pb-2">
              <Package className="h-16 w-16 text-primary" />
            </CardContent>
            <CardFooter className="flex justify-center pt-2">
              {user ? (
                <div className="space-x-4">
                  <Button onClick={() => navigate('/orders')}>
                    Meus Pedidos
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/order/new')}>
                    Novo Pedido
                  </Button>
                </div>
              ) : (
                <Button onClick={() => navigate('/login')}>
                  Login / Cadastro
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Cadastro Rápido</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Cadastre pedidos de forma simples e intuitiva, com todos os dados necessários.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Rastreio em Tempo Real</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Acompanhe cada etapa do envio com atualizações detalhadas da localização.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Compartilhamento</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Compartilhe facilmente links de rastreamento com seus clientes.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
