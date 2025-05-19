
import React, { createContext, useContext, useState, useEffect } from "react";
import { Order } from "@/types";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  setCurrentOrder: (order: Order | null) => void;
  saveOrder: (order: Order) => Promise<string>;
  updateOrder: (order: Order) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  fetchOrderByTrackingCode: (trackingCode: string) => Promise<Order | null>;
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

  // Fetch orders when user changes
  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('orders')
            .select('*, tracking_steps(*)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;

          if (data) {
            const formattedOrders: Order[] = data.map(order => ({
              id: order.id,
              userId: order.user_id,
              customer: {
                firstName: order.customer_first_name,
                lastName: order.customer_last_name,
                phone: order.customer_phone,
                cpf: order.customer_cpf,
                address: order.customer_address,
                city: order.customer_city,
                state: order.customer_state,
                zipCode: order.customer_zip_code,
              },
              product: {
                name: order.product_name,
                image: order.product_image_url,
                quantity: order.product_quantity,
                price: order.product_price,
                shippingPrice: order.shipping_price,
                freeShipping: order.free_shipping,
              },
              tracking: {
                trackingCode: order.tracking_code,
                company: order.tracking_company,
                estimatedDeliveryDate: order.estimated_delivery_date ? new Date(order.estimated_delivery_date) : undefined,
                steps: order.tracking_steps.map((step: any) => {
                  switch (step.status_type) {
                    case 'processed':
                      return { type: 'processed' as const };
                    case 'forwarded':
                      return { 
                        type: 'forwarded' as const, 
                        city: step.destination_city 
                      };
                    case 'inTransit':
                      return { 
                        type: 'inTransit' as const, 
                        origin: step.origin_city, 
                        destination: step.destination_city 
                      };
                    case 'cancelled':
                      return { type: 'cancelled' as const };
                    case 'outForDelivery':
                      return { 
                        type: 'outForDelivery' as const, 
                        city: step.delivery_city 
                      };
                    case 'delivered':
                      return { type: 'delivered' as const };
                    default:
                      return { type: 'processed' as const };
                  }
                }).sort((a: any, b: any) => {
                  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                }),
              },
              createdAt: new Date(order.created_at),
            }));
            
            setOrders(formattedOrders);
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
          toast.error("Falha ao carregar pedidos.");
        } finally {
          setIsLoading(false);
        }
      } else {
        setOrders([]);
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const fetchOrderByTrackingCode = async (trackingCode: string): Promise<Order | null> => {
    try {
      console.log("Fetching order with tracking code:", trackingCode);
      
      const { data, error } = await supabase
        .from('orders')
        .select('*, tracking_steps(*)')
        .ilike('tracking_code', trackingCode)
        .single();

      if (error) {
        console.error("Supabase error:", error);
        if (error.code === 'PGRST116') {
          // This is the "no rows returned" error code
          return null;
        }
        throw error;
      }

      console.log("Data returned from Supabase:", data);
      
      if (data) {
        const formattedOrder: Order = {
          id: data.id,
          userId: data.user_id,
          customer: {
            firstName: data.customer_first_name,
            lastName: data.customer_last_name,
            phone: data.customer_phone,
            cpf: data.customer_cpf,
            address: data.customer_address,
            city: data.customer_city,
            state: data.customer_state,
            zipCode: data.customer_zip_code,
          },
          product: {
            name: data.product_name,
            image: data.product_image_url,
            quantity: data.product_quantity,
            price: data.product_price,
            shippingPrice: data.shipping_price,
            freeShipping: data.free_shipping,
          },
          tracking: {
            trackingCode: data.tracking_code,
            company: data.tracking_company,
            estimatedDeliveryDate: data.estimated_delivery_date ? new Date(data.estimated_delivery_date) : undefined,
            steps: data.tracking_steps.map((step: any) => {
              switch (step.status_type) {
                case 'processed':
                  return { type: 'processed' as const };
                case 'forwarded':
                  return { 
                    type: 'forwarded' as const, 
                    city: step.destination_city 
                  };
                case 'inTransit':
                  return { 
                    type: 'inTransit' as const, 
                    origin: step.origin_city, 
                    destination: step.destination_city 
                  };
                case 'cancelled':
                  return { type: 'cancelled' as const };
                case 'outForDelivery':
                  return { 
                    type: 'outForDelivery' as const, 
                    city: step.delivery_city 
                  };
                case 'delivered':
                  return { type: 'delivered' as const };
                default:
                  return { type: 'processed' as const };
              }
            }).sort((a: any, b: any) => {
              return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            }),
          },
          createdAt: new Date(data.created_at),
        };
        
        return formattedOrder;
      }
      return null;
    } catch (error) {
      console.error("Error fetching order by tracking code:", error);
      throw error;
    }
  };

  const saveOrder = async (order: Order): Promise<string> => {
    if (!user) {
      toast.error("Você precisa estar logado para salvar pedidos.");
      throw new Error("User not authenticated");
    }
    
    try {
      // First, insert the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          customer_first_name: order.customer.firstName,
          customer_last_name: order.customer.lastName,
          customer_phone: order.customer.phone,
          customer_cpf: order.customer.cpf,
          customer_address: order.customer.address,
          customer_city: order.customer.city,
          customer_state: order.customer.state,
          customer_zip_code: order.customer.zipCode,
          product_name: order.product.name,
          product_image_url: typeof order.product.image === 'string' ? order.product.image : '',
          product_quantity: order.product.quantity,
          product_price: order.product.price,
          shipping_price: order.product.shippingPrice,
          free_shipping: order.product.freeShipping,
          tracking_code: order.tracking.trackingCode,
          tracking_company: order.tracking.company,
          estimated_delivery_date: order.tracking.estimatedDeliveryDate ? order.tracking.estimatedDeliveryDate.toISOString().split('T')[0] : null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Then, insert tracking steps if any exist
      if (order.tracking.steps && order.tracking.steps.length > 0) {
        const trackingStepsData = order.tracking.steps.map(step => {
          const baseStep = {
            order_id: orderData.id,
            status_type: step.type,
          };
          
          switch (step.type) {
            case 'forwarded':
              return { ...baseStep, destination_city: step.city };
            case 'inTransit':
              return { 
                ...baseStep, 
                origin_city: step.origin, 
                destination_city: step.destination 
              };
            case 'outForDelivery':
              return { ...baseStep, delivery_city: step.city };
            default:
              return baseStep;
          }
        });
        
        const { error: stepsError } = await supabase
          .from('tracking_steps')
          .insert(trackingStepsData);
        
        if (stepsError) throw stepsError;
      }
      
      // Upload image if it's a File object
      if (order.product.image instanceof File) {
        const fileExt = order.product.image.name.split('.').pop();
        const fileName = `${orderData.id}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, order.product.image);
        
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        
        // Update the order with the image URL
        const { error: updateError } = await supabase
          .from('orders')
          .update({ product_image_url: urlData.publicUrl })
          .eq('id', orderData.id);
        
        if (updateError) throw updateError;
      }
      
      toast.success("Pedido salvo com sucesso!");
      
      // Fetch the updated orders
      const { data: updatedData, error: fetchError } = await supabase
        .from('orders')
        .select('*, tracking_steps(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      if (updatedData) {
        const formattedOrders: Order[] = updatedData.map(order => ({
          id: order.id,
          userId: order.user_id,
          customer: {
            firstName: order.customer_first_name,
            lastName: order.customer_last_name,
            phone: order.customer_phone,
            cpf: order.customer_cpf,
            address: order.customer_address,
            city: order.customer_city,
            state: order.customer_state,
            zipCode: order.customer_zip_code,
          },
          product: {
            name: order.product_name,
            image: order.product_image_url,
            quantity: order.product_quantity,
            price: order.product_price,
            shippingPrice: order.shipping_price,
            freeShipping: order.free_shipping,
          },
          tracking: {
            trackingCode: order.tracking_code,
            company: order.tracking_company,
            estimatedDeliveryDate: order.estimated_delivery_date ? new Date(order.estimated_delivery_date) : undefined,
            steps: order.tracking_steps.map((step: any) => {
              switch (step.status_type) {
                case 'processed':
                  return { type: 'processed' as const };
                case 'forwarded':
                  return { 
                    type: 'forwarded' as const, 
                    city: step.destination_city 
                  };
                case 'inTransit':
                  return { 
                    type: 'inTransit' as const, 
                    origin: step.origin_city, 
                    destination: step.destination_city 
                  };
                case 'cancelled':
                  return { type: 'cancelled' as const };
                case 'outForDelivery':
                  return { 
                    type: 'outForDelivery' as const, 
                    city: step.delivery_city 
                  };
                case 'delivered':
                  return { type: 'delivered' as const };
                default:
                  return { type: 'processed' as const };
              }
            }).sort((a: any, b: any) => {
              return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            }),
          },
          createdAt: new Date(order.created_at),
        }));
        
        setOrders(formattedOrders);
        const newOrder = formattedOrders.find(o => o.id === orderData.id) || null;
        setCurrentOrder(newOrder);
      }
      
      return orderData.id;
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error("Falha ao salvar pedido.");
      throw error;
    }
  };

  const updateOrder = async (updatedOrder: Order): Promise<void> => {
    if (!updatedOrder.id) {
      toast.error("ID do pedido não encontrado.");
      throw new Error("Order ID not found");
    }
    
    try {
      // Update the order
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          customer_first_name: updatedOrder.customer.firstName,
          customer_last_name: updatedOrder.customer.lastName,
          customer_phone: updatedOrder.customer.phone,
          customer_cpf: updatedOrder.customer.cpf,
          customer_address: updatedOrder.customer.address,
          customer_city: updatedOrder.customer.city,
          customer_state: updatedOrder.customer.state,
          customer_zip_code: updatedOrder.customer.zipCode,
          product_name: updatedOrder.product.name,
          product_quantity: updatedOrder.product.quantity,
          product_price: updatedOrder.product.price,
          shipping_price: updatedOrder.product.shippingPrice,
          free_shipping: updatedOrder.product.freeShipping,
          tracking_code: updatedOrder.tracking.trackingCode,
          tracking_company: updatedOrder.tracking.company,
          estimated_delivery_date: updatedOrder.tracking.estimatedDeliveryDate ? updatedOrder.tracking.estimatedDeliveryDate.toISOString().split('T')[0] : null,
        })
        .eq('id', updatedOrder.id);
      
      if (orderError) throw orderError;

      // If there's a new image that is a File object
      if (updatedOrder.product.image instanceof File) {
        const fileExt = updatedOrder.product.image.name.split('.').pop();
        const fileName = `${updatedOrder.id}.${fileExt}`;
        
        // Upload the new image
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, updatedOrder.product.image, {
            upsert: true
          });
        
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        
        // Update the order with the new image URL
        const { error: updateError } = await supabase
          .from('orders')
          .update({ product_image_url: urlData.publicUrl })
          .eq('id', updatedOrder.id);
        
        if (updateError) throw updateError;
      }
      
      // Handle tracking steps updates
      if (updatedOrder.tracking.steps && updatedOrder.tracking.steps.length > 0) {
        // First, delete existing steps
        const { error: deleteError } = await supabase
          .from('tracking_steps')
          .delete()
          .eq('order_id', updatedOrder.id);
        
        if (deleteError) throw deleteError;
        
        // Then insert the updated steps
        const trackingStepsData = updatedOrder.tracking.steps.map(step => {
          const baseStep = {
            order_id: updatedOrder.id,
            status_type: step.type,
          };
          
          switch (step.type) {
            case 'forwarded':
              return { ...baseStep, destination_city: step.city };
            case 'inTransit':
              return { 
                ...baseStep, 
                origin_city: step.origin, 
                destination_city: step.destination 
              };
            case 'outForDelivery':
              return { ...baseStep, delivery_city: step.city };
            default:
              return baseStep;
          }
        });
        
        const { error: stepsError } = await supabase
          .from('tracking_steps')
          .insert(trackingStepsData);
        
        if (stepsError) throw stepsError;
      }
      
      toast.success("Pedido atualizado com sucesso!");
      
      // Fetch the updated orders
      const { data: updatedData, error: fetchError } = await supabase
        .from('orders')
        .select('*, tracking_steps(*)')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      if (updatedData) {
        const formattedOrders: Order[] = updatedData.map(order => ({
          id: order.id,
          userId: order.user_id,
          customer: {
            firstName: order.customer_first_name,
            lastName: order.customer_last_name,
            phone: order.customer_phone,
            cpf: order.customer_cpf,
            address: order.customer_address,
            city: order.customer_city,
            state: order.customer_state,
            zipCode: order.customer_zip_code,
          },
          product: {
            name: order.product_name,
            image: order.product_image_url,
            quantity: order.product_quantity,
            price: order.product_price,
            shippingPrice: order.shipping_price,
            freeShipping: order.free_shipping,
          },
          tracking: {
            trackingCode: order.tracking_code,
            company: order.tracking_company,
            estimatedDeliveryDate: order.estimated_delivery_date ? new Date(order.estimated_delivery_date) : undefined,
            steps: order.tracking_steps.map((step: any) => {
              switch (step.status_type) {
                case 'processed':
                  return { type: 'processed' as const };
                case 'forwarded':
                  return { 
                    type: 'forwarded' as const, 
                    city: step.destination_city 
                  };
                case 'inTransit':
                  return { 
                    type: 'inTransit' as const, 
                    origin: step.origin_city, 
                    destination: step.destination_city 
                  };
                case 'cancelled':
                  return { type: 'cancelled' as const };
                case 'outForDelivery':
                  return { 
                    type: 'outForDelivery' as const, 
                    city: step.delivery_city 
                  };
                case 'delivered':
                  return { type: 'delivered' as const };
                default:
                  return { type: 'processed' as const };
              }
            }).sort((a: any, b: any) => {
              return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            }),
          },
          createdAt: new Date(order.created_at),
        }));
        
        setOrders(formattedOrders);
        const updatedCurrentOrder = formattedOrders.find(o => o.id === updatedOrder.id) || null;
        setCurrentOrder(updatedCurrentOrder);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Falha ao atualizar pedido.");
      throw error;
    }
  };

  const deleteOrder = async (orderId: string): Promise<void> => {
    try {
      // Delete the order (cascade will delete tracking steps)
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);
      
      if (error) throw error;
      
      // Delete associated image if exists
      try {
        await supabase.storage
          .from('product-images')
          .remove([`${orderId}.jpg`, `${orderId}.jpeg`, `${orderId}.png`]);
      } catch (imageError) {
        // Just log the error as the image might not exist
        console.warn("Could not delete image, might not exist:", imageError);
      }
      
      setOrders(orders.filter((order) => order.id !== orderId));
      if (currentOrder?.id === orderId) {
        setCurrentOrder(null);
      }
      
      toast.success("Pedido excluído com sucesso!");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Falha ao excluir pedido.");
      throw error;
    }
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
        fetchOrderByTrackingCode,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
