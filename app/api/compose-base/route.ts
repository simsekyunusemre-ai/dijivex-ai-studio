import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

function getImageSize(format?: string) {
  if (format === "story" || format === "portrait") return "1024x1536";
  if (format === "landscape") return "1536x1024";
  return "1024x1024";
}

function buildPrompt({
  brandName,
  sector,
  campaign,
  targetAudience,
  customerVisualRequest,
  format,
}: any) {
  const layout =
    format === "story" || format === "portrait"
      ? `
Create a vertical Instagram Story advertising composition.
Leave empty space at the top for headline placement.
Leave empty space at the bottom for CTA placement.
Keep the product centered.
`
      : `
Create a square Instagram advertising composition.
Leave empty space at the top for headline placement.
Leave empty space at the bottom for CTA placement.
Keep the product centered.
`;

  return `
You are generating a professional advertising base image.

RULES:
- Do NOT generate any text
- Do NOT generate letters
- Do NOT generate typography
- Do NOT generate captions
- Do NOT generate UI
- Do NOT generate watermarks

The uploaded product must remain the main focus.

${layout}

Brand: ${brandName || ""}
Sector: ${sector || ""}
Campaign: ${campaign || ""}
Target Audience: ${targetAudience || ""}

Extra visual request:
${customerVisualRequest || "none"}

Create a premium advertising composition background that keeps the product visible.
`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      brandName,
      sector,
      campaign,
      format,
      targetAudience,
      customerVisualRequest,
      productImageBase64,
      mimeType,
    } = body;

    if (!productImageBase64) {
      return Response.json(
        { error: "Product image required" },
        { status: 400 }
      );
    }

    const size = getImageSize(format);

    const prompt = buildPrompt({
      brandName,
      sector,
      campaign,
      targetAudience,
      customerVisualRequest,
      format,
    });

    const result = await client.images.edit({
      model: "gpt-image-1",
      prompt,
      size,
      image: `data:${mimeType || "image/png"};base64,${productImageBase64}`,
    });

    const imageBase64 = result.data?.[0]?.b64_json;

    if (!imageBase64) {
      return Response.json(
        { error: "Image generation failed" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      imageBase64,
      stage: "base-image",
    });
  } catch (error: any) {
    console.error(error);

    return Response.json(
      {
        error: "Generation error",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
