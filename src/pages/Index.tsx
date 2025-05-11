import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Package, Search } from 'lucide-react';
const Index: React.FC = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [trackingCode, setTrackingCode] = React.useState('');
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingCode.trim()) {
      navigate(`/tracking?code=${trackingCode}`);
    }
  };
  return <div className="container max-w-6xl mx-auto py-12 px-4">
      <div className="flex flex-col items-center justify-center text-center py-12">
        <img src="/lovable-uploads/048c0548-c909-453f-9fcc-95a63daf7f3e.png" alt="Logo" className="h-24 mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Sistema de Entregas
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          Plataforma completa para rastreamento de pedidos
        </p>

        <div className="w-full max-w-4xl mb-12">
  <Card className="glass-card w-full">
            <CardHeader>
              <CardTitle>Rastreamento de Pedido</CardTitle>
              <CardDescription>
                Acompanhe seu pedido em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex space-x-2">
                <Input placeholder="Digite o código de rastreio" value={trackingCode} onChange={e => setTrackingCode(e.target.value)} />
                <Button type="submit" className="bg-sky-900 hover:bg-sky-800">
                  <Search className="mr-2 h-4 w-4" />
                  Rastrear
                </Button>
              </form>
            </CardContent>
          </Card>

         
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Consulta Rápida</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Encontre informações completas do seu pedido em poucos segundos.</p>
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
              <CardTitle>Histórico de Movimentações</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Veja todas as etapas que o pedido já percorreu, desde a postagem até a entrega.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};
export default Index;