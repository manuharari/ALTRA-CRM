
import { GoogleGenAI, Type } from "@google/genai";
import { CrmRecord, SaleStage } from "../types";

// Fixed: Removed import.meta.env to resolve TypeScript error and follow guidelines to use process.env.API_KEY exclusively.
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeRecord = async (record: CrmRecord, customPrompt?: string, language: 'es' | 'en' = 'es'): Promise<string> => {
  const ai = getAiClient();

  const langInstruction = language === 'es' ? 'Responder en Español.' : 'Respond in English.';
  
  const systemPrompt = `
    You are an expert CRM Sales Assistant. 
    Analyze the provided customer record.
    ${langInstruction}
    If a custom prompt is provided, follow it strictly using the record as context.
    If no custom prompt is provided, provide:
    1. A brief strategic recommendation to close this specific deal.
    2. A tactical next step.
  `;

  const recordContext = JSON.stringify(record, null, 2);
  
  const userContent = customPrompt 
    ? `Record: ${recordContext}\n\nUser Request: ${customPrompt}`
    : `Analyze this record for strategic next steps: ${recordContext}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userContent,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating analysis. Please check your API Quota or Key.";
  }
};

export const generateDailyBriefing = async (records: CrmRecord[], language: 'es' | 'en' = 'es'): Promise<string> => {
  const ai = getAiClient();

  const langInstruction = language === 'es' ? 'Responder en Español.' : 'Respond in English.';
  
  // Filter for active deals only to save tokens and focus relevance
  const activeRecords = records.filter(r => r.saleStage !== 'Closed Lost' && r.saleStage !== 'Closed Won');
  const summaryData = activeRecords.map(r => ({
    company: r.companyName,
    stage: r.saleStage,
    value: r.dealValue,
    nextAction: r.nextAction,
    date: r.nextActionDate,
    lastActivity: r.lastActivityDate
  }));

  const systemPrompt = `
    You are a VP of Sales acting as a daily coach.
    Review the list of active opportunities.
    ${langInstruction}
    
    Task:
    1. Identify the top 3 priorities for TODAY based on 'nextActionDate' (urgency) and 'dealValue' (impact).
    2. Highlight any stalled deals (no activity in >30 days).
    3. Provide a motivational quote or quick tip for the day.
    
    Format nicely with bullet points and bold text for readability.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Here is the current pipeline summary: ${JSON.stringify(summaryData)}`,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    return response.text || "No briefing generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating briefing.";
  }
};

export const parseSalesOrder = async (text: string): Promise<{ dealValue: number; saleStage: SaleStage; notes: string }> => {
  const ai = getAiClient();

  // We want JSON output
  const systemPrompt = `
    You are a Sales Operations Data Entry Agent.
    Extract the total monetary value from the provided text (Sales Order, Email, Invoice, etc.).
    Determine if this indicates a Closed Won sale, or a Negotiation/Proposal stage.
    
    Return JSON format only:
    {
      "dealValue": number,
      "saleStage": "Closed Won" | "Negotiation" | "Proposal",
      "summary": "string (short summary of what was ordered)"
    }
    
    If no value is found, estimate or set to 0.
    If the text implies a confirmed order, use "Closed Won".
    If it is a quote request, use "Proposal".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: text,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
             dealValue: { type: Type.NUMBER },
             saleStage: { type: Type.STRING, enum: Object.values(SaleStage) },
             summary: { type: Type.STRING }
          }
        }
      }
    });

    const result = JSON.parse(response.text);
    return {
      dealValue: result.dealValue,
      saleStage: result.saleStage as SaleStage,
      notes: result.summary
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { dealValue: 0, saleStage: SaleStage.Negotiation, notes: "Error parsing order." };
  }
};