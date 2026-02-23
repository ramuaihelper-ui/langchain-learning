// ============================================================================
// INTERACTIVE CHAT: Terminal-based AI (Simplified - Works with installed packages)
// ============================================================================
//
// WHAT THIS DOES:
// - Takes user input from terminal
// - Analyzes it: detects Hinglish, sentiment, cultural context
// - Generates a warm, personalized response
//
// RUN: node agent-chat.js
// THEN: Type messages and chat!
// EXIT: Type 'quit' or 'exit'
//
// ============================================================================

import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import readline from "readline";

// ----------------------------------------------------------------------------
// SETUP: LLM
// ----------------------------------------------------------------------------
const llm = new ChatOllama({
  baseUrl: "http://localhost:11434",
  model: "kimi-k2.5:cloud",
  temperature: 0.7,
});

// ----------------------------------------------------------------------------
// TOOL FUNCTIONS (Simple implementations)
// ----------------------------------------------------------------------------

// Tool 1: Detect if text is Hinglish and translate
function analyzeHinglish(input) {
  const dictionary = {
    "kya": "what", "baat": "thing/matter", "hai": "is", 
    "yaar": "friend/buddy", "mast": "awesome", "thak": "tired",
    "gaya": "gone/became", "kar": "do", "raha": "doing",
    "acha": "good", "bohot": "very", "nahi": "no/not",
    "kuch": "something", "samajh": "understand", "aa": "come",
    "rhi": "doing (fem)", "rha": "doing (masc)", "hai": "is",
    "ka": "what/of", "kahan": "where", "kab": "when",
    "kaise": "how", "kyun": "why", "kitna": "how much",
    "badiya": "great", "badhiya": "great", "lage": "seem/feel",
    "sahi": "correct/good", "galat": "wrong", "han": "yes",
    "hmm": "uh huh", "haha": "laughter", "lol": "lol",
    "arre": "oh hey", "chal": "let's go/move", "chalo": "come on",
    "sun": "listen", "bol": "speak/say", "bolo": "please say",
    "acha": "okay", "theek": "okay/fine", "bas": "enough/stop",
    "nahi": "no", "hmm": "mhm", "arey": "oh hey",
    "yaar": "friend", "dost": "friend", "bhai": "brother/friend"
  };
  
  const lowerInput = input.toLowerCase();
  const hinglishWords = Object.keys(dictionary).filter(word => 
    lowerInput.includes(word)
  );
  
  const isHinglish = hinglishWords.length > 0;
  
  // Simple translation
  let translation = input;
  hinglishWords.forEach(word => {
    translation = translation.replace(
      new RegExp(`\\b${word}\\b`, "gi"), 
      dictionary[word]
    );
  });
  
  return {
    is_hinglish: isHinglish,
    detected_words: hinglishWords,
    translation: isHinglish ? translation : input,
    confidence: Math.min(hinglishWords.length * 0.2 + 0.5, 0.9)
  };
}

// Tool 2: Analyze sentiment
function analyzeSentiment(input) {
  const text = input.toLowerCase();
  
  const positive = ["happy", "great", "mast", "good", "awesome", "excited", 
    "love", "like", "enjoy", "badiya", "badhiya", "sahi", "acha", "maza", "fun"];
  const negative = ["sad", "bad", "thak", "tired", "hate", "angry", "upset", 
    "worried", "stressed", "tension", "problem", "issue", "nahi", "galat"];
  const emphasis = ["bohot", "bahut", "kitna", "very", "so", "too"];
  
  let sentiment = "neutral";
  let intensity = 5;
  
  const hasPositive = positive.some(w => text.includes(w));
  const hasNegative = negative.some(w => text.includes(w));
  const hasEmphasis = emphasis.some(w => text.includes(w));
  
  if (hasPositive && !hasNegative) {
    sentiment = "positive";
    intensity = hasEmphasis ? 8 : 6;
  } else if (hasNegative && !hasPositive) {
    sentiment = "negative";
    intensity = hasEmphasis ? 7 : 5;
  }
  
  return {
    sentiment,
    intensity,
    confidence: 0.75,
    should_celebrate: sentiment === "positive" && intensity > 6,
    should_comfort: sentiment === "negative" && intensity > 4
  };
}

