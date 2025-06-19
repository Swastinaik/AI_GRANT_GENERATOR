import React from 'react'

const ErrorFallBack = (error: any) => {
  return (
    <div className='h-full w-full flex justify-center items-center'>
        <h1>Something went wrong</h1>
        <p className='text-red-500'>{error.message}</p>
        <p className='text-red-500'>Please try again later</p>
    </div>
  )
}

export default ErrorFallBack