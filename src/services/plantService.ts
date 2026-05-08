import { GoogleGenAI, Type } from "@google/genai";
import { PlantInfo } from "../components/PlantDetails";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const PLANT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    isPlant: { type: Type.BOOLEAN, description: "Is this actually a plant? Set false if it is a human, object, or anything else." },
    name: { type: Type.STRING, description: "O'simlikning nomi" },
    scientificName: { type: Type.STRING, description: "Lotincha nomi" },
    species: { type: Type.STRING, description: "O'simlik turi" },
    description: { type: Type.STRING, description: "Batafsil tavsifi" },
    benefits: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Ekologik yoki shifobaxsh 3ta foydasi"
    },
    careTips: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "O'stirish bo'yicha 3-4ta maslahat"
    },
    toxicity: { type: Type.STRING, description: "Zaharlilik haqida qisqa ma'lumot" },
    safetyWarning: { type: Type.STRING, description: "ENG MUHIM: Zaharli yoki zaharsizligi haqida katta ogohlantirish matni" },
    waterNeeds: { type: Type.STRING, description: "Sug'orish tartibi" },
    sunlightNeeds: { type: Type.STRING, description: "Yorug'lik ehtiyoji" },
    dangerPercentage: { type: Type.INTEGER, description: "Inson uchun haqiqiy xavflilik darajasi (0-100). MUHIM: Shunchaki tikanlar xavf hisoblanmaydi. Faqat toksik yoki zaharli bo'lsagina yuqori foiz bering (masalan > 30%). Mutlaqo xavfsiz bo'lsa 10% dan past bering." },
    rarity: { type: Type.STRING, description: "Hozirda tabiatda qanchalik kamyobligi haqida qisqa ma'lumot" },
    isRedBook: { type: Type.BOOLEAN, description: "Qizil kitobga kiritilganmi?" }
  },
  required: ["isPlant", "name", "scientificName", "species", "description", "benefits", "careTips", "toxicity", "safetyWarning", "waterNeeds", "sunlightNeeds", "dangerPercentage", "rarity", "isRedBook"]
};

export const identifyPlantByImage = async (base64Image: string): Promise<PlantInfo> => {
  const imagePart = {
    inlineData: {
      mimeType: "image/jpeg",
      data: base64Image.split(",")[1],
    },
  };

  const promptPart = {
    text: "Ushbu tasvirni tahlil qiling. AGAR TASVIRDA O'SIMLIK BO'LMASA (masalan, odam, mashina, hayvon yoki boshqa narsa bo'lsa), yoki tasvir juda noaniq bo'lib, unga mos keladigan HAQIQIY o'simlik turi topilmasa, isPlant ni false qilib belgilang. FAQAT HAQIQIY va ANIQ turlarni aniqlang. Agar o'simlik bo'lsa, haqiqiy botanika ma'lumotlarini bering. Qizil kitob holati va xavfliligiga (zaharliligiga) alohida e'tibor bering. JAVOB FAQAT O'ZBEK TILIDA BO'LSIN.",
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: [imagePart, promptPart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: PLANT_SCHEMA,
    },
  });

  const parsed = JSON.parse(response.text || "{}");
  if (!parsed.isPlant) {
    throw new Error("Bunday tur hali kashf etilmagan yoki rasmda o'simlik aniqlanmadi.");
  }
  return parsed as PlantInfo;
};

export const identifyPlantByName = async (name: string): Promise<PlantInfo> => {
  const promptPart = {
    text: `Ushbu nomdagi o'simlik haqida to'liq botanika ma'lumotlarini bering: ${name}. Agar bunday o'simlik mavjud bo'lmasa yoki nomi noto'g'ri bo'lsa, isPlant ni false qiling. JAVOB FAQAT O'ZBEK TILIDA BO'LSIN.`,
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: [promptPart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: PLANT_SCHEMA,
    },
  });

  const parsed = JSON.parse(response.text || "{}");
  if (!parsed.isPlant) {
    throw new Error("Bunday tur hali kashf etilmagan (nomi bo'yicha).");
  }
  return parsed as PlantInfo;
};

export const describePlantByPrompt = async (userInput: string): Promise<PlantInfo> => {
  const promptPart = {
    text: `Foydalanuvchi quyidagicha o'simlikni tasvirladi: "${userInput}". Ushbu tavsifga mos keladigan HAQIQIY o'simlikni aniqlang. Agar tavsif juda umumiy bo'lsa yoki haqiqiy o'simlikka mos kelmasa, isPlant ni false qiling. JAVOB FAQAT O'ZBEK TILIDA BO'LSIN.`,
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: [promptPart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: PLANT_SCHEMA,
    },
  });

  const parsed = JSON.parse(response.text || "{}");
  if (!parsed.isPlant) {
    throw new Error("Tavsifga mos keladigan haqiqiy tur hali topilmadi.");
  }
  return parsed as PlantInfo;
};
