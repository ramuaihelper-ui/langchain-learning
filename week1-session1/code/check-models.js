// check-models.js - See what Ollama models you have installed
import { execSync } from "child_process";

console.log("📋 Your installed Ollama models:\n");

try {
  const output = execSync("ollama list", { encoding: "utf-8" });
  console.log(output);
  
  console.log("\n✅ To use any model above, update the code:");
  console.log('   const llm = new ChatOllama({');
  console.log('     baseUrl: "http://localhost:11434",');
  console.log('     model: "kimi-k2.5",  // <-- Change this');
  console.log('   });');
} catch (error) {
  console.log("❌ Ollama not running or installed");
  console.log("   Install: https://ollama.com/download");
  console.log("   Then: ollama pull kimi-k2.5");
}
