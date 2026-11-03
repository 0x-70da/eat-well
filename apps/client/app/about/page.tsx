import { AboutHero } from "./components/AboutHero";
import { AboutValues } from "./components/AboutValues";
import { AboutChefStory } from "./components/AboutChefStory";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <AboutHero />
      <AboutValues />
      <AboutChefStory />
    </div>
  );
}
