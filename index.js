require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;
const EMAIL = process.env.EMAIL || "dhruv0240.be23@chitkara.edu.in"; // [cite: 40]

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- HELPER FUNCTIONS ---

// Fibonacci Series Generator
const getFibonacci = (n) => {
    if (typeof n !== 'number' || n < 0) throw new Error("Input must be a non-negative integer");
    if (n === 0) return [];
    if (n === 1) return [0];
    let series = [0, 1];
    while (series.length < n) {
        series.push(series[series.length - 1] + series[series.length - 2]);
    }
    return series.slice(0, n);
};

// Prime Checker
const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

// GCD (for HCF and LCM)
const gcd = (a, b) => (!b ? a : gcd(b, a % b));

// LCM
const lcm = (a, b) => (a * b) / gcd(a, b);

// --- ROUTES ---

// GET /health
app.get('/health', (req, res) => {
    res.status(200).json({
        "is_success": true,
        "official_email": EMAIL
    });
});

// POST /bfhl
app.post('/bfhl', async (req, res) => {
    try {
        const body = req.body;
        const keys = Object.keys(body);

        // Validation: Ensure exactly one functional key exists
        const validKeys = ['fibonacci', 'prime', 'lcm', 'hcf', 'AI'];
        const requestKey = keys.find(k => validKeys.includes(k));

        if (!requestKey || keys.length !== 1) {
            const error = new Error("Request must contain exactly one valid key: fibonacci, prime, lcm, hcf, or AI.");
            error.statusCode = 400;
            throw error;
        }

        let resultData;

        // Logic Mapping
        switch (requestKey) {
            case 'fibonacci':
                // Expecting Integer -> Returns Series
                const n = body.fibonacci;
                if (!Number.isInteger(n)) {
                    const err = new Error("fibonacci input must be an integer");
                    err.statusCode = 400;
                    throw err;
                }
                resultData = getFibonacci(n);
                break;

            case 'prime':
                // Expecting Array -> Returns Primes
                const pArr = body.prime;
                if (!Array.isArray(pArr)) {
                    const err = new Error("prime input must be an array");
                    err.statusCode = 400;
                    throw err;
                }
                resultData = pArr.filter(num => Number.isInteger(num) && isPrime(num));
                break;

            case 'lcm':
                // Expecting Array -> Returns LCM value
                const lArr = body.lcm;
                if (!Array.isArray(lArr) || lArr.length === 0) {
                    const err = new Error("lcm input must be a non-empty array");
                    err.statusCode = 400;
                    throw err;
                }
                resultData = lArr.reduce((acc, curr) => lcm(acc, curr));
                break;

            case 'hcf':
                // Expecting Array -> Returns HCF value
                const hArr = body.hcf;
                if (!Array.isArray(hArr) || hArr.length === 0) {
                    const err = new Error("hcf input must be a non-empty array");
                    err.statusCode = 400;
                    throw err;
                }
                resultData = hArr.reduce((acc, curr) => gcd(acc, curr));
                break;

            case 'AI':
                // Expecting String -> Returns Single-word AI response 
                const prompt = body.AI;
                if (typeof prompt !== 'string') {
                    const err = new Error("AI input must be a string");
                    err.statusCode = 400;
                    throw err;
                }

                // Gemini Integration 
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                // Strict instruction for single word response
                const aiResult = await model.generateContent(`${prompt} Answer in exactly one single word. do not use punctuation.`);
                const response = await aiResult.response;
                resultData = response.text().trim().split(' ')[0]; // Ensure single word
                break;
        }

        // Success Response
        res.status(200).json({
            "is_success": true,
            "official_email": EMAIL,
            "data": resultData
        });

    } catch (error) {
        // Graceful error handling 
        console.error("Error processing request:", error);
        res.status(error.statusCode || 500).json({
            "is_success": false,
            "official_email": EMAIL,
            "message": error.message || "Internal Server Error"
        });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});