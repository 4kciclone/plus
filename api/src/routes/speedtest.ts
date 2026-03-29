import { Router, Request, Response } from "express";
import crypto from "crypto";

const router = Router();

// Garbage data buffer (pre-generated for performance)
const CHUNK_SIZE = 1024 * 1024; // 1MB
const garbageBuffer = crypto.randomBytes(CHUNK_SIZE);

/**
 * GET /speedtest/ping
 * Returns a tiny response for latency measurement
 */
router.get("/ping", (_req: Request, res: Response) => {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "Connection": "keep-alive",
  });
  res.status(200).send("pong");
});

/**
 * GET /speedtest/download
 * Streams random data for download speed measurement
 * Query params:
 *   size: MB to download (default 10, max 100)
 */
router.get("/download", (req: Request, res: Response) => {
  const sizeMB = Math.min(parseInt(req.query.size as string) || 10, 100);
  const totalBytes = sizeMB * 1024 * 1024;

  res.set({
    "Content-Type": "application/octet-stream",
    "Content-Length": totalBytes.toString(),
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "Connection": "keep-alive",
  });

  let sent = 0;
  const sendChunk = () => {
    while (sent < totalBytes) {
      const remaining = totalBytes - sent;
      const chunk = remaining >= CHUNK_SIZE ? garbageBuffer : garbageBuffer.subarray(0, remaining);
      const canContinue = res.write(chunk);
      sent += chunk.length;
      if (!canContinue) {
        res.once("drain", sendChunk);
        return;
      }
    }
    res.end();
  };
  sendChunk();
});

/**
 * POST /speedtest/upload
 * Receives data for upload speed measurement
 * Returns bytes received
 */
router.post("/upload", (req: Request, res: Response) => {
  let bytes = 0;
  req.on("data", (chunk: Buffer) => {
    bytes += chunk.length;
  });
  req.on("end", () => {
    res.set("Cache-Control", "no-store");
    res.json({ bytes });
  });
});

export default router;
