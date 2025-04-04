import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { readFileSync } from "fs";
import { join } from "path";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://uotinitiative.org");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { file } = req.query;

  if (!file) {
    return res.status(400).json({ error: "Missing 'file' parameter" });
  }

  try {
    const privateKey = process.env.CLOUDFRONT_PRIVATE_KEY.replace(/\\n/g, '\n');

    const signedUrl = getSignedUrl({
      url: `https://assets.uotinitiative.org/${file}`,
      keyPairId: "K3DIU5P2B5DBYE",
      dateLessThan: new Date(Date.now() + 5 * 60 * 1000),
      privateKey,
    });
    
    return res.status(200).json({ url: signedUrl });
  } catch (err) {
    console.error("Failed to generate signed URL", err);
    return res.status(500).json({ error: "Signing failed" });
  }
}
