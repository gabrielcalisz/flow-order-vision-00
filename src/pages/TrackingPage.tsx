import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useOrders } from '@/contexts/OrderContext';
import { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import TrackingTimeline from '@/components/TrackingTimeline';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Package, Search, Calendar, Truck, MapPin, Phone, User } from 'lucide-react';
import { toast } from 'sonner';

const TrackingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { fetchOrderByTrackingCode } = useOrders();
  const [trackingCode, setTrackingCode] = useState((searchParams.get('code') || '').trim().toUpperCase());
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      const normalizedCode = code.trim().toUpperCase();
      setTrackingCode(normalizedCode);
      handleSearch(normalizedCode);
    }
  }, [searchParams]);

  const handleSearch = async (code?: string) => {
    const searchCode = code || trackingCode;
    if (!searchCode.trim()) {
      toast.error("Digite um código de rastreio");
      return;
    }

    const normalizedCode = searchCode.trim().toUpperCase();
    console.log("Normalized tracking code for search:", normalizedCode);

    setIsLoading(true);
    setSearchAttempted(true);
    
    try {
      console.log("Searching for tracking code:", normalizedCode);
      const foundOrder = await fetchOrderByTrackingCode(normalizedCode);
      console.log("Search result:", foundOrder);
      
      setOrder(foundOrder);
      if (!foundOrder) {
        toast.error("Pedido não encontrado");
      } else {
        toast.success("Pedido encontrado com sucesso!");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Erro ao buscar pedido");
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedCode = trackingCode.trim().toUpperCase();
    handleSearch();
    setSearchParams({ code: normalizedCode });
  };

  const getLastStatusText = () => {
    if (!order?.tracking.steps || order.tracking.steps.length === 0) {
      return "Aguardando processamento";
    }

    const lastStep = order.tracking.steps[order.tracking.steps.length - 1];
    switch (lastStep.type) {
      case "processed":
        return "Pedido Processado";
      case "forwarded":
        return `Encaminhado para ${lastStep.city}`;
      case "inTransit":
        return `Em trânsito de ${lastStep.origin} para ${lastStep.destination}`;
      case "cancelled":
        return "Pedido Cancelado";
      case "outForDelivery":
        return `Saiu para entrega em ${lastStep.city}`;
      case "delivered":
        return "Pedido Entregue";
      default:
        return "Em processamento";
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <img 
            src="/lovable-uploads/504e8cd6-db66-42f5-82aa-d26d2da4a099.png" 
            alt="Logo" 
            className="h-16 mb-4"
          />
          <h1 className="text-3xl font-bold mb-2">Rastreamento de Pedido</h1>
          <p className="text-muted-foreground">
            Acompanhe o status de entrega do seu pedido em tempo real
          </p>
        </div>

        <Card className="glass-card mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleFormSubmit} className="flex space-x-2">
              <div className="relative flex-grow">
                <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Digite o código de rastreio (ex: AB123BR)"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                  className="pl-9"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Buscando..." : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Rastrear
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {order ? (
          <div className="space-y-8">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">
                      {getLastStatusText()}
                    </CardTitle>
                    <CardDescription>
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 mr-1 text-muted-foreground" />
                        Código de Rastreio: {order.tracking.trackingCode}
                      </div>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Transportadora</p>
                    <p className="font-medium">{order.tracking.company}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Atualizações de Rastreio</h3>
                    {order.tracking.steps && order.tracking.steps.length > 0 ? (
                      <div className="border rounded-md p-4 bg-background/50">
                        <TrackingTimeline steps={order.tracking.steps} />
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Nenhuma atualização disponível</p>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Informações do Produto</h3>
                      <div className="border rounded-md p-4 bg-background/50">
                        <div className="flex gap-4">
                          {typeof order.product.image === 'string' && order.product.image ? (
                            <div className="w-24 h-24 shrink-0">
                              <img
                                src={order.product.image}
                                alt={order.product.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-24 h-24 shrink-0 bg-muted/30 rounded-md flex items-center justify-center">
                              <Package className="h-10 w-10 text-muted-foreground" />
                            </div>
                          )}

                          <div className="space-y-1 flex-grow">
                            <p className="font-medium">{order.product.name}</p>
                            <p className="text-sm">Quantidade: {order.product.quantity}</p>
                            <p className="font-medium">R$ {order.product.price.toFixed(2)}</p>
                            <p className="text-sm">
                              {order.product.freeShipping
                                ? "Frete Grátis"
                                : `Frete: R$ ${order.product.shippingPrice.toFixed(2)}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {order.tracking.estimatedDeliveryDate && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Previsão de Entrega</h3>
                        <div className="border rounded-md p-4 bg-background/50 flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <span>
                            {format(order.tracking.estimatedDeliveryDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-medium mb-2">Destinatário</h3>
                      <div className="border rounded-md p-4 bg-background/50">
                        <div className="flex items-center mb-1">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p className="font-medium">{order.customer.firstName} {order.customer.lastName}</p>
                        </div>
                        <div className="flex items-center mb-1">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">{order.customer.address}</p>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground opacity-0" />
                          <p className="text-sm text-muted-foreground">
                            {order.customer.city}, {order.customer.state} - {order.customer.zipCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : searchAttempted ? (
          <Card className="text-center py-12">
            <CardContent className="flex flex-col items-center justify-center">
              <Truck className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Pedido não encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Não foi possível encontrar um pedido com o código de rastreio fornecido.
              </p>
              <p className="text-sm text-muted-foreground">
                Verifique se o código foi digitado corretamente e tente novamente.
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

export default TrackingPage;
