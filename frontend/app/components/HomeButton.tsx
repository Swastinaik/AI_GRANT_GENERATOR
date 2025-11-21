import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
const HomeButton = () => {
  return (
    <Link href={'/'}>
    <Button className="large-button" variant={'outline'}>
          
         
            HOME
          
    </Button>
    </Link>
  )
}

export default HomeButton