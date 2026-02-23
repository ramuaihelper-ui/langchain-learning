# 🎓 12-Week AI Engineering Mastery Plan

**Created by:** Ramu 🦋  
**For:** Kunal  
**Started:** Feb 22, 2026  
**Goal:** Master LangChain/LangGraph & Build NCERT AI Tutor

---

## 🎯 Learning Philosophy

- **Build while you learn** - Every session produces working code
- **Hinglish as the thread** - Apply everything to the NCERT EdTech project
- **12 weeks = 3 phases** - Foundation → Application → Production
- **Weekends only** - 3 hours/week, focused and achievable

---

## 📅 SCHEDULE

| Session | Date | Duration | Topic | Deliverable |
|---------|------|----------|-------|-------------|
| **Week 1 Session 1** | Feb 22 Sun | 2:00-3:30 PM | Chains, Prompts, Parsers | ✅ HinglishChain |
| **Week 1 Session 2** | Mar 1 Sat | 2:00-3:30 PM | Document Loaders & RAG | 📄 PDF → Vector Store |
| **Week 2 Session 1** | Mar 2 Sun | 2:00-3:30 PM | Memory & Conversation | 🧠 Chat with History |
| **Week 2 Session 2** | Mar 8 Sat | 2:00-3:30 PM | Agents & Tools | 🤖 NCERT Q&A Agent |
| **Week 3 Session 1** | Mar 9 Sun | 2:00-3:30 PM | Embeddings Deep Dive | 📊 Smart Search |
| **Week 3 Session 2** | Mar 15 Sat | 2:00-3:30 PM | Production Patterns | 🏭 Error Handling & Speed |
| **Week 4 Session 1** | Mar 16 Sun | 2:00-3:30 PM | LangGraph Intro | 🔄 Flow-Based Chains |
| **Week 4 Session 2** | Mar 22 Sat | 2:00-3:30 PM | Multi-Agent Systems | 👥 Agent Teams |
| **Week 5-8** | Mar 23-Apr 19 | Project Sprint | NCERT AI Tutor | 🎓 Full Application |
| **Week 9-10** | Apr 20-May 3 | Polish & Scale | Performance & UX | 🚀 Production Ready |
| **Week 11-12** | May 4-May 17 | Launch & Share | Blog & GitHub | 🌟 Portfolio Complete |

---

## PHASE 1: Foundation (Weeks 1-4)

### Week 1: Core LangChain Patterns ✅
**Status:** COMPLETE

**What You Built:**
- [x] Basic chains with Ollama
- [x] Structured output with Zod
- [x] HinglishChain class
- [x] Error handling & retry
- [x] Streaming responses
- [x] Speed optimization

**Key Concepts Mastered:**
- Chain pattern: `prompt.pipe(llm).pipe(parser)`
- Prompt templates with variables
- Output parsers (String vs Structured)
- Temperature, tokens, context window
- Model comparison & selection

**Files:**
- `week1-session1/code/hinglish-chain.js`
- `week1-session1/code/hinglish-chain-pro.js`
- `week1-session1/code/agent-chat.js`

---

### Week 1: Document Loaders & RAG 📚
**Next Session:** Mar 1, 2026

**Learning Goals:**
- Load PDFs, text, web pages
- Chunk documents intelligently
- Create embeddings
- Store in vector databases
- Retrieve relevant content

**Project Application:**
- Download NCERT PDFs
- Build ingestion pipeline
- Store first chapter in Chroma
- Test similarity search

**Concepts:**
- [ ] DocumentLoaders (PDF, Text, Web)
- [ ] TextSplitters & chunking strategies
- [ ] Embeddings (OpenAI, Ollama)
- [ ] Vector Stores (Chroma, Pinecone)
- [ ] RAG chains

**Deliverable:** Working RAG with NCERT content

---

### Week 2: Memory & Conversation 🧠

**Learning Goals:**
- Conversation memory types
- Buffer memory, summary memory
- Redis persistence
- Chat history management

**Project Application:**
- NCERT tutor remembers previous questions
- Adapts explanations based on history
- Personalizes for student level

**Concepts:**
- [ ] BufferMemory
- [ ] ConversationChain
- [ ] Persistent memory (Redis/Postgres)
- [ ] Memory in HinglishChain

**Deliverable:** Chat that remembers context

---

### Week 2: Agents & Tools 🤖

**Learning Goals:**
- ReAct agents
- Tool definitions
- Agent decision-making
- Custom tools for NCERT

**Project Application:**
- Agent decides when to search, when to explain
- Tool for formula lookup
- Tool for diagram generation
- Tool for hint system

**Concepts:**
- [ ] AgentExecutor
- [ ] DynamicTool
- [ ] Tool selection
- [ ] Agent scratchpad

**Deliverable:** NCERT Q&A Agent

---

## PHASE 2: Application (Weeks 5-8)

### Week 3: Embeddings Deep Dive 📊

**Learning Goals:**
- Understand embeddings
- Multi-language embeddings
- Similarity algorithms
- Embedding visualization

**Project Application:**
- Find similar concepts across chapters
- Cross-reference between subjects
- Smart "Related topics" suggestions

