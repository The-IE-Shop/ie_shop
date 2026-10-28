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
          This is not a clothing brand. It's a mark for the people of the 
          IE to proudly display where they're from and call home.
        </p>

        <p> 
          For generations, we've worn Dodgers, Angels, and Padres hats to 
          represent our Southern California roots because we didn’t have a 
          mark of our own.
        </p>

        <p>
          Until now.
        </p>
        
        <p>
          Wherever you call home in the Inland Empire, this mark is yours. 
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
      <div className="about-us-logo-container">
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