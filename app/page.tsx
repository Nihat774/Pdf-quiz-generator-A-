import Hero from "@/components/hero";
import Questions from "@/components/questions";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center bg-[#EDE1C5]">
      <Hero />
      <Questions />
    </div>
  );
}