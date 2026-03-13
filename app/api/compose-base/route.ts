import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getImageSize(format: string) {
  if (format === "story" || format === "portrait") {
    return "1024x1536";
  }

  if (format === "landscape") {
    return "1536x1024";
  }

  return "1024x1024";
}

function buildBasePrompt(params: {
  brandName?: string;
  sector?: string;
  campaign?: string;
  targetAudience?: string;
  customerVisualRequest?: string;
  format?: string;
}) {
  const {
    brandName = "",
    sector = "",
    campaign = "",
    targetAudience = "",
    customerVisualRequest = "",
    format = "square",
  } = params;

  const layoutRules =
    format === "story" || format === "portrait"
      ? `
Create a vertical Instagram Story advertising composition.
Leave clean negative space at the top 12% of the canvas for headline placement.
Leave clean negative space at the bottom 15% of the canvas for CTA placement.
Keep the main product visually dominant in the center-middle area.
Do not place important objects inside the top or bottom text-safe zones.
`
      : `
Create a square Instagram advertising composition.
Leave clean negative space at the top 15% for headline placement.
Leave clean negative space at the bottom 15% for CTA placement.
Keep the main product visually dominant in the center area.
Do not place important objects inside the reserved text-safe zones.
`;

  return `
You are creating a premium commercial advertising base image for a SaaS ad generator.

GOAL:
Create a polished, high-conversion social media ad background/composition using the uploaded product image as the main reference.

IMPORTANT:
- The uploaded product must remain the hero element.
- Preserve the product identity, category, proportions, and recognizability.
- Build a realistic or premium ad scene around it depending on the product type and sector.
- This image must look like a finished professional ad background, but WITHOUT ANY TEXT.

STRICT TEXT RULES:
- Do not generate any words
- Do not generate any letters
- Do not generate any typography
- Do not generate captions
- Do not generate labels
- Do not generate logos made of text
- Do not generate watermarks
- Do not place fake UI elements
- Do not place fake packaging text unless it already exists naturally on the uploaded product and is unavoidable

COMPOSITION RULES:
${layoutRules}

VISUAL QUALITY RULES:
- premium advertising look
- elegant lighting
- strong product focus
- realistic shadows and depth
- clean composition
- visually rich but not cluttered
- brand-safe commercial aesthetic
- aesthetically balanced negative space for future text placement

BUSINESS CONTEXT:
- Brand name: ${brandName}
- Sector: ${sector}
- Campaign: ${campaign}
- Target audience: ${targetAudience}

CUSTOM VISUAL REQUEST:
${customerVisualRequest || "No extra visual request. Build the best premium ad composition automatically."}

SCENE DIRECTION:
- If the product belongs to home decor/furniture, place it in a tasteful realistic interior scene
- If the product belongs to baby/mother category, create a warm, trustworthy, premium family-oriented commercial atmosphere
- If the product belongs to cosmetics/beauty, create a premium elegant beauty campaign atmosphere
- If the product belongs to fashion/accessories, create a stylish editorial advertising scene
- Adapt the environment intelligently to the product category

FINAL OUTPUT:
A premium ad base image with reserved text-safe areas, no typography, no fake text, no UI clutter, no poster text.
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
        { error: "Ürün görseli gerekli." },
        { status: 400 }
      );
    }

    const size = getImageSize(format);

    const prompt = buildBasePrompt({
      brandName,
      sector,
      campaign,
      targetAudience,
      customerVisualRequest,
      format,
    });

    const result = await client.images.generate({
      model: "gpt-image-1",
      size,
      quality: "high",
      output_format: "png",
      input_image: `data:${mimeType || "image/png"};base64,${productImageBase64}`,
      prompt,
    });

    const imageBase64 = result.data?.[0]?.b64_json;

    if (!imageBase64) {
      return Response.json(
        { error: "Base image üretilemedi." },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      stage: "base-image",
      prompt,
      imageBase64,
    });
  } catch (error: any) {
    console.error("compose-base error:", error);
    return Response.json(
      {
        error: "Base image oluşturulurken hata oluştu.",
        details: error?.message || "Bilinmeyen hata",
      },
      { status: 500 }
    );
  }
}
