
import React, { useState } from 'react';
import { Product } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface ProductFormProps {
  product: Product;
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, setProduct }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    typeof product.image === 'string' ? product.image : null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setProduct(prev => ({ 
        ...prev, 
        [name]: checked,
        // Auto-set shipping price to 0 if free shipping is checked
        ...(name === 'freeShipping' && checked ? { shippingPrice: 0 } : {})
      }));
    } else if (type === 'number') {
      setProduct(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProduct(prev => ({ ...prev, image: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Informações do Produto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Produto</Label>
          <Input
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Nome do produto"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={product.quantity}
                onChange={handleChange}
                placeholder="Quantidade"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Preço do Produto (R$)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={product.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shippingPrice">Valor do Frete (R$)</Label>
              <Input
                id="shippingPrice"
                name="shippingPrice"
                type="number"
                min="0"
                step="0.01"
                value={product.shippingPrice}
                onChange={handleChange}
                placeholder="0.00"
                disabled={product.freeShipping}
                required
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="freeShipping" 
                name="freeShipping"
                checked={product.freeShipping} 
                onCheckedChange={(checked) => 
                  setProduct(prev => ({ 
                    ...prev, 
                    freeShipping: !!checked,
                    shippingPrice: !!checked ? 0 : prev.shippingPrice
                  }))
                }
              />
              <Label htmlFor="freeShipping">Frete Grátis</Label>
            </div>
          </div>
          
          <div className="space-y-4">
            <Label>Imagem do Produto</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-48">
              {previewUrl ? (
                <div className="relative w-full h-full">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-contain"
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="absolute bottom-2 right-2"
                    onClick={() => {
                      setPreviewUrl(null);
                      setProduct(prev => ({ ...prev, image: undefined }));
                    }}
                  >
                    Remover
                  </Button>
                </div>
              ) : (
                <label htmlFor="productImage" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                  <Upload className="h-10 w-10 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Clique para fazer upload</span>
                  <Input
                    id="productImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
