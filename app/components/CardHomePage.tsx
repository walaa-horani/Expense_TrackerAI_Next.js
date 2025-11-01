import { LineChart, Layers, BarChart3 } from 'lucide-react'
import React from 'react'

function CardHomePage() {
  return (
    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch ">
  <div className="bg-white shadow-green-100 p-6 shadow-xl rounded-xl text-center flex flex-col justify-center">
    <LineChart
      size={56}
      className="bg-linear-to-r from-green-500 via-green-400 to-green-600 text-white p-3 rounded-xl mx-auto"
    />
    <h1 className="mt-4 text-2xl text-green-700 font-bold">Smart Analytics</h1>
    <p className="text-gray-600">Gain instant insights into your data trends.</p>
  </div>

  <div className="bg-white shadow-green-100 p-6 shadow-xl rounded-xl text-center flex flex-col justify-center">
    <Layers
      size={56}
      className="bg-linear-to-r from-green-500 via-green-400 to-green-600 text-white p-3 rounded-xl mx-auto"
    />
    <h1 className="mt-4 text-2xl text-green-700 font-bold">Auto Categorization</h1>
    <p className="text-gray-600">
      Automatically group your expenses into smart categories.
    </p>
  </div>

  <div className="bg-white shadow-green-100 p-6 shadow-xl rounded-xl text-center flex flex-col justify-center">
    <BarChart3
      size={56}
      className="bg-linear-to-r from-green-500 via-green-400 to-green-600 text-white p-3 rounded-xl mx-auto"
    />
    <h1 className="mt-4 text-2xl text-green-700 font-bold">Financial Dashboard</h1>
    <p className="text-gray-600">
      Get a clear, visual overview of your finances at a glance.
    </p>
  </div>
</div>

  )
}

export default CardHomePage
