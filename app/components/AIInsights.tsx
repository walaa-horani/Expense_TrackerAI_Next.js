"use client"

import React, { useEffect, useState } from 'react'
import { Loader2, Sparkles, TrendingUp, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react'

// Interface for AI insight data
interface Insight {
  id: string
  category: string
  type: 'warning' | 'success' | 'info'
  title: string
  message: string
  recommendation: string
}

// This component shows AI-powered spending insights and recommendations
function AIInsights() {
  // State to store AI insights
  const [insights, setInsights] = useState<Insight[]>([])
  // State to show loading spinner
  const [isLoading, setIsLoading] = useState(true)
  // State to show when insights were generated
  const [lastUpdated, setLastUpdated] = useState<string>('Just now')

  // This function runs when the component first loads
  useEffect(() => {
    fetchAIInsights()
  }, [])

  // Function to get AI insights from the API
  const fetchAIInsights = async () => {
    try {
      // Call the API to get AI-generated insights
      const response = await fetch('/api/ai-insights')
      const data = await response.json()

      if (response.ok) {
        setInsights(data.insights)
        setLastUpdated('Just now')
      }
    } catch (error) {
      console.error('Error fetching AI insights:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to get the right icon based on insight type
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className='w-5 h-5' />
      case 'success':
        return <CheckCircle className='w-5 h-5' />
      default:
        return <TrendingUp className='w-5 h-5' />
    }
  }

  // Function to get the right background color based on insight type
  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-gradient-to-br from-red-50 to-orange-50 border-l-4 border-red-400'
      case 'success':
        return 'bg-gradient-to-br from-emerald-50 to-green-50 border-l-4 border-emerald-400'
      default:
        return 'bg-gradient-to-br from-yellow-50 to-amber-50 border-l-4 border-yellow-400'
    }
  }

  // Function to get badge color
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-red-100 text-red-700'
      case 'success':
        return 'bg-emerald-100 text-emerald-700'
      default:
        return 'bg-yellow-100 text-yellow-700'
    }
  }

  return (
    <div className='col-span-1 md:col-span-2 p-6 shadow-emerald-100 shadow-md rounded-xl bg-white mt-5'>
      {/* Card Header */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <div className='p-3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg'>
            <Sparkles className='w-6 h-6 text-white' />
          </div>
          <div>
            <h2 className='text-xl font-bold text-gray-800'>AI Insights</h2>
            <p className='text-sm text-gray-500'>AI financial analysis</p>
          </div>
        </div>
        
        {/* Last updated badge */}
        <div className='flex items-center gap-2 text-sm'>
          <span className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse'></span>
          <span className='text-emerald-600 font-medium'>{lastUpdated}</span>
        </div>
      </div>

      {/* Show loading spinner while fetching data */}
      {isLoading ? (
        <div className='flex flex-col justify-center items-center h-64 gap-3'>
          <Loader2 className='h-8 w-8 animate-spin text-emerald-500' />
          <p className='text-gray-500'>Analyzing your spending patterns...</p>
        </div>
      ) : insights.length === 0 ? (
        // Show message if no insights available
        <div className='flex justify-center items-center h-64 text-gray-400'>
          Add more expenses to get AI-powered insights!
        </div>
      ) : (
        // Show the insights
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`p-5 rounded-xl ${getInsightColor(insight.type)} transition-all hover:shadow-md`}
            >
              {/* Insight Header */}
              <div className='flex items-start gap-3 mb-3'>
                <div className={`p-2 rounded-lg ${insight.type === 'warning' ? 'bg-red-100 text-red-600' : insight.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-yellow-100 text-yellow-600'}`}>
                  {getInsightIcon(insight.type)}
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(insight.type)}`}>
                      {insight.category}
                    </span>
                  </div>
                  <h3 className='font-bold text-gray-800'>{insight.title}</h3>
                </div>
              </div>

              {/* Insight Message */}
              <p className='text-sm text-gray-700 mb-3 leading-relaxed'>
                {insight.message}
              </p>

              {/* Recommendation */}
              <div className='flex items-start gap-2 pt-3 border-t border-gray-200'>
                <ChevronRight className='w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0' />
                <p className='text-xs text-gray-600 leading-relaxed'>
                  {insight.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AIInsights