const { GoogleGenerativeAI } = require("@google/generative-ai");

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
    2. Ask follow-up questions if important information is missing.
    3. Generate a short, meaningful complaint title.
    4. Generate a clear and professional description.
    5. Do not invent facts that the employee hasn't provided.
    6. Do not create a complaint yourself.
    7. Ask short questions one by one.
  `
});

const sendChatMessage = async (req, res) => {
  try {
    const { history, newMessage } = req.body;

    if (!newMessage || typeof newMessage !== "string") {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const chat = model.startChat({history: history || []});

    const result = await chat.sendMessage(newMessage);

    return res.status(200).json({
      success: true,
      response: result.response.text()
    });

  } catch (error) {
    console.error("Gemini Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to communicate with AI"
    });
  }
};

module.exports = {sendChatMessage};