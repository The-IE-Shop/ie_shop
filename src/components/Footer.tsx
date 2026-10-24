import logo from '~/public/images/white-ie-logo.png';
import Image from "next/image";
import Link from "next/link";
import { FaInstagram } from 'react-icons/fa';
import { getShopLayoutData } from '@/lib/shopifyFetch';

export default async function Footer(): Promise<React.JSX.Element> { 
  const shopData = await getShopLayoutData();
  const currentYear = new Date().getFullYear();

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
        
        <nav className="site-links-container" aria-label="Footer corporate policies and utility links">
          <Link
            href="/shop"
            className="site-links"
          >
            Shop
          </Link>

          <Link
            href="/contact"
            className="site-links"
          >
            Contact
          </Link>

          <Link
            href="/about-us"
            className="site-links"
          >
            About Us
          </Link>

          {shopData?.privacyPolicy && <Link
            className="site-links" 
            href="/policies/privacy-policy"
            >
            Privacy Policy
          </Link>}

          {shopData?.termsOfService && <Link
            className="site-links" 
            href="/policies/terms-of-service"
            >
            Terms of Service
          </Link>}

          {shopData?.refundPolicy && <Link
            className="site-links" 
            href="/policies/refund-policy"
            >
            Refund Policy
          </Link>}

          {shopData?.shippingPolicy && <Link
            className="site-links" 
            href="/policies/shipping-policy"
            >
            Shipping Policy
          </Link>}
        </nav>
        <div className="footer-info">
          <p>© {currentYear} IE Shop.</p>


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