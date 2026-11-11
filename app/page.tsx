import { person, seo, services, faq } from "@/content/site";
import { Preloader } from "@/components/sections/Preloader";
import { Hero } from "@/components/sections/Hero";
import { ReceiptMarquee } from "@/components/sections/ReceiptMarquee";
import { About } from "@/components/sections/About";
import { Expertise } from "@/components/sections/Expertise";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Experience } from "@/components/sections/Experience";
import { Results } from "@/components/sections/Results";
import { Tools } from "@/components/sections/Tools";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

/* Structured data: AccountingService + FAQPage. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AccountingService",
      "@id": `${person.siteUrl}/#business`,
      name: `${person.name}, Bookkeeper`,
      description: seo.description,
      url: person.siteUrl,
      email: person.email,
      telephone: person.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: person.city,
        addressRegion: person.region,
        addressCountry: person.country,
      },
      areaServed: person.country,
      founder: { "@type": "Person", name: person.name, jobTitle: person.title },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Bookkeeping services",
        itemListElement: services.items.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.name, description: s.description },
        })),
      },
      sameAs: person.socials.filter((s) => s.href.startsWith("http")).map((s) => s.href),
    },
    {
      "@type": "FAQPage",
      mainEntity: faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Preloader />
      <main id="main">
        <Hero />
        <ReceiptMarquee />
        <About />
        <Expertise />
        <Services />
        <Process />
        <Experience />
        <Results />
        <Tools />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
