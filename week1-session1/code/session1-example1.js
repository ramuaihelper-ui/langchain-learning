// ============================================================================
// SESSION 1 EXAMPLE 1: Basic LangChain Chain with Ollama
// ============================================================================
// 
// WHAT THIS DOES:
// This is the "Hello World" of LangChain. It creates a simple chain that:
// 1. Takes a topic as input
// 2. Formats it into a prompt
// 3. Sends it to your local Ollama LLM (kimi-k2.5:cloud)
// 4. Returns the response as clean text
//
// THE CHAIN PATTERN:
// Input → Prompt Template → LLM → Output Parser → Result
//
// ============================================================================

// ----------------------------------------------------------------------------
// STEP 1: IMPORTS
// ----------------------------------------------------------------------------
// These are the building blocks we need from LangChain

import { ChatOllama } from "@langchain/ollama";
// ^ ChatOllama: Connects to your local Ollama instance (localhost:11434)
//   This is how we talk to kimi-k2.5:cloud without needing an API key!

import { ChatPromptTemplate } from "@langchain/core/prompts";
// ^ ChatPromptTemplate: Creates structured prompts with variables
//   Think of it like a template string: "Hello {name}"

import { StringOutputParser } from "@langchain/core/output_parsers";
// ^ StringOutputParser: Extracts just the text content from LLM response
//   Without this, you'd get extra metadata you don't need

// ----------------------------------------------------------------------------
// STEP 2: CREATE THE LLM (The Brain)
// ----------------------------------------------------------------------------
// This configures which model to use and how it should behave

const llm = new ChatOllama({ 
  baseUrl: "http://localhost:11434",  // Ollama's default local address
  model: "kimi-k2.5:cloud",           // Your installed model
  temperature: 0.7,                   // Controls creativity:
                                      // 0.0 = deterministic (same answer every time)
                                      // 1.0 = very creative (more random)
                                      // 0.7 = balanced (good for most tasks)
});

// ----------------------------------------------------------------------------
// STEP 3: CREATE THE PROMPT TEMPLATE (The Instructions)
// ----------------------------------------------------------------------------
// This defines what the LLM should do. It has two parts:
// 1. System message: Sets the "personality" or role
// 2. User message: The actual task/question

const prompt = ChatPromptTemplate.fromMessages([
  // System message: Tells the LLM who it is
  ["system", "You are a helpful AI engineering tutor."],
  
  // User message: The task with a variable placeholder {topic}
  // This gets replaced when we invoke the chain
  ["user", "Explain {topic} in 2 sentences."],
]);

// ----------------------------------------------------------------------------
// STEP 4: CREATE THE OUTPUT PARSER (The Formatter)
// ----------------------------------------------------------------------------
// LLMs return complex objects. This extracts just the text we want.

const parser = new StringOutputParser();
// ^ Takes the LLM response and returns: "Just the answer text"
//   Without it, you'd get: { content: "answer", metadata: {...}, ... }

// ----------------------------------------------------------------------------
// STEP 5: BUILD THE CHAIN (Connect Everything)
// ----------------------------------------------------------------------------
// The pipe operator (|) connects components like Unix pipes!
// prompt.pipe(llm) means: output of prompt goes into llm
// .pipe(parser) means: output of llm goes into parser

const chain = prompt.pipe(llm).pipe(parser);
// 
// VISUAL FLOW:
// ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
// │  Input:     │────▶│   Prompt    │────▶│     LLM     │────▶│   Parser    │
// │ {topic:     │     │ (formats    │     │ (generates  │     │ (extracts   │
// │  "Chains"}  │     │  request)   │     │  response)  │     │  text)      │
// └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
//                                                                     │
//                                                                     ▼
//                                                               "LangChain 
//                                                                Chains are..."

// ----------------------------------------------------------------------------
// STEP 6: INVOKE THE CHAIN (Run It!)
// ----------------------------------------------------------------------------
// This is where we actually run the chain with real data

const result = await chain.invoke({ topic: "LangChain Chains" });
//                         ^
//                         This replaces {topic} in our prompt template
//                         {topic: "LangChain Chains"} becomes:
//                         "Explain LangChain Chains in 2 sentences."

// Print the result to console
console.log(result);
// Output: "LangChain Chains are reusable pipelines that link together 
//          language models, prompts, and output parsers to execute..."

// ============================================================================
// NEXT STEPS:
// Try changing the topic! Replace "LangChain Chains" with:
// - "React Hooks"
// - "REST APIs"
// - "Python Decorators"
// - Any topic you want to learn about!
// ============================================================================
