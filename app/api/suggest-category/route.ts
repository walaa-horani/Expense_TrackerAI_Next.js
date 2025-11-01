import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(request: NextRequest){
  try{
      const { description } = await request.json();

    const   completion = await openai.chat.completions.create({
    
  model:"meta-llama/llama-3.2-3b-instruct:free",
  messages:[
     {
      "role": "system",
      content: `
      You are an expense categorization assistant.
      Choose exactly ONE category from the following list:
      [Food & Dining, Transportation, Shopping, Entertainment, Bills & Utilities, Healthcare, Education, Travel, Personal Care, Other].
      Respond with only the category name, nothing else.
      Example responses:
      "Food & Dining"
      "Transportation"
      `
    },

    {
      "role": "user",
      "content": `Categorize this expense: ${description}`
    }
  ],

   temperature: 0.3,
    max_tokens: 20
 })

 const suggestedCategory = completion.choices[0]?.message?.content?.trim() || 'Other'

 return NextResponse.json({category:suggestedCategory})
  }
  catch(error){
 console.error('Error suggesting category:', error);
 return NextResponse.json(
      { error: 'Failed to suggest category' },
      { status: 500 }
    );
  }
}

