import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      format,
      brandName,
      sector,
      campaign,
      targetAudience,
      imageBase64,
      mimeType,
    } = body;

    if (!imageBase64) {
      return Response.json(
        { error: "imageBase64 gerekli" },
        { status: 400 }
      );
    }

    const isPortrait = format === "portrait" || format === "story";

    const systemPrompt = `
You are an advertising layout planner.

Your task:
Analyze the given ad base image and return a strict JSON layout plan.

Rules:
- Return only valid JSON
- Do not add markdown
- Do not add explanation
- Keep text away from the product
- Reserve safe areas
- Make the layout suitable for social media advertising

Return this exact JSON shape:
{
  "format": "square or portrait",
  "safeAreas": {
    "top": number,
    "bottom": number,
    "left": number,
    "right": number
  },
  "headlineBox": {
    "x": number,
    "y": number,
    "width": number,
    "height": number
  },
  "descriptionBox": {
    "x": number,
    "y": number,
    "width": number,
    "height": number
  },
  "ctaBox": {
    "x": number,
    "y": number,
    "width": number,
    "height": number
  },
  "productProtectedBox": {
    "x": number,
    "y": number,
    "width": number,
    "height": number
  },
  "styleNotes": [
    "short note 1",
    "short note 2"
  ]
}

Coordinate system:
- x, y, width, height must be percentages from 0 to 100
- all boxes must stay inside canvas
- productProtectedBox must cover the main product area
`;

    const userPrompt = `
Brand: ${brandName || ""}
Sector: ${sector || ""}
Campaign: ${campaign || ""}
Target audience: ${targetAudience || ""}
Format: ${isPortrait ? "portrait" : "square"}

Create a professional ad layout plan for this image.
`;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userPrompt,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType || "image/png"};base64,${imageBase64}`,
                detail: "high",
              },
            },
          ],
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content || "{}";
    const layout = JSON.parse(content);

    return Response.json({
      success: true,
      layout,
    });
  } catch (error: any) {
    console.error("plan-layout error:", error);

    return Response.json(
      {
        error: "Layout plan oluşturulamadı",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
