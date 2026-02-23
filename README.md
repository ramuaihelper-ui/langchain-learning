# 🎓 LangChain JS Learning Examples

Code examples from Week 1, Session 1 - LangChain fundamentals.

---

## 📅 Progress

| Week | Topic | Status |
|------|-------|--------|
| **Week 1** | Core LangChain Patterns | COMPLETE ✅ |
| **Week 2** | Document Loaders & RAG | Mar 1, 2026 📚 |
| **Week 3** | Memory & Conversation | Mar 8, 2026 🧠 |
| **Week 4** | Agents & Tools | Mar 15, 2026 🤖 |

---

## 🚀 Quick Start

```bash
# Setup
cd week1-session1/code
npm install

# Run your first chain
node session1-example1.js

# Try the Hinglish translator
node hinglish-chain.js

# Interactive chat
node agent-chat.js
```

---

## 📂 Repository Structure

```
langchain-learning/
├── week1-session1/              ✅ COMPLETE
│   ├── code/                    ← Working code examples
│   │   ├── session1-example1.js
│   │   ├── hinglish-chain.js
│   │   ├── hinglish-chain-pro.js
│   │   ├── agent-chat.js
│   │   ├── agent-chat-fast.js
│   │   └── speed-test.js
│   ├── cheatsheets/
│   └── resources/
├── week1-session2/              📚 IN PROGRESS
├── .gitignore                   ← Excludes private data
└── README.md                    ← This file
```

---

## 📖 Files

| File | Description |
|------|-------------|
| `session1-example1.js` | Basic chain pattern |
| `hinglish-chain.js` | Structured output with Zod |
| `hinglish-chain-pro.js` | Production features (error handling, streaming) |
| `agent-chat.js` | Interactive terminal AI |
| `agent-chat-fast.js` | Optimized for speed |
| `speed-test.js` | Model comparison utility |
| `setup-verification.js` | Environment checker |

---

## 🎓 What You've Built

### Session 1: Foundation ✅
- **HinglishChain** - Translator with structured JSON output
- **Agent Chat** - Terminal-based AI with sentiment analysis
- **Speed Test** - Model comparison utility
- **7 Code Examples** - All with detailed comments

### Key Patterns Mastered
- ✅ Chain composition: `prompt.pipe(llm).pipe(parser)`
- ✅ Prompt templates with variables
- ✅ Output parsers (String & Structured)
- ✅ Structured output with Zod schemas
- ✅ Ollama integration (local LLMs)
- ✅ Class wrappers for reusability
- ✅ Error handling & retry logic
- ✅ Streaming responses
- ✅ Multi-step chains

---

## 🛠️ Tech Stack

- **LangChain JS** - LLM orchestration framework
- **Ollama** - Local LLMs (llama3.2, kimi-k2.5)
- **Zod** - Schema validation
- **Node.js** - Runtime environment

---

## 📚 Learning Resources

- [LangChain Docs](https://js.langchain.com/docs/)
- [Ollama](https://ollama.com/)
- [LangChain Examples](https://github.com/langchain-ai/langchainjs/tree/main/examples)

---

## 🚀 Next Session

**Week 1, Session 2: Document Loaders & RAG**
- **Date:** Saturday, March 1, 2026
- **Time:** 2:00-3:30 PM EST
- **Topic:** Loading documents into vector stores

See you there! 🦋

---

*Week 1, Session 1 - Feb 22, 2026*
