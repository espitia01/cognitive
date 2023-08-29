import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY 
});

export async function POST(req: Request) {
  try {
    // Make sure to adapt this part according to how Clerk expects you to use auth
    const { userId } = auth();  // Pass `req` if required

    const body = await req.json();
    const { messages } = body;

    const systemMessage = {
        role: "system",
        content: "You are a helpful assistant that generates responses in HTML formatted text."
      };

    const combinedMessages = [systemMessage, ...messages];

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: combinedMessages,
    });

    if (response.status === 429) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }

    return NextResponse.json(response.choices[0].message);

  } catch (error) {
    console.log('[CONVERSATION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
