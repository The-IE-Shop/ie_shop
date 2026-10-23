export type ShopifySeoType = {
  title: string | null;
  description: string | null;
};

export type ShopifyImageType = {
  url: string;
  altText: string;
};

export type ShopifyMetafieldType = {
  type: string;
  value: string;
};

export type ShopifyVariantType = {
  id: string;
  title: string;
  availableForSale?: boolean | null;
  quantityAvailable?: number;
  price: { 
    amount: string;
    currencyCode: string;
  };
  compareAtPrice?: {
    amount: string;
    currencyCode: string;
  } | null;
  sellingPlanAllocations?: {
   nodes: Array<{
    checkoutChargeAmount: {
      amount: string;
      currencyCode: string;
    }
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
  };
};


export type ShopifyProductType = {
  product: ShopifyProductFieldsType | null;
};

export type ShopifyProductFieldsType = {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  seo: ShopifySeoType;
  shippingMessage?: ShopifyMetafieldType | null;
  options: Array<{
    name: string;
    values: string[];
  }>;
  priceRange: {
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    }
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    }
  };
  images: {
    edges: Array<{ node: ShopifyImageType }>
  };
  variants: {
    edges: Array<{ node: ShopifyVariantType }>
  };
}

export type ShopifyCollectionType = {
  collection: {
    id: string;
    title: string;
    handle: string;
    description: string;
    products: {
      edges: Array<{ node: ShopifyProductFieldsType }>
    }
  } | null
}

export type ShopifyCartType = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    }
  }
  lines: {
    nodes: Array<{
      id: string;
      quantity: number;
      merchandise: {
        id: string;
        title: string;
        product: {
          title: string;
        }
      }
    }>
  }
};

export type ShopifyCartLineType = {
  id: string;
  merchandise: {
    id: string;
    title: string;
    image: {
      url: string;
      altText: string | null;
    } | null;
    price: {
      amount: string;
      currencyCode: string;
    };
    product: {
      title: string;
    };
  };
  sellingPlanAllocation?: {
    sellingPlan: {
      name: string;
      description: string | null;
    }
  } | null;
  quantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}

export type LiveCartResponseType = {
  checkoutUrl: string;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  lines: {
    edges: Array<{
      node: ShopifyCartLineType;
    }>
  };
}

export type ShopifyShopPolicyType = {
  id: string;
  title: string;
  body: string;
  url: string;
};

export type ShopifyLayoutFieldsType = {
  name: string;
  primaryDomain: {
    url: string;
  };
  termsOfService: ShopifyShopPolicyType | null;
  privacyPolicy: ShopifyShopPolicyType | null;
  refundPolicy: ShopifyShopPolicyType | null;
  shippingPolicy: ShopifyShopPolicyType | null;
};

export type ShopifyLayoutType = {
  shop: ShopifyLayoutFieldsType;
};