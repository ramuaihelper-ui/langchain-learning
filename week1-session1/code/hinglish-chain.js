// ============================================================================
// SESSION 1 PROJECT: HinglishChain - Production-Ready Translator
// ============================================================================
//
// WHAT THIS BUILDS:
// A reusable Hinglish translator class that outputs structured data.
// HINGLISH = HINDI + ENGLISH (Romanized Hindi mixed with English)
//
// FIXED VERSION: Handles async .partial() properly
//
// ============================================================================

import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

// Define the output schema
const hinglishResponseSchema = z.object({
  translated_text: z.string(),
  detected_language: z.string(),
  confidence: z.number().min(0).max(1),
  alternative_translations: z.array(z.string()).default([]),
  cultural_notes: z.string().optional(),
});

export class HinglishChain {
  constructor(modelName = "kimi-k2.5:cloud") {
    this.modelName = modelName;
    this.chain = null; // We'll build this lazily (on first use)
  }

  // Build the chain on first use (handles the async .partial())
  async init() {
    if (this.chain) return; // Already initialized

    // Create LLM
    const llm = new ChatOllama({
      baseUrl: "http://localhost:11434",
      model: this.modelName,
      temperature: 0.3,
    });

    // Create parser
    const parser = StructuredOutputParser.fromZodSchema(hinglishResponseSchema);

    // Create prompt - NOTE: await the .partial()!
    const prompt = await ChatPromptTemplate.fromMessages([
      ["system", `You are a Hinglish translator for the Indian market. 
Convert Hinglish (Romanized Hindi + English) to proper Hindi and English.
Provide confidence score and cultural context.

{format_instructions}`],
      ["user", "{hinglish_text}"],
    ]).partial({
      format_instructions: parser.getFormatInstructions()
    });

    // Build chain
    this.chain = prompt.pipe(llm).pipe(parser);
  }

  // Translate method - auto-initializes
  async translate(text) {
    await this.init(); // Ensure chain is built before using
    return await this.chain.invoke({ hinglish_text: text });
  }
}

// ============================================================================
// USAGE
// ============================================================================

const chain = new HinglishChain("kimi-k2.5:cloud");
const result = await chain.translate("mujhe tumse baat karni hai!");

console.log("=== HINGLISH TRANSLATION ===\n");
console.log(`📝 Translation: ${result.translated_text}`);
console.log(`🎯 Confidence: ${(result.confidence * 100).toFixed(1)}%`);
console.log(`🌐 Detected: ${result.detected_language}`);

if (result.cultural_notes) {
  console.log(`📚 Cultural Notes: ${result.cultural_notes}`);
}

if (result.alternative_translations?.length > 0) {
  console.log("\n💡 Alternatives:");
  result.alternative_translations.forEach((alt, i) => {
    console.log(`   ${i + 1}. ${alt}`);
  });
}
