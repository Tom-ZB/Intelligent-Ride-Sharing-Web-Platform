const aiDAO = require('../DAO/aiDAO');
const OpenAI = require('openai'); // 使用 openai 库

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY, // 从环境变量读取 API key
// });

// 5.1 获取AI行程建议
// exports.getAISuggestions = async (req, res) => {
//     try {
//         const userId = req.user.id; // 从 JWT 中解析的用户ID
//         const { query } = req.body;
//
//         if (!query) {
//             return res.status(400).json({ error: "Query is required" });
//         }
//
//         // 调用 OpenAI API (可换成其他 AI 服务)
//         const completion = await openai.chat.completions.create({
//             model: "gpt-4o-mini",
//             messages: [{ role: "user", content: query }],
//         });
//
//         const aiResponse = completion.choices[0].message.content;
//
//         // 存储 AI 交互记录到数据库
//         const timestamp = await aiDAO.saveAIInteraction(userId, query, aiResponse);
//
//         res.json({
//             res: aiResponse,
//             timestamp,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Failed to get AI suggestion" });
//     }
// };
