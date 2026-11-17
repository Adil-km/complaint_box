
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite",
  systemInstruction: `
    You are an AI complaint creation assistant
    for an employee management system.

    Your task is to understand employee complaints
    and convert them into structured complaint data.

    Instructions:
    1. Understand the employee's problem.
    2. Ask follow-up questions if important information
       is missing.
    3. Generate a short, meaningful complaint title.
    4. Generate a clear and professional description.
    5. Do not invent facts that the employee hasn't provided.
    6. Do not create a complaint yourself.
    7. The questions should be short and ask one by one
       instead of asking all in one question.
  `
});

export async function sendChatMessage(history, newMessage) {
  try {
    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(newMessage);

    return result.response.text();

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
