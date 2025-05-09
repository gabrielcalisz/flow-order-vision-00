
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Package, Truck, CheckCheck } from "lucide-react";

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <Package className="h-8 w-8 text-brand-500" />,
      title: "Cadastre seus Pedidos",
      description: "Registre facilmente informações de produtos e clientes.",
    },
    {
      icon: <Truck className="h-8 w-8 text-brand-500" />,
      title: "Acompanhe Entregas",
      description: "Visualize em tempo real a jornada dos seus envios.",
    },
    {
      icon: <CheckCheck className="h-8 w-8 text-brand-500" />,
      title: "Controle Completo",
      description: "Gerencie todas as etapas de envio em um só lugar.",
    },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 to-white/30 z-0" />
        <div className="container px-4 mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Acompanhe seus pedidos com <span className="text-brand-500">clareza</span> e <span className="text-brand-500">precisão</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                Plataforma moderna para cadastrar, rastrear e gerenciar seus pedidos, com uma interface visual intuitiva.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate(user ? "/order/new" : "/login")}
                >
                  {user ? "Cadastrar Pedido" : "Começar Agora"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate(user ? "/orders" : "/login")}
                >
                  {user ? "Ver Meus Pedidos" : "Saiba Mais"}
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <img
                src="/lovable-uploads/048c0548-c909-453f-9fcc-95a63daf7f3e.png"
                alt="RastreioFlow"
                className="w-60 md:w-80 animate-pulse"
                style={{ animationDuration: '3s' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-muted/50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Funcionalidades Principais
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tudo o que você precisa para gerenciar seus pedidos do início ao fim.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-6 rounded-xl transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="mb-4 bg-brand-500/10 w-16 h-16 flex items-center justify-center rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-brand-500/20 to-brand-500/5">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Experimente a forma mais simples e visual de gerenciar seus pedidos.
          </p>
          <Button
            size="lg"
            onClick={() => navigate(user ? "/order/new" : "/login")}
          >
            {user ? "Cadastrar Pedido" : "Criar Conta Gratuita"}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
