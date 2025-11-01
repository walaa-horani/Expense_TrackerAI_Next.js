"use client"
import { UserButton, useUser } from "@clerk/nextjs"
import React, { useEffect, useState } from "react"

function UserInfo() {
  const { user } = useUser()
  const [createdAt, setCreatedAt] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await fetch("/api/check-user")
      const data = await res.json()
      setCreatedAt(new Date(data.user.createdAt).toLocaleDateString())
    }
    fetchUserData()
  }, [user])

  return (
    <div className="p-6 shadow-emerald-100 shadow-md rounded-xl bg-white mt-5">
      <div className="flex flex-col gap-2">
        {/* header */}
        <h1 className="font-bold bg-linear-to-r from-green-400 via-green-600 to-green-700 bg-clip-text text-transparent text-3xl ml-10">
          Welcome Back, {user?.firstName}
        </h1>

        {/* Image With Pragraph */}
        <div className="flex items-start gap-3">
          <UserButton />
          <p className="text-gray-600 text-md leading-relaxed">
            A quick overview of your recent expense activity. Track your spending,
            analyze patterns, and manage your budget efficiently!
          </p>
        </div>

        {/* createdAt */}
        <div className="border w-[170px] mt-3 bg-green-50 border-green-700 rounded-md p-2.5 text-center">
          {createdAt ? (
           <p className="text-green-800 text-sm font-medium">
  Member since:{' '}
  {createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Loading...'}
</p>

          ) : (
            <p className="text-gray-500 text-sm">Loading account info...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserInfo
