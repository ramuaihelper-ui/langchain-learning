// ============================================================================
// SESSION 1 BONUS: Streaming + Error Handling
// ============================================================================
//
// WHAT THIS ADDS TO HINGLISHCHAIN:
// 1. STREAMING: Watch translation generate token-by-token (feels faster)
// 2. ERROR HANDLING: Graceful failures, retries, user-friendly messages
//
// REAL-WORLD USE:
// - Show loading state while streaming
// - Retry failed requests automatically
// - Don't crash app when Ollama is offline
// ============================================================================

import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

// Same schema as before
const hinglishResponseSchema = z.object({
  translated_text: z.string(),
  detected_language: z.string(),
  confidence: z.number().min(0).max(1),
  alternative_translations: z.array(z.string()).default([]),
  cultural_notes: z.string().optional(),
});

export class HinglishChainPro {
  constructor(modelName = "kimi-k2.5:cloud", options = {}) {
    this.modelName = modelName;
    this.chain = null;

    // Error handling options
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000; // ms
    this.timeout = options.timeout || 30000; // 30 seconds
  }

  // Initialize chain (async)
  async init() {
    if (this.chain) return;

    const llm = new ChatOllama({
      baseUrl: "http://localhost:11434",
      model: this.modelName,
      temperature: 0.3,
    });

    const parser = StructuredOutputParser.fromZodSchema(hinglishResponseSchema);

    const prompt = await ChatPromptTemplate.fromMessages([
      ["system", `You are a curious, supportive friend who loves listening and sharing fascinating facts. You translate Hinglish naturally while being warm and conversational.

When someone shares with you:
- Casual/social chat → Reply like a friend, with warmth and curiosity
- Translation needed → Provide it naturally + cultural context
- Always make them feel heard
- Share 1-2 interesting facts when relevant (etymology, history, cultural parallels)
- Approachable and warm - like texting a friend

{format_instructions}`],
      ["user", "{hinglish_text}"],
    ]).partial({
      format_instructions: parser.getFormatInstructions()
    });

    this.chain = prompt.pipe(llm).pipe(parser);
  }

  // ==========================================================================
  // METHOD 1: Normal Translation (what we have)
  // ==========================================================================
  async translate(text) {
    await this.init();

    // Wrap in try-catch for error handling
    try {
      console.log(`🔄 Translating: "${text}"`);
      const result = await this.chain.invoke({ hinglish_text: text });
      console.log(`✅ Translation complete!`);
      return result;

    } catch (error) {
      // Handle specific error types
      if (error.code === "ECONNREFUSED") {
        throw new Error("Ollama is not running! Start with: ollama serve");
      }
      if (error.name === "OutputParserException") {
        throw new Error("Model returned invalid JSON. Try again.");
      }
      throw error; // Re-throw unknown errors
    }
  }

  // ==========================================================================
  // METHOD 2: Streaming with Raw LLM (For real-time UI updates)
  // ==========================================================================
  // Stream raw text tokens (not structured) - better for UI responsiveness
  async translateStreamRaw(text, onToken) {
    await this.init();

    console.log(`🔄 Streaming translation: "${text}"\n`);

    try {
      // Stream from LLM directly (before parser)
      const llm = new ChatOllama({
        baseUrl: "http://localhost:11434",
        model: this.modelName,
        temperature: 0.3,
      });

      const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You're a curious friend chatting. Listen and respond naturally with interesting context when it fits. Translate as needed."],
        ["user", "{text}"],
      ]);

      const stream = await prompt.pipe(llm).stream({ text });

      let fullText = "";

      for await (const chunk of stream) {
        const content = chunk.content || chunk;
        fullText += content;

        if (onToken) {
          onToken(content);
        } else {
          process.stdout.write(content);
        }
      }

