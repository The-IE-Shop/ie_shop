import React from "react";
import { getShopLayoutData } from "@/lib/shopifyFetch";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    policyHandle: string;
  }>
}
export default async function PrivacyPolicy({ params }: Props): Promise<React.JSX.Element> {
  const { policyHandle } = await params;
  const shopData = await getShopLayoutData();

  const policyMap: Record<string, "privacyPolicy" | "termsOfService" | "refundPolicy" | "shippingPolicy"> = {
    "privacy-policy": "privacyPolicy",
    "terms-of-service": "termsOfService",
    "refund-policy": "refundPolicy",
    "shipping-policy": "shippingPolicy"
  };

  const selectedPolicyKey = policyMap[policyHandle];
  const policy = selectedPolicyKey && shopData ? shopData[selectedPolicyKey] : null;
  
  if(!policy || !policy.body) {
    notFound();
  };

  return(
    <main className="policy-container" aria-label={shopData?.[selectedPolicyKey]?.title || "Store Policy"}>
      <h1 className="policy-pages-header">
        {shopData?.[selectedPolicyKey]?.title}
      </h1>
      <article
        className="policy-pages-body"
        dangerouslySetInnerHTML={{__html: policy.body}}
      >
      </article>
    </main>
  )
}