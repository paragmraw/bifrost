import TabViewport from "@/components/TabViewport";
import TopNav from "@/components/TopNav";
import PageFoot from "@/components/PageFoot";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";
import DocsCta from "@/components/sections/DocsCta";

// Runs at parse time (before first paint) so the saved tab is already active
// when the page appears; TabViewport's effect re-applies the same state.
const INIT_TAB = `
try {
  var t = localStorage.getItem("bifrost.tab");
  var ids = ["tab-hero", "tab-how", "tab-features", "tab-docs"];
  if (ids.indexOf(t) < 0) t = ids[0];
  var s = document.getElementById(t);
  if (s) s.classList.add("is-active");
  document.querySelectorAll("[data-tab]").forEach(function (a) {
    if (a.getAttribute("data-tab") === t) a.setAttribute("aria-current", "true");
  });
} catch (e) {}
`;

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#content">Skip to content</a>
      <TopNav />
      <TabViewport>
        <Hero />
        <HowItWorks />
        <Features />
        <DocsCta />
      </TabViewport>
      <PageFoot />
      <script dangerouslySetInnerHTML={{ __html: INIT_TAB }} />
    </>
  );
}