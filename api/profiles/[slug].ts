import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { slug } = req.query;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(503).json({ error: "Banco não configurado." });
  const response = await fetch(
    `${url}/rest/v1/professional_leads?slug=eq.${encodeURIComponent(String(slug))}&select=profile_json,status&limit=1`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } }
  );
  if (!response.ok) return res.status(500).json({ error: "Erro ao buscar perfil." });
  const rows = await response.json();
  if (!rows[0] || rows[0].status === "arquivado") return res.status(404).json({ error: "Perfil não encontrado." });
  return res.status(200).json(rows[0].profile_json);
}
