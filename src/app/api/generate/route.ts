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
  productLook: string;
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

function getFormatSettings(format: string) {
  if (format === "portrait") {
    return {
      size: "1024x1536" as const,
      formatText: "vertical instagram story / reel ad",
    };
  }

  if (format === "landscape") {
    return {
      size: "1536x1024" as const,
      formatText: "horizontal banner ad",
    };
  }

  return {
    size: "1024x1024" as const,
    formatText: "square instagram post",
  };
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
  "sceneSuggestion": "",
  "productLook": ""
}

Kurallar:
- kısa ve net yaz
- ürünün reklam görselinde nasıl görünmesi gerektiğini productLook alanında tarif et
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
- açıklama reklam diliyle yazılsın
- CTA kısa ve net olsun
- hashtag tek string olsun
- JSON dışında hiçbir şey yazma
    `.trim(),
  });

  return safeJsonParse<GeneratedText>(response.output_text);
}

function pickRandomVariant() {
  const variants = [
    "campaign",
    "premium",
    "editorial",
    "splash",
    "high-conversion",
  ];

  return variants[Math.floor(Math.random() * variants.length)];
}

function getSectorDirection(sector: string) {
  const s = sector.toLowerCase();

  if (s.includes("bebek") || s.includes("çocuk") || s.includes("cocuk") || s.includes("bez")) {
    return `
baby diaper advertising,
fresh clean mood,
soft pastel colors,
water splash effects,
floating decorative particles,
cute premium campaign style,
mother and baby friendly look
`;
  }

  if (s.includes("mobilya")) {
    return `
furniture advertising,
premium interior design mood,
decorative home styling,
warm texture,
modern elegant campaign composition
`;
  }

  if (s.includes("kozmetik")) {
    return `
beauty advertising,
clean glossy beauty scene,
premium skincare campaign,
soft reflections,
luxury product styling
`;
  }

  if (s.includes("takı") || s.includes("taki")) {
    return `
jewelry advertising,
luxury boutique mood,
editorial campaign style,
glossy reflective premium setup
`;
  }

  return `
premium social media advertising,
high-end campaign composition,
decorative commercial design
`;
}

function getVariantDirection(variant: string) {
  const map: Record<string, string> = {
    campaign: `
strong campaign feel,
big bold promo design,
attention grabbing composition,
high energy ad layout
`,
    premium: `
luxury premium design,
refined composition,
polished commercial poster style
`,
    editorial: `
editorial social media ad,
magazine-like visual hierarchy,
stylish designed poster look
`,
    splash: `
dynamic visual effects,
liquid or particle effects,
dramatic ad styling,
eye-catching modern composition
`,
    "high-conversion": `
conversion-focused ad design,
clear focal point,
strong promotional structure,
scroll-stopping instagram visual
`,
  };

  return map[variant] || map.campaign;
}

function buildFullPosterPrompt(params: {
  brandName: string;
  sector: string;
  format: string;
  campaign: string;
  slogan: string;
  customVisualRequest: string;
  analysis: ProductAnalysis;
  copy: GeneratedText;
  randomSeedHint: string;
}) {
  const {
    brandName,
    sector,
    format,
    campaign,
    slogan,
    customVisualRequest,
    analysis,
    copy,
    randomSeedHint,
  } = params;

  const variant = pickRandomVariant();
  const formatText = getFormatSettings(format).formatText;
  const sectorDirection = getSectorDirection(sector);
  const variantDirection = getVariantDirection(variant);

  const customRequestText = customVisualRequest
    ? `
User custom visual request:
${customVisualRequest}
`
    : `
User custom visual request:
none
`;

  return `
Create a complete professional social media advertising poster.

Brand: ${brandName}
Sector: ${sector}
Format: ${formatText}
Campaign: ${campaign}
Slogan: ${slogan}

Reference product description:
- Product type: ${analysis.productType}
- Colors: ${analysis.colors.join(", ")}
- Materials: ${analysis.materials.join(", ")}
- Usage area: ${analysis.usageArea}
- Suggested scene: ${analysis.sceneSuggestion}
- Product look: ${analysis.productLook}

Ad copy to include in the poster:
- Main headline: ${copy.title}
- Supporting text: ${copy.description}
- CTA text: ${copy.cta}
- Hashtag text: ${copy.hashtags}

Creative variant:
${variant}

Creative variation hint:
${randomSeedHint}

Sector direction:
${sectorDirection}

Variant direction:
${variantDirection}

${customRequestText}

Main goal:
Create a full instagram-ready ad poster with everything designed inside the image:
- real advertising composition
- the product as hero object
- decorative effects
- strong campaign feeling
- professional text layout
- CTA area
- badge or campaign label
- visually polished branded post

Critical rules:
- the product should closely resemble the uploaded reference product
- product should be the main hero and centered or strongly featured
- create an attention-grabbing instagram ad, not a plain photo
- text should be large, intentional, poster-like and readable
- use the provided ad copy naturally inside the design
- create premium commercial quality
- include decorative design elements that match the sector
- keep layout visually balanced and realistic for social media marketing
- no watermark
`.trim();
}

async function generatePoster(prompt: string, format: string): Promise<string> {
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

    const customVisualRequest = String(
      formData.get("customVisualRequest") ||
        formData.get("backgroundRequest") ||
        formData.get("visualRequest") ||
        ""
    ).trim();

    const referenceImage = formData.get("referenceImage") as File | null;

    if (!brandName) {
      return Response.json(
        { success: false, error: "Marka adı zorunlu." },
        { status: 400 }
      );
    }

    if (!sector) {
      return Response.json(
        { success: false, error: "Sektör zorunlu." },
        { status: 400 }
      );
    }

    if (!targetAudience) {
      return Response.json(
        { success: false, error: "Hedef kitle zorunlu." },
        { status: 400 }
      );
    }

    if (!campaign) {
      return Response.json(
        { success: false, error: "Kampanya mesajı zorunlu." },
        { status: 400 }
      );
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

    const fullPosterPrompt = buildFullPosterPrompt({
      brandName,
      sector,
      format,
      campaign,
      slogan,
      customVisualRequest,
      analysis,
      copy: text,
      randomSeedHint,
    });

    const imageBase64 = await generatePoster(fullPosterPrompt, format);

    return Response.json({
      success: true,
      image: imageBase64,
      text,
      meta: {
        brandName,
        sector,
        format,
        slogan,
        customVisualRequest,
      },
      analysis,
    });
  } catch (error) {
    console.error("generate route error:", error);

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Reklam postu oluşturulurken hata oluştu.",
      },
      { status: 500 }
    );
  }
}
