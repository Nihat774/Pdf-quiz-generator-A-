import Hero from "@/components/hero";
import Questions from "@/components/questions";

export default function Home() {
  return (
   <div  className=" flex flex-col relative z-20 justify-center items-center">
    <div className="bg-gray-300 absolute min-h-screen inset-0 z-10"></div>
   <div className="flex flex-col justify-center items-center z-20">
    <Hero />
    <Questions />
   </div>
   </div>
  );
}
