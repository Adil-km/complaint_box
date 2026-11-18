const complaintTools = [
  {
    functionDeclarations: [
      {
        name: "createComplaint",
        description: "Submit a new complaint for the authenticated user.",
        parameters: {
          type: "OBJECT",
          properties: {
            title: {
              type: "STRING",
              description: "Complaint title"
            },
            description: {
              type: "STRING",
              description: "Detailed complaint description"
            }
          },
          required: ["title", "description"]
        }
      }
    ]
  }
];

module.exports = { complaintTools };