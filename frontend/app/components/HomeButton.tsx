import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
const HomeButton = () => {
  return (
    <Link href={'/me'}>
      <Button className="large-button" variant={'outline'}>
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back
      </Button>
    </Link>
  )
}

export default HomeButton