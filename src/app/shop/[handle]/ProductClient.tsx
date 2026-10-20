"use client";
import { useState, useEffect, use, act } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { HiArrowLongLeft } from "react-icons/hi2";
import { ShopifyProductType, ShopifyVariantType } from "@/types/shopifyTypes";
import { notFound } from "next/navigation";
import { useCart } from "@/components/CartContext";
import AddToCartButton from "@/components/AddToCartButton";
import { formatPrice } from "@/lib/utils";

type SingleShopifyImageType = {
  node: {
    url: string;
    altText: string;
  }
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
    return(
      <div 
        className="variant-image-container" 
        key={index}
        onClick={() => setImageIndex(index)}
      >
        <Image 
          src={image.node.url}
          alt={image.node.altText}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="variant-images"
        />
      </div>
    )
  });

  const standardPrice = currentActiveVariant?.node?.price;
  const sellingPlans = currentActiveVariant?.node?.sellingPlanAllocations?.nodes || [];
  const activeSellingPlans = sellingPlans.find((a) => a.sellingPlan.id === selectedSellingPlanId);

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
        <HiArrowLongLeft className="back-to-icon"/>
        Back to shop
      </Link>

      <div className="product-container">
        <section className="product-info">
          <div className="product-title">
            <p>{title}</p>
          </div>
          <div className="product-price">
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
          <div className="product-variant-image-grid">
            {variantImages}
          </div>
        </div>
        <div className="product-page-btns">
          {hasMultipleSizes && <div className="sizes-container">
            <label htmlFor="select-sizes" className="sr-only">Select a size:</label>
            <select
              name="select-sizes"
              id="select-sizes" 
              className="sizes-dropdown"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option
                value=""
                disabled
              >
                Select a size: 
              </option>
              {selectSizes}
            </select>
            <IoMdArrowDropdown className="drop-arrow"/>
          </div>}

          {isOutOfStock && isSizeSelected && standardPrice && sellingPlans.length > 0 && (
            <div className="payment-options-selector">
              <p style={{ fontWeight: "600", fontSize: "0.9rem", textTransform: "uppercase" }}>
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
                    htmlFor="" 
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
                          {formatPrice(Number(standardPrice?.amount), standardPrice.currencyCode)}</span>
                        } 
                        <span>{formatPrice(Number(planPrice), standardPrice.currencyCode)}</span>
                      </span>

                      {/* Discount percent */}
                      {discountPrice && 
                        <span style={{ height: "1rem", fontSize: ".75rem", fontWeight: "bold", color: "#d97706"}}>
                          {`Save ${Number(standardPrice?.amount) / (Number(standardPrice?.amount) - Number(discountPrice))}%`}
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
            </div>
          )}
          
          {isOutOfStock && selectedSellingPlanId && (
            <p className="preorder-message">
              ✦ {activeSellingPlans?.sellingPlan?.description || "Item available via pre-order."}
            </p>
          )}
          
          <AddToCartButton 
            variantId={isSizeSelected ? currentActiveVariant?.node?.id : undefined}
            disabled={(hasMultipleSizes && !selectedSize) || (isOutOfStock && !selectedSellingPlanId)}
            sellingPlanId={selectedSellingPlanId || undefined}
          />

          
          <div className="product-description-container">
            <div 
              className="product-description-title"
              onClick={() => setIsTabOpen((prev) => !prev)}
            >
              <h3 className="product-description-header">Description</h3>
              {isTabOpen ? <IoMdArrowDropup className="accordian-drop-arrow"/> : <IoMdArrowDropdown className="accordian-drop-arrow"/>}
            </div>
            <div 
              className={`product-description ${!isTabOpen && "close"}`}
              dangerouslySetInnerHTML={{__html: description}}
            >
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}