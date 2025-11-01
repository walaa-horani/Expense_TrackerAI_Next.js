import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { json } from "stream/consumers";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});
export async function GET(request: NextRequest){
    try {

      const user = await currentUser()
     if (!user) {
   return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch user's recent expenses (last 30 days)


    const thirtyDaysAgo  = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30) 

    const records = await prisma.record.findMany({
        where:{userId:user.id,

          date  : {
             gte: thirtyDaysAgo,
          } 

        },
         orderBy: {
        date: 'desc',
      },
       
    })

    // If no expenses, return empty insights


    if(records.length === 0) {
        return NextResponse.json({
        insights: [],
        message: 'No expenses to analyze'
        })
    }


      // Prepare expense summary for AI

      const expenseSummary = prepareExpenseSummary(records)


    // Call AI to generate insights

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.2-3b-instruct:free",
      messages: [
        {
     role: "system",
    content: `You are a financial advisor AI. Analyze the user's spending data and provide 3-4 actionable insights. 

For each insight, provide:
1. category: The spending category (e.g., "Shopping", "Transportation", "Food & Dining")
2. type: Either "warning" (overspending), "success" (good habits), or "info" (general advice)
3. title: A short, catchy title (e.g., "High Spending on Shopping")
4. message: A brief explanation of what you noticed (1-2 sentences, include specific amounts)
5. recommendation: Specific actionable advice (1-2 sentences)

Respond ONLY with a valid JSON array. Example format:
[
  {
    "category": "Shopping",
    "type": "warning",
    "title": "High Spending on Shopping",
    "message": "You spent $50 on shopping for a bed, which is a significant portion of your recent expenses.",
    "recommendation": "Consider comparing prices or waiting for sales before making large purchases."
  }
]`
        },
        {
          role: "user",
          content: `Analyze this spending data and provide insights:\n\n${expenseSummary}`
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    });


    const aiResponse = completion.choices[0]?.message?.content?.trim() || '[]'

    let insights


    try {
        insights = JSON.parse(aiResponse)
    } catch (parseError) {
      // If AI doesn't return valid JSON, provide fallback insights    

    insights = generateFallbackInsights(records);
    }




return NextResponse.json({
     insights,
    message: "Insights generated successfully"
})

    }catch(error){
        console.error("Error generating AI insights",error)
     NextResponse.json({
        error: 'Failed to generate insights' 
     }, {status:500})   
    }
}


   // Helper function to prepare expense summary for AI
   
   function prepareExpenseSummary(records:any[]){
     // Calculate totals by category

     const categoryTotals : {[key: string]: number} = {}

     records.forEach(record => {

        if(categoryTotals[record.category])  {
         categoryTotals[record.category] += record.amount;  
        
     }else{

      categoryTotals[record.category] = record.amount;    
    
        }
    })
     // Calculate total spending


     const totalSpending = records.reduce((sum,r) => sum + r.amount, 0)

     // Find highest expenses

     const sortedRecords = [...records].sort((a,b)=>  b.amount - a.amount).slice(0, 5)


   return `
  Total Expenses: ${records.length} transactions

 Total Amount: ${totalSpending.toFixed(2)}


 Spending by Category:
${Object.entries(categoryTotals)
  .map(([cat, amount]) => `- ${cat}: $${amount.toFixed(2)} (${((amount / totalSpending) * 100).toFixed(1)}%)`)
  .join('\n')}

Top 5 Expenses:
${sortedRecords.map(r => `- $${r.amount.toFixed(2)} on ${r.text} (${r.category})`).join('\n')}

  `
   }

function generateFallbackInsights(records: any[]) {
  const insights = [];
  
  // Calculate category spending
  const categoryTotals: { [key: string]: number } = {};
  records.forEach(record => {
    categoryTotals[record.category] = (categoryTotals[record.category] || 0) + record.amount;
  });

  // Find highest spending category
  const highestCategory = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)[0];

  if (highestCategory) {
    insights.push({
      category: highestCategory[0],
      type: 'warning',
      title: `High Spending on ${highestCategory[0]}`,
      message: `You spent $${highestCategory[1].toFixed(2)} on ${highestCategory[0]}, which is a significant portion of your recent expenses.`,
      recommendation: 'Consider setting a budget limit for this category and tracking it weekly.'
    });
  }

  // Add general advice
  insights.push({
    category: 'Budget',
    type: 'info',
    title: 'Track Your Spending Regularly',
    message: 'Regular expense tracking helps you stay on top of your finances.',
    recommendation: 'Review your expenses weekly to identify patterns and adjust your budget accordingly.'
  });

  return insights;
}
 
   
    
                
        
   