// Tool 3: Cultural context lookup
function lookupCultural(input) {
  const cultureDB = {
    "yaar": {
      origin: "Persian/Urdu",
      meaning: "Friend, companion",
      formality: "Very informal",
      region: "All India",
      fun_fact: "Became iconic through 90s Bollywood (especially Shah Rukh Khan movies)"
    },
    "mast": {
      origin: "Urdu",
      meaning: "Fun, enjoyable, carefree",
      formality: "Informal",
      region: "North India",
      fun_fact: "Originally meant 'intoxicated', now means 'having fun'"
    },
    "thak": {
      origin: "Sanskrit",
      meaning: "Tired, exhausted",
      formality: "Neutral",
      region: "All India",
      fun_fact: "Root word 'taksh' means to labor or work"
    },
    "bhai": {
      origin: "Sanskrit/Hindi",
      meaning: "Brother (also used for friends)",
      formality: "Neutral to formal",
      region: "All India", 
      fun_fact: "Respectful way to address any male, even strangers"
    },
    "arre": {
      origin: "Hindi",
      meaning: "Oh hey / Wait",
      formality: "Informal",
      region: "All India",
      fun_fact: "Can express surprise, concern, or just get attention"
    }
  };
  
  const found = Object.entries(cultureDB).find(([term]) => 
    input.toLowerCase().includes(term)
  );
  
  return found ? { found: true, term: found[0], ...found[1] } : { found: false };
}

// ----------------------------------------------------------------------------
// MAIN CHAT FUNCTION
// ----------------------------------------------------------------------------
async function processMessage(userInput) {
  // Step 1: Analyze inputs (tools)
  const hinglish = analyzeHinglish(userInput);
  const sentiment = analyzeSentiment(userInput);
  const cultural = lookupCultural(userInput);
  
  // Step 2: Build prompt with context
  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", `You're texting a friend who's writing to you in Hinglish.

The user said: "{user_input}"
- It means: "{translation}"
- They're feeling: {sentiment} ({intensity}/10 intensity)
{cultural_context}

Text back like a real friend would:
- React naturally to what they said (not robotic)
- Use casual language you'd actually text
- If they seem happy → be happy with them, maybe ask what's up
- If they seem down → be there for them, offer support
- If they used Hinglish → you can respond in Hinglish too if it feels right
- Reference the cultural stuff ONLY if it flows naturally (don't force it)
- Match their energy - if they're hyped, you hype too; if they're chill, stay chill
- Keep it short (like real texts, not paragraphs)
- Feel free to use emojis like a normal person would 📱

Don't sound like you're giving a presentation. Just be a friend texting back.`],
    ["user", "{user_input}"]
  ]);
  
  // Format cultural info (friend context, not lecture)
  let culturalContext = "";
  if (cultural.found) {
    culturalContext = `- Context: "${cultural.term}" is like calling someone "${cultural.meaning}"`;
  } else if (hinglish.is_hinglish) {
    culturalContext = `- Hinglish mix detected`;
  }
  
  const parser = new StringOutputParser();
  const chain = promptTemplate.pipe(llm).pipe(parser);
  
  // Step 3: Generate response
  const response = await chain.invoke({
    user_input: userInput,
    is_hinglish: hinglish.is_hinglish ? "Yes" : "No",
    translation: hinglish.translation,
    sentiment: sentiment.sentiment,
    intensity: sentiment.intensity,
    cultural_context: culturalContext || "- No special context"
  });
  
  // Return context + response
  return {
    response,
    analysis: {
      hinglish,
      sentiment,
      cultural
    }
  };
}

// ----------------------------------------------------------------------------
// INTERACTIVE CHAT LOOP
// ----------------------------------------------------------------------------
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("🦋 Welcome to Agent Chat!");
console.log("I can understand Hinglish, analyze feelings, and share cultural facts.");
console.log("Type your message. Type 'quit' to exit.\n");
console.log("Examples:");
console.log('  "Yaar, aaj bohot mast hai! 😊"');
console.log('  "Thak gaya hun office mein"');
console.log('  "Kya baat hai yaar! 🎉"');
console.log('  "Kuch samajh nahi aa rha"\n');

async function askQuestion() {
  rl.question("👤 You: ", async (input) => {
    if (input.toLowerCase().trim() === "quit" || input.toLowerCase().trim() === "exit") {
      console.log("\n🦋 Goodbye! It was great chatting with you.");
      rl.close();
      process.exit(0);
    }

    if (!input.trim()) {
      console.log("⚠️  Please type something!\n");
      askQuestion();
      return;
    }

    console.log("🤖 Thinking...\n");

    try {
      const result = await processMessage(input);
      
      console.log(`🤖 Friend: ${result.response}\n`);
      
      // Show minimal context
      console.log(`   📱 (detected: ${result.analysis.sentiment.sentiment} vibe, ${result.analysis.hinglish.is_hinglish ? 'some Hinglish' : 'English'})\n`);

    } catch (error) {
      console.error("❌ Error:", error.message);
      if (error.code === "ECONNREFUSED") {
        console.log("💡 Make sure Ollama is running: ollama serve\n");
      }
    }

    askQuestion();
  });
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log("\n\n🦋 Goodbye!");
  process.exit(0);
});

// Start
askQuestion();
