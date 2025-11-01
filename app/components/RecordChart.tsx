
"use client"
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function RecordChart() {

   const [chartData, setChartData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(()=> {
      fetchChartData()
    },[])


    const fetchChartData = async() => {
      try {
        const res = await fetch("/api/records")
        const data = await res.json()
        if(res.ok){
         // Group records by date and calculate total for each day  
          const groupedData  = groupRecordsByDate(data.records)
          setChartData(groupedData)
        } 

      } catch (error) {
         console.error('Error fetching chart data:', error)
      }finally{
        setIsLoading(false)
      }

    }
     // Helper function to group records by date
     const groupRecordsByDate = (records:any[])=> {
       // Create an object to store totals for each date
         const grouped: { [key: string]: number } = {}
         records.forEach((record)=> {
          // Format the date to show only month/day (e.g., "07/01")
          const date = new Date(record.date).toLocaleDateString("en-US", {
             month: '2-digit',
            day: '2-digit'
          })
           // Add the record amount to that date's total

           if(grouped[date]) {
             grouped[date] += record.amount
           }else{
              grouped[date] = record.amount
           }


         })

       // Convert the object to an array format that the chart can use
    // Example: [{ date: "07/01", amount: 25 }, { date: "07/03", amount: 50 }]

    return Object.keys(grouped).map((date)=> ({
      date,
        amount: grouped[date],
   
     
    }))
     }
  return (
    <div className='p-6 shadow-emerald-100 shadow-md rounded-xl bg-white mt-5'>
      
       {/* Card Header */}
      <div className='flex items-center gap-3 mb-6'>
        <div className='p-3 bg-emerald-100 rounded-lg'>
          <span className='text-2xl'>📊</span>
        </div>
        <div>
          <h2 className='text-xl font-bold text-gray-800'>Expense Chart</h2>
          <p className='text-sm text-gray-500'>Visual representation of your spending</p>
        </div>
      </div>

        {/* Show loading spinner while fetching data */}

        {isLoading ? (

          <div className='flex justify-center items-center h-64'>
          <Loader2 className='h-8 w-8 animate-spin text-emerald-500' />
        </div>  
        ): chartData.length=== 0 ? (

        <div className='flex justify-center items-center h-64 text-gray-400'>
          No expenses recorded yet. Add your first expense!
        </div>
        

        ):(
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={chartData}>
                
                <XAxis dataKey="date"
                tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
                />

                <YAxis
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => `$${value}`}

              
                />

                 <Tooltip 
              formatter={(value: any) => [`$${value.toFixed(2)}`, 'Amount']}
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />

                <Bar   dataKey='amount' 
              fill='#10b981' 
              radius={[8, 8, 0, 0]}
                />
              </BarChart> 

            </ResponsiveContainer>
        )}

    </div>
  )
}

export default RecordChart