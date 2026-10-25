"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Trash2, Save, Plus, AlertTriangle } from "lucide-react";

export default function StocksSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlyLow, setOnlyLow] = useState(false);

  // New product form
  const [newName, setNewName] = useState("");
  const [newStock, setNewStock] = useState("0");
  const [newLimit, setNewLimit] = useState("0");
  const [adding, setAdding] = useState(false);

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

  const saveStock = async (product: Product, stockQty: number, lowStockLimit: number) => {
    try {
      const { product: updated } = await api.updateProduct(product.id, {
        stockQty,
        lowStockLimit,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
      );
      toast.success(`Saved ${updated.name}`);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to save"
      );
      load();
    }
  };

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const { product } = await api.createProduct({
        name: newName,
        stockQty: Number(newStock) || 0,
        lowStockLimit: Number(newLimit) || 0,
      });
      setProducts((prev) => [...prev, product].sort((a, b) => a.name.localeCompare(b.name)));
      toast.success(`Added ${product.name}`);
      setNewName("");
      setNewStock("0");
      setNewLimit("0");
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to add product"
      );
    } finally {
      setAdding(false);
    }
  };

  const remove = async (product: Product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    try {
      await api.deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      toast.success(`Deleted ${product.name}`);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to delete"
      );
    }
  };

  const visible = onlyLow ? products.filter((p) => p.isLowStock) : products;
  const lowCount = products.filter((p) => p.isLowStock).length;

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
        <CardTitle className="flex items-center gap-2">
          Stocks
          {lowCount > 0 && (
            <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {lowCount} low stock
            </Badge>
          )}
        </CardTitle>
        <Button
          variant={onlyLow ? "default" : "outline"}
          size="sm"
          onClick={() => setOnlyLow(!onlyLow)}
          className={onlyLow ? "bg-amber-500 hover:bg-amber-600 text-white" : "h-10 sm:h-8"}
        >
          {onlyLow ? "Showing low stock" : "Show low stock only"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <form
          onSubmit={addProduct}
          className="grid grid-cols-2 gap-3 items-end sm:flex sm:flex-wrap"
        >
          <div className="col-span-2 sm:flex-1 sm:min-w-[200px] space-y-1">
            <label className="text-sm font-medium">New product name</label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Chocolate sponge 1kg"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Stock</label>
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              className="w-full sm:w-28"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Low-stock at</label>
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              className="w-full sm:w-32"
            />
          </div>
          <Button
            type="submit"
            disabled={adding}
            className="col-span-2 sm:col-span-1 w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            {adding ? "Adding..." : "Add"}
          </Button>
        </form>

        {loading ? (
          <p className="text-gray-500 py-8 text-center">Loading products...</p>
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="w-28">Stock</TableHead>
                    <TableHead className="w-32">Low-stock at</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="w-40">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((product) => (
                    <StockRow
                      key={`${product.id}-${product.stockQty}-${product.lowStockLimit}`}
                      product={product}
                      onSave={saveStock}
                      onDelete={remove}
                    />
                  ))}
                  {visible.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                        No products match.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile: stacked cards instead of a horizontally scrolling table */}
            <div className="sm:hidden space-y-3">
              {visible.map((product) => (
                <StockCard
                  key={`${product.id}-${product.stockQty}-${product.lowStockLimit}`}
                  product={product}
                  onSave={saveStock}
                  onDelete={remove}
                />
              ))}
              {visible.length === 0 && (
                <p className="text-center text-gray-500 py-8">No products match.</p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function StockRow({
  product,
  onSave,
  onDelete,
}: {
  product: Product;
  onSave: (p: Product, stockQty: number, lowStockLimit: number) => Promise<void>;
  onDelete: (p: Product) => void;
}) {
  const [stock, setStock] = useState(String(product.stockQty));
  const [limit, setLimit] = useState(String(product.lowStockLimit));
  const [saving, setSaving] = useState(false);

  const dirty =
    Number(stock) !== Number(product.stockQty) ||
    Number(limit) !== Number(product.lowStockLimit);

  const save = async () => {
    setSaving(true);
    await onSave(product, Number(stock) || 0, Number(limit) || 0);
    setSaving(false);
  };

  return (
    <TableRow className={product.isLowStock ? "bg-red-50/50" : undefined}>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell>
        <Input
          type="number"
          min={0}
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="h-8"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min={0}
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          className="h-8"
        />
      </TableCell>
      <TableCell>
        {product.isLowStock ? (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Low</Badge>
        ) : (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            OK
          </Badge>
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
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
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700"
            onClick={() => onDelete(product)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

/**
 * Mobile variant of a stock row — stacked card with touch-sized controls.
 * Only rendered below the `sm` breakpoint (the table covers larger screens).
 */
function StockCard({
  product,
  onSave,
  onDelete,
}: {
  product: Product;
  onSave: (p: Product, stockQty: number, lowStockLimit: number) => Promise<void>;
  onDelete: (p: Product) => void;
}) {
  const [stock, setStock] = useState(String(product.stockQty));
  const [limit, setLimit] = useState(String(product.lowStockLimit));
  const [saving, setSaving] = useState(false);

  const dirty =
    Number(stock) !== Number(product.stockQty) ||
    Number(limit) !== Number(product.lowStockLimit);

  const save = async () => {
    setSaving(true);
    await onSave(product, Number(stock) || 0, Number(limit) || 0);
    setSaving(false);
  };

  return (
    <div
      className={`rounded-lg border p-3 ${
        product.isLowStock ? "border-red-100 bg-red-50/50" : "bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-sm leading-snug">{product.name}</p>
        {product.isLowStock ? (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 shrink-0">
            Low
          </Badge>
        ) : (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 shrink-0">
            OK
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Stock</label>
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="h-11"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Low-stock at</label>
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="h-11"
          />
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <Button
          size="sm"
          variant={dirty ? "default" : "outline"}
          disabled={!dirty || saving}
          onClick={save}
          className={`flex-1 h-11 ${
            dirty ? "bg-amber-500 hover:bg-amber-600 text-white" : ""
          }`}
        >
          <Save className="h-4 w-4 mr-1" />
          {saving ? "Saving..." : "Save"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-11 w-11 p-0 text-red-600 hover:text-red-700"
          onClick={() => onDelete(product)}
          aria-label={`Delete ${product.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
