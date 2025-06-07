import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { InboxMessage, OutboxMessage } from "@/types";

/**
 * Sends a message from the user to the AI agent's inbox.
 * @param userId The ID of the user sending the message.
 * @param text The text content of the message.
 * @returns The ID of the newly created message document.
 */
export async function sendMessageToAI(
  userId: string,
  text: string
): Promise<string> {
  const inboxRef = collection(db, "users", userId, "inbox");
  const newMessage: Omit<InboxMessage, "id"> = {
    text,
    timestamp: serverTimestamp(),
    status: "pending",
  };
  const docRef = await addDoc(inboxRef, newMessage);
  return docRef.id;
}

/**
 * Sets up a real-time listener for the AI's outbox messages.
 * @param userId The ID of the user whose outbox to listen to.
 * @param onNewMessage A callback function that will be invoked with the new messages.
 * @returns An unsubscribe function to detach the listener.
 */
export function streamAIResponses(
  userId: string,
  onNewMessage: (messages: OutboxMessage[]) => void,
  options: { since?: Date } = {}
) {
  const outboxRef = collection(db, "users", userId, "outbox");
  let q = query(outboxRef, orderBy("timestamp", "asc"));

  if (options.since) {
    q = query(q, where("timestamp", ">", options.since));
  }

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const messages = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      } as OutboxMessage;
    });
    onNewMessage(messages);
  });

  return unsubscribe;
} 