import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v2/https";
import {
  VertexAI,
  HarmCategory,
  HarmBlockThreshold,
  Content,
  GenerationConfig,
} from "@google-cloud/vertexai";
import { logger, setGlobalOptions } from "firebase-functions/v2";

// Initialize Firebase Admin SDK
admin.initializeApp();

// Set the region for all functions in this file
const region = "us-east4";
setGlobalOptions({ region: region });

// Initialize Vertex AI
const project = process.env.GCLOUD_PROJECT;
logger.info(
  `Initializing Vertex AI for project: ${
    project ?? "(default)"
  } in location: ${region}`
);

const vertexAI = new VertexAI({
  project: project,
  location: region,
});
const model = "gemini-1.5-flash-latest";

// Gemini safety settings and generation config
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];
const generationConfig: GenerationConfig = {
  maxOutputTokens: 8192,
  temperature: 0.7,
  topP: 1,
};

const generativeModel = vertexAI.getGenerativeModel({
  model: model,
  safetySettings: safetySettings,
  generationConfig: generationConfig,
});

logger.info(`Vertex AI initialized with model: ${model}`);

/**
 * The core AI agent that processes messages from the user's inbox.
 *
 * This function is triggered whenever a new document is created in the
 * `inbox` subcollection of any user.
 */
export const aichat = functions.onCall(
  { cors: true },
  async (request: functions.CallableRequest<{ history: Content[], newMessage: string }>) => {
    // 1. Authenticate the user
    if (!request.auth) {
      throw new functions.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
      );
    }
    const userId = request.auth.uid;
    const { history, newMessage } = request.data;

    if (!newMessage) {
      throw new functions.HttpsError(
        "invalid-argument",
        "The function must be called with a newMessage."
      );
    }

    try {
      logger.info("Function started for user:", userId);
      const firestore = admin.firestore();

      // 2. Fetch user profile for long-term memory
      const profileDoc = await firestore
        .collection("users")
        .doc(userId)
        .collection("profile")
        .doc("main")
        .get();
      logger.info("User profile fetched.");

      const userProfileContext = profileDoc.exists
        ? profileDoc.data()?.context || ""
        : "";

      const systemPrompt = `You are a helpful AI assistant. Your primary goal is to assist the user with their tasks, goals, and preferences. Here is some information about the user:
---
${userProfileContext}
---
Use this information to provide personalized and relevant responses. Be proactive and helpful.`;

      logger.info(
        `Starting chat for user ${userId} with ${history.length} history messages.`
      );

      // 3. Start a chat session with history and system prompt
      const chat = generativeModel.startChat({
        history: history,
        systemInstruction: systemPrompt,
      });
      logger.info("Chat session started.");

      // 4. Send the new message
      const result = await chat.sendMessage(newMessage);
      const resp = result.response;
      logger.info("Received response from Vertex AI chat.");

      if (
        !resp ||
        !resp.candidates ||
        resp.candidates.length === 0 ||
        !resp.candidates[0].content ||
        !resp.candidates[0].content.parts ||
        resp.candidates[0].content.parts.length === 0
      ) {
        throw new functions.HttpsError(
          "internal",
          "AI failed to generate a response."
        );
      }

      const responseText = resp.candidates[0].content.parts[0].text;
      logger.info("Successfully generated response text.");

      // 5. Return the response to the client
      return { text: responseText };
    } catch (error) {
      const err = error as Error;
      logger.error("Error in aichat function:", {
        message: err.message,
        stack: err.stack,
        userId,
        requestData: request.data,
      });

      if (error instanceof functions.HttpsError) {
        throw error;
      }

      // Pass a more detailed error message to the client for easier debugging.
      throw new functions.HttpsError(
        "internal",
        `The function failed with the following error: ${err.message}`,
        { stack: err.stack }
      );
    }
  }
); 