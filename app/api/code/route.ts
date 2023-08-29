import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionRequestMessage } from "openai/resources/chat";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY 
});

export async function POST(req: Request) {
  try {
    // Make sure to adapt this part according to how Clerk expects you to use auth
    const { userId } = auth();  // Pass `req` if required

    const body = await req.json();
    const { messages } = body;

    const instructionMessage: ChatCompletionRequestMessage = {
        role: "system",
        content: "You are a code generator, you must answer only in markdown code snippets. Use code comments for explanations. Additionally, style the output so that it reads easier. For example, if there is something you believe to be the title, make the text bigger. Continue this for all of the text."
    }

   

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
      messages: [instructionMessage, ...messages],
    });

    if (response.status === 429) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }

    return NextResponse.json(response.choices[0].message);

  } catch (error) {
    console.log('[CODE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
