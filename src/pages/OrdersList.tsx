
import React from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Package, MoreHorizontal, PackageCheck, CheckCheck, X, Truck, Share, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const OrdersList: React.FC = () => {
  const navigate = useNavigate();
  const { orders, setCurrentOrder, deleteOrder } = useOrders();
  const { user } = useAuth();

  const handleEditOrder = (orderId: string) => {
    const orderToEdit = orders.find((order) => order.id === orderId);
    if (orderToEdit) {
      setCurrentOrder(orderToEdit);
      navigate("/order/edit");
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm("Tem certeza de que deseja excluir este pedido?")) {
      deleteOrder(orderId);
    }
  };
  
  const handleShareOrder = (trackingCode: string) => {
    const url = `${window.location.origin}/tracking?code=${trackingCode}`;
    navigator.clipboard.writeText(url);
    toast.success("Link de rastreamento copiado para a área de transferência!");
  };

  const handleSendToClient = (order: any) => {
    // Validações
    if (!order.customer.phone) {
      toast.error("Telefone do cliente não está preenchido!");
      return;
    }

    if (!order.tracking.trackingCode) {
      toast.error("Código de rastreio não está disponível!");
      return;
    }

    // Formatar o número de telefone (remover caracteres especiais)
    const phone = order.customer.phone.replace(/\D/g, '');
    
    // Validar se o telefone está em um formato válido
    if (!phone || phone.length < 10) {
      toast.error("Formato de telefone inválido. Verifique se contém DDD e número.");
      return;
    }
    
    // Construir a URL de compartilhamento
    const trackingUrl = `${window.location.origin}/tracking?code=${order.tracking.trackingCode}`;
    
    // Montar a mensagem
    const message = `Olá, seu pedido já está sendo preparado e separado para entrega! A OutletUrbano agradece a preferência. Segue seu código de rastreio: ${order.tracking.trackingCode.toUpperCase()}. Clique aqui para acompanhar seu pedido: ${trackingUrl} e saber mais detalhes.`;
    
    // Construir o link para o WhatsApp
    const whatsappLink = `https://api.whatsapp.com/send?phone=55${phone}&text=${encodeURIComponent(message)}`;
    
    // Abrir o link em uma nova janela
    window.open(whatsappLink, "_blank");
    
    toast.success("Mensagem preparada para envio via WhatsApp!");
  };

  const getStatusIcon = (order: any) => {
    const steps = order.tracking.steps;
    
    if (!steps || steps.length === 0) return <Package className="h-5 w-5 text-muted-foreground" />;
    
    const lastStep = steps[steps.length - 1];
    
    switch (lastStep.type) {
      case "delivered":
        return <CheckCheck className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <X className="h-5 w-5 text-red-500" />;
      case "outForDelivery":
        return <Truck className="h-5 w-5 text-blue-500" />;
      default:
        return <PackageCheck className="h-5 w-5 text-amber-500" />;
    }
  };

  const getStatusText = (order: any) => {
    const steps = order.tracking.steps;
    
    if (!steps || steps.length === 0) return "Aguardando processamento";
    
    const lastStep = steps[steps.length - 1];
    
    switch (lastStep.type) {
      case "processed":
        return "Processado";
      case "forwarded":
        return `Encaminhado para ${lastStep.city}`;
      case "inTransit":
        return `Em trânsito: ${lastStep.origin} → ${lastStep.destination}`;
      case "cancelled":
        return "Cancelado";
      case "outForDelivery":
        return `Saiu para entrega em ${lastStep.city}`;
      case "delivered":
        return "Entregue";
      default:
        return "Em processamento";
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Meus Pedidos</h1>
        <Button onClick={() => navigate("/order/new")} className="mt-4 md:mt-0">
          Novo Pedido
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Nenhum pedido encontrado</CardTitle>
            <CardDescription>
              Você ainda não possui pedidos cadastrados.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Clique no botão "Novo Pedido" para começar.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate("/order/new")}>Criar Pedido</Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Pedidos cadastrados</CardTitle>
            <CardDescription>
              Gerenciamento de todos os seus pedidos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Status</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Código de Rastreio</TableHead>
                    <TableHead className="hidden md:table-cell">Atualização</TableHead>
                    <TableHead className="text-right">Preço</TableHead>
                    <TableHead className="w-[100px] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {getStatusIcon(order)}
                      </TableCell>
                      <TableCell>
                        {order.customer.firstName} {order.customer.lastName}
                      </TableCell>
                      <TableCell>{order.product.name}</TableCell>
                      <TableCell>{order.tracking.trackingCode}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getStatusText(order)}
                      </TableCell>
                      <TableCell className="text-right">
                        R$ {order.product.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => navigate(`/tracking?code=${order.tracking.trackingCode}`)}
                            >
                              Ver Rastreio
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleShareOrder(order.tracking.trackingCode)}
                            >
                              <Share className="mr-2 h-4 w-4" />
                              Compartilhar Link
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleSendToClient(order)}
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Enviar para Cliente
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditOrder(order.id!)}
                            >
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteOrder(order.id!)}
                              className="text-destructive"
                            >
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrdersList;
