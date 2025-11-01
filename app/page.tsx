import { Button } from "@/components/ui/button";
import Image from "next/image";
import CardHomePage from "./components/CardHomePage";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
        <div className="mt-10 text-center">

       <h1 className="mb-4 text-5xl leading-normal text-green-600">Take control of your money with <br/> <span className="font-bold bg-linear-to-r from-green-300 via-green-500 to-green-700 bg-clip-text text-transparent">Tracker Cost AI</span>  </h1>
         <p className="text-gray-600 text-xl leading-9">Welcome to your new money buddy 🤝
        Track, save, and plan with the help of AI.<br/>

        Meet your smartest finance assistant!
        ExpenseTracker AI helps you spend wisely and stress less.</p>
        
        </div>

        <div className="flex items-center justify-center gap-4 m-6">
          <Button>Get Started</Button>
          <Button>See Details</Button>
        </div>

       <CardHomePage/>
    </div>
  );
}
