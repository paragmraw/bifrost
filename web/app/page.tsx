import TabViewport from "@/components/TabViewport";
import TopNav from "@/components/TopNav";
import PageFoot from "@/components/PageFoot";
import AuroraField from "@/components/AuroraField";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";
import DocsCta from "@/components/sections/DocsCta";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#content">Skip to content</a>
      <AuroraField />
      <TopNav />
      <TabViewport>
        <Hero />
        <HowItWorks />
        <Features />
        <DocsCta />
      </TabViewport>
      <PageFoot />
    </>
  );
}