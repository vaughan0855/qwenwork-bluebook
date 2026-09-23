const ALLOWED_ORIGINS = new Set([
  "https://qwenwork.homes",
  "https://www.qwenwork.homes"
]);

const json = (body, request, status = 200) => {
  const origin = request.headers.get("Origin");
  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };
  if (ALLOWED_ORIGINS.has(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return new Response(JSON.stringify(body), { status, headers });
};

const listValue = (value) => {
  if (Array.isArray(value)) return value.filter((item) => typeof item === "string" && item.trim()).slice(0, 20);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return listValue(parsed);
    } catch (error) {}
    return value.split(/[;,，、]/).map((item) => item.trim()).filter(Boolean).slice(0, 20);
  }
  return [];
};

const isAllowedOrigin = (request) => {
  const origin = request.headers.get("Origin");
  return !origin || ALLOWED_ORIGINS.has(origin);
};

const buildSummary = async (db) => {
  const rows = await db.prepare("SELECT helpfulness, valuable_json, action_json, nps FROM feedback ORDER BY id ASC").all();
  const data = rows.results || [];
  const helpfulness = {};
  const valuable = {};
  const action = {};
  const nps = {};
  let helpTotal = 0;
  let helpCount = 0;
  let promoters = 0;
  let detractors = 0;

  const helpScore = { "非常有帮助": 5, "比较有帮助": 4, "一般": 3, "帮助不大": 2, "没有帮助": 1 };
  for (const row of data) {
    helpfulness[row.helpfulness] = (helpfulness[row.helpfulness] || 0) + 1;
    if (helpScore[row.helpfulness]) {
      helpTotal += helpScore[row.helpfulness];
      helpCount += 1;
    }
    const score = Number(row.nps);
    if (Number.isInteger(score) && score >= 0 && score <= 10) {
      nps[String(score)] = (nps[String(score)] || 0) + 1;
      if (score >= 9) promoters += 1;
      if (score <= 6) detractors += 1;
    }
    for (const item of [...listValue(row.valuable_json), ...[]]) valuable[item] = (valuable[item] || 0) + 1;
    for (const item of listValue(row.action_json)) action[item] = (action[item] || 0) + 1;
  }

  return {
    total: data.length,
    averageHelpfulness: helpCount ? Number((helpTotal / helpCount).toFixed(1)) : null,
    nps: data.length ? Math.round((promoters - detractors) / data.length * 100) : null,
    promoters,
    detractors,
    helpfulness,
    valuable,
    action,
    npsDistribution: nps,
    commentsCount: 0,
    comments: []
  };
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return json({ ok: true }, request);
    if (!isAllowedOrigin(request)) return json({ error: "origin_not_allowed" }, request, 403);

    if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/summary")) {
      try {
        return json(await buildSummary(env.DB), request);
      } catch (error) {
        return json({ error: "summary_unavailable" }, request, 500);
      }
    }

    if (request.method === "POST" && url.pathname === "/feedback") {
      try {
        const body = await request.json();
        const helpfulness = typeof body.helpfulness === "string" ? body.helpfulness.trim() : "";
        const valuable = listValue(body.valuable);
        const action = listValue(body.action);
        const nps = Number(body.nps);
        const reason = typeof body.reason === "string" ? body.reason.trim().slice(0, 2000) : "";
        if (!helpfulness || !valuable.length || !action.length || !Number.isInteger(nps) || nps < 0 || nps > 10) {
          return json({ error: "invalid_feedback" }, request, 400);
        }
        await env.DB.prepare(
          "INSERT INTO feedback (helpfulness, valuable_json, action_json, nps, reason, submitted_at) VALUES (?, ?, ?, ?, ?, ?)"
        ).bind(helpfulness, JSON.stringify(valuable), JSON.stringify(action), nps, reason, new Date().toISOString()).run();
        return json({ ok: true }, request, 201);
      } catch (error) {
        return json({ error: "feedback_not_saved" }, request, 500);
      }
    }

    return json({ error: "not_found" }, request, 404);
  }
};
