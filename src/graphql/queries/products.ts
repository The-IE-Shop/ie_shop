export const GET_PRODUCT_QUERY = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      options {
        name
        values
      }
      images(first: 5) {
        edges {
          node { 
            url 
            altText 
          }
        }
      }
      priceRange {
        maxVariantPrice {
          amount
          currencyCode
        }
        minVariantPrice {
          amount
          currencyCode
        }
      }
      seo {
        title
        description
      }
      shippingMessage: metafield(
        namespace: "custom"
        key: "preorder_shipping_message"
      ) {
        type
        value
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            availableForSale
            quantityAvailable
            price { 
              amount 
              currencyCode 
            }
            shippingMessage: metafield(
              namespace: "custom"
              key: "preorder_shipping_message"
            ) {
              type
              value
            }
            sellingPlanAllocations(first: 5) {
              nodes {
                checkoutChargeAmount {
                  amount
                  currencyCode
                }
                priceAdjustments {
                  price {
                    amount
                    currencyCode
                  }
                }
                sellingPlan {
                  id
                  name
                  description
                }
              }
            }
          }
        }
      }
    }
  }
`;