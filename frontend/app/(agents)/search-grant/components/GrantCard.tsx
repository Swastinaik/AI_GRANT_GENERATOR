'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import {GrantType} from '../../../lib/utils/types'
import  useAuthStore  from "@/app/store/AuthStore"
interface GrantCardProps {
    grant: GrantType;
}
export default function GrantCard( grant :GrantCardProps) {
  const setFundersDetail = useAuthStore((state)=> state.setFundersDetail)
  const {id,title,agency,agencyCode,openDate,closeDate,link,score} = grant.grant
  const fundersDetail = `The id of Organization is ${id} title ${title}, agency name is ${agency} with code ${agencyCode}, the opening date for the grant is ${openDate} and closing date is ${closeDate}`
  const router = useRouter()
  const handleGenerate = () => {
  try {
    setFundersDetail(fundersDetail)
    router.push(`/generate-grant`)
  } catch (error) {
    console.log(error)
  }
  };

  return (
    <Card className="flex flex-col justify-between h-full p-6 bg-secondary text-secondary-foreground">
      <CardHeader>
        <CardTitle className='text-2xl  font-bold'>{title}</CardTitle>
      </CardHeader>
      <CardContent   className="space-y-2 text-foreground">
        <p><span className="font-semibold text-foreground">Agency:</span> {agency}</p>
        <p><span className="font-semibold text-foreground">Agency Code:</span> {agencyCode}</p>
        <p><span className="font-semibold text-foreground">Open Date:</span> {openDate}</p>
        <p><span className="font-semibold text-foreground">Close Date:</span> {closeDate}</p>
        <p><span className="font-semibold text-foreground">Score:</span> {score} (for your granrt)</p>
        
      </CardContent>
      {/* Buttons at the bottom-right corner */}
      <CardFooter className="flex justify-around items-center mt-6">
        <a href={link} target="_blank" rel="noopener noreferrer" className=" underline">
        <Button
        variant={'outline'}
        >
          View Grant
          Apply
        </Button>
        </a>
        <Button
          onClick={handleGenerate}
        >
          Generate
        </Button>
      </CardFooter>
    </Card>
  );
}