      console.log("\n✅ Stream complete!");
      return { translated_text: fullText };

    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==========================================================================
  // METHOD 3: Translation with Retries (NEW!)
  // ==========================================================================
  // Automatically retries on failure (network issues, model busy, etc.)
  async translateWithRetry(text) {
    let lastError;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${this.maxRetries}...`);
        const result = await this.translate(text);
        return result;

      } catch (error) {
        lastError = error;
        console.log(`❌ Attempt ${attempt} failed: ${error.message}`);

        // Don't retry if it's a validation error (won't fix itself)
        if (error.name === "OutputParserException") {
          throw error;
        }

        // Wait before retrying
        if (attempt < this.maxRetries) {
          console.log(`⏳ Retrying in ${this.retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        }
      }
    }

    // All retries failed
    throw new Error(`Failed after ${this.maxRetries} attempts: ${lastError.message}`);
  }

  // ==========================================================================
  // METHOD 4: CHAT MODE (Conversational, no JSON)
  // ==========================================================================
  // Just chat like a friend - no structured output, just warm conversation
  async chat(message, history = []) {
    try {
      const llm = new ChatOllama({
        baseUrl: "http://localhost:11434",
        model: this.modelName,
        temperature: 0.8,  // More creative for conversation
      });

      const prompt = ChatPromptTemplate.fromMessages([
        ["system", `You are a warm, curious friend who loves chatting about life, culture, and languages. You're knowledgeable about Indian culture, Hinglish expressions, and love sharing interesting facts.

You're texting with a friend. Be:
- Warm and supportive (use emojis occasionally 💫)
- Curious about their stories
- Ready with a fun fact or cultural tidbit when it fits naturally
- Brief but engaging (like a real text conversation)
- Happy to translate or explain things when asked
- Sometimes just listen and validate their feelings

If they share something personal: validate + maybe a gentle insight
If they ask about Hinglish: explain + share origin/cultural context
If they seem down: supportive + encouraging
If they seem excited: celebrate with them! 🎉`],
        ...history,  // Previous messages
        ["user", "{message}"],
      ]);

      const chain = prompt.pipe(llm);
      const response = await chain.invoke({ message });

      return response.content;

    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==========================================================================
  // ERROR HANDLER (Helper method)
  // ==========================================================================
  handleError(error) {
    // Map technical errors to user-friendly messages
    const errorMap = {
      "ECONNREFUSED": "⚠️  Cannot connect to Ollama. Is it running?",
      "ENOTFOUND": "⚠️  Ollama server not found. Check your setup.",
      "ETIMEDOUT": "⚠️  Request timed out. Model might be busy.",
      "ECONNRESET": "⚠️  Connection lost. Please try again.",
    };

    const message = errorMap[error.code] || error.message;
    console.error(`\n❌ Error: ${message}`);

    return new Error(message);
  }
}

// ============================================================================
// DEMONSTRATION
// ============================================================================

async function demo() {
  const chain = new HinglishChainPro("kimi-k2.5:cloud", {
    maxRetries: 3,
    retryDelay: 1000,
  });

  console.log("=".repeat(60));
  console.log("DEMO 1: NORMAL TRANSLATION\n");
  console.log("=".repeat(60));

  try {
    const result = await chain.translate("kya baat hai yaar!");
    console.log("\nResult:", JSON.stringify(result, null, 2));
  } catch (e) {
    console.error(e.message);
  }

  console.log("\n" + "=".repeat(60));
  console.log("DEMO 2: STREAMING (Watch it generate!)");
  console.log("=".repeat(60) + "\n");

  try {
    // Streaming with custom callback
    await chain.translateStreamRaw("mast hai yaar", (token) => {
      // In a React app, this would update UI state!
      // setPartialText(prev => prev + token)
      process.stdout.write(token);
    });
    console.log("\n");
  } catch (e) {
    console.error(e.message);
  }

  console.log("\n" + "=".repeat(60));
  console.log("DEMO 3: WITH RETRY LOGIC");
  console.log("=".repeat(60) + "\n");

  try {
    const result = await chain.translateWithRetry("kitna badiya hai");
    console.log("\nResult:", result.translated_text);
  } catch (e) {
    console.error(e.message);
  }

  console.log("\n" + "=".repeat(60));
  console.log("DEMO 4: CHAT MODE (Friendly conversation)");
  console.log("=".repeat(60) + "\n");

  try {
    // Simple chat
    const response1 = await chain.chat("Yaar, aaj bohot thak gaya hun");
    console.log("User: Yaar, aaj bohot thak gaya hun");
    console.log("Friend:", response1);
    console.log();

    // Chat with history (contextual conversation)
    const history = [
      ["human", "Yaar, aaj bohot thak gaya hun"],
      ["ai", response1],
    ];

    const response2 = await chain.chat("Kya karun samajh nahi aa raha", history);
    console.log("User: Kya karun samajh nahi aa raha");
    console.log("Friend:", response2);

  } catch (e) {
    console.error(e.message);
  }
}

// Run the demo
demo();

// ============================================================================
// INTEGRATION WITH REACT NATIVE
// ============================================================================
/*
import { useState } from 'react';

function ChatComponent() {
  const [translation, setTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const chain = new HinglishChainPro('kimi-k2.5:cloud');
  
  const handleTranslate = async (text) => {
    setIsLoading(true);
    setError(null);
    setTranslation('');
    
    try {
      // Option 1: Normal (wait for full response)
      const result = await chain.translate(text);
      setTranslation(result.translated_text);
      
      // Option 2: Streaming (show as it generates)
      await chain.translateStreamRaw(text, (token) => {
        setTranslation(prev => prev + token);
      });
      
    } catch (err) {
      setError(err.message); // User-friendly error!
    } finally {
      setIsLoading(false);
    }
  };
  
  // Chat mode - conversational
  const handleChat = async (message) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await chain.chat(message, chatHistory);
      setChatHistory(prev => [...prev, 
        ["human", message],
        ["ai", response]
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
/*
// React Native Component Example (commented out - just reference)

import { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

function ChatComponent() {
  const [translation, setTranslation] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const chain = new HinglishChainPro('kimi-k2.5:cloud');
  
  const handleTranslate = async (text) => {
    setIsLoading(true);
    setError(null);
    setTranslation('');
    
    try {
      const result = await chain.translate(text);
      setTranslation(result.translated_text);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChat = async (message) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await chain.chat(message, chatHistory);
      setChatHistory(prev => [...prev, 
        ['human', message],
        ['ai', response]
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View>
      {error && <Text style={{color: 'red'}}>{error}</Text>}
      {isLoading && <ActivityIndicator />}
      <Text>{translation}</Text>
      {chatHistory.map((msg, i) => (
        <View key={i} style={{padding: 10}}>
          <Text>{msg[1]}</Text>
        </View>
      ))}
    </View>
  );
}
*/
