import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type GeneratedText = {
  title: string;
  description: string;
  cta: string;
  hashtags: string;
};

type ProductAnalysis = {
  productType: string;
  colors: string[];
  materials: string[];
  usageArea: string;
  sceneSuggestion: string;
};

function fileToBase64(buffer: ArrayBuffer) {
  return Buffer.from(buffer).toString("base64");
}

function cleanJsonString(text: string) {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
}

function safeJsonParse<T>(text: string): T {
  try {
    return JSON.parse(cleanJsonString(text)) as T;
  } catch (error) {
    console.error("JSON parse error:", text);
    throw new Error("AI JSON parse edilemedi.");
  }
}

async function analyzeProduct(imageBase64: string): Promise<ProductAnalysis> {
  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `
Bu ürün görselini analiz et ve SADECE geçerli JSON döndür.

Format:
{
  "productType": "",
  "colors": [],
  "materials": [],
  "usageArea": "",
  "sceneSuggestion": ""
}

Kurallar:
- kısa ve net yaz
- JSON dışında hiçbir şey yazma
            `.trim(),
          },
          {
            type: "input_image",
            image_url: `data:image/png;base64,${imageBase64}`,
            detail: "auto",
          },
        ],
      },
    ],
  });

  return safeJsonParse<ProductAnalysis>(response.output_text);
}

async function generateCopy(params: {
  brandName: string;
  sector: string;
  slogan: string;
  campaign: string;
  targetAudience: string;
}): Promise<GeneratedText> {
  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: `
Sen profesyonel Türkçe reklam metin yazarıısın.

Aşağıdaki bilgilere göre SADECE geçerli JSON döndür.

Marka: ${params.brandName}
Sektör: ${params.sector}
Slogan: ${params.slogan}
Kampanya: ${params.campaign}
Hedef Kitle: ${params.targetAudience}

Format:
{
  "title": "",
  "description": "",
  "cta": "",
  "hashtags": ""
}

Kurallar:
- Türkçe yaz
- başlık kısa ve güçlü olsun
- açıklama kısa ve reklam diliyle olsun
- CTA net olsun
- hashtag tek string olsun
- JSON dışında hiçbir şey yazma
    `.trim(),
  });

  return safeJsonParse<GeneratedText>(response.output_text);
}

function pickRandomVariant() {
  const variants = [
    "splash-campaign",
    "premium-showcase",
    "editorial-social",
    "promo-layout",
    "clean-impact",
  ];

  return variants[Math.floor(Math.random() * variants.length)];
}

function getSectorCreativeDirection(sector: string) {
  const s = sector.toLowerCase();

  if (s.includes("bebek") || s.includes("çocuk") || s.includes("cocuk") || s.includes("bez")) {
    return `
baby diaper advertising scene,
soft aqua and pastel tones,
fresh clean mood,
premium splash effects,
floating decorative particles,
playful but premium campaign styling,
instagram ad energy
`;
  }

  if (s.includes("mobilya")) {
    return `
furniture advertising scene,
modern premium interior styling,
architectural depth,
warm textured surfaces,
decorative premium props,
high-end instagram furniture campaign look
`;
  }

  if (s.includes("kozmetik")) {
    return `
beauty advertising scene,
clean glossy premium setup,
soft liquid reflections,
floating highlights,
high-end skincare campaign styling
`;
  }

  if (s.includes("takı") || s.includes("taki")) {
    return `
luxury jewelry advertising scene,
elegant reflective surfaces,
premium boutique styling,
dramatic lighting,
editorial campaign feeling
`;
  }

  return `
premium product advertising scene,
social media campaign layout,
decorative set design,
high-end branded composition
`;
}

function getVariantInstruction(variant: string) {
  const map: Record<string, string> = {
    "splash-campaign": `
Create a bold campaign visual with strong decorative effects,
dynamic layers, premium energy, floating accents and obvious ad composition zones.
`,
    "premium-showcase": `
Create a refined premium showcase scene with elegant decor,
luxury lighting, premium material feeling and polished advertising composition.
`,
    "editorial-social": `
Create a magazine-like editorial social post layout with strong hierarchy,
stylish set design, visual rhythm and premium campaign feeling.
`,
    "promo-layout": `
Create a promotional ad layout with decorative banner zones,
cta box zones and campaign badge areas.
`,
    "clean-impact": `
Create a clean but striking social media ad composition
with spacious layout, strong product focus and modern campaign styling.
`,
  };

  return map[variant] || map["promo-layout"];
}

