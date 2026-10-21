import { useState, useEffect } from "react";
import { getLiveCart } from "@/lib/shopifyFetch";
import { useCart } from "./CartContext";
import { LiveCartResponseType } from "@/types/shopifyTypes";
import Image from "next/image";
import Link from "next/link";
import ieBlackLogo from "~/public/images/black-ie-logo.png";
import { BsFillTrash2Fill } from "react-icons/bs";
import { formatPrice } from "@/lib/utils";


export default function Cart({liveCartId, isOpen, setIsOpen}: {liveCartId: string | null; isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;}) {
  const {cartData, loading, removeItem, updateQuantity} = useCart();

  const allCartItems = cartData?.lines?.edges || [];

  useEffect(() => {
    if(isOpen) {
      document.getElementById("exit-cart")?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if(isOpen && allCartItems.length === 0) {
      document.getElementById("exit-cart")?.focus();
    }
  }, [allCartItems.length, isOpen]);
  
  const displayItems = allCartItems?.map((item) => {
    const node = item?.node;
    const imageUrl = node?.merchandise?.image?.url || ieBlackLogo;
    const imageAlt = node?.merchandise?.image?.altText || "Product Image";
    const preOrderPlanName = node?.sellingPlanAllocation?.sellingPlan?.name;
    const itemTitle = node.merchandise.product.title;
    const itemVariant = node.merchandise.title;

    return(
      <div className="cart-item-container" key={item.node.id}>
        <div className="remove-item-container">
          <button
            type="button"
            className="remove-item-btn" 
            onClick={() => removeItem(item.node.id)}
            aria-label={`Remove ${itemTitle} (${itemVariant}) from cart`}
          >
            <BsFillTrash2Fill className="remove-item-icon" aria-hidden="true"/>
          </button>
        </div>
        <div className="cart-item-image-container">
          <Image 
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="cart-item-image"
          />
        </div>
        <div className="cart-item-info">
          <div className="cart-item-title-container">
            <p className="cart-item-title">{`${itemTitle}`} </p>
            <p className="cart-item-variant-title">{`(${itemVariant})`}</p>
            {preOrderPlanName && (
              <p className="pre-order-text">
                ✦ Pre-Order Item
              </p>
            )}
          </div>
          <div className="price-container">
            <p className="cart-item-price">
              <span className="sr-only">Total price:</span>
              {formatPrice(node.cost.totalAmount.amount, node.cost.totalAmount.currencyCode)}
            </p>
          </div>
          <div className="cart-item-quantity-container">
            <button 
              type="button"
              className="subtract-item-quantity"
              onClick={() => updateQuantity(item.node.id, node.quantity, "decrease")}
              aria-label={`Decrease quantity for ${itemTitle} (${itemVariant})`}
              disabled={loading}
            >
              -
            </button>
            <p className="cart-item-quantity">
              <span className="sr-only">Quantity:</span>
              {node.quantity}
            </p>
            <button 
              type="button"
              className="add-item-quantity"
              onClick={() => updateQuantity(item.node.id, node.quantity, "increase")}
              aria-label={`Increase quantity for ${itemTitle} (${itemVariant})`}
              disabled={loading}
            >
              +
            </button>
          </div>
        </div>
      </div>
    )
  });

  const subtotal = cartData?.cost.totalAmount;

  return(
    <div 
      className={`cart ${isOpen ? "active" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
      aria-hidden={!isOpen}
      inert={!isOpen}
      aria-busy={loading}
    >
      <div className="exit-cart-container">
        <button 
          type="button"
          id="exit-cart"
          onClick={() => setIsOpen(false)}
          aria-label="Close cart drawer"
        >
          x
        </button>
      </div>
      <h3 className="cart-header">Your Cart</h3>

      {!liveCartId || allCartItems.length === 0 ? 
        <div className="empty-cart-container">
          <p className="empty-cart-message">Cart is empty</p>
        </div>
       : 
        <div className="cart-items-container">
          {displayItems}
        </div>
      }

      {liveCartId && cartData?.checkoutUrl && allCartItems.length > 0 &&
        <div className="cart-totals-container">
          <div className="subtotal-container">
            <h4 className="subtotal-header">Subtotal:</h4>
            <p className="subtotal">{subtotal ? formatPrice(subtotal.amount, subtotal.currencyCode): "$0.00"}</p>
            {/* <span className="currency-code">{subtotal?.currencyCode}</span> */}
          </div>
          <Link 
            href={`${cartData.checkoutUrl}&channel=headless-storefronts`}
            id="checkout-btn"
            role="button"
          >
            Checkout
          </Link>
        </div>
      }
    </div>
  )
}