
import React, { useState } from 'react';
import { Tracking, TrackingStep, BrazilianCapital } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2, Truck, Package, MapPin } from 'lucide-react';
import { cn } from "@/lib/utils";
import StatusModal from './StatusModal';
import TrackingTimeline from './TrackingTimeline';

interface TrackingFormProps {
  tracking: Tracking;
  setTracking: React.Dispatch<React.SetStateAction<Tracking>>;
}

const TrackingForm: React.FC<TrackingFormProps> = ({ tracking, setTracking }) => {
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'trackingCode') {
      // Convert tracking code to uppercase
      setTracking(prev => ({ ...prev, [name]: value.toUpperCase() }));
    } else {
      setTracking(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setTracking(prev => ({ ...prev, estimatedDeliveryDate: date }));
  };

  const addTrackingStep = (newStep: TrackingStep) => {
    setTracking(prev => ({
      ...prev,
      steps: [...(prev.steps || []), newStep]
    }));
  };

  const removeTrackingStep = (index: number) => {
    setTracking(prev => ({
      ...prev,
      steps: prev.steps?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Informações de Rastreio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="trackingCode">Código de Rastreio</Label>
            <div className="relative">
              <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="trackingCode"
                name="trackingCode"
                value={tracking.trackingCode}
                onChange={handleChange}
                placeholder="BR1234567890"
                required
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Empresa de Entrega</Label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="company"
                name="company"
                value={tracking.company}
                onChange={handleChange}
                placeholder="Nome da transportadora"
                required
                className="pl-9"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Data Prevista de Entrega</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !tracking.estimatedDeliveryDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {tracking.estimatedDeliveryDate ? (
                  format(tracking.estimatedDeliveryDate, 'PP')
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
              <Calendar
                mode="single"
                selected={tracking.estimatedDeliveryDate}
                onSelect={handleDateChange}
                initialFocus
                disabled={(date) => date < new Date()}
                className="p-3"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Tracking Timeline */}
        {tracking.steps && tracking.steps.length > 0 && (
          <div className="space-y-4">
            <Label>Atualizações de Rastreio</Label>
            <div className="border rounded-md p-4">
              <TrackingTimeline steps={tracking.steps} />

              <div className="mt-4">
                {tracking.steps.map((step, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-t">
                    <div className="text-sm">
                      {(() => {
                        switch (step.type) {
                          case 'processed':
                            return 'Pedido Processado';
                          case 'forwarded':
                            return `Encaminhado para ${step.city}`;
                          case 'inTransit':
                            return `Em trânsito de ${step.origin} para ${step.destination}`;
                          case 'cancelled':
                            return 'Pedido Cancelado';
                          case 'outForDelivery':
                            return `Saiu para entrega em ${step.city}`;
                          case 'delivered':
                            return 'Entregue';
                          default:
                            return '';
                        }
                      })()}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTrackingStep(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add New Tracking Step Button */}
        <div className="border rounded-md p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Adicionar Atualização</h3>
          </div>
          <div className="mt-4">
            <Button 
              onClick={() => setStatusModalOpen(true)}
              className="w-full"
              type="button"
            >
              <Plus className="mr-2 h-4 w-4" /> Adicionar Status de Rastreio
            </Button>
          </div>
        </div>

        {/* Status Modal */}
        <StatusModal 
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          onAddStatus={addTrackingStep}
        />
      </CardContent>
    </Card>
  );
};

export default TrackingForm;
