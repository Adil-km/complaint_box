const { GoogleGenerativeAI } = require("@google/generative-ai");
const { complaintTools } = require("../tools/complaintTools");
const { createComplaint } = require("../controllers/complaintController");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite",
  tools: complaintTools,
  systemInstruction: `
    You are an AI complaint creation assistant
    for an employee management system.

    Your task is to understand employee complaints
    and convert them into structured complaint data.

    Instructions:
    1. Understand the employee's problem.
    2. Ask follow-up questions if important information is missing.
    3. Generate a short, meaningful complaint title (strict first person).
    4. Generate a clear and professional description (strict first person).
    5. Do not invent facts that the employee hasn't provided.
    6. Do not create a complaint yourself.
    7. Ask short questions one by one.
    8. Always use commas or full stop in each line as it would be in continuous text stream.
    9. Always send the title and description before submitting for creating a new complaint
  `
});

const sendChatMessage = async (req, res) => {
  try {
    const { history, newMessage, context } = req.body;
    
    if (!newMessage || typeof newMessage !== "string") {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const chat = model.startChat({history: history || []});

    let msg = newMessage

    if (context && context.complaints) {
      let ctx = `\n\n[For context only, no relation with user's message text, these are the complaints raised by the user, don't replay with star or bolding when asked about it, it should be short and simple in normal text, only include title and status(in bracket) separated by commas, only give description if user asked.] don't list complaints without asking`;
      ctx += `\nTotal complaints: ${context.totalComplaints}`;

      if (context.complaints.length > 0) {
          for (const c of context.complaints) {
              ctx += `\n${JSON.stringify(c)}`;
          }
      }

      ctx += "\n[End of context]";
      msg += ctx;
    }


    let result = await chat.sendMessage(msg);

    const calls = result.response.functionCalls();

    if (calls?.length) {
      const call = calls[0];

      if (call.name === "createComplaint") {
        let responseData;

        const mockReq = {
          body: call.args,
          user: req.user
        };

        const mockRes = {
          status() {
            return this;
          },
          json(data) {
            responseData = data;
            return this;
          }
        };

        await createComplaint(mockReq, mockRes);

        result = await chat.sendMessage([
          {
            functionResponse: {
              name: call.name,
              response: {
                result: responseData
              }
            }
          }
        ]);
      }
    }

    return res.json({
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