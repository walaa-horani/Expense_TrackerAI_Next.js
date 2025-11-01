"use client"
import { Button } from '@/components/ui/button'
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useUser } from '@clerk/nextjs'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'

function Navbar() {


    const {user} = useUser()

    useEffect(()=> {
       const checkUser  = async() => {
        try {
            const res = await fetch("/api/check-user", {
                method:"GET",

            })

           const data = await res.json();

            if(!res.ok){
              console.error(" Failed to check or create user",data);
            }else{
               console.log(" User check success",data);   
            }

        } catch (error) {
       console.error(" Error calling check-user:", error);      
        }
       }

       if (user) checkUser()
    },[user])
  return (
    <div className='w-full bg-white shadow-md py-3 px-6 flex justify-between items-center'>
        <Image src="/logo.png" alt='logo' width={120} height={120}/>
        <div className='hidden md:flex items-center gap-8 text-gray-700 font-medium'>

         <Link href="/" className="text-green-600 hover:text-green-800 transition">Home</Link>
        <Link href="/about" className="text-green-600 hover:text-green-800 transition">About</Link>
        <Link href="/contact" className="text-green-600  hover:text-green-800 transition">Contact</Link>

        </div>

        {/* Right Side (Auth Buttons) */}

        <div className='flex items-center gap-3'>
          
          <SignedOut>
          <SignInButton  mode="modal">
          <Button>

            Sign In
          </Button>
    </SignInButton>
          </SignedOut>


         <SignedIn>

          <SignOutButton  redirectUrl="/" >

          <Button>
            Sign out
          </Button>

        
          </SignOutButton >
          <UserButton appearance={{
            elements:{
             userButtonPopoverActionButton__addRecord: "text-green-600 hover:text-green-800 font-medium"
         
            }
          }}>

          <UserButton.MenuItems>
            <UserButton.Link
          label="Add Record"
         href="/add-record"
         labelIcon={<span><Plus size={20}/></span>}
            
            />
          </UserButton.MenuItems>

            </UserButton>
          </SignedIn>
        </div>
    </div>
  )
}

export default Navbar