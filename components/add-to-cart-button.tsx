"use client";

import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useState } from "react";

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

export default function AddToCartButton({
  productId,
  quantity = 1,
  className = "",
  size = "default",
  variant = "default",
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    addItem(productId, quantity);

    // Show feedback for a short time
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding}
      size={size}
      variant={variant}
      className={className}
    >
      <ShoppingBag className="h-4 w-4 mr-2" />
      {isAdding ? "Added!" : "Add to Cart"}
    </Button>
  );
}
