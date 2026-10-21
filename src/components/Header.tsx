"use client";
import Image from "next/image";
import Link from "next/link";
import whiteLogo from "~/public/images/white-ie-logo.png";
import { FaInstagram } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import Cart from "./Cart";
import { useCart } from "./CartContext";

export default function Header(): React.JSX.Element {
  const { isCartOpen, setIsCartOpen, cartId, cartData} = useCart();

  const cartQuantityCount = cartData?.lines?.edges?.reduce((acc, edge) => acc + edge.node.quantity, 0) || 0;

  return(
    <header id="product-header-container" className="header-container">
      <div id="product-header-wrapper" className="header-wrapper">
        <button 
          type="button"
          className="shopping-bag-container"
          onClick={() => setIsCartOpen(!isCartOpen)}
          aria-expanded={isCartOpen}
          aria-label={`Shopping bag, ${cartQuantityCount} item${cartQuantityCount === 1 ? "" : "s"}. Open cart drawer`}
        >
          {cartQuantityCount > 0 && 
            <div className="show-cart-total" aria-hidden="true">
              {cartQuantityCount}
            </div>
          }
          <FiShoppingBag id="contact-cart-icon" className="header-cart-icon" aria-hidden="true"/>
        </button>

        <Link href="/" aria-label="Go to home page">
          <Image 
            id="header-logo"
            src={whiteLogo}
            alt="IE Home logo"
          />
        </Link>

        <a 
          href="https://www.instagram.com/theie.shop" 
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit our Instagram page (opens in a new tab)"
        >
          <FaInstagram className="social-media-icon" aria-hidden="true" />
        </a>
      </div>

      <Cart liveCartId={cartId} isOpen={isCartOpen} setIsOpen={setIsCartOpen}/>
    </header>
  )
}