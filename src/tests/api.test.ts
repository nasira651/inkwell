import { describe, expect, it } from "vitest";
import mongoose from "mongoose";

import { ApiError, handleApiError } from "@/lib/api/errors";
import { loginBodySchema } from "@/lib/api/schemas";
import { validate } from "@/lib/api/validation";

describe("validate(loginBodySchema)", () => {
  it("normalizes and accepts a valid email", () => {
    expect(validate(loginBodySchema, { email: "  Nasira@Gmail.COM  " })).toEqual({
      email: "nasira@gmail.com",
    });
  });

  it("rejects missing email", () => {
    expect(() => validate(loginBodySchema, {})).toThrow();
  });

  it("rejects invalid email format", () => {
    expect(() => validate(loginBodySchema, { email: "not-an-email" })).toThrow();
  });
});

describe("handleApiError", () => {
  it("maps ApiError to JSON with the correct status", async () => {
    const response = handleApiError(new ApiError(401, "Unauthorized"));
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
  });

  it("maps mongoose CastError to 400", async () => {
    const response = handleApiError(new mongoose.Error.CastError("ObjectId", "bad-id", "_id"));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Invalid request parameter",
    });
  });

  it("maps unknown errors to generic 500", async () => {
    const response = handleApiError(new Error("database connection exploded"));
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Internal server error",
    });
  });
});
