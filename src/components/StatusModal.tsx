
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BrazilianCapital, TrackingStep } from '@/types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  CheckCircle2, 
  Truck, 
  MapPin, 
  AlertTriangle,
  Package, 
  PackageCheck 
} from 'lucide-react';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStatus: (step: TrackingStep) => void;
}

const brazilianCapitals: BrazilianCapital[] = [
  "São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza",
  "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Porto Alegre",
  "Belém", "Goiânia", "Florianópolis"
];

const StatusModal: React.FC<StatusModalProps> = ({ isOpen, onClose, onAddStatus }) => {
  const [statusType, setStatusType] = useState<string>('');
  const [cityOrigin, setCityOrigin] = useState<BrazilianCapital | ''>('');
  const [cityDestination, setCityDestination] = useState<BrazilianCapital | ''>('');
  const [deliveryCity, setDeliveryCity] = useState<string>('');

  const resetForm = () => {
    setStatusType('');
    setCityOrigin('');
    setCityDestination('');
    setDeliveryCity('');
  };

  const handleSubmit = () => {
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

    onAddStatus(newStep);
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Status de Rastreio</DialogTitle>
          <DialogDescription>
            Selecione o tipo de status e preencha as informações necessárias
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="statusType">Tipo de Status</Label>
            <Select value={statusType} onValueChange={(value) => setStatusType(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo de status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="processed">
                    <div className="flex items-center">
                      <PackageCheck className="h-4 w-4 mr-2 text-primary" />
                      <span>Pedido Processado</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="forwarded">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-amber-500" />
                      <span>Encaminhado para Centro de Distribuição</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="inTransit">
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Em Trânsito</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="cancelled">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-destructive" />
                      <span>Pedido Cancelado</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="outForDelivery">
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Saiu para Entrega</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="delivered">
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      <span>Entregue</span>
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {statusType === 'forwarded' && (
            <div className="space-y-2">
              <Label htmlFor="cityDestination">Capital de Destino</Label>
              <Select 
                value={cityDestination} 
                onValueChange={(value) => setCityDestination(value as BrazilianCapital)}
              >
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
                <Select 
                  value={cityOrigin} 
                  onValueChange={(value) => setCityOrigin(value as BrazilianCapital)}
                >
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
                <Select 
                  value={cityDestination}
                  onValueChange={(value) => setCityDestination(value as BrazilianCapital)}
                >
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!statusType}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar à Linha do Tempo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StatusModal;
