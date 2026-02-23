# 🚀 LANGCHAIN JS MASTER CHEAT SHEET

**Session:** Week 1, Session 1 (Feb 22, 2026)  
**Next Session:** Week 1, Session 2 (Mar 1, 2026) - Document Loaders & RAG

---

## ✅ SESSION 1 COMPLETED (Checkmarks)

### Core Concepts
- [x] Chain Pattern: `prompt.pipe(llm).pipe(parser)`
- [x] ChatPromptTemplate with variables
- [x] StringOutputParser (plain text)
- [x] StructuredOutputParser (JSON with Zod)
- [x] Ollama integration (local LLM)
- [x] Class wrappers for reusable components
- [x] Error handling patterns
- [x] Streaming responses
- [x] Retry logic
- [x] Multi-step chains

### Code Examples Created
- [x] `session1-example1.js` - Basic chain with comments
- [x] `hinglish-chain.js` - Structured output with Zod
- [x] `hinglish-chain-pro.js` - Production version with error handling
- [x] `agent-chat.js` - Interactive terminal chat
- [x] `agent-chat-fast.js` - Optimized version
- [x] `speed-test.js` - Model comparison utility
- [x] `setup-verification.js` - Environment checker

---

## 📋 UPCOMING (Session 2 - Mar 1)

### To Learn
- [ ] Document Loaders (PDF, text, web)
- [ ] Text Splitters (chunking strategies)
- [ ] Embeddings (text → vectors)
- [ ] Vector Stores (Chroma, Pinecone, PGVector)
- [ ] RAG Chains (retrieval + generation)
- [ ] Memory/Persistence (conversation history)

---

## 🔑 PATTERNS (Copy-Paste Ready)

### Pattern 1: Basic Chain ✅
```javascript
import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOllama({ model: "llama3.2" });
const prompt = ChatPromptTemplate.fromTemplate("Hello {name}");
const chain = prompt.pipe(llm).pipe(new StringOutputParser());
const result = await chain.invoke({ name: "World" });
```

### Pattern 2: Structured Output ✅
```javascript
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

const schema = z.object({
  answer: z.string(),
  confidence: z.number().min(0).max(1)
});

const parser = StructuredOutputParser.fromZodSchema(schema);
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "Respond with JSON\n{format_instructions}"],
  ["user", "{input}"]
]).partial({ format_instructions: parser.getFormatInstructions() });

const chain = prompt.pipe(llm).pipe(parser);
const result = await chain.invoke({ input: "..." }); // Typed!
```

### Pattern 3: Class Wrapper ✅
```javascript
export class MyChain {
  constructor() {
    this.chain = null;
  }
  
  async init() {
    if (this.chain) return;
    // Build chain here (async)
    this.chain = ...;
  }
  
  async invoke(input) {
    await this.init();
    return await this.chain.invoke(input);
  }
}
```

---

## 🆕 ADVANCED PATTERNS (New)

### Pattern 4: Sequential Chain ⏳
```javascript
import { RunnableSequence } from "@langchain/core/runnables";

const chain = RunnableSequence.from([
  async (input) => {
    const translated = await translate(input.text);
    return { ...input, translation: translated };
  },
  async (input) => {
    const sentiment = await analyzeSentiment(input.translation);
    return { ...input, sentiment };
  },
  async (input) => {
    const reply = await generateReply(input);
    return { ...input, reply };
  }
]);

const result = await chain.invoke({ text: "..." });
```

### Pattern 5: Parallel Execution ⏳
```javascript
import { RunnableParallel } from "@langchain/core/runnables";

const parallel = RunnableParallel.from({
  summary: summaryChain,
  sentiment: sentimentChain,
  translation: translationChain,
  entities: entityExtractionChain
});

const result = await parallel.invoke({ text: "..." });
// result = { summary: "...", sentiment: "...", ... }
```

### Pattern 6: Conditional Routing ⏳
```javascript
import { RunnableBranch } from "@langchain/core/runnables";

const branch = RunnableBranch.from([
  [(input) => input.type === "question", qaChain],
  [(input) => input.type === "chitchat", chatChain],
  [(input) => input.type === "command", commandChain],
  fallbackChain  // default
]);

const result = await branch.invoke({ type: "question", text: "..." });
```

### Pattern 7: Transform/Map ⏳
```javascript
import { RunnableMap } from "@langchain/core/runnables";

const map = RunnableMap.from({
  // Transform input before main chain
  cleaned: (input) => input.text.trim().toLowerCase(),
  tokens: (input) => input.text.split(" ").length,
  language: detectLanguage
});

const result = await map.invoke({ text: "Hello World" });
// { cleaned: "hello world", tokens: 2, language: "en" }
```

