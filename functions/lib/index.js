"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.aichat = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions/v2/https"));
const vertexai_1 = require("@google-cloud/vertexai");
const v2_1 = require("firebase-functions/v2");
// Initialize Firebase Admin SDK
admin.initializeApp();
// Set the region for all functions in this file
const region = "us-east4";
(0, v2_1.setGlobalOptions)({ region: region });
// Initialize Vertex AI
const project = process.env.GCLOUD_PROJECT || "";
v2_1.logger.info(`Initializing Vertex AI with project: ${project} and location: ${region}`);
const vertexAI = new vertexai_1.VertexAI({
    project: project,
    location: region,
});
const model = "gemini-1.5-flash-latest";
// Gemini safety settings and generation config
const safetySettings = [
    {
        category: vertexai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: vertexai_1.HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
        category: vertexai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: vertexai_1.HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
];
const generationConfig = {
    maxOutputTokens: 8192,
    temperature: 0.7,
    topP: 1,
};
const generativeModel = vertexAI.getGenerativeModel({
    model: model,
    safetySettings: safetySettings,
    generationConfig: generationConfig,
});
v2_1.logger.info(`Vertex AI initialized with model: ${model}`);
/**
 * The core AI agent that processes messages from the user's inbox.
 *
 * This function is triggered whenever a new document is created in the
 * `inbox` subcollection of any user.
 */
exports.aichat = functions.onCall({ cors: true }, async (request) => {
    // 1. Authenticate the user
    if (!request.auth) {
        throw new functions.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }
    const userId = request.auth.uid;
    const { history, newMessage } = request.data;
    if (!newMessage) {
        throw new functions.HttpsError("invalid-argument", "The function must be called with a newMessage.");
    }
    try {
        v2_1.logger.info("Function started for user:", userId);
        const firestore = admin.firestore();
        // 2. Fetch user profile for long-term memory
        const profileDoc = await firestore
            .collection("users")
            .doc(userId)
            .collection("profile")
            .doc("main")
            .get();
        v2_1.logger.info("User profile fetched.");
        const userProfileContext = profileDoc.exists
            ? profileDoc.data()?.context || ""
            : "";
        const systemPrompt = `You are a helpful AI assistant. Your primary goal is to assist the user with their tasks, goals, and preferences. Here is some information about the user:
---
${userProfileContext}
---
Use this information to provide personalized and relevant responses. Be proactive and helpful.`;
        v2_1.logger.info(`Starting chat for user ${userId} with ${history.length} history messages.`);
        // 3. Start a chat session with history and system prompt
        const chat = generativeModel.startChat({
            history: history,
            systemInstruction: systemPrompt,
        });
        v2_1.logger.info("Chat session started.");
        // 4. Send the new message
        const result = await chat.sendMessage(newMessage);
        const resp = result.response;
        v2_1.logger.info("Received response from Vertex AI chat.");
        if (!resp ||
            !resp.candidates ||
            resp.candidates.length === 0 ||
            !resp.candidates[0].content ||
            !resp.candidates[0].content.parts ||
            resp.candidates[0].content.parts.length === 0) {
            throw new functions.HttpsError("internal", "AI failed to generate a response.");
        }
        const responseText = resp.candidates[0].content.parts[0].text;
        v2_1.logger.info("Successfully generated response text.");
        // 5. Return the response to the client
        return { text: responseText };
    }
    catch (error) {
        v2_1.logger.error("Error in aichat function:", {
            error: error.message,
            stack: error.stack,
            userId,
            requestData: request.data,
        });
        if (error instanceof functions.HttpsError) {
            throw error;
        }
        throw new functions.HttpsError("internal", "An unexpected error occurred.", { originalError: error.message });
    }
});
//# sourceMappingURL=index.js.map