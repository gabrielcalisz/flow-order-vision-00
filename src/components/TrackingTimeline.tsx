
import React from 'react';
import { TrackingStep } from '@/types';
import { CheckCircle2, Circle, MapPin, PackageCheck, PackageX, Truck } from 'lucide-react';
import { cn } from "@/lib/utils";

interface TrackingTimelineProps {
  steps: TrackingStep[];
  simplified?: boolean;
}

const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ steps, simplified = false }) => {
  const sortedSteps = [...steps];

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

      <div className="space-y-8">
        {sortedSteps.map((step, index) => {
          let icon = <Circle />;
          let title = '';
          let description = '';
          let isCompleted = true;

          switch (step.type) {
            case 'processed':
              icon = <PackageCheck className="h-8 w-8 text-primary" />;
              title = 'Pedido Processado';
              description = 'Seu pedido foi processado e está sendo preparado';
              break;
            case 'forwarded':
              icon = <MapPin className="h-8 w-8 text-amber-500" />;
              title = 'Encaminhado';
              description = `Encaminhado para centro de distribuição em ${step.city}`;
              break;
            case 'inTransit':
              icon = <Truck className="h-8 w-8 text-blue-500" />;
              title = 'Em Trânsito';
              description = `Em trânsito de ${step.origin} para ${step.destination}`;
              break;
            case 'cancelled':
              icon = <PackageX className="h-8 w-8 text-destructive" />;
              title = 'Pedido Cancelado';
              description = 'Seu pedido foi cancelado';
              break;
            case 'outForDelivery':
              icon = <Truck className="h-8 w-8 text-blue-500" />;
              title = 'Saiu para Entrega';
              description = `Saiu para entrega em ${step.city}`;
              break;
            case 'delivered':
              icon = <CheckCircle2 className="h-8 w-8 text-green-500" />;
              title = 'Entregue';
              description = 'Seu pedido foi entregue com sucesso';
              break;
          }

          return (
            <div key={index} className="relative pl-10">
              <span className={cn(
                "absolute left-0 flex h-8 w-8 items-center justify-center", 
              )}>
                {icon}
              </span>

              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{title}</p>
                {!simplified && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackingTimeline;
