
import React from 'react';
import { Product } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Package, Image } from 'lucide-react';

interface ProductFormProps {
  product: Product;
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, setProduct }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    setProduct(prev => ({ ...prev, [name]: val }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setProduct(prev => ({
      ...prev,
      freeShipping: checked,
      shippingPrice: checked ? 0 : prev.shippingPrice,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProduct(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Dados do Produto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto</Label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="Nome do produto"
                required
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Imagem do Produto</Label>
            <div className="relative">
              <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="image"
                name="image"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="pl-9"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={product.quantity}
                onChange={handleChange}
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Preço (R$)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 font-bold text-muted-foreground">R$</span>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={product.price}
                onChange={handleChange}
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="shippingPrice">Frete (R$)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 font-bold text-muted-foreground">R$</span>
              <Input
                id="shippingPrice"
                name="shippingPrice"
                type="number"
                step="0.01"
                min="0"
                value={product.shippingPrice}
                onChange={handleChange}
                disabled={product.freeShipping}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="freeShipping"
            checked={product.freeShipping}
            onCheckedChange={handleSwitchChange}
          />
          <Label htmlFor="freeShipping">Frete Grátis</Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
