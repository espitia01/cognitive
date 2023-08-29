'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter()
    const handleClick = (direction) => () => {
        router.push(direction)
    }
  return (
    <main className='text-center mt-5 font-bold text-6xl'>
        <p>Cognitive Landing Page</p>
        <div className="justify-center flex items-center mt-9">
            <Button className="" onClick={handleClick("/sign-up")}>Sign Up</Button>
            <Button className="ml-5" onClick={handleClick("/sign-in")}>Sign In</Button>
        </div>  
    </main>
  )
}
