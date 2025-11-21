import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "./ui/button";
import Link from "next/link";

const FeatureSection = () => {
    return (
        <div className="flex flex-col">
            <div className="flex  p-8 space-x-8 w-full border-t border-b">
                <div className=" p-4  hidden md:flex w-1/2">
                <h1 className=" text-7xl  font-bold ">
                    AI- Powered Grant Generator for Non Profit Organization.
                </h1>
                </div>
             
                <div className="flex items-center justify-center  p-4 md:w-1/2 w-full">
                <Card className="w-96 flex flex-col items-between justify-center p-8 space-y-2 ">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">GRANT GENERATOR</CardTitle>
                    </CardHeader>
                    <CardDescription className="text-lg">
                        Our AI-powered platform helps non-profits generate professional grant proposals by 
                        analyzing their project details, budgets, and documents. It saves time and improves the 
                        quality of submissions, increasing their chances of securing funding.
                    </CardDescription>
                    <Link href={'/generate-grant'} className="text-center">
                    <Button variant={'default'} className="">
                        Know More
                    </Button>
                    </Link>
                </Card>
                </div>
            </div>
            <div className="flex  p-8 space-x-8 w-full border-t border-b">
                <div className="flex items-center justify-center  p-4 md:w-1/2 w-full">
                <Card className="w-96 flex flex-col items-between justify-center p-8 space-y-2">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">SEARCH GRANT</CardTitle>
                    </CardHeader>
                    <CardDescription className="text-lg">
                        Our AI-powered platform helps non-profits to seach grants using a robust
                        search and ranking mechanism which fetch grants from grants.gov and matches
                        the synopsis and ranks it according to user description to get exact results.
                    </CardDescription>
                    <Link href={'/search-grant'} className="text-center">
                    <Button variant={'default'} className="">
                        Know More
                    </Button>
                    </Link>
                </Card>
                </div>
                <div className="md:w-1/2 w-full p-4 hidden md:flex">
                <h1 className=" text-7xl  font-bold">
                    AI- Powered Grant Searching and Ranking Tool.
                </h1>
                </div>
             
                
            </div>
        </div>
    )
}

export default FeatureSection;