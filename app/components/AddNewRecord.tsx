"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

// Add interface for props


function AddNewRecord() {
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState('')
  const [isLoadingCategory, setIsLoadingCategory] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)
 

  const suggestCategory = async (desc: string) => {
    if (!desc || desc.trim().length < 3) return

    setIsLoadingCategory(true)
    try {
      const response = await fetch('/api/suggest-category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: desc }),
      })

      if (response.ok) {
        const data = await response.json()
        setCategory(data.category)
      }
    } catch (error) {
      console.error('Error getting category suggestion:', error)
    } finally {
      setIsLoadingCategory(false)
    }
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDescription(value)

    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    // Set new timer to call API after 800ms of no typing
    const newTimer = setTimeout(() => {
      suggestCategory(value)
    }, 800)

    setDebounceTimer(newTimer)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/add-expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          date,
          category,
          amount: parseFloat(amount)
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast(
        
        "Expense added successfully",
        )
       
        // Reset form
        setDescription('')
        setCategory('')
        setDate('')
        setAmount('')
      } else {
        toast(
         
         "Failed to add expense",
        
        )
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast(
      
        "Failed to add expense. Please try again.",
       
     )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='p-6 shadow-emerald-100 shadow-md rounded-xl bg-white mt-5'>
      <form onSubmit={handleSubmit}>
        <div className='flex gap-4'>
          <Input 
            type='text' 
            placeholder='Expense Description'
            value={description}
            onChange={handleDescriptionChange}
            required
            disabled={isSubmitting}
          />
          <Input 
            type='date' 
            placeholder='Expense Date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>  

        <div className='flex gap-4 mt-7'>
          <div className='relative'>
            <Input 
              type='text' 
              placeholder='Category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              disabled={isSubmitting}
            />
            {isLoadingCategory && (
              <Loader2 className='absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400' />
            )}
          </div>

          <Input 
            type='number' 
            placeholder='Amount'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            required
            disabled={isSubmitting}
          />
        </div> 

        <Button 
          className='mt-10 w-full' 
          type='submit'
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Adding...
            </>
          ) : (
            'Add Record'
          )}
        </Button>
      </form>  
    </div>
  )
}

export default AddNewRecord