"use client"
import React, { useState } from 'react'
import UserInfo from '../components/UserInfo'
import AddNewRecord from '../components/AddNewRecord'
import RecordChart from '../components/RecordChart'
import ExpenseStats from '../components/ExpenseStats'
import AIInsights from '../components/AIInsights'

function page() {

  
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto mt-20 gap-5'>

    <UserInfo/>
    <AddNewRecord   />

       <RecordChart  />
      <ExpenseStats />

      <AIInsights/>
     
      </div>
  )
}

export default page