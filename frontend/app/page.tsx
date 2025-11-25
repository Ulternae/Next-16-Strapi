import { HeroSection } from "@/components/hero-section";
import { getHomePage } from "@/lib/strapi";
import { Suspense } from "react";

export async function generateMetadata() {
  const strapiData = await getHomePage();
  return {
    title: strapiData?.title || "Home",
    description: strapiData?.description || "Welcome to our site",
  }

}

async function HomeContent() {
  const strapiData = await getHomePage();
  const [heroSectionData] = strapiData?.sections || [];
  return (
    <main>
      <HeroSection data={heroSectionData} />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="h-[600px] flex items-center justify-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
