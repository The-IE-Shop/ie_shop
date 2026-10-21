import logo from '~/public/images/white-ie-logo.png';
import Image from "next/image";
import Link from "next/link";
import { FaInstagram } from 'react-icons/fa';
import { getShopLayoutData } from '@/lib/shopifyFetch';
import type { ShopifyLayoutFieldsType } from '@/types/shopifyTypes';

type FooterProps = {
  shopData?: ShopifyLayoutFieldsType | null;
};

export default async function Footer(): Promise<React.JSX.Element> { 
  const shopData = await getShopLayoutData();

  return(
    <footer>
      <div id="footer-wrapper" className="wrapper">
        <Link href="/">
          <Image 
            src={logo} 
            alt="IE Shop Logo" 
            className="footer-logo-image"
            width="200"
            height="200"
            />
        </Link>
        
        <nav className="policy-links-container" aria-label="Footer corporate policies and utility links">
          <Link
            href="/about-us"
            className="policy-links"
          >
            About Us
          </Link>
          {shopData?.privacyPolicy && <Link
            className='policy-links' 
            href="/policies/privacy-policy"
            >
            Privacy Policy
          </Link>}

          {shopData?.termsOfService && <Link
            className='policy-links' 
            href="/policies/terms-of-service"
            >
            Terms of Service
          </Link>}

          {shopData?.refundPolicy && <Link
            className='policy-links' 
            href="/policies/refund-policy"
            >
            Refund Policy
          </Link>}

          {shopData?.shippingPolicy && <Link
            className='policy-links' 
            href="/policies/shipping-policy"
            >
            Shippping Policy
          </Link>}
        </nav>
        <div className="footer-info">
          <p>© 2026 IE Shop.</p>


          <div className="social-media-container">
            <a 
              href="https://www.instagram.com/theie.shop" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Visit our Instagram page (opens in a new window tab)"
            >
              <FaInstagram className="social-media-icon" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}