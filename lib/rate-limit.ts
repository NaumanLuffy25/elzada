import { NextRequest } from "next/server";

/**
 * Simple in-memory rate limiter.
 * Tracks requests per IP address within a sliding time window.
 * Not suitable for multi-server deployments (use Redis instead).
 */
const rateLimitMap = new Map<string, number[]>();

export function rateLimit(ip: string, maxRequests = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];
  const valid = timestamps.filter((t) => now - t < windowMs);

  if (valid.length >= maxRequests) {
    return false;
  }

  valid.push(now);
  rateLimitMap.set(ip, valid);
  return true;
}

/** Extract client IP from request headers, falling back to "unknown". */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "unknown";
}
