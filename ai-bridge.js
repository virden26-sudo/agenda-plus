const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyAc-5b06tOEjZOe_PZTEQAkqdvXnYLaPb4Y"; 
const genAI = new GoogleGenerativeAI(API_KEY);
const upload = multer({ dest: 'uploads/' });

const apiApp = express();
apiApp.use(cors());
apiApp.use(express.json());

apiApp.post('/upload-syllabus', upload.single('syllabus'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const filePath = req.file.path;
        const mimeType = req.file.mimetype;
        let isImage = mimeType.startsWith('image/');

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        let prompt = `Extract all assignments, quizzes, and exams as a JSON array. 
                      Each object should have "title", "dueDate", and "course". 
                      Return ONLY the JSON array.`;

        let result;

        if (isImage) {
            const imageData = {
                inlineData: {
                    data: fs.readFileSync(filePath).toString("base64"),
                    mimeType
                }
            };
            result = await model.generateContent([prompt, imageData]);
        } else if (mimeType === 'application/pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            result = await model.generateContent(prompt + "

Text: " + data.text.substring(0, 15000));
        } else {
            const textContent = fs.readFileSync(filePath, 'utf8');
            result = await model.generateContent(prompt + "

Text: " + textContent.substring(0, 20000));
        }

        const response = await result.response;
        const text = response.text();
        const jsonMatch = text.match(/\[.*\]/s);
        const assignments = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

        fs.unlinkSync(filePath);
        res.json({ assignments });
    } catch (err) {
        console.error(err);
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: "AI failed to process the file." });
    }
});

const PORT = 9003;
apiApp.listen(PORT, () => {
    console.log(`AI Bridge server running on port ${PORT}`);
});
