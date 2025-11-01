"use client"

import { ArrowDown, ArrowUp, Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'


interface Statistics {
 averageDaily: number   
  highestExpense: number   
  lowestExpense: number  
  totalExpenses: number   
  daysWithExpenses: number
}
function ExpenseStats() {

  const [stats, setStats] = useState<Statistics>({
 averageDaily: 0 ,  
  highestExpense: 0  , 
  lowestExpense: 0  ,
  totalExpenses: 0   ,
  daysWithExpenses: 0,


  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=> {
    fetchStatistics()
  },[])

  const fetchStatistics = async() => {
    try {
      const res = await fetch("/api/records")
    const data = await res.json()

    if(res.ok && data.records.length > 0 ) {
      // Calculate all the statistics from the expense data

      const calculatedStats = calculateStatistics(data.records)
      setStats(calculatedStats)
    }

    } catch (error) {
      console.error('Error fetching statistics:', error)
    }finally{
      setIsLoading(false)
    }

     }
// Helper function to calculate all statistics
    const calculateStatistics = (expenses: any[]): Statistics => {
      // Find all unique dates that have expenses
     const uniqueDates = new Set (
      expenses.map((exp)=> new Date(exp.date).toDateString())
    
        //"Tue Oct 28 2025"
         //"Tue Oct 28 2025"
         //"Tue Oct 29 2025"

     )

     const daysWithExpenses = uniqueDates.size

     // Calculate total amount spent
     const totalAmount  = expenses.reduce((sum, exp) => sum + exp.amount, 0)

     

      // Calculate average daily spending
    const averageDaily = daysWithExpenses > 0 ? totalAmount / daysWithExpenses : 0

      const highestExpense = Math.max(...expenses.map((exp) => exp.amount))


      const lowestExpense  = Math.min(...expenses.map((exp) => exp.amount))
      
      return {
       averageDaily,
      highestExpense,
      lowestExpense,
      totalExpenses:expenses.length,
      daysWithExpenses
      }
 
    }
 
  return (
    <div className='p-6 shadow-emerald-100 shadow-md rounded-xl bg-white mt-5'>

      {/* Card Header */}
       <div className='flex items-center gap-3 mb-6'>
        <div className='p-3 bg-emerald-100 rounded-lg'>
          <span className='text-2xl'>📈</span>
        </div>
        <div>
          <h2 className='text-xl font-bold text-gray-800'>Expense Statistics</h2>
          <p className='text-sm text-gray-500'>Your spending insights and ranges</p>
        </div>
      </div>


      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <Loader2 className='h-8 w-8 animate-spin text-emerald-500' />
        </div>  
      ): stats.totalExpenses === 0 ?(
         <div className='flex justify-center items-center h-40 text-gray-400'>
          No statistics available yet. Add some expenses to see your insights!
        </div>
      ):(

        <div className='space-y-4'>
       {/* Average Daily Spending Card */}

       <div className='bg-linear-to-br from-slate-700 to-slate-800 p-6 rounded-xl text-white'>

        <p className='text-sm font-medium mb-2'>AVERAGE DAILY SPENDING</p>
        <h3 className='text-4xl font-bold mb-2'>  ${stats.averageDaily.toFixed(2)}</h3>

        <p className='text-xs text-emerald-400 flex items-center gap-1'>

          <span> Based on {stats.daysWithExpenses} days with expenses</span>
        </p>
       </div>

          {/* Highest and Lowest Expense Cards */}
        
        <div className='grid grid-cols-2 gap-4'>
           {/* Highest Expense */}

          <div className='bg-linear-to-br from-red-500 to-red-600 p-4 rounded-xl text-white'>
            <div className='flex items-center gap-2 mb-2'>
              <ArrowUp/>
              <span>Highest</span>
            </div>
            <h4 className='text-2xl font-bold'>{stats.highestExpense.toFixed(2)} $</h4>
            </div> 

          {/* Lowest Expense */}


          <div className='bg-linear-to-br from-emerald-500 to-emerald-600 p-4 rounded-xl text-white'>
            <div className='flex items-center gap-2 mb-2'>
              <ArrowDown/>
              <span>Lowest</span>
            </div>
            <h4 className='text-2xl font-bold'>{stats.lowestExpense.toFixed(2)} $</h4>
            </div> 

        </div>


        </div>

      
      

      )}
      
    </div>
  )
}

export default ExpenseStats