**Concepts:**
- [ ] Embedding models comparison
- [ ] Cosine similarity
- [ ] Vector arithmetic
- [ ] Dimensionality reduction

**Deliverable:** Smart search that finds related content

---

### Week 3: Production Patterns 🏭

**Learning Goals:**
- Error handling deeply
- Retry strategies
- Rate limiting
- Caching
- Monitoring

**Project Application:**
- Robust NCERT pipeline
- Failed ingestion recovery
- Cost optimization
- Performance monitoring

**Concepts:**
- [ ] Circuit breakers
- [ ] Exponential backoff
- [ ] LangSmith tracing
- [ ] Analytics

**Deliverable:** Production-ready code

---

### Week 4: LangGraph Intro 🔄

**Learning Goals:**
- Graph-based chains
- State management
- Conditional edges
- Human-in-the-loop

**Project Application:**
- Multi-step tutoring flow
- Quiz → Feedback → Next question
- Pause for clarification
- Branch based on understanding

**Concepts:**
- [ ] StateGraph
- [ ] Nodes and edges
- [ ] Compile and invoke
- [ ] Persistence

**Deliverable:** LangGraph-based NCERT tutor

---

### Week 4: Multi-Agent Systems 👥

**Learning Goals:**
- Agent orchestration
- Agent communication
- Supervisor patterns
- Parallel execution

**Project Application:**
- Math agent + Physics agent + Chemistry agent
- Supervisor decides which agent handles query
- Agents debate when answer is uncertain

**Concepts:**
- [ ] Multi-agent teams
- [ ] Agent routing
- [ ] Parallel agents
- [ ] Agent consensus

**Deliverable:** Team of specialized NCERT agents

---

## PHASE 3: Production (Weeks 9-12)

### Weeks 5-8: NCERT Project Sprint 🎓

**Building the Full Application:**

**Sprint 1 (Week 5): Backend**
- [ ] Load all NCERT chapters (Classes 6-12)
- [ ] Build vector store with metadata
- [ ] Question generation pipeline
- [ ] Hint system API
- [ ] Progress tracking DB

**Sprint 2 (Week 6): Hinglish Layer**
- [ ] Integrate HinglishChain
- [ ] Hindi + Hinglish mode
- [ ] Cultural context for terms
- [ ] Regional variations

**Sprint 3 (Week 7): Frontend**
- [ ] React Native chat interface
- [ ] PDF viewer integration
- [ ] Progress dashboard
- [ ] Offline mode

**Sprint 4 (Week 8): Polish**
- [ ] Socratic questions work
- [ ] Hint levels functional
- [ ] Progress tracking accurate
- [ ] MVP complete

---

### Weeks 9-10: Scale & Optimize 🚀

**Performance:**
- [ ] Response time < 2 seconds
- [ ] Smart caching
- [ ] Model distillation (smaller models)
- [ ] Query optimization

**Experience:**
- [ ] Smooth animations
- [ ] Voice input/output
- [ ] Diagram support
- [ ] Formula rendering (LaTeX)

**Deployment:**
- [ ] API on cloud (Railway/AWS)
- [ ] Vector store (Pinecone)
- [ ] React Native app published
- [ ] Monitoring (Sentry)

---

### Weeks 11-12: Launch & Share 🌟

**Documentation:**
- [ ] Comprehensive README
- [ ] API documentation
- [ ] Architecture diagrams
- [ ] Setup guide

**Content:**
- [ ] Blog post: "Building an AI Tutor for 300M Indian Students"
- [ ] Demo video
- [ ] LinkedIn series
- [ ] GitHub showcase

**Portfolio:**
- [ ] 3 shipped projects (HinglishChain, NCERT Tutor)
- [ ] Technical blog posts
- [ ] Open source contributions
- [ ] Interview ready

---

## 📚 Weekly Structure

### Pre-Session (Before 2:00 PM)
- Videos/blogs assigned (see resources)
- Review previous code
- Prepare questions

### During Session (2:00-3:30 PM)
- Live coding together
- Concepts explained
- Troubleshooting together
- Build something that works

### Post-Session (Before next week)
- Integrate into your React Native app
- Practice with different prompts
- Study Session 2 prep materials
- Build on what we made

---

## 🎯 Success Metrics

By Week 12:

| Metric | Target | Current |
|--------|--------|---------|
| Working Projects | 3 shipped | ⏳ 1 (HinglishChain) |
| Lines of Code | 5000+ | ✅ ~1000 |
| Blog Posts | 3 published | ⏳ 0 |
| GitHub Stars | 50+ | ⏳ 0 |
| Interview Readiness | Confident | ⏳ Building |

---

## 🎁 Bonus Goals

- [ ] Open source HinglishChain
- [ ] Presentation at local meetup
- [ ] Mentor someone else
- [ ] Apply for AI Engineer roles

---

## 📞 Support

- **Telegram:** @ramuaihelper (daily check-ins)
- **Notion:** Daily Planner & Ramu Dashboard
- **GitHub:** Issues, PRs, discussions
- **Next Session:** Sat Mar 1, 2:00 PM EST

---

**Remember:** Every line of code is a step toward mastery. Build publicly, learn deeply. 🚀

*Updated: Feb 22, 2026 | Next: Document Loaders & RAG*