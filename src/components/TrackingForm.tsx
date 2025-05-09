
import React, { useState } from 'react';
import { Tracking, TrackingStep, BrazilianCapital } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TrackingTimeline from './TrackingTimeline';

interface TrackingFormProps {
  tracking: Tracking;
  setTracking: React.Dispatch<React.SetStateAction<Tracking>>;
}

const brazilianCapitals: BrazilianCapital[] = [
  "São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza",
  "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Porto Alegre",
  "Belém", "Goiânia", "Florianópolis"
];

const TrackingForm: React.FC<TrackingFormProps> = ({ tracking, setTracking }) => {
  const [statusType, setStatusType] = useState<string>('');
  const [cityOrigin, setCityOrigin] = useState<BrazilianCapital | ''>('');
  const [cityDestination, setCityDestination] = useState<BrazilianCapital | ''>('');
  const [deliveryCity, setDeliveryCity] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTracking(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setTracking(prev => ({ ...prev, estimatedDeliveryDate: date }));
  };

  const addTrackingStep = () => {
    if (!statusType) return;

    let newStep: TrackingStep;

    switch (statusType) {
      case 'processed':
        newStep = { type: 'processed' };
        break;
      case 'forwarded':
        if (!cityDestination) {
          alert('Selecione a cidade de destino');
          return;
        }
        newStep = { type: 'forwarded', city: cityDestination as BrazilianCapital };
        break;
      case 'inTransit':
        if (!cityOrigin || !cityDestination) {
          alert('Selecione as cidades de origem e destino');
          return;
        }
        newStep = { 
          type: 'inTransit', 
          origin: cityOrigin as BrazilianCapital, 
          destination: cityDestination as BrazilianCapital 
        };
        break;
      case 'cancelled':
        newStep = { type: 'cancelled' };
        break;
      case 'outForDelivery':
        if (!deliveryCity) {
          alert('Informe a cidade de entrega');
          return;
        }
        newStep = { type: 'outForDelivery', city: deliveryCity };
        break;
      case 'delivered':
        newStep = { type: 'delivered' };
        break;
      default:
        return;
    }

    setTracking(prev => ({
      ...prev,
      steps: [...(prev.steps || []), newStep]
    }));

    // Reset form
    setStatusType('');
    setCityOrigin('');
    setCityDestination('');
    setDeliveryCity('');
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
            <Input
              id="trackingCode"
              name="trackingCode"
              value={tracking.trackingCode}
              onChange={handleChange}
              placeholder="BR1234567890"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Empresa de Entrega</Label>
            <Input
              id="company"
              name="company"
              value={tracking.company}
              onChange={handleChange}
              placeholder="Nome da transportadora"
              required
            />
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
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={tracking.estimatedDeliveryDate}
                onSelect={handleDateChange}
                initialFocus
                disabled={(date) => date < new Date()}
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

        {/* Add New Tracking Step */}
        <div className="border rounded-md p-4">
          <h3 className="text-lg font-medium mb-4">Adicionar Atualização</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="statusType">Tipo de Status</Label>
              <Select value={statusType} onValueChange={(value: string) => setStatusType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="processed">Pedido Processado</SelectItem>
                    <SelectItem value="forwarded">Encaminhado para Centro de Distribuição</SelectItem>
                    <SelectItem value="inTransit">Em Trânsito</SelectItem>
                    <SelectItem value="cancelled">Pedido Cancelado</SelectItem>
                    <SelectItem value="outForDelivery">Saiu para Entrega</SelectItem>
                    <SelectItem value="delivered">Entregue</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {statusType === 'forwarded' && (
              <div className="space-y-2">
                <Label htmlFor="cityDestination">Capital de Destino</Label>
                <Select value={cityDestination} onValueChange={(value: BrazilianCapital) => setCityDestination(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a capital" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {brazilianCapitals.map((capital) => (
                        <SelectItem key={capital} value={capital}>
                          {capital}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

            {statusType === 'inTransit' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="cityOrigin">Capital de Origem</Label>
                  <Select value={cityOrigin} onValueChange={(value: BrazilianCapital) => setCityOrigin(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a capital de origem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {brazilianCapitals.map((capital) => (
                          <SelectItem key={capital} value={capital}>
                            {capital}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cityDestination">Capital de Destino</Label>
                  <Select value={cityDestination} onValueChange={(value: BrazilianCapital) => setCityDestination(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a capital de destino" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {brazilianCapitals.map((capital) => (
                          <SelectItem key={capital} value={capital}>
                            {capital}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {statusType === 'outForDelivery' && (
              <div className="space-y-2">
                <Label htmlFor="deliveryCity">Cidade de Entrega</Label>
                <Input
                  id="deliveryCity"
                  value={deliveryCity}
                  onChange={(e) => setDeliveryCity(e.target.value)}
                  placeholder="Cidade onde será entregue"
                />
              </div>
            )}

            <Button 
              onClick={addTrackingStep}
              className="w-full"
              type="button"
            >
              <Plus className="mr-2 h-4 w-4" /> Adicionar Atualização
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackingForm;
