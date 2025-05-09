
import React, { createContext, useContext, useState, useEffect } from "react";
import { Order } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  setCurrentOrder: (order: Order | null) => void;
  saveOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  deleteOrder: (orderId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load orders from localStorage when user changes
  useEffect(() => {
    if (user) {
      const storedOrders = localStorage.getItem("orders");
      if (storedOrders) {
        try {
          const parsedOrders = JSON.parse(storedOrders);
          // Filter orders by current user
          const userOrders = parsedOrders.filter((order: Order) => order.userId === user.id);
          setOrders(userOrders);
        } catch (error) {
          console.error("Failed to parse orders", error);
          setOrders([]);
        }
      } else {
        setOrders([]);
      }
    } else {
      setOrders([]);
    }
    setIsLoading(false);
  }, [user]);

  // Save orders to localStorage when they change
  useEffect(() => {
    if (user && orders.length > 0) {
      // Get all orders from localStorage
      const storedOrders = localStorage.getItem("orders");
      let allOrders: Order[] = [];
      
      if (storedOrders) {
        try {
          allOrders = JSON.parse(storedOrders);
          // Remove current user's orders
          allOrders = allOrders.filter((order: Order) => order.userId !== user.id);
        } catch (error) {
          console.error("Failed to parse orders", error);
        }
      }
      
      // Add current user's orders
      allOrders = [...allOrders, ...orders];
      localStorage.setItem("orders", JSON.stringify(allOrders));
    }
  }, [orders, user]);

  const saveOrder = (order: Order) => {
    if (!user) {
      toast.error("Você precisa estar logado para salvar pedidos.");
      return;
    }
    
    const newOrder: Order = {
      ...order,
      id: `order_${new Date().getTime()}`,
      userId: user.id,
      createdAt: new Date(),
    };
    
    setOrders([...orders, newOrder]);
    setCurrentOrder(newOrder);
    toast.success("Pedido salvo com sucesso!");
  };

  const updateOrder = (updatedOrder: Order) => {
    if (!updatedOrder.id) {
      toast.error("ID do pedido não encontrado.");
      return;
    }
    
    const updatedOrders = orders.map((order) =>
      order.id === updatedOrder.id ? updatedOrder : order
    );
    
    setOrders(updatedOrders);
    setCurrentOrder(updatedOrder);
    toast.success("Pedido atualizado com sucesso!");
  };

  const deleteOrder = (orderId: string) => {
    setOrders(orders.filter((order) => order.id !== orderId));
    if (currentOrder?.id === orderId) {
      setCurrentOrder(null);
    }
    toast.success("Pedido excluído com sucesso!");
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        isLoading,
        setCurrentOrder,
        saveOrder,
        updateOrder,
        deleteOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
