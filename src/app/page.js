
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import Services from "@/components/Services";
import Survey from "@/app/Survey/page";
import Footer from "./Footer/page";
import Featured from "@/app/Featured/page";


export default function Home() {
  return (
    <div>
      <Hero />
      <Featured />
      <Services />
      <Menu />
      <Survey />
      <Footer />
 
    </div>
  );
}
