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

  if (s.includes("bebek") || s.includes("çocuk") || s.includes("cocuk")) {
    return `
baby product advertising scene,
soft aqua palette,
floating particles,
fresh clean mood,
gentle splash effects,
playful premium campaign styling
`;
  }

  if (s.includes("mobilya")) {
    return `
furniture advertising scene,
decorative premium interior styling,
architectural depth,
warm textured surfaces,
modern lifestyle campaign look,
instagram premium furniture ad composition
`;
  }

  if (s.includes("kozmetik")) {
    return `
beauty advertising scene,
clean glossy premium setup,
soft liquid reflections,
floating highlights,
high-end skincare campaign feeling
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
dynamic layers, premium energy, floating accents,
and obvious ad composition zones.
`,
    "premium-showcase": `
Create a refined premium showcase scene with elegant decor,
luxury lighting, premium material feeling,
and polished advertising composition.
`,
    "editorial-social": `
Create a magazine-like editorial social post layout with strong hierarchy,
stylish set design, visual rhythm,
and premium instagram campaign feeling.
`,
    "promo-layout": `
Create a promotional ad layout with clear title ribbon shape,
bottom call-to-action panel shape,
and campaign badge zones.
`,
    "clean-impact": `
Create a clean but striking social media ad composition
with spacious layout, strong product focus,
and modern campaign styling.
`,
  };

  return map[variant] || map["promo-layout"];
}

function getDesignZoneInstruction(format: string) {
  if (format === "portrait") {
    return `
Use vertical Instagram ad composition.
Top area: one large decorative title panel or ribbon shape.
Middle area: clean center-right or center zone for real product placement.
Bottom area: one CTA panel shape and one small badge zone.
Composition must feel like a designed ad post, not a plain room photo.
`;
  }

  if (format === "landscape") {
    return `
Use horizontal advertising composition.
Left or upper-left: large title banner zone.
Center: open hero zone for real product placement.
Lower-left: CTA panel shape.
Right side: badge or mini-info shape.
Composition must feel like a polished marketing banner.
`;
  }

  return `
Use square Instagram post composition.
Top-left or top: decorative headline banner zone.
Center: open hero zone for real product placement.
Bottom-left: CTA panel shape.
Bottom-right: badge/logo friendly zone.
Composition must feel like a premium ad post.
`;
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
  const designZones = getDesignZoneInstruction(format);

  return `
Create a premium instagram advertising poster background.

Brand context: ${brandName}
Campaign context: ${campaign}
Sector: ${sector}

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

Design zone instructions:
${designZones}

Critical composition rules:
- The real uploaded product will be composited later by code
- Do NOT generate the actual product
- Do NOT generate a duplicate of the product
- Do NOT place a fake product in the center
- Keep the main center zone visually clean for product placement
- Add decorative campaign elements, textures, lighting, props, effects and scene styling
- Make this look like a designed Instagram ad, not a normal room photo
- Include obvious visual shapes for title, subtitle, CTA and badge placement
- These shapes can be ribbons, rounded panels, banners, capsules, label zones, poster blocks, promo cards
- Those zones must look designed and premium
- Use strong visual hierarchy and ad composition
- Make the result visually interesting and commercially appealing
- Avoid generic repeated living room layouts
- Vary framing, prop density, texture, lighting and campaign mood

Hard text restrictions:
- No readable text
- No letters
- No words
- No numbers
- No typography
- No headline text
- No CTA text
- No logo text
- No watermark
- No signage
- If text-like areas are needed, render them as blank decorative shapes only
`.trim();
}

function getImagenAspectRatio(format: string) {
  if (format === "portrait") return "3:4";
  if (format === "landscape") return "16:9";
  return "1:1";
}

async function generateGeminiBackground(prompt: string, format: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY tanımlı değil.");
  }

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        instances: [
          {
            prompt,
          },
        ],
        parameters: {
          sampleCount: 1,
          aspectRatio: getImagenAspectRatio(format),
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Gemini/Imagen error:", data);
    throw new Error(data?.error?.message || "Gemini background üretimi başarısız oldu.");
  }

  const imageBase64 =
    data?.predictions?.[0]?.bytesBase64Encoded ||
    data?.predictions?.[0]?.image?.imageBytes ||
    "";

  if (!imageBase64) {
    console.error("Unexpected Gemini/Imagen response:", data);
    throw new Error("Gemini görsel verisi dönmedi.");
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

    const backgroundBase64 = await generateGeminiBackground(backgroundPrompt, format);

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
