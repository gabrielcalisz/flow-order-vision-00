
import React from "react";
import { TrackingStep } from "@/types";
import { cn } from "@/lib/utils";
import { Check, PackageCheck, Truck, Building, X, Package } from "lucide-react";

interface TrackingTimelineProps {
  steps: TrackingStep[];
}

const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ steps }) => {
  const getStepIcon = (step: TrackingStep) => {
    switch (step.type) {
      case "processed":
        return <Check className="h-5 w-5 text-green-500" />;
      case "forwarded":
        return <Building className="h-5 w-5 text-blue-500" />;
      case "inTransit":
        return <Truck className="h-5 w-5 text-amber-500" />;
      case "outForDelivery":
        return <Package className="h-5 w-5 text-violet-500" />;
      case "delivered":
        return <PackageCheck className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Check className="h-5 w-5" />;
    }
  };

  const getStepTitle = (step: TrackingStep) => {
    switch (step.type) {
      case "processed":
        return "✅ Pedido Processado";
      case "forwarded":
        return `🏢 Pedido encaminhado para centro de distribuição em ${step.city}`;
      case "inTransit":
        return `🚚 Pedido em trânsito de ${step.origin} para ${step.destination}`;
      case "outForDelivery":
        return `📬 Pedido saiu para entrega em ${step.city}`;
      case "delivered":
        return "📦 Produto Entregue";
      case "cancelled":
        return "❌ Pedido Cancelado";
      default:
        return "Atualização de status";
    }
  };

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div 
          key={index} 
          className={cn(
            "timeline-container",
            index === steps.length - 1 && "border-l-dashed"
          )}
        >
          <span className="timeline-dot flex items-center justify-center bg-white">
            {getStepIcon(step)}
          </span>
          <div className="timeline-content">
            <p className="font-medium">{getStepTitle(step)}</p>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("pt-BR")} {/* Em uma app real, viria da API */}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackingTimeline;
