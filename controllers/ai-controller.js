// const { askOpenAIStream } = require("../config/openAiService");

// // 🎓 Student doubt solving with typing effect
// const solveStudentDoubt = async (req, res) => {
//     const { question } = req.body;
//     if (!question) return res.status(400).json({ message: "Please provide a question" });

//     const prompt = `A student asked: "${question}". Provide a clear and simple explanation.`;
    
//     res.setHeader("Content-Type", "text/plain"); //  Ensure streaming text format
//     askOpenAIStream(prompt, res);
//     console.log(res)
// };

// // 🎓 Instructor Assignment & MCQ Generation with typing effect
// const generateAssignment = async (req, res) => {
//     const { topic, type } = req.body;
//     if (!topic || !type) return res.status(400).json({ message: "Please provide topic and type (assignment/mcq)" });

//     let prompt;
//     if (type === "assignment") {
//         prompt = `Generate a detailed assignment on the topic: "${topic}". Include questions and explanations.`;
//     } else if (type === "mcq") {
//         prompt = `Generate 5 multiple choice questions with options and correct answers on the topic: "${topic}".`;
//     } else {
//         return res.status(400).json({ message: "Invalid type, use 'assignment' or 'mcq'" });
//     }

//     res.setHeader("Content-Type", "text/plain"); // ✅ Streaming response
//     askOpenAIStream(prompt, res);
// };

// module.exports = { solveStudentDoubt, generateAssignment };
