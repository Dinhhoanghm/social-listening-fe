import { NextRequest, NextResponse } from "next/server";

const backendOrigin = () =>
  (process.env.BACKEND_ORIGIN ?? "http://localhost:8080").replace(/\/$/, "");

/**
 * BFF: trình duyệt chỉ gọi same-origin `/api/backend/...`.
 * Server Next proxy tới Spring — không cần NEXT_PUBLIC_* cho URL backend.
 */
async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  if (!path?.length) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  const targetPath = path.join("/");
  const url = new URL(request.url);
  const targetUrl = `${backendOrigin()}/${targetPath}${url.search}`;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);
  const auth = request.headers.get("authorization");
  if (auth) headers.set("Authorization", auth);

  const init: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  try {
    const res = await fetch(targetUrl, init);
    const body = await res.text();
    return new NextResponse(body, {
      status: res.status,
      headers: {
        "Content-Type":
          res.headers.get("content-type") ?? "application/json; charset=utf-8",
      },
    });
  } catch (e) {
    console.error("[api/backend] upstream error", targetUrl, e);
    return NextResponse.json(
      {
        code: "502",
        message: "Upstream unreachable",
        data: null,
      },
      { status: 502 }
    );
  }
}

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, ctx);
}

export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, ctx);
}

export async function PUT(
  request: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, ctx);
}

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, ctx);
}

export async function DELETE(
  request: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, ctx);
}
