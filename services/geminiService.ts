import { GoogleGenAI } from "@google/genai";
import { FactCheckResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Tu es "Tunisia Fact Checker AI", un expert en vérification des faits.
Ta mission est d'analyser un texte ou un lien fourni par l'utilisateur pour vérifier sa véracité en utilisant Google Search.

Tu dois retourner un objet JSON (et UNIQUEMENT du JSON) suivant strictement ce format :
{
  "resume": "Résumé clair et concis de l'information analysée (en Français).",
  "verdict": "VRAI" | "FAUX" | "TROMPEUR" | "NON VÉRIFIABLE",
  "explication_tunisien": "Une explication courte en dialecte tunisien (Derja) ÉCRITE EN LETTRES ARABES (Arabic Script), simple et compréhensible.",
  "sources": [
    {"nom": "Nom de la source", "lien": "URL de la source"}
  ],
  "ui_hints": {
    "couleur_verdict": "vert" (si VRAI) | "rouge" (si FAUX ou TROMPEUR) | "orange" (si NON VÉRIFIABLE),
    "icon": "✅" (VRAI) | "❌" (FAUX) | "⚠️" (TROMPEUR) | "❓" (NON VÉRIFIABLE)
  },
  "is_tunisia_related": boolean (true si le sujet concerne la Tunisie ou des personnalités/événements tunisiens, false sinon)
}

Règles importantes :
1. Utilise l'outil de recherche Google pour trouver des sources fiables.
2. DÉTECTION DU CONTEXTE : Analyse si l'information concerne la Tunisie.
   - Si OUI : Mets "is_tunisia_related": true.
   - Si NON : Mets "is_tunisia_related": false (ex: élections USA, football européen, actualité France).
3. TRAITEMENT OBLIGATOIRE : Même si "is_tunisia_related" est false, tu DOIS vérifier l'information et donner un verdict.
4. EXPLICATION : 
   - DOIT ETRE EN CARACTÈRES ARABES (Tunisian Arabic script).
   - Si c'est Tunisien : Explique normalement en Derja (Arabe).
   - Si ce n'est PAS Tunisien : Commence ton explication par préciser en Derja (Arabe) que ça ne concerne pas la Tunisie directement, puis explique.
5. Sois objectif, factuel et précis.
`;

// Fonction utilitaire pour attendre (sleep)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const checkFactWithGemini = async (query: string): Promise<FactCheckResult> => {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Vérifie cette information ou ce lien : ${query}`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text;
      
      // Attempt to extract JSON from the text response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Le modèle n'a pas retourné un JSON valide.");
      }

      const result: FactCheckResult = JSON.parse(jsonMatch[0]);

      // Enhance sources with grounding metadata
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      
      if ((!result.sources || result.sources.length === 0) && groundingChunks) {
        const extractedSources = groundingChunks
          .filter((chunk: any) => chunk.web)
          .map((chunk: any) => ({
            nom: chunk.web.title || "Source Web",
            lien: chunk.web.uri
          }))
          // Filter out duplicates based on URI
          .filter((v: any, i: number, a: any) => a.findIndex((t: any) => (t.lien === v.lien)) === i)
          .slice(0, 4); // Limit to top 4

          if (extractedSources.length > 0) {
              result.sources = extractedSources;
          }
      }

      return result;

    } catch (error: any) {
      console.error(`Gemini API Error (Attempt ${attempt + 1}/${maxRetries}):`, error);

      // Vérifie si c'est une erreur de surcharge (429) ou temporaire (503)
      const isOverloaded = error.message?.includes('429') || error.message?.includes('503') || error.status === 429 || error.status === 503;

      if (isOverloaded && attempt < maxRetries - 1) {
        // Attendre un peu plus longtemps à chaque échec (2s, 4s...)
        const waitTime = 2000 * (attempt + 1);
        console.log(`API surchargée, nouvelle tentative dans ${waitTime}ms...`);
        await delay(waitTime);
        attempt++;
      } else {
        // Si ce n'est pas une erreur de surcharge ou si on a épuisé les essais
        throw new Error("Le service est momentanément saturé par trop de demandes. Veuillez réessayer dans quelques secondes.");
      }
    }
  }

  throw new Error("Impossible de vérifier l'information pour le moment.");
};
