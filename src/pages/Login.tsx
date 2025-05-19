
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { login, register, isLoading, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/orders');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (isRegistering && password !== confirmPassword) {
      toast.error("As senhas não correspondem.");
      return;
    }

    try {
      if (isRegistering) {
        if (!name) {
          toast.error("Por favor, informe seu nome para registrar-se.");
          return;
        }
        await register(name, email, password);
        navigate("/orders");
      } else {
        await login(email, password);
        navigate("/orders");
      }
    } catch (error) {
      // Erro já tratado nos contextos
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="space-y-4 items-center text-center">
          <img 
            src="/lovable-uploads/504e8cd6-db66-42f5-82aa-d26d2da4a099.png" 
            alt="Logo" 
            className="h-16 mx-auto"
          />
          <CardTitle className="text-2xl">
            {isRegistering ? "Criar uma conta" : "Entrar"}
          </CardTitle>
          <CardDescription>
            {isRegistering
              ? "Crie sua conta para gerenciar seus pedidos"
              : "Entre na sua conta para gerenciar seus pedidos"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {isRegistering && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? "Processando..."
                : isRegistering
                ? "Registrar"
                : "Entrar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering
              ? "Já tem uma conta? Entre aqui"
              : "Não tem uma conta? Registre-se"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
