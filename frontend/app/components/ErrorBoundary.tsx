import React from 'react'
import HomeButton from './HomeButton'
const ErrorFallBack = (error: any) => {
  return (
    <div className='flex flex-col space-y-2 justify-center items-center h-screen w-screen'>
    <div className='flex '>
        <h1>Something went wrong{' '} </h1>
        <p className='text-destructive'>{ error.message}</p>
        <p className='text-destructive'>Please try again later</p>
    </div>
    <HomeButton/>
    </div>
  )
}

export default ErrorFallBack