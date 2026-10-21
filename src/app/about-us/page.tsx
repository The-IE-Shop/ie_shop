import whiteLogo from "~/public/images/white-ie-logo.png";
import blackLogo from "~/public/images/black-ie-logo.png";
import Image from "next/image";


export default function AboutUs() {
  return(
    <section id="about-us-section">
      <h2 className="mobile-about-title">
        THE OFFICIAL MARK OF THE INLAND EMPIRE
      </h2>
      <h2 className="desktop-about-title">
        THE OFFICIAL MARK OF <br/> THE  INLAND EMPIRE
      </h2>
      <article className="about-us">
        <p>We present to you the Official Mark of the Inland Empire.</p>

        <p> 
          This is not a clothing brand. It's a mark for the people of the IE 
          to proudly represent where they're from and the place they call home.
        </p>

        <p> 
          For generations, we've worn Dodgers, Angels, and Padres hats to represent 
          our Southern California roots. We've worn the colors of our favorite teams 
          to showcase where we come from, because we didn’t have a mark of our own.
        </p>

        <p>
          Until now.
        </p>
        
        <p>
          This mark was created to give our region a symbol of its own. A mark 
          that brings together the spirit, energy, and pride of the many cities 
          and communities that make up The IE.
        </p>

        <p>
          Wherever you reside within its boundaries, this is for you. 
          (And yes, Pomona is the IE….argue with your mama)
        </p>

        <p>
          The hat is just the beginning. We envision this mark living far 
          beyond a single product, finding its way into the many places and 
          forms through which people choose to represent The IE.
        </p>

        <p>
          The Inland Empire has always had an identity. Now it has a mark to 
          represent it. 
        </p>

        <p>
          Wear it with pride. Wear it with honor. Wear it with 
          enthusiasm.
        </p>

        <p> 
          You know where you’re from. Now show it.
        </p>

        <p>
          Keep It IE.
        </p>
      </article>
      <div className="about-us-logo-container white">
        <Image
          className="about-us-logo-image"
          src={whiteLogo}
          alt="IE Logo"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1600px"
        />
      </div>
      <div className="about-us-logo-container black">
        <Image
          className="about-us-logo-image"
          src={blackLogo}
          alt="IE Logo"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1600px"
        />
      </div>
      <article className="trademark-info" style={{ marginTop: "2rem"}}>
        <p>
          The mark is a registered trademark of Mesa Verde Worldwide, LLC. 
          For licensing inquiries, please contact us at info@theie.shop
        </p>
      </article>
    </section>
  )
}