---

## 📄 DOCUMENT LOADERS (Session 2 Prep)

```javascript
// Text files
import { TextLoader } from "@langchain/community/document_loaders/text";
const loader = new TextLoader("file.txt");
const docs = await loader.load();  // [{ pageContent: "...", metadata: {} }]

// PDFs
import { PDFLoader } from "@langchain/community/document_loaders/pdf";
const loader = new PDFLoader("ncert-chapter.pdf", { splitPages: true });
const docs = await loader.load();  // One doc per page

// Web pages
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
const loader = new CheerioWebBaseLoader("https://ncert.nic.in/textbook.php");

// JSON
import { JSONLoader } from "@langchain/community/document_loaders/json";
const loader = new JSONLoader("questions.json", "/text");

// CSV
import { CSVLoader } from "@langchain/community/document_loaders/csv";
```

---

## ✂️ TEXT SPLITTERS (Session 2 Prep)

```javascript
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,      // Target chunk size (chars)
  chunkOverlap: 200,    // Overlap between chunks
  separators: ["\n\n", "\n", " ", ""]  // Priority order
});

const chunks = await splitter.splitDocuments(docs);
// Each chunk: { pageContent: "...", metadata: { source: "...", chunk: 1 } }

// For code
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
const codeSplitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
  chunkSize: 500,
  chunkOverlap: 50
});

// For markdown
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
const mdSplitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
  chunkSize: 1000
});
```

---

## 🔢 EMBEDDINGS (Session 2 Prep)

```javascript
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  apiKey: "..."
});

// Generate embedding for single text
const vector = await embeddings.embedQuery("Hello world");
// Returns: [0.1, -0.2, 0.3, ...] (1536 dimensions)

// Batch embedding
const vectors = await embeddings.embedDocuments(["doc1", "doc2", "doc3"]);
```

---

## 🗄️ VECTOR STORES (Session 2 Prep)

### Chroma (Local/Dev)
```javascript
import { Chroma } from "@langchain/community/vectorstores/chroma";

const vectorStore = await Chroma.fromDocuments(
  chunks,
  embeddings,
  { collectionName: "ncert-physics" }
);

// Query
const results = await vectorStore.similaritySearch("Newton's laws", 5);
// Returns: [{ pageContent: "...", metadata: { source: "..." } }, ...]

// With filters
const results = await vectorStore.similaritySearch("motion", 5, {
  chapter: "chapter-3"
});
```

### Pinecone (Production)
```javascript
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/community/vectorstores/pinecone";

const client = new Pinecone({ apiKey: "..." });
const index = client.Index("ncert-index");

const vectorStore = await PineconeStore.fromDocuments(
  chunks,
  embeddings,
  { pineconeIndex: index }
);
```

---

## 🔍 RAG CHAINS (Session 2 Prep)

```javascript
import { createStuffDocumentsChain } from "@langchain/chains/combine_documents";
import { createRetrievalChain } from "@langchain/chains";

// 1. Convert vector store to retriever
const retriever = vectorStore.asRetriever({ 
  k: 5,  // Number of docs to retrieve
  searchType: "similarity"  // or "mmr" for diversity
});

// 2. Create QA chain
const prompt = ChatPromptTemplate.fromTemplate(`
Answer based on context:
{context}

Question: {input}
`);

const combineDocsChain = await createStuffDocumentsChain({
  llm,
  prompt,
  documentPrompt: ChatPromptTemplate.fromTemplate("{page_content}")
});

// 3. Create RAG chain
const ragChain = await createRetrievalChain({
  retriever,
  combineDocsChain
});

// 4. Use
const result = await ragChain.invoke({
  input: "Explain Newton's first law with examples"
});
// result.answer = "...", result.context = [...]
```

---

## 🧠 MEMORY (Session 3 Preview)

```javascript
import { BufferMemory } from "@langchain/community/memory";

const memory = new BufferMemory({
  returnMessages: true,
  memoryKey: "history"
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant"],
  new MessagesPlaceholder("history"),  // Injects previous messages
  ["user", "{input}"]
]);

const chain = prompt.pipe(llm);

// First call
await memory.saveContext({ input: "Hi" }, { output: "Hello!" });

// Second call (has memory)
const history = await memory.loadMemoryVariables({});
const result = await chain.invoke({ ...history, input: "What's my name?" });
```

