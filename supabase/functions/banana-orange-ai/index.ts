const corsHeaders = {
  "Access-Control-Allow-Origin": "https://emilogetdev.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};

const recentRequests = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 12;

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

function allowedPublishableKey(candidate: string | null): boolean {
  if (!candidate) return false;
  try {
    const keys = JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") ?? "{}");
    return Object.values(keys).includes(candidate);
  } catch {
    return candidate === Deno.env.get("SUPABASE_ANON_KEY");
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  const origin = req.headers.get("Origin") ?? "";
  const localDev = origin === "http://localhost:8000" || origin === "http://127.0.0.1:8000";
  if (origin !== "https://emilogetdev.github.io" && !localDev) {
    return json({ error: "Origin not allowed." }, 403);
  }
  if (!allowedPublishableKey(req.headers.get("apikey"))) {
    return json({ error: "Invalid application key." }, 401);
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const recent = (recentRequests.get(ip) ?? []).filter((stamp) => now - stamp < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) return json({ error: "Zu viele Nachrichten. Bitte warte eine Minute." }, 429);
  recent.push(now);
  recentRequests.set(ip, recent);

  const apiKey = Deno.env.get("XAI_API_KEY");
  if (!apiKey) return json({ error: "Die KI ist noch nicht fertig eingerichtet. Der Betreiber muss den xAI-Schlüssel als Supabase Secret XAI_API_KEY hinterlegen." }, 503);

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Ungültige Anfrage." }, 400);
  }
  if (!Array.isArray(body.messages) || body.messages.length < 1 || body.messages.length > 12) {
    return json({ error: "Die Unterhaltung enthält zu viele oder zu wenige Nachrichten." }, 400);
  }

  const messages = body.messages.map((item) => {
    if (!item || typeof item !== "object") throw new Error("Invalid message");
    const role = (item as { role?: string }).role;
    const content = (item as { content?: string }).content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string" || content.length < 1 || content.length > 5000) {
      throw new Error("Invalid message");
    }
    return { role, content };
  });

  try {
    const upstream = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "grok-4.7",
        messages: [
          { role: "system", content: "You are Banana Orange AI, a helpful, friendly assistant. Answer in the language the user uses. Be clear, accurate, age-appropriate, and honest when uncertain. Do not claim to have performed actions you did not perform." },
          ...messages,
        ],
        max_tokens: 800,
      }),
      signal: AbortSignal.timeout(45_000),
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      console.error("xAI request failed:", upstream.status);
      return json({ error: "Die KI-Anfrage ist fehlgeschlagen. Prüfe den xAI-Schlüssel und das API-Guthaben." }, 502);
    }
    const reply = data?.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) return json({ error: "Die KI hat keine Antwort geliefert." }, 502);
    return json({ reply: reply.trim() });
  } catch (error) {
    console.error("Banana Orange AI error:", error);
    return json({ error: "Verbindung zur KI fehlgeschlagen. Bitte versuche es erneut." }, 502);
  }
});
