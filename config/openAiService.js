// const { OpenAI } = require("openai");
// require("dotenv").config();

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// const askOpenAIStream = async (prompt, res) => {
//     try {
//         const response = await openai.chat.completions.create({
//             model: "gpt-4o",
//             messages: [{ role: "user", content: prompt }],
//             max_tokens: 500,
//             stream: true, // ✅ Streaming enabled
//         });

//         // ✅ Stream response word-by-word
//         for await (const chunk of response) {
//             const content = chunk.choices[0]?.delta?.content || "";
//             if (content) {
//                 res.write(content);
//             }
//         }

//         res.end();
//     } catch (error) {
//         console.error("Streaming Error:", error);
//         res.status(500).json({ message: "Error with OpenAI streaming" });
//     }
// };

// module.exports = { askOpenAIStream };
