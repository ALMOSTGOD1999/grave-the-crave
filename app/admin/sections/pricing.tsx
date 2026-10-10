"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api, ApiError, type Product } from "@/lib/api";
import { Save } from "lucide-react";

export default function PricingSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { products } = await api.products();
      setProducts(products);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (
    product: Product,
    buyingPrice: number,
    profitPercent: number
  ) => {
    try {
      const { product: updated } = await api.updateProduct(product.id, {
        buyingPrice,
        profitPercent,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
      );
      toast.success(`Pricing saved for ${updated.name}`);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to save pricing"
      );
      load();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
        <p className="text-sm text-gray-600">
          Selling price = buying price + buying price × profit %.
        </p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-gray-500 py-8 text-center">Loading products...</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="w-32">Buying ₹</TableHead>
                  <TableHead className="w-32">Profit %</TableHead>
                  <TableHead className="w-32">Selling ₹</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <PricingRow
                    key={product.id}
                    product={product}
                    onSave={save}
                  />
                ))}
                {products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      No products yet — add them in the Stocks tab.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PricingRow({
  product,
  onSave,
}: {
  product: Product;
  onSave: (p: Product, buyingPrice: number, profitPercent: number) => Promise<void>;
}) {
  const [buyingPrice, setBuyingPrice] = useState(String(product.buyingPrice));
  const [profitPercent, setProfitPercent] = useState(String(product.profitPercent));
  const [saving, setSaving] = useState(false);

  const dirty =
    Number(buyingPrice) !== Number(product.buyingPrice) ||
    Number(profitPercent) !== Number(product.profitPercent);

  const previewSelling = (() => {
    const bp = Number(buyingPrice);
    const pct = Number(profitPercent);
    if (!Number.isFinite(bp) || !Number.isFinite(pct)) return null;
    return bp + (bp * pct) / 100;
  })();

  const save = async () => {
    setSaving(true);
    await onSave(product, Number(buyingPrice) || 0, Number(profitPercent) || 0);
    setSaving(false);
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell>
        <Input
          type="number"
          min={0}
          step="0.01"
          value={buyingPrice}
          onChange={(e) => setBuyingPrice(e.target.value)}
          className="h-8"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min={0}
          step="0.1"
          value={profitPercent}
          onChange={(e) => setProfitPercent(e.target.value)}
          className="h-8"
        />
      </TableCell>
      <TableCell className="font-medium text-amber-600">
        {(dirty && previewSelling !== null
          ? previewSelling
          : product.sellingPrice
        ).toFixed(2)}
      </TableCell>
      <TableCell>
        <Button
          size="sm"
          variant={dirty ? "default" : "outline"}
          disabled={!dirty || saving}
          onClick={save}
          className={dirty ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}
        >
          <Save className="h-4 w-4 mr-1" />
          {saving ? "Saving..." : "Save"}
        </Button>
      </TableCell>
    </TableRow>
  );
}
