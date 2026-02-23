import { Request, Response } from 'express';
const { GoogleGenAI } = require('@google/genai');
import prisma from '../utils/prisma';

// Initialize the Google Gen AI client with the system API key
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || 'dummy_key'
});

export const smartSearch = async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // 1. Fetch all available product names and categories to give Gemini context
        const products = await prisma.product.findMany({
            where: { isActive: true },
            select: { name: true, category: true }
        });

        const productCatalogContext = products.map(p => `${p.name} (${p.category})`).join(', ');

        // 2. Query Gemini for semantic extraction
        const prompt = `
            You are a smart shopping assistant for Vemgal Mart. 
            The user searched for: "${query}".
            
            Here is our current catalog of products: ${productCatalogContext}
            
            Based on the user's semantic intent (e.g., if they ask for "spicy dinner", they want spices, rice, chicken), 
            return ONLY a raw JSON array of strings containing the exact Product Names from the catalog that best fulfill their request.
            Do not include Markdown formatting like \`\`\`json. Return a maximum of 6 relevant items.
        `;

        let recommendedProductNames: string[] = [];

        try {
            if (process.env.GEMINI_API_KEY) {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });

                const responseText = response.text || '[]';

                // Extremely defensive JSON parsing, as LLMs frequently inject formatting
                const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
                recommendedProductNames = JSON.parse(cleanedText);
            } else {
                console.log("No GEMINI_API_KEY present. Skipping AI logic and returning an empty smart match array.");
            }
        } catch (aiError) {
            console.error('Gemini API Error (fallback to basic search):', aiError);
            // Fallthrough: Let it return empty array so standard search can catch it
        }

        // 3. Fetch the actual rich product objects from Prisma based on the AI's exact name recommendations
        let recommendedProducts: any[] = [];

        if (Array.isArray(recommendedProductNames) && recommendedProductNames.length > 0) {
            recommendedProducts = await prisma.product.findMany({
                where: {
                    name: {
                        in: recommendedProductNames
                    },
                    isActive: true
                },
                include: {
                    seller: {
                        select: { name: true, shopName: true }
                    }
                }
            });
        }

        res.status(200).json({
            isSmartSearch: true,
            products: recommendedProducts,
        });

    } catch (error) {
        console.error('Smart Search Error:', error);
        res.status(500).json({ message: 'An error occurred during smart search processing' });
    }
};
