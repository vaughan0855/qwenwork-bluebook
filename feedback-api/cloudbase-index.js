const http = require("http");
const tcb = require("@cloudbase/node-sdk");

const ALLOWED_ORIGINS = new Set([
  "https://qwenwork.homes",
  "https://www.qwenwork.homes"
]);

const app = tcb.init({
  env: process.env.CLOUDBASE_ENV_ID || "qwenwork-feedback-d0d30k294ca8ef",
  accessKey: process.env.CLOUDBASE_APIKEY
});
const db = app.rdb({ database: "public" });

const json = (res, status, body, origin = "") => {
  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };
  if (!origin || ALLOWED_ORIGINS.has(origin)) headers["Access-Control-Allow-Origin"] = origin || "*";
  res.writeHead(status, headers);
  res.end(JSON.stringify(body));
};

const listValue = (value) => {
  if (Array.isArray(value)) return value.filter((item) => typeof item === "string" && item.trim()).slice(0, 20);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return listValue(parsed);
    } catch (_) {}
    return value.split(/[;,，、]/).map((item) => item.trim()).filter(Boolean).slice(0, 20);
  }
  return [];
};

const parseBody = (req) => new Promise((resolve, reject) => {
  let raw = "";
  req.on("data", (chunk) => {
    raw += chunk;
    if (raw.length > 100_000) reject(new Error("payload too large"));
  });
  req.on("end", () => {
    try {
      resolve(raw ? JSON.parse(raw) : {});
    } catch (_) {
      reject(new Error("invalid json"));
    }
  });
  req.on("error", reject);
});

const normalizeRow = (row) => ({
  helpfulness: row.helpfulness,
  valuable: listValue(row.valuable),
  action: listValue(row.action),
  nps: Number(row.nps),
  reason: row.reason || "",
  submittedAt: row.submitted_at || row.submittedAt || null
});

const buildSummary = async () => {
  const result = await db
    .from("feedback")
    .select("id, helpfulness, valuable, action, nps, reason, submitted_at")
    .order("id", { ascending: true });
  if (result.error) throw new Error(result.error.message || "database query failed");
  const rows = (result.data || []).map(normalizeRow);
  const helpfulness = {};
  const valuable = {};
  const action = {};
  const npsDistribution = {};
  const helpScore = { "非常有帮助": 5, "比较有帮助": 4, "一般": 3, "帮助不大": 2, "没有帮助": 1 };
  let helpTotal = 0;
  let helpCount = 0;
  let promoters = 0;
  let detractors = 0;
  const comments = [];

  for (const row of rows) {
    if (row.helpfulness) helpfulness[row.helpfulness] = (helpfulness[row.helpfulness] || 0) + 1;
    if (helpScore[row.helpfulness]) {
      helpTotal += helpScore[row.helpfulness];
      helpCount += 1;
    }
    if (Number.isInteger(row.nps) && row.nps >= 0 && row.nps <= 10) {
      npsDistribution[String(row.nps)] = (npsDistribution[String(row.nps)] || 0) + 1;
      if (row.nps >= 9) promoters += 1;
      if (row.nps <= 6) detractors += 1;
    }
    for (const item of row.valuable) valuable[item] = (valuable[item] || 0) + 1;
    for (const item of row.action) action[item] = (action[item] || 0) + 1;
    if (row.reason) comments.push(row.reason);
  }

  return {
    total: rows.length,
    averageHelpfulness: helpCount ? Number((helpTotal / helpCount).toFixed(1)) : null,
    nps: rows.length ? Math.round((promoters - detractors) / rows.length * 100) : null,
    promoters,
    detractors,
    helpfulness,
    valuable,
    action,
    npsDistribution,
    commentsCount: comments.length,
    comments
  };
};

const handle = async (req, res) => {
  const origin = req.headers.origin || "";
  if (req.method === "OPTIONS") return json(res, 200, { ok: true }, origin);
  if (origin && !ALLOWED_ORIGINS.has(origin)) return json(res, 403, { error: "origin_not_allowed" }, origin);

  const url = new URL(req.url, "http://localhost");
  const pathname = url.pathname.replace(/^\/feedback-api(?=\/|$)/, "") || "/";
  if (req.method === "GET" && (pathname === "/" || pathname === "/summary")) {
    return json(res, 200, await buildSummary(), origin);
  }

  if (req.method === "POST" && (pathname === "/feedback" || pathname === "/feedback/")) {
    const body = await parseBody(req);
    const helpfulness = typeof body.helpfulness === "string" ? body.helpfulness.trim() : "";
    const valuable = listValue(body.valuable);
    const action = listValue(body.action);
    const nps = Number(body.nps);
    const reason = typeof body.reason === "string" ? body.reason.trim().slice(0, 2000) : "";
    if (!helpfulness || !valuable.length || !action.length || !Number.isInteger(nps) || nps < 0 || nps > 10) {
      return json(res, 400, { error: "invalid_feedback" }, origin);
    }
    const result = await db.from("feedback").insert({
      helpfulness,
      valuable,
      action,
      nps,
      reason,
      submitted_at: new Date().toISOString()
    });
    if (result.error) throw new Error(result.error.message || "database insert failed");
    return json(res, 201, { ok: true }, origin);
  }

  return json(res, 404, { error: "not_found" }, origin);
};

http.createServer((req, res) => {
  handle(req, res).catch((error) => {
    console.error(error);
    json(res, 500, { error: "server error" }, req.headers.origin || "");
  });
}).listen(Number(process.env.PORT) || 9000, "0.0.0.0");
