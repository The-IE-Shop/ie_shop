import Image from "next/image";
import Link from "next/link";
import BannerCarousel from "./components/BannerCarousel";
import { shopifyFetch } from "@/lib/shopifyFetch";
import { ShopifyCollectionType } from "@/types/shopifyTypes";
import { GET_SHOP_COLLECTION } from "@/graphql/queries/shop";
import { formatPrice } from "@/lib/utils";

interface Props {
  params: Promise<{ handle: string }>;
}

export default async function ShopPage() {

  const handle = "hats";

  const response = await shopifyFetch<ShopifyCollectionType>({
    query: GET_SHOP_COLLECTION,
    variables: { handle }
  });

  const collection = response?.data?.collection?.products.edges;

  const allHats = collection?.map((hat) => {
    const title = hat.node.title;
    const images = hat.node.images.edges[0].node;
    const price = hat.node.priceRange.maxVariantPrice;
    const productLink = hat.node.handle;

    const isPreOrderProduct = hat.node.variants.edges.some((variantEdge) => {
      const variant = variantEdge.node;
      const isOutOfStock = !variant.availableForSale || (variant.quantityAvailable !== undefined && variant.quantityAvailable <= 0);
      const hasPreOrderPlan = (variant.sellingPlanAllocations?.nodes?.length ?? 0) > 0;
      return isOutOfStock && hasPreOrderPlan;
    });
    
    return(
      <div
        className="shop-hat-container" 
        key={hat.node.id}
      >
        <Link
          href={`shop/${productLink}`}
          className="shop-hat-image-container"
        >
          {
            isPreOrderProduct && (
              <div style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: '#d97706', color: '#fff', padding: '4px 8px', fontSize: '11px', fontWeight: 'bold', zIndex: 9, borderRadius: '4px' }}>
                Pre-Order
              </div>
            )
          }
          <Image
            src={images.url}
            alt={images.altText}
            className="shop-hat-images"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1600px"
          />
        </Link>
        <Link 
          href={`shop/${productLink}`}
          className="shop-hat-info"
        >
          <span className="shop-hat-title">
            {title}
          </span>
          <span className="shop-hat-price">
            {formatPrice(price.amount, price.currencyCode)}
          </span>
        </Link>
      </div>
    )
  });

  return(
    <main>
      <div className="shop-banner">
        <BannerCarousel autoSlide={10000}/>
      </div>
      <section className="shop-hat-section">
        <h3 className="shop-headline">
          Place your Pre-Order now
        </h3>
        <div className="shop-hat-grid-container">
          {allHats}
        </div>
      </section>
    </main>
  )
}