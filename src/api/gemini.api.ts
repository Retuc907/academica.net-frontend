import {
  PROMPT_AI_DETECTOR,
  buildAcademicAssistantPrompt,
  buildAdminInsightsPrompt,
} from "./gemini.prompts";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

const DEFAULT_PRIMARY = "gemini-2.5-flash";
const DEFAULT_FALLBACKS = "gemini-2.5-flash";

function getModelChain(): string[] {
  const chain = import.meta.env.VITE_GEMINI_MODEL_CHAIN as string | undefined;
  if (chain?.trim()) {
    return chain.split(",").map((m) => m.trim()).filter(Boolean);
  }
  const primary = (import.meta.env.VITE_GEMINI_MODEL as string | undefined)?.trim() || DEFAULT_PRIMARY;
  const fallbacksRaw = (import.meta.env.VITE_GEMINI_MODEL_FALLBACKS as string | undefined)?.trim() || DEFAULT_FALLBACKS;
  const fallbacks = fallbacksRaw.split(",").map((m) => m.trim()).filter(Boolean);
  return [...new Set([primary, ...fallbacks])];
}

interface GeminiPart {
  text?: string;
  inline_data?: { mime_type: string; data: string };
}

interface GeminiResponse {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
  error?: { message?: string; status?: string };
}

function parseRetrySeconds(message: string): number | null {
  const match = message.match(/retry in ([\d.]+)s/i);
  return match ? Math.ceil(parseFloat(match[1])) + 1 : null;
}

function isQuotaError(message: string): boolean {
  return /quota exceeded|rate limit|resource exhausted|limit:\s*0/i.test(message);
}

function sleep(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

async function callGeminiOnce(model: string, parts: GeminiPart[]): Promise<string> {
  const res = await fetch(
    `${BASE_URL}/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts }] }),
    }
  );

  const data: GeminiResponse = await res.json();

  if (!res.ok) {
    const msg = data.error?.message ?? `Error de Gemini (${res.status})`;
    const err = new Error(msg) as Error & { isQuota?: boolean; retrySeconds?: number };
    err.isQuota = isQuotaError(msg);
    err.retrySeconds = parseRetrySeconds(msg) ?? undefined;
    throw err;
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini no devolvió una respuesta válida.");
  return text;
}

async function callGemini(parts: GeminiPart[]): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("Falta la clave de Gemini. Configura VITE_GEMINI_API_KEY en tu archivo .env");
  }

  const models = getModelChain();
  let lastError: Error | null = null;

  for (const model of models) {
    try {
      return await callGeminiOnce(model, parts);
    } catch (e: unknown) {
      const err = e as Error & { isQuota?: boolean; retrySeconds?: number };
      lastError = err;

      if (err.isQuota && err.retrySeconds && err.retrySeconds <= 120) {
        await sleep(err.retrySeconds);
        try {
          return await callGeminiOnce(model, parts);
        } catch (retryErr) {
          lastError = retryErr as Error;
        }
      }
      console.warn(`[Gemini] Modelo ${model} falló:`, err.message);
    }
  }

  if (lastError?.message && isQuotaError(lastError.message)) {
    throw new Error(
      "Cuota de Gemini agotada en el plan gratuito. Espera un minuto e intenta de nuevo, " +
      "o verifica tu clave en https://aistudio.google.com/apikey"
    );
  }

  throw lastError ?? new Error("No se pudo conectar con Gemini.");
}

function parseJsonFromText<T>(text: string): T {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No se pudo interpretar la respuesta de la IA.");
  return JSON.parse(match[0]) as T;
}

export interface AiDetectionResult {
  porcentaje: number;
  justificacion: string;
}

export interface AdminInsightResult {
  resumen: string;
  alertas: string[];
  recomendaciones: string[];
}

/** Analiza una imagen de documento y estima el % de contenido generado por IA */
export async function detectAiInDocument(
  base64: string,
  mimeType: string
): Promise<AiDetectionResult> {
  const text = await callGemini([
    { inline_data: { mime_type: mimeType, data: base64 } },
    { text: PROMPT_AI_DETECTOR },
  ]);

  const result = parseJsonFromText<AiDetectionResult>(text);
  result.porcentaje = Math.min(100, Math.max(0, Math.round(result.porcentaje)));
  return result;
}

/** Asistente académico: responde preguntas del estudiante con contexto de sus notas */
export async function askAcademicAssistant(
  question: string,
  gradesContext: string
): Promise<string> {
  return callGemini([{ text: buildAcademicAssistantPrompt(question, gradesContext) }]);
}

/** Genera insights para el admin basados en estadísticas institucionales */
export async function generateAdminInsights(statsContext: string): Promise<AdminInsightResult> {
  const text = await callGemini([{ text: buildAdminInsightsPrompt(statsContext) }]);
  return parseJsonFromText<AdminInsightResult>(text);
}

export { getModelChain };
