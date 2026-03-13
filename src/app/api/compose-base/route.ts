import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

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
    } = body;

    const size =
      format === "story" || format === "portrait"
        ? "1024x1536"
        : "1024x1024";

    const prompt = `
Create a professional advertising background image.

IMPORTANT RULES:
- Do NOT generate any text
- Do NOT generate letters
- Do NOT generate typography
- Do NOT generate captions
- Do NOT generate logos
- Do NOT generate UI elements
- Do NOT generate watermarks

Leave empty visual space at the top and bottom for future text placement.

Brand: ${brandName || ""}
Sector: ${sector || ""}
Campaign: ${campaign || ""}
Target audience: ${targetAudience || ""}

Extra visual request:
${customerVisualRequest || "none"}

Create a premium commercial advertising scene.
`;

    const result = await client.images.generate({
      model: "gpt-image-1",
      size,
      prompt,
    });

    const imageBase64 = result.data?.[0]?.b64_json;

    return Response.json({
      success: true,
      imageBase64,
    });
  } catch (error: any) {
    console.error(error);

    return Response.json(
      {
        error: "Image generation failed",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
