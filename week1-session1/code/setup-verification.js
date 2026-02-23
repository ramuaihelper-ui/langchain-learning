// ============================================================================
// SETUP VERIFICATION - Test Your Environment
// ============================================================================
//
// WHAT THIS DOES:
// Before starting the session, run this to verify everything works.
// It tests:
// - Ollama is running
// - Model is accessible
// - Dependencies are installed
// - Network connectivity
//
// RUN THIS FIRST: node setup-verification.js
//
// ============================================================================

import { ChatOllama } from "@langchain/ollama";
import { execSync } from "child_process";

console.log("🔍 Running Setup Verification...\n");
console.log("=".repeat(60));

let allPassed = true;

// ----------------------------------------------------------------------------
// TEST 1: Check Ollama CLI
// ----------------------------------------------------------------------------
console.log("\n1️⃣  Checking Ollama CLI...");
try {
  const result = execSync("ollama --version", { encoding: "utf-8" });
  console.log("   ✅ Ollama CLI is available");
  console.log(`   ${result.trim()}`);
} catch (error) {
  console.log("   ❌ Ollama CLI not found");
  console.log("   💡 Install: https://ollama.com/download");
  allPassed = false;
}

// ----------------------------------------------------------------------------
// TEST 2: Check Ollama Server
// ----------------------------------------------------------------------------
console.log("\n2️⃣  Checking Ollama Server...");
try {
  execSync("curl -s http://localhost:11434", { encoding: "utf-8" });
  console.log("   ✅ Ollama server is running on localhost:11434");
} catch (error) {
  console.log("   ❌ Ollama server is not running");
  console.log("   💡 Start with: ollama serve");
  allPassed = false;
}

// ----------------------------------------------------------------------------
// TEST 3: Check Installed Models
// ----------------------------------------------------------------------------
console.log("\n3️⃣  Checking Installed Models...");
try {
  const models = execSync("ollama list", { encoding: "utf-8" });
  const lines = models.split("\n").filter(line => line.trim() && !line.startsWith("NAME"));
  
  if (lines.length > 0) {
    console.log("   ✅ Models installed:");
    lines.forEach(line => {
      const modelName = line.split(/\s+/)[0];
      console.log(`      • ${modelName}`);
    });
  } else {
    console.log("   ⚠️  No models found");
    console.log("   💡 Pull a model: ollama pull llama3.2");
  }
} catch (error) {
  console.log("   ❌ Could not list models");
  allPassed = false;
}

// ----------------------------------------------------------------------------
// TEST 4: Test LLM Connection
// ----------------------------------------------------------------------------
console.log("\n4️⃣  Testing LLM Connection...");
const llm = new ChatOllama({ 
  baseUrl: "http://localhost:11434",
  model: "kimi-k2.5:cloud",
});

try {
  console.log("   🔄 Sending test request...");
  const result = await llm.invoke("Hi!");
  console.log("   ✅ LLM responded!");
  console.log(`   Response: "${result.content.substring(0, 100)}..."`);
} catch (error) {
  console.log("   ❌ Could not connect to LLM");
  console.log(`   Error: ${error.message}`);
  console.log("   💡 Make sure Ollama is running and the model is pulled");
  allPassed = false;
}

// ----------------------------------------------------------------------------
// TEST 5: Check Dependencies
// ----------------------------------------------------------------------------
console.log("\n5️⃣  Checking Dependencies...");
const requiredPackages = [
  "@langchain/core",
  "@langchain/ollama",
  "zod"
];

let missingDeps = [];
for (const pkg of requiredPackages) {
  try {
    await import(pkg);
    console.log(`   ✅ ${pkg}`);
  } catch {
    console.log(`   ❌ ${pkg} - MISSING`);
    missingDeps.push(pkg);
  }
}

if (missingDeps.length > 0) {
  console.log("\n   💡 Install missing packages:");
  console.log(`      npm install ${missingDeps.join(" ")}`);
  allPassed = false;
}

// ----------------------------------------------------------------------------
// SUMMARY
// ----------------------------------------------------------------------------
console.log("\n" + "=".repeat(60));
if (allPassed) {
  console.log("✅ ALL TESTS PASSED - Ready for Session 1!");
  console.log("\nNext steps:");
  console.log("   node session1-example1.js");
  console.log("   node hinglish-chain.js");
} else {
  console.log("❌ SOME TESTS FAILED - Please fix the issues above");
  console.log("\nTroubleshooting:");
  console.log("   1. Install Ollama: https://ollama.com/download");
  console.log("   2. Start Ollama: ollama serve");
  console.log("   3. Pull model: ollama pull kimi-k2.5:cloud");
  console.log("   4. Install deps: npm install");
}
console.log("=".repeat(60));
