import { GoogleGenAI, Chat } from "@google/genai";
import { 
  PROPOSAL_CONTENT, 
  TECHNICAL_CONTENT, 
  CYBERSECURITY_GUIDE,
  TROUBLESHOOTING_CHEAT_SHEET,
  FREELANCER_AGREEMENT,
  TECH_SAFETY_CHECKLIST,
  DEVOPS_GUIDE,
  HELP_DESK_GUIDE,
  WEBSITE_AUDIT_GUIDE
} from "../data/projectData";

const getClient = (): GoogleGenAI => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeSecurityLog = async (logData: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a cybersecurity expert specializing in HIPAA and healthcare compliance. 
      Analyze the following security log entry from the MediAccess system. 
      Explain the potential risk and suggest a mitigation strategy.
      
      Log Data: ${logData}
      
      Keep the response concise (under 100 words).`,
    });
    return response.text || "Analysis failed.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to analyze log at this time due to an API error.";
  }
};

export const askComplianceQuestion = async (question: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a compliance officer for MediAccess, a biometric healthcare authentication platform.
      Answer the following question regarding HIPAA/GDPR compliance or the MediAccess system architecture.
      
      Context:
      - MediAccess uses Multi-factor authentication (MFA) with facial recognition and fingerprinting.
      - Data is encrypted end-to-end.
      - Passwords hashed with bcrypt.
      - Biometric data is tokenized and stored securely.
      
      Question: ${question}`,
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to connect to the compliance AI assistant.";
  }
};

export const summarizeDocument = async (docContent: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an investment analyst and technical expert. Summarize the following project documentation for a potential investor. Highlight the value proposition, technical feasibility, and financial outlook.
      
      Document Content:
      ${docContent.substring(0, 10000)}... (truncated for API limits if necessary)
      
      Provide a bulleted executive summary.`,
    });
    return response.text || "Summary generation failed.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate summary at this time.";
  }
};

export const createSystemChat = (liveContext: string = "No live system data available."): Chat => {
  const ai = getClient();
  const systemInstruction = `You are the MediAccess System Assistant. You are an expert on the MediAccess project and its operational procedures.
  
  Your goal is to assist users (Staff, Admins, Investors, Partners) by answering questions about the project's proposal, technical architecture, financials, roadmap, and operational support.

  === LIVE SYSTEM STATUS ===
  ${liveContext}
  (Use this data to answer questions about current patients, alerts, tasks, or revenue)
  
  === PROJECT DOCUMENTATION (RESTRICTED) ===
  ${PROPOSAL_CONTENT}
  
  ${TECHNICAL_CONTENT}

  === OPERATIONAL SUPPORT & CYBERSECURITY ===
  ${CYBERSECURITY_GUIDE}

  ${TROUBLESHOOTING_CHEAT_SHEET}

  ${DEVOPS_GUIDE}

  ${TECH_SAFETY_CHECKLIST}

  ${HELP_DESK_GUIDE}

  ${WEBSITE_AUDIT_GUIDE}

  === LEGAL & HR ===
  ${FREELANCER_AGREEMENT}
  
  Rules:
  1. Be helpful, professional, and concise.
  2. If a user asks about something not in the documents, state that it is outside the current scope of the documentation.
  3. Format your answers nicely with Markdown.
  4. If a user asks for specific technical commands (e.g., Linux, Network), use the Cheat Sheets provided.
  5. If a user asks about security protocols or troubleshooting, refer to the Cybersecurity Guide.
  6. If a user asks about help desk operations, refer to the Help Desk Guide.
  `;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
    },
  });
};