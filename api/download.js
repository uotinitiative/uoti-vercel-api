import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { readFileSync } from "fs";
import { join } from "path";

export default async function handler(req, res) {
  const { file } = req.query;

  if (!file) {
    return res.status(400).json({ error: "Missing 'file' parameter" });
  }

  try {
    const privateKeyPath = join(process.cwd(), "api", "private_key.pem");
    const privateKey = readFileSync(privateKeyPath, "utf8");

    const signedUrl = getSignedUrl({
      url: `https://df3f5t1ky9d5t.cloudfront.net/${file}`, // <== change this later
      keyPairId: "K3DIU5P2B5DBYE", // <== change this later
      dateLessThan: new Date(Date.now() + 5 * 60 * 1000),
      privateKey,
    });

    return res.status(200).json({ url: signedUrl });
  } catch (err) {
    console.error("Failed to generate signed URL", err);
    return res.status(500).json({ error: "Signing failed" });
  }
}
