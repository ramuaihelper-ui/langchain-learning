# 🚀 LANGCHAIN JS CHEAT SHEET

## Official Documentation
- **Main Docs:** https://js.langchain.com/docs/
- **Quickstart:** https://js.langchain.com/docs/get_started/quickstart
- **API Reference:** https://js.langchain.com/api/
- **GitHub:** https://github.com/langchain-ai/langchainjs

---

## ⚡ 30-Second Quick Start

```javascript
import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const llm = new ChatOllama({ model: "llama3.2" });
const prompt = ChatPromptTemplate.fromTemplate("Hello {name}");
const chain = prompt.pipe(llm);
const result = await chain.invoke({ name: "World" });
```

---

## 🔑 Core Concepts (Memorize These)

### 1. Chain Pattern
```javascript
const chain = prompt.pipe(llm).pipe(parser);
const result = await chain.invoke({ input: "..." });
```

### 2. Prompt Templates
```javascript
// Simple
const prompt = ChatPromptTemplate.fromTemplate("Tell me about {topic}");

// Complex (with system message)
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a {role}"],
  ["user", "{input}"]
]);

// With partial variables
const filled = await prompt.partial({ role: "expert" });
```

### 3. Output Parsers
```javascript
import { StringOutputParser } from "@langchain/core/output_parsers";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

// Plain text
const parser = new StringOutputParser();

// Structured JSON
const schema = z.object({ answer: z.string(), confidence: z.number() });
const parser = StructuredOutputParser.fromZodSchema(schema);
```

### 4. Model Integration
```javascript
// Ollama (local)
import { ChatOllama } from "@langchain/ollama";
const llm = new ChatOllama({ model: "llama3.2", baseUrl: "http://localhost:11434" });

// OpenAI
import { ChatOpenAI } from "@langchain/openai";
const llm = new ChatOpenAI({ model: "gpt-4", apiKey: "..." });

// Anthropic
import { ChatAnthropic } from "@langchain/anthropic";
const llm = new ChatAnthropic({ model: "claude-3" });

// Google
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
const llm = new ChatGoogleGenerativeAI({ model: "gemini-pro" });
```

---

## 🛠️ Common Patterns

### Pattern 1: Simple Q&A
```javascript
const prompt = ChatPromptTemplate.fromTemplate("Q: {question}\nA:");
const chain = prompt.pipe(llm).pipe(new StringOutputParser());
const answer = await chain.invoke({ question: "What is AI?" });
```

### Pattern 2: Structured Output
```javascript
const schema = z.object({
  translation: z.string(),
  confidence: z.number().min(0).max(1)
});

const parser = StructuredOutputParser.fromZodSchema(schema);
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "Translate and return JSON\n{format_instructions}"],
  ["user", "{text}"]
]).partial({ format_instructions: parser.getFormatInstructions() });

const chain = prompt.pipe(llm).pipe(parser);
const result = await chain.invoke({ text: "hello" }); // Typed!
```

### Pattern 3: Sequential Chains
```javascript
import { RunnableSequence } from "@langchain/core/runnables";

const chain = RunnableSequence.from([
  step1,  // Function or chain
  step2,  // Receives output from step1
  step3   // Receives output from step2
]);

const result = await chain.invoke({ input: "..." });
```

### Pattern 4: Branching (Parallel)
```javascript
import { RunnableParallel } from "@langchain/core/runnables";

const parallel = RunnableParallel.from({
  summary: summaryChain,
  sentiment: sentimentChain,
  translation: translationChain
});

const result = await parallel.invoke({ text: "..." });
// result = { summary: "...", sentiment: "...", translation: "..." }
```

### Pattern 5: Streaming
```javascript
const stream = await chain.stream({ input: "..." });

for await (const chunk of stream) {
  process.stdout.write(chunk);  // Real-time output
}
```

### Pattern 6: Batch Processing
```javascript
const inputs = [{ topic: "A" }, { topic: "B" }, { topic: "C" }];
const results = await chain.batch(inputs);  // Parallel execution
```

---

## 📋 Document Loaders (Session 2)

```javascript
// Text files
import { TextLoader } from "@langchain/community/document_loaders/text";
const loader = new TextLoader("file.txt");
const docs = await loader.load();

// PDFs
import { PDFLoader } from "@langchain/community/document_loaders/pdf";

// Web pages
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
const loader = new CheerioWebBaseLoader("https://...");

// JSON
import { JSONLoader } from "@langchain/community/document_loaders/json";
```

---

## ✂️ Text Splitters

```javascript
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,      // Characters per chunk
  chunkOverlap: 50     // Overlap between chunks
});

const chunks = await splitter.splitDocuments(docs);
```

---

## 🗄️ Vector Stores (Session 2)

```javascript
// Chroma (local, free)
import { Chroma } from "@langchain/community/vectorstores/chroma";

const vectorStore = await Chroma.fromDocuments(docs, embeddings, {
  collectionName: "hinglish"
});

// Pinecone (cloud)
import { PineconeStore } from "@langchain/community/vectorstores/pinecone";

// Query
const results = await vectorStore.similaritySearch("hello", 3);
```

---

## 🔍 RAG (Retrieval Augmented Generation)

```javascript
import { createRetrievalChain } from "@langchain/chains";

const retriever = vectorStore.asRetriever({ k: 5 });

const ragChain = await createRetrievalChain({
  retriever,
  combineDocsChain: questionAnswerChain
});

const result = await ragChain.invoke({ question: "..." });
```

---

## 🤖 Agents

```javascript
import { createReactAgent } from "@langchain/agents";
import { AgentExecutor } from "@langchain/agents";

const tools = [
  new DynamicTool({
    name: "search",
    description: "Search the web",
    func: async (input) => { /* ... */ }
  })
];

const agent = createReactAgent({ llm, tools });
const executor = new AgentExecutor({ agent, tools });
const result = await executor.invoke({ input: "..." });
```

---

## ⚙️ Model Parameters

```javascript
const llm = new ChatOllama({
  model: "llama3.2",
  temperature: 0.7,      // 0=precise, 1=creative
  maxTokens: 256,        // Limit output
  topP: 0.9,            // Nucleus sampling
  frequencyPenalty: 0,   // Reduce repetition
  presencePenalty: 0
});
```

---

## ❌ Error Handling

```javascript
try {
  const result = await chain.invoke({ input });
} catch (error) {
  if (error.code === "ECONNREFUSED") {
    console.log("Ollama not running!");
  }
  if (error.name === "OutputParserException") {
    console.log("Invalid JSON from model");
  }
}
```

---

## 📊 Performance Tips

| Technique | Speed Impact |
|-----------|-------------|
| Smaller model | 3-5x faster |
| Lower num_ctx | 20% faster |
| Lower num_predict | 50% faster |
| Streaming | Feels faster |
| Batch processing | Parallel speed |

---

## 🔗 Key Links

- **Tutorials:** https://github.com/langchain-ai/langchainjs/tree/main/examples
- **Templates:** https://github.com/langchain-ai/langchainjs/tree/main/templates  
- **YouTube:** https://www.youtube.com/@LangChain

---

## 🎯 Learning Path (Fast)

1. **Day 1:** Chains, prompts, parsers ✅ (you did this)
2. **Day 2:** Document loaders, splitters, vector stores
3. **Day 3:** RAG chains
4. **Day 4:** Agents with tools
5. **Day 5+:** Production patterns

**Speed run:** Skip straight to examples in GitHub repo!

---

*Generated: Feb 22, 2026*  
*Location: workspace/cheat-sheets/langchain-js-cheatsheet.md*