function getFormatSettings(format: string) {
  if (format === "portrait") {
    return {
      size: "1024x1536" as const,
      formatText: "vertical instagram story / reel ad composition",
    };
  }

  if (format === "landscape") {
    return {
      size: "1536x1024" as const,
      formatText: "horizontal banner advertising composition",
    };
  }

  return {
    size: "1024x1024" as const,
    formatText: "square instagram post composition",
  };
}

function buildBackgroundPrompt(params: {
  brandName: string;
  sector: string;
  format: string;
  campaign: string;
  analysis: ProductAnalysis;
  randomSeedHint: string;
}) {
  const { brandName, sector, format, campaign, analysis, randomSeedHint } = params;

  const variant = pickRandomVariant();
  const sectorDirection = getSectorCreativeDirection(sector);
  const variantInstruction = getVariantInstruction(variant);
  const formatSettings = getFormatSettings(format);

  return `
Create a premium social media advertising poster background.

Brand context: ${brandName}
Campaign context: ${campaign}
Format intent: ${formatSettings.formatText}

Reference product info:
- Product type: ${analysis.productType}
- Colors: ${analysis.colors.join(", ")}
- Materials: ${analysis.materials.join(", ")}
- Usage area: ${analysis.usageArea}
- Scene suggestion: ${analysis.sceneSuggestion}

Creative variation hint: ${randomSeedHint}
Creative style variant: ${variant}

Sector direction:
${sectorDirection}

Variant direction:
${variantInstruction}

Design goals:
- create a visually rich instagram ad scene
- include decorative banner-like shapes, label zones, badge areas, CTA-like panel zones
- create visual hierarchy like a real ad creative
- use premium props, textures, effects, lighting and mood
- make the result feel designed, not like a plain room photo
- leave a strong central hero zone for compositing the real uploaded product later
- the center must stay usable for a real product PNG
- use eye-catching campaign composition and commercial styling
- vary props, layout and framing every generation

Hard restrictions:
- do not generate the actual product
- do not generate a duplicate of the product
- do not place a fake product in the center
- no readable text
- no letters
- no words
- no numbers
- no typography
- no watermark
- no logo text
- if text-like areas are needed, render them as blank decorative design shapes only
`.trim();
}

async function generateOpenAIBackground(prompt: string, format: string): Promise<string> {
  const formatSettings = getFormatSettings(format);

  const imageResponse = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    size: formatSettings.size,
    quality: "high",
    output_format: "png",
  });

  const imageBase64 = imageResponse.data?.[0]?.b64_json || "";

  if (!imageBase64) {
    throw new Error("OpenAI görsel verisi dönmedi.");
  }

  return imageBase64;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const brandName = String(formData.get("brandName") || "").trim();
    const sector = String(formData.get("sector") || "").trim();
    const slogan = String(formData.get("slogan") || "").trim();
    const format = String(formData.get("format") || "square").trim();
    const targetAudience = String(formData.get("targetAudience") || "").trim();
    const campaign = String(formData.get("campaign") || "").trim();
    const referenceImage = formData.get("referenceImage") as File | null;

    if (!brandName) {
      return Response.json({ success: false, error: "Marka adı zorunlu." }, { status: 400 });
    }

    if (!sector) {
      return Response.json({ success: false, error: "Sektör zorunlu." }, { status: 400 });
    }

    if (!targetAudience) {
      return Response.json({ success: false, error: "Hedef kitle zorunlu." }, { status: 400 });
    }

    if (!campaign) {
      return Response.json({ success: false, error: "Kampanya mesajı zorunlu." }, { status: 400 });
    }

    if (!referenceImage) {
      return Response.json(
        { success: false, error: "Referans ürün görseli zorunlu." },
        { status: 400 }
      );
    }

    const referenceBuffer = await referenceImage.arrayBuffer();
    const referenceBase64 = fileToBase64(referenceBuffer);

    const analysis = await analyzeProduct(referenceBase64);

    const text = await generateCopy({
      brandName,
      sector,
      slogan,
      campaign,
      targetAudience,
    });

    const randomSeedHint = `${Date.now()}-${Math.floor(Math.random() * 999999)}`;

    const backgroundPrompt = buildBackgroundPrompt({
      brandName,
      sector,
      format,
      campaign,
      analysis,
      randomSeedHint,
    });

    const backgroundBase64 = await generateOpenAIBackground(backgroundPrompt, format);

    return Response.json({
      success: true,
      background: backgroundBase64,
      text,
      layout: {
        productPosition: "center",
        textPosition: "designed-zones",
        ctaPosition: "designed-zones",
      },
      meta: {
        brandName,
        sector,
        format,
        slogan,
      },
      analysis,
    });
  } catch (error) {
    console.error("generate route error:", error);

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Sahne oluşturulurken hata oluştu.",
      },
      { status: 500 }
    );
  }
}
