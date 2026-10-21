"use client";
import { useState, useEffect } from "react";
import { useCart } from "./CartContext";

type AddToCartProps = {
  variantId: string | undefined;
  disabled?: boolean;
  sellingPlanId?: string;
  isOutOfStock?: boolean;
};

export default function AddToCartButton({ variantId, disabled, sellingPlanId, isOutOfStock}: AddToCartProps) {
  const {setIsCartOpen, addItem, loading} = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [success, setSucces] = useState(false);

  const isPreOrder = !!sellingPlanId;

  const handleAddToCartClick = async () => {
    if(!variantId) return;

    setIsAdding(true);
    try {
      await addItem(variantId, sellingPlanId);
      setSucces(true);
      setIsCartOpen(true);
      
      setTimeout(() => {
        setSucces(false);
      }, 2000);
    } catch(error) {
      console.error(error);
      alert("Failed to update cart session");
    } finally {
      setIsAdding(false);
    }
  };
  
  const getButtonText = () => {
    if(isAdding) return "Adding...";
    if(success) return isPreOrder ? "✓ Added to Cart" : "✓ Added!";
    if(disabled && !variantId) return "Select Option";
    if(disabled && isOutOfStock && !sellingPlanId) return "Select Option";
    if(disabled) return "Out of Stock";
    return isPreOrder ? "Pre-Order Now" : "Add to Cart";
  };

  return(
    <button 
      className={`add-to-cart ${success ? "bg-green-600" : ""}`}
      onClick={handleAddToCartClick}
      disabled={isAdding || disabled || !variantId}
      aria-live="polite"
    >
      {getButtonText()}
    </button>
  )
};