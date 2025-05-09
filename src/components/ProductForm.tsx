
import React, { useRef } from "react";
import { Product } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductFormProps {
  product: Product;
  setProduct: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, setProduct }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Product
  ) => {
    if (field === "price" || field === "shippingPrice" || field === "quantity") {
      setProduct({
        ...product,
        [field]: parseFloat(e.target.value) || 0,
      });
    } else {
      setProduct({
        ...product,
        [field]: e.target.value,
      });
    }
  };

  const handleCheckbox = (checked: boolean) => {
    setProduct({
      ...product,
      freeShipping: checked,
      shippingPrice: checked ? 0 : product.shippingPrice,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProduct({
        ...product,
        image: file,
      });
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="bg-brand-500/10 p-3 rounded-full">
          <Package className="h-6 w-6 text-brand-500" />
        </div>
        <div>
          <CardTitle>🛍️ Produto</CardTitle>
          <CardDescription>Detalhes do produto</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Produto</Label>
          <Input
            id="name"
            value={product.name}
            onChange={(e) => handleChange(e, "name")}
            placeholder="Nome do produto"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label>📷 Upload de Foto do Produto</Label>
          <div 
            className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={handleImageClick}
          >
            {product.image ? (
              typeof product.image === "string" ? (
                <img 
                  src={product.image} 
                  alt="Produto" 
                  className="max-h-40 object-contain mb-2" 
                />
              ) : (
                <img 
                  src={URL.createObjectURL(product.image as File)} 
                  alt="Produto" 
                  className="max-h-40 object-contain mb-2" 
                />
              )
            ) : (
              <Image className="h-10 w-10 text-muted-foreground mb-2" />
            )}
            <span className="text-sm text-muted-foreground">
              {product.image ? "Clique para trocar a imagem" : "Clique para fazer upload"}
            </span>
            <Input
              id="image"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade do Produto</Label>
            <Input
              id="quantity"
              type="number"
              value={product.quantity.toString()}
              onChange={(e) => handleChange(e, "quantity")}
              placeholder="0"
              min="1"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Preço do Produto (R$)</Label>
            <Input
              id="price"
              type="number"
              value={product.price.toString()}
              onChange={(e) => handleChange(e, "price")}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="shippingPrice">Valor do Frete Pago (R$)</Label>
            <Input
              id="shippingPrice"
              type="number"
              value={product.shippingPrice.toString()}
              onChange={(e) => handleChange(e, "shippingPrice")}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full"
              disabled={product.freeShipping}
            />
          </div>
          <div className="flex items-center space-x-2 mt-8">
            <Checkbox
              id="freeShipping"
              checked={product.freeShipping}
              onCheckedChange={handleCheckbox}
            />
            <Label htmlFor="freeShipping" className="font-normal cursor-pointer">
              Frete Grátis
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