---

## 🤖 NCERT PROJECT ARCHITECTURE

### Vision
Create an AI tutor for Indian students using NCERT PDFs:
- Load NCERT chapters → Vector Store
- Generate dynamic questions (not just MCQs, but Socratic)
- Guide students through problem-solving (not direct answers)
- Multi-language support (Hinglish/Hindi + English)

### System Design
```
┌─────────────────┐
│  NCERT PDFs     │
└────────┬────────┘
         ▼
┌─────────────────┐
│ PDF Loader      │  ← Week 2
└────────┬────────┘
         ▼
┌─────────────────┐
│ Text Splitter   │  ← Chunk by topics
└────────┬────────┘
         ▼
┌─────────────────┐
│ Embeddings      │  ← Convert to vectors
└────────┬────────┘
         ▼
┌─────────────────┐
│ Vector Store    │  ← Chroma/Pinecone
└────────┬────────┘
         ▼
┌─────────────────┐
│ RAG Chain       │  ← Retrieve + Generate
│  ├─ Question Gen│  ← "Why does this happen?"
│  ├─ Hint System │  ← "Think about..."
│  └─ Explain     │  ← Walk through solution
└─────────────────┘
```

### Key Features to Build
1. **PDF Ingestion Pipeline** - Auto-process NCERT chapters
2. **Question Generator** - Create Socratic questions from content
3. **Adaptive Tutoring** - Give hints, not answers
4. **Progress Tracking** - Which concepts mastered?
5. **Multi-modal** - Support text, diagrams, formulas

---

## ⚙️ MODEL PARAMETERS GUIDE

```javascript
const llm = new ChatOllama({
  // Model Selection
  model: "llama3.2",           // Fast, good quality
  model: "mistral",            // Better reasoning
  model: "kimi-k2.5",          // Most capable
  
  // Creativity
  temperature: 0.0,            // Deterministic (facts)
  temperature: 0.7,            // Balanced (default)
  temperature: 1.0,            // Creative (brainstorming)
  
  // Performance
  num_ctx: 2048,               // Context window (smaller = faster)
  num_predict: 100,            // Max output tokens
  
  // Sampling
  top_p: 0.9,                  // Nucleus sampling
  top_k: 40,                   // Top-k sampling
  repeat_penalty: 1.1,         // Reduce repetition
});
```

---

## 🔗 ESSENTIAL RESOURCES

| Resource | URL | Purpose |
|----------|-----|---------|
| **Main Docs** | https://js.langchain.com/docs/ | Everything |
| **Quickstart** | https://js.langchain.com/docs/get_started/quickstart | 10-min setup |
| **API Ref** | https://api.js.langchain.com/ | Function lookup |
| **Examples** | https://github.com/langchain-ai/langchainjs/tree/main/examples | Copy-paste |
| **Templates** | https://github.com/langchain-ai/langchainjs/tree/main/templates | Starters |
| **Integrations** | https://js.langchain.com/docs/integrations/overview | All tools |

---

## 📚 LEARNING SCHEDULE

| Week | Topic | Status |
|------|-------|--------|
| **Week 1** | Chains, Prompts, Parsers | ✅ Complete |
| **Week 2** | Document Loaders, RAG, Vector DBs | ⏳ Mar 1 |
| **Week 3** | Agents with Tools, Memory | ⏳ Mar 8 |
| **Week 4** | Production Patterns, Deployment | ⏳ Mar 15 |
| **Week 5-8** | NCERT Project Implementation | ⏳ TBD |
| **Week 9-12** | Advanced: LangGraph, Multi-agent | ⏳ TBD |

---

## 💡 QUICK REFERENCE

### Install
```bash
npm install @langchain/core @langchain/ollama zod
npm install @langchain/community  # For loaders/stores
```

### Debug
```javascript
// Enable LangChain debug logging
process.env.LANGCHAIN_VERBOSE = "true";

// Check model
ollama list

#Run Ollama with GPU
ollama serve &

#Use specific model
const llm = new ChatOllama({ model: "llama3.2:latest" });
```

### Common Errors
| Error | Fix |
|-------|-----|
| `ECONNREFUSED` | Start Ollama: `ollama serve` |
| `404 model not found` | Pull model: `ollama pull llama3.2` |
| `OutputParserException` | Model returned invalid JSON |
| `Module not found` | Run `npm install` |

---

*Updated: Feb 22, 2026 | Next: Session 2 - Document Loaders & RAG*
