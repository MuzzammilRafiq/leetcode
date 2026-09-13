import { createHmac, timingSafeEqual } from "node:crypto";
import { get, put } from "@vercel/blob";

const BLOB_PATH = "dsa-pattern-progress.json";
const COOKIE_NAME = "dsa_sync";

function json(value, status = 200, headers = {}) {
  return Response.json(value, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

function secret() {
  return process.env.SYNC_PASSWORD || "";
}

function authToken() {
  return createHmac("sha256", secret())
    .update("dsa-pattern-sheet-sync")
    .digest("hex");
}

function equal(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && timingSafeEqual(left, right);
}

function cookie(request, name) {
  const cookies = request.headers.get("cookie") || "";
  for (const part of cookies.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return "";
}

function authorized(request) {
  return !!secret() && equal(cookie(request, COOKIE_NAME), authToken());
}

function sameOrigin(request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

function cleanState(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const entries = Object.entries(value);
  if (entries.length > 10000) return null;

  const result = {};
  for (const [id, solved] of entries) {
    if (!/^\d+$/.test(id) || solved !== true) return null;
    result[id] = true;
  }
  return result;
}

async function readProgress() {
  const result = await get(BLOB_PATH, {
    access: "private",
    useCache: false,
  });
  if (!result || result.statusCode !== 200 || !result.stream) {
    return { exists: false, state: {}, updatedAt: 0 };
  }

  const stored = await new Response(result.stream).json();
  const state = cleanState(stored.state);
  if (!state) throw new Error("Stored progress is invalid");

  return {
    exists: true,
    state,
    updatedAt: Number(stored.updatedAt) || 0,
  };
}

export default {
  async fetch(request) {
    if (!secret()) {
      return json({ error: "SYNC_PASSWORD is not configured" }, 503);
    }

    if (request.method === "POST") {
      if (!sameOrigin(request)) return json({ error: "Forbidden" }, 403);

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "Invalid JSON" }, 400);
      }

      if (!equal(body?.password || "", secret())) {
        return json({ error: "Wrong password" }, 401);
      }

      return json(
        { ok: true },
        200,
        {
          "Set-Cookie": `${COOKIE_NAME}=${authToken()}; Path=/api/progress; HttpOnly; Secure; SameSite=Strict; Max-Age=31536000`,
        },
      );
    }

    if (!authorized(request)) return json({ error: "Unauthorized" }, 401);

    if (request.method === "GET") {
      try {
        return json(await readProgress());
      } catch (error) {
        console.error("Could not read progress", error);
        return json({ error: "Could not read progress" }, 500);
      }
    }

    if (request.method === "PUT") {
      if (!sameOrigin(request)) return json({ error: "Forbidden" }, 403);

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "Invalid JSON" }, 400);
      }

      const state = cleanState(body?.state);
      const updatedAt = Number(body?.updatedAt);
      if (!state || !Number.isFinite(updatedAt) || updatedAt < 0) {
        return json({ error: "Invalid progress" }, 400);
      }

      try {
        await put(
          BLOB_PATH,
          JSON.stringify({ version: 1, updatedAt, state }),
          {
            access: "private",
            allowOverwrite: true,
            contentType: "application/json",
            cacheControlMaxAge: 60,
          },
        );
        return json({ ok: true, updatedAt });
      } catch (error) {
        console.error("Could not save progress", error);
        return json({ error: "Could not save progress" }, 500);
      }
    }

    return json({ error: "Method not allowed" }, 405, {
      Allow: "GET, POST, PUT",
    });
  },
};
