import Hero from "@/components/hero";
import Questions from "@/components/questions";

export default function Home() {
  return (
   <div className=" flex flex-col justify-center items-center">
    <Hero />
    <Questions />
   </div>
  );
}
