import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  if (error instanceof ZodError) {
    const message = error.issues.map((issue) => issue.message).join("; ");
    return NextResponse.json({ error: message || "Invalid request" }, { status: 400 });
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const message = Object.values(error.errors)[0]?.message ?? "Validation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (error instanceof mongoose.Error.CastError) {
    return NextResponse.json({ error: "Invalid request parameter" }, { status: 400 });
  }

  if (isRecord(error) && error.code === 11000) {
    return NextResponse.json({ error: "Resource already exists" }, { status: 409 });
  }

  console.error(error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

export async function parseJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, "Invalid JSON body");
  }
}
