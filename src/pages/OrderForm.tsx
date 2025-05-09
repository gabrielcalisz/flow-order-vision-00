
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Customer, Order, Product, Tracking } from "@/types";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import CustomerForm from "@/components/CustomerForm";
import ProductForm from "@/components/ProductForm";
import TrackingForm from "@/components/TrackingForm";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const OrderForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentOrder, saveOrder, updateOrder } = useOrders();
  const { user } = useAuth();
  
  // Redireciona para login se não estiver autenticado
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const isEditMode = location.pathname === '/order/edit';
  
  // Inicializa o estado com os valores do pedido atual ou valores padrão
  const [customer, setCustomer] = useState<Customer>(
    currentOrder?.customer || {
      firstName: "",
      lastName: "",
      phone: "",
      cpf: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    }
  );

  const [product, setProduct] = useState<Product>(
    currentOrder?.product || {
      name: "",
      quantity: 1,
      price: 0,
      shippingPrice: 0,
      freeShipping: false,
    }
  );

  const [tracking, setTracking] = useState<Tracking>(
    currentOrder?.tracking || {
      trackingCode: "",
      company: "",
      steps: [],
    }
  );

  // Atualiza os formulários se currentOrder mudar
  useEffect(() => {
    if (isEditMode && currentOrder) {
      setCustomer(currentOrder.customer);
      setProduct(currentOrder.product);
      setTracking(currentOrder.tracking);
    }
  }, [currentOrder, isEditMode]);

  // Redireciona para orders se estiver em modo de edição mas não tiver pedido selecionado
  useEffect(() => {
    if (isEditMode && !currentOrder) {
      navigate('/orders');
    }
  }, [isEditMode, currentOrder, navigate]);

  const validateForm = () => {
    // Validação básica
    if (!customer.firstName || !customer.lastName) {
      toast.error("Por favor, informe o nome e sobrenome do cliente.");
      return false;
    }
    
    if (!product.name) {
      toast.error("Por favor, informe o nome do produto.");
      return false;
    }
    
    if (product.quantity <= 0) {
      toast.error("A quantidade do produto deve ser maior que zero.");
      return false;
    }
    
    if (!tracking.trackingCode) {
      toast.error("Por favor, informe o código de rastreio.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const order: Order = {
      customer,
      product,
      tracking,
      ...(currentOrder?.id && { id: currentOrder.id }),
    };

    try {
      if (isEditMode && currentOrder?.id) {
        await updateOrder(order);
      } else {
        await saveOrder(order);
      }
      navigate("/orders");
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Editar Pedido" : "Novo Pedido"}
        </h1>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Button variant="outline" onClick={() => navigate("/orders")}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {isEditMode ? "Atualizar Pedido" : "Salvar Pedido"}
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        <CustomerForm customer={customer} setCustomer={setCustomer} />
        <ProductForm product={product} setProduct={setProduct} />
        <TrackingForm tracking={tracking} setTracking={setTracking} />
      </div>
    </div>
  );
};

export default OrderForm;
