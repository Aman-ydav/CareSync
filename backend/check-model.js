// check-models.js
import "dotenv/config";

const API_KEY = process.env.GENAI_API_KEY;

if (!API_KEY) {
  console.error("❌ No API Key found in .env");
  process.exit(1);
}

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  
  console.log("🔍 Checking available models...");
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error("Error:", data);
      return;
    }

    console.log("\n✅ AVAILABLE MODELS FOR YOUR KEY:");
    console.log("---------------------------------");
    const models = data.models || [];
    
    // Filter for models that support "generateContent"
    const chatModels = models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
    
    chatModels.forEach(m => {
      // The API returns names like "models/gemini-1.5-flash"
      // We just need the part after "models/"
      console.log(`Name: ${m.name.replace("models/", "")}`);
    });
    console.log("---------------------------------");
    
  } catch (error) {
    console.error("Network Error:", error);
  }
}

listModels();