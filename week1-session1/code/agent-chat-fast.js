// ============================================================================
// AGENT CHAT - FAST VERSION
// ============================================================================
//
// Optimizations applied:
// 1. Faster model (llama3.2)
// 2. Limited tokens (faster response)
// 3. Smaller context window
// 4. Lower temperature (more predictable)
//
// ============================================================================

import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import readline from "readline";

// OPTIMIZED: Fast model with speed settings
const llm = new ChatOllama({
  baseUrl: "http://localhost:11434",
  model: "llama3.2:latest",      // ⚡ MUCH faster than kimi
  temperature: 0.5,              // Balanced: not too random
  num_ctx: 2048,                 // Smaller context = faster
  num_predict: 100,              // ⏱️ Max 100 tokens (faster responses)
});

// Tool functions (same as before, but simplified)
function quickAnalyze(input) {
  const text = input.toLowerCase();
  const positive = text.match(/mast|happy|great|good|awesome|excited|love|badiya|sahi|acha/);
  const negative = text.match(/sad|bad|thak|tired|upset|worried|stressed|nahi/);
  
  const hinglish = /(yaar|mast|thak|bohot|kya|kar|raha)/i.test(text);
  
  let sentiment = "neutral";
  if (positive) sentiment = "positive";
  if (negative) sentiment = "negative";
  
  return { sentiment, hinglish };
}

async function processMessage(userInput) {
  const start = Date.now();
  const analysis = quickAnalyze(userInput);
  
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `Text back like a friend. They said: "{input}" (feeling {sentiment}). Casual, warm, short. Can use Hinglish if they did.`],
    ["user", "{input}"]
  ]);
  
  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  
  const response = await chain.invoke({
    input: userInput,
    sentiment: analysis.sentiment
  });
  
  const duration = Date.now() - start;
  
  return { response, duration };
}

// Chat loop
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("🚀 FAST CHAT MODE (llama3.2)");
console.log("Model: llama3.2:latest");
console.log("Max tokens: 100 | Temp: 0.5");
console.log("Type 'quit' to exit\n");

async function chat() {
  rl.question("👤 You: ", async (input) => {
    if (input.toLowerCase() === "quit") {
      console.log("\n👋 Bye!");
      process.exit(0);
    }

    console.log("⚡ Thinking...");
    
    try {
      const result = await processMessage(input);
      console.log(`🤖 Friend: ${result.response}`);
      console.log(`⏱️  (${result.duration}ms)\n`);
    } catch (e) {
      console.error("❌ Error:", e.message);
    }

    chat();
  });
}

chat();
