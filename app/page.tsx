import AnimateLayout from "@/components/layout/AnimateLayout";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import CallToAction from "@/components/home/CallToAction";

export default function Home() {
  return (
    <AnimateLayout>
      <Hero />
      <Features />
      <CallToAction />
    </AnimateLayout>
  );
}
