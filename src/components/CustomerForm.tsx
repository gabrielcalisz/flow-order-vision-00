
import React from "react";
import { Customer } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "lucide-react";

interface CustomerFormProps {
  customer: Customer;
  setCustomer: (customer: Customer) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customer, setCustomer }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Customer
  ) => {
    setCustomer({
      ...customer,
      [field]: e.target.value,
    });
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="bg-brand-500/10 p-3 rounded-full">
          <User className="h-6 w-6 text-brand-500" />
        </div>
        <div>
          <CardTitle>👤 Cliente</CardTitle>
          <CardDescription>Informações do cliente</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nome</Label>
            <Input
              id="firstName"
              value={customer.firstName}
              onChange={(e) => handleChange(e, "firstName")}
              placeholder="Nome"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Sobrenome</Label>
            <Input
              id="lastName"
              value={customer.lastName}
              onChange={(e) => handleChange(e, "lastName")}
              placeholder="Sobrenome"
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={customer.phone}
              onChange={(e) => handleChange(e, "phone")}
              placeholder="(XX) XXXXX-XXXX"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              value={customer.cpf}
              onChange={(e) => handleChange(e, "cpf")}
              placeholder="XXX.XXX.XXX-XX"
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Endereço</Label>
          <Input
            id="address"
            value={customer.address}
            onChange={(e) => handleChange(e, "address")}
            placeholder="Rua, Número, Complemento"
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              value={customer.city}
              onChange={(e) => handleChange(e, "city")}
              placeholder="Cidade"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <Input
              id="state"
              value={customer.state}
              onChange={(e) => handleChange(e, "state")}
              placeholder="Estado"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zipCode">CEP</Label>
            <Input
              id="zipCode"
              value={customer.zipCode}
              onChange={(e) => handleChange(e, "zipCode")}
              placeholder="XXXXX-XXX"
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerForm;
