"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { HiArrowLongLeft } from "react-icons/hi2";
import { ShopifyProductType } from "@/types/shopifyTypes";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import { formatPrice } from "@/lib/utils";

type SingleShopifyImageType = {
  node: {
    url: string;
    altText: string;
  }
};

export type ShopifyMetafieldType = {
  type: string;
  value: string;
};

type ProductVariantType = {
  node: {
    id: string;
    title: string;
    availableForSale?: boolean | null;
    quantityAvailable?: number;
    price: {
      amount: string;
      currencyCode: string;
    };
    shippingMessage?: ShopifyMetafieldType | null;
    sellingPlanAllocations?: {
      nodes:
        Array<{
          checkoutChargeAmount: {
            amount: string;
            currencyCode: string;
          } | null;
          priceAdjustments: Array<{
            price: {
              amount: string;
              currencyCode: string;
            }
          }>;
          sellingPlan: {
            id: string;
            name: string;
            description: string | null;
          }
        }>
    }
  }
}

export default function ProductClient({ product }: ShopifyProductType) {
  if(!product) {
    notFound();
  };

  const [imageIndex, setImageIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isTabOpen, setIsTabOpen] = useState<boolean>(true);
  const [selectedSellingPlanId, setSelectedSellingPlanId] = useState<string | null>(null);
  
  const title = product.title;
  const description = product.descriptionHtml;
  const mainProductImage = product.images?.edges[imageIndex]?.node;
  const variantList = (product.variants?.edges || []) as ProductVariantType[];
  const hasMultipleSizes = product.options[0]?.values && product.options[0].values.length > 0;
  
  const currentActiveVariant = variantList.find((edge) => edge.node.title === selectedSize) || variantList[0];
  const isSizeSelected = hasMultipleSizes ? selectedSize !== "" : true;
  
  const isOutOfStock = isSizeSelected && currentActiveVariant 
    ? !currentActiveVariant.node.availableForSale || (currentActiveVariant.node.quantityAvailable !== undefined && currentActiveVariant.node.quantityAvailable <= 0) 
    : false;
    
  // Create options for select size dropdown
  const selectSizes = variantList.map((variant: ProductVariantType, index: number) => {
    const option = variant?.node?.title;
    return(
      <option value={option} key={index}>
        {`Size: ${option}`}
      </option>
    )
  });

  // Create array of all images from product
  const variantImages = product.images.edges.map((image: SingleShopifyImageType, index: number) => {
    const isSelected = index === imageIndex;

    return(
      <button 
        className={`variant-image-container ${isSelected ? "active" : ""}`}
        key={index}
        onClick={() => setImageIndex(index)}
        aria-label={`View product image ${index + 1}`}
        aria-pressed={isSelected}
      >
        <Image 
          src={image.node.url}
          alt={image.node.altText || `Product thumbnail view ${index + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="variant-images"
        />
      </button>
    )
  });

  const standardPrice = currentActiveVariant?.node?.price;
  const sellingPlans = currentActiveVariant?.node?.sellingPlanAllocations?.nodes || [];
  const activeSellingPlans = sellingPlans.find((a) => a.sellingPlan.id === selectedSellingPlanId);
  const variantShippingMessage = currentActiveVariant?.node?.shippingMessage?.value;
  const productShippingMessage = product?.shippingMessage?.value;
  const shippingMessage = variantShippingMessage ?? productShippingMessage ?? "";
  
  let displayPriceAmount = standardPrice?.amount || "0";

  if (activeSellingPlans) {
    displayPriceAmount = 
      activeSellingPlans?.priceAdjustments?.[0]?.price?.amount ||
      standardPrice?.amount || "0";
  };

  useEffect(() => {
    if(isOutOfStock && sellingPlans.length > 0) {
      const planExists = sellingPlans.some((a) => a.sellingPlan.id === selectedSellingPlanId);

      if(!planExists) {
        setSelectedSellingPlanId(null);
      };
    } else {
      setSelectedSellingPlanId(null);
    }

  }, [sellingPlans, selectedSellingPlanId, isOutOfStock]);

  
  return(
    <main id="main-product-content">
      <Link
        href={"/shop"}
        className="back-to-link"
      >
        <HiArrowLongLeft className="back-to-icon" aria-hidden="true"/>
        Back to shop
      </Link>

      <div className="product-container">
        <section className="product-info">
          <h2 className="product-title">
            {title}
          </h2>
          <div className="product-price">
            <span className="sr-only">Price:</span>
            <p className="price-amount">{standardPrice ? formatPrice(Number(displayPriceAmount), standardPrice.currencyCode) : "$0.00"}</p>
          </div>
        </section>
        <div className="product-content-card-container">
          <div className="product-image-container">
            <Image 
              src={mainProductImage.url}
              alt={mainProductImage.altText}
              className="product-main-image"
              fill
              priority={true}
              loading="eager"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1600vw"
            />
          </div>
          <nav className="product-variant-image-grid" aria-label="Product thumbnail gallery">
            {variantImages}
          </nav>
        </div>
        <div className="product-page-btns">
          {hasMultipleSizes && 
            <div className="sizes-container">
              <label htmlFor="select-sizes" className="sr-only">Select a size:</label>
              <select
                name="select-sizes"
                id="select-sizes" 
                className="sizes-dropdown"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                onKeyDown={(e) => {
                  if(e.key === "Enter") {
                    e.preventDefault();
                    try {
                      e.currentTarget.showPicker();
                    } catch(err) {
                      e.currentTarget.dispatchEvent(new KeyboardEvent("keydown", {key: ' '}))
                    }
                  }
                }}
              >
                <option
                  value=""
                  disabled
                >
                  Select a size: 
                </option>
                {selectSizes}
              </select>
              <IoMdArrowDropdown className="drop-arrow" aria-hidden="true"/>
            </div>
          }

          {isOutOfStock && isSizeSelected && standardPrice && sellingPlans.length > 0 && (
            <fieldset className="payment-options-selector">
              <p role="legend" style={{ fontWeight: "600", fontSize: "0.9rem", textTransform: "uppercase" }}>
                Select Purchase Options:
              </p>

              {sellingPlans.map((sellingPlan) => {
                const plan = sellingPlan.sellingPlan;
                const depositPrice = sellingPlan?.checkoutChargeAmount?.amount;
                const discountPrice = sellingPlan?.priceAdjustments?.[0]?.price?.amount;
                
                const planPrice = 
                  depositPrice || discountPrice || standardPrice.amount || "0";
                  
                return(
                  <label
                    key={plan.id} 
                    className="payment-choice"
                  >
                    <input 
                      type="radio"
                      name="payment-choice"
                      value={plan.id}
                      checked={selectedSellingPlanId === plan.id}
                      onChange={() => setSelectedSellingPlanId(plan.id)}
                    />

                    
                    <div className="payment-choice-info-container">
                      {/* Plan name, price, and (if necessary) discounted price */}
                      <span style={{ display: "flex", gap: ".25rem", fontWeight: "bold", fontSize: "0.875rem" }}>
                        {`${plan.name}:`}
                        {discountPrice && 
                          <span style={{ textDecoration: "line-through", opacity: ".5", fontWeight: "normal" }}>
                          <span className="sr-only">Original price:</span>
                          {formatPrice(Number(standardPrice?.amount), standardPrice.currencyCode)}</span>
                        } 
                        <span>
                          <span className="sr-only">Plan price:</span>
                          {formatPrice(Number(planPrice), standardPrice.currencyCode)}
                        </span>
                      </span>

                      {/* Discount percent */}
                      {discountPrice && 
                        <span style={{ height: "1rem", fontSize: ".75rem", fontWeight: "bold", color: "#d97706"}}>
                          {`Save ${Math.round((1 - (Number(discountPrice) / Number(standardPrice?.amount))) * 100)}%`}
                        </span>
                      }

                      {/* Plan description */}
                      {plan.description && 
                        <p style={{ margin: 0, fontSize: ".75rem", opacity: 0.7 }}>
                          {plan.description}
                        </p>
                      }
                    </div>
                  </label>
                )
              })}
            </fieldset>
          )}
          
          {isOutOfStock && selectedSellingPlanId && (
            <p className="preorder-message" role="status" aria-live="polite">
              ✦ {activeSellingPlans?.sellingPlan?.description || "Item available via pre-order."}
            </p>
          )}
          
          {!!shippingMessage && isOutOfStock && selectedSellingPlanId && (
            <p className="shipping-message" role="status" aria-live="polite">
              {shippingMessage}
            </p>
          )}
          
          <AddToCartButton 
            variantId={isSizeSelected ? currentActiveVariant?.node?.id : undefined}
            disabled={(hasMultipleSizes && !selectedSize) || (isOutOfStock && !selectedSellingPlanId)}
            sellingPlanId={selectedSellingPlanId || undefined}
            isOutOfStock={isOutOfStock}
          />

          <div className="product-description-container">
            <button 
              type="button"
              className="product-description-title"
              onClick={() => setIsTabOpen((prev) => !prev)}
              aria-expanded={isTabOpen}
              aria-controls="product-description-panel"
            >
              <h3 className="product-description-header">Description</h3>
              {isTabOpen ? <IoMdArrowDropup className="accordian-drop-arrow" aria-hidden="true"/> : <IoMdArrowDropdown className="accordian-drop-arrow" aria-hidden="true"/>}
            </button>
            <div 
              id="product-description-panel"
              className={`product-description ${!isTabOpen ? "close" : ""}`}
              role="region"
              aria-hidden={!isTabOpen}
              dangerouslySetInnerHTML={{__html: description}}
            >
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}