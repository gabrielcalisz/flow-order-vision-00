
import React, { useState } from "react";
import { format } from "date-fns";
import { BrazilianCapital, Tracking, TrackingStep } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CalendarDays, Truck, Check, X, PackageCheck } from "lucide-react";
import TrackingTimeline from "./TrackingTimeline";

interface TrackingFormProps {
  tracking: Tracking;
  setTracking: (tracking: Tracking) => void;
}

const BRAZILIAN_CAPITALS: BrazilianCapital[] = [
  "São Paulo",
  "Rio de Janeiro",
  "Brasília",
  "Salvador",
  "Fortaleza",
  "Belo Horizonte",
  "Manaus",
  "Curitiba",
  "Recife",
  "Porto Alegre",
  "Belém",
  "Goiânia",
  "Florianópolis",
];

const TrackingForm: React.FC<TrackingFormProps> = ({ tracking, setTracking }) => {
  const [stepType, setStepType] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [originCity, setOriginCity] = useState<BrazilianCapital>("São Paulo");
  const [destCity, setDestCity] = useState<BrazilianCapital>("Rio de Janeiro");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Tracking
  ) => {
    setTracking({
      ...tracking,
      [field]: e.target.value,
    });
  };

  const addTrackingStep = () => {
    let newStep: TrackingStep | null = null;

    switch (stepType) {
      case "processed":
        newStep = { type: "processed" };
        break;
      case "forwarded":
        newStep = { type: "forwarded", city: city as BrazilianCapital };
        break;
      case "inTransit":
        newStep = {
          type: "inTransit",
          origin: originCity,
          destination: destCity,
        };
        break;
      case "cancelled":
        newStep = { type: "cancelled" };
        break;
      case "outForDelivery":
        newStep = { type: "outForDelivery", city };
        break;
      case "delivered":
        newStep = { type: "delivered" };
        break;
    }

    if (newStep) {
      setTracking({
        ...tracking,
        steps: [...tracking.steps, newStep],
      });
      setIsDialogOpen(false);
      setStepType("");
      setCity("");
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setTracking({
      ...tracking,
      estimatedDeliveryDate: date,
    });
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="bg-brand-500/10 p-3 rounded-full">
          <Truck className="h-6 w-6 text-brand-500" />
        </div>
        <div>
          <CardTitle>🚚 Rastreio</CardTitle>
          <CardDescription>Informações de rastreamento</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="trackingCode">🔢 Código do Rastreio</Label>
            <Input
              id="trackingCode"
              value={tracking.trackingCode}
              onChange={(e) => handleChange(e, "trackingCode")}
              placeholder="Código de rastreamento"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">🏢 Empresa do Rastreio</Label>
            <Input
              id="company"
              value={tracking.company}
              onChange={(e) => handleChange(e, "company")}
              placeholder="Empresa de entrega"
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>📈 Atualizações da Entrega</Label>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <span>Adicionar Etapa</span> <PackageCheck className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Etapa de Rastreio</DialogTitle>
                  <DialogDescription>
                    Selecione o tipo de atualização para adicionar à timeline.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="stepType">Tipo de Etapa</Label>
                    <Select value={stepType} onValueChange={setStepType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de etapa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="processed">✅ Pedido Processado</SelectItem>
                        <SelectItem value="forwarded">🏢 Pedido encaminhado para centro de distribuição</SelectItem>
                        <SelectItem value="inTransit">🚚 Pedido em trânsito para centro de distribuição</SelectItem>
                        <SelectItem value="outForDelivery">📬 Pedido saiu para entrega ao destinatário</SelectItem>
                        <SelectItem value="delivered">📦 Produto Entregue</SelectItem>
                        <SelectItem value="cancelled">❌ Pedido Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {stepType === "forwarded" && (
                    <div className="space-y-2">
                      <Label htmlFor="city">Selecione uma capital brasileira</Label>
                      <Select value={city} onValueChange={setCity}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma cidade" />
                        </SelectTrigger>
                        <SelectContent>
                          {BRAZILIAN_CAPITALS.map((capital) => (
                            <SelectItem key={capital} value={capital}>
                              {capital}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {stepType === "inTransit" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="originCity">Cidade de origem</Label>
                        <Select value={originCity} onValueChange={setOriginCity as (value: string) => void}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a cidade de origem" />
                          </SelectTrigger>
                          <SelectContent>
                            {BRAZILIAN_CAPITALS.map((capital) => (
                              <SelectItem key={capital} value={capital}>
                                {capital}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="destCity">Cidade de destino</Label>
                        <Select value={destCity} onValueChange={setDestCity as (value: string) => void}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a cidade de destino" />
                          </SelectTrigger>
                          <SelectContent>
                            {BRAZILIAN_CAPITALS.map((capital) => (
                              <SelectItem key={capital} value={capital}>
                                {capital}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {stepType === "outForDelivery" && (
                    <div className="space-y-2">
                      <Label htmlFor="cityDelivery">Cidade de entrega</Label>
                      <Input
                        id="cityDelivery"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Digite a cidade de entrega"
                        className="w-full"
                      />
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={addTrackingStep} disabled={!stepType || (stepType === "forwarded" && !city) || (stepType === "outForDelivery" && !city)}>
                    Adicionar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="border rounded-lg p-4 min-h-[200px] bg-background/50">
            {tracking.steps.length > 0 ? (
              <TrackingTimeline steps={tracking.steps} />
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                <PackageCheck className="h-10 w-10 mb-2" />
                <p>Adicione etapas para visualizar a timeline de rastreio.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="estimatedDate">📅 Data Prevista de Entrega</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !tracking.estimatedDeliveryDate && "text-muted-foreground"
                )}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                {tracking.estimatedDeliveryDate ? (
                  format(tracking.estimatedDeliveryDate, "dd/MM/yyyy")
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={tracking.estimatedDeliveryDate}
                onSelect={handleDateSelect}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackingForm;
