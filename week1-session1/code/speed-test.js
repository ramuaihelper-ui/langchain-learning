// ============================================================================
// SPEED TEST: Compare LLM Models
// ============================================================================
//
// WHAT THIS DOES:
// - Tests multiple Ollama models for speed
// - Shows response time for each
// - Runs same prompt on all models
// - Helps you pick the fastest for your use case
//
// RUN: node speed-test.js
//
// ============================================================================

import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Models to test (add/remove as needed)
const modelsToTest = [
  { name: "llama3.2:latest", description: "Meta Llama 3.2 (recommended fast)" },
  { name: "kimi-k2.5:cloud", description: "Kimi k2.5 (current, slower but smart)" },
  { name: "mistral:latest", description: "Mistral (balanced)" },
  { name: "qwen2.5:0.5b", description: "Qwen 2.5 0.5B (very fast, basic)" },
  { name: "gemma:2b", description: "Google Gemma 2B (lightweight)" },
];

// Test prompt (short and simple)
const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant."],
  ["user", "Say hello briefly"],
]);

const parser = new StringOutputParser();

console.log("🏎️  LLM Speed Test\n");
console.log("=" .repeat(60));
console.log("Testing models with same prompt...\n");

async function testModel(modelName) {
  const llm = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: modelName,
    temperature: 0.7,
  });

  const chain = promptTemplate.pipe(llm).pipe(parser);
  
  const start = Date.now();
  let success = false;
  let response = "";
  let error = "";
  
  try {
    response = await chain.invoke({});
    success = true;
  } catch (e) {
    error = e.message;
  }
  
  const duration = Date.now() - start;
  
  return {
    model: modelName,
    duration,
    success,
    response: response?.substring(0, 50) + "...",
    error: error?.substring(0, 50)
  };
}

async function runTests() {
  const results = [];
  
  for (const model of modelsToTest) {
    process.stdout.write(`⏱️  Testing ${model.name}... `);
    
    const result = await testModel(model.name);
    results.push({ ...result, description: model.description });
    
    if (result.success) {
      console.log(`✅ ${result.duration}ms`);
    } else {
      console.log(`❌ Failed: ${result.error}`);
    }
  }
  
  // Sort by speed (fastest first)
  const successfulResults = results.filter(r => r.success).sort((a, b) => a.duration - b.duration);
  
  console.log("\n" + "=" .repeat(60));
  console.log("🏁 RESULTS (Fastest to Slowest):\n");
  
  successfulResults.forEach((result, index) => {
    const rank = index + 1;
    const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "  ";
    console.log(`${medal} ${rank}. ${result.model}`);
    console.log(`      Time: ${result.duration}ms (${(result.duration/1000).toFixed(2)}s)`);
    console.log(`      Desc: ${result.description}`);
    console.log(`      Sample: "${result.response}"`);
    console.log();
  });
  
  // Recommendation
  console.log("=" .repeat(60));
  console.log("💡 RECOMMENDATION:\n");
  
  if (successfulResults.length > 0) {
    const fastest = successfulResults[0];
    console.log(`Fastest: ${fastest.model} (${fastest.duration}ms)`);
    console.log(`Quality comparison: Llama3.2 ≈ Kimi > Qwen-small\n`);
    
    console.log("For your Hinglish app:");
    if (fastest.duration < 2000) {
      console.log("✅ Fast enough for real-time chat");
    } else if (fastest.duration < 5000) {
      console.log("⚡ Good for most use cases");
    } else {
      console.log("⏱️  Consider optimizing (streaming, token limits)");
    }
  }
  
  // Show failed models
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log("\n⚠️  Models not available (install with 'ollama pull'):")
    failed.forEach(f => {
      console.log(`   - ${f.model}: ${f.error}`);
    });
  }
  
  console.log("=" .repeat(60));
  
  // Interactive: Test your custom prompt
  console.log("\n🧪 Want to test with YOUR prompt?");
  console.log("Edit the 'Test prompt' section in speed-test.js");
  console.log("Or run: node agent-chat.js (uses your actual chat logic)\n");
}

// Run
runTests().catch(console.error);
