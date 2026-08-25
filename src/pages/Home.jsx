import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import Work from "../components/Work";
import WhyUs from "../components/WhyUs";
import Hours from "../components/Hours";
import QuoteForm from "../components/QuoteForm";

export default function Home() {
  return (
    <div>
      <Hero />
      <About />
      <Services />
      <Work />
      <WhyUs />
      <Hours />
      <QuoteForm />
    </div>
  );
}
