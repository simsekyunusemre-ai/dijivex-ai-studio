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

function buildBackgroundPrompt(params: {
  brandName: string;
  sector: string;
  format: string;
  campaign: string;
  analysis: ProductAnalysis;
  randomSeedHint: string;
}) {
  const { brandName, sector, format, campaign, analysis, randomSeedHint } = params;

  const formatTextMap: Record<string, string> = {
    square: "instagram social media ad, square composition",
    portrait: "vertical social media ad, story style composition",
    landscape: "horizontal banner advertising composition",
  };

  return `
Create a premium advertising background scene only.

Brand context: ${brandName}
Sector: ${sector}
Campaign: ${campaign}
Format intent: ${formatTextMap[format] || "instagram ad composition"}

Reference product info:
- Product type: ${analysis.productType}
- Colors: ${analysis.colors.join(", ")}
- Materials: ${analysis.materials.join(", ")}
- Usage area: ${analysis.usageArea}
- Scene suggestion: ${analysis.sceneSuggestion}

Creative variation hint: ${randomSeedHint}

Important rules:
- Do NOT generate the product itself
- Do NOT generate a duplicate of the product
- Reserve the center area for placing the real uploaded product later
- Build a premium Instagram ad background
- Add advertising energy, set design, depth, stylish props, lighting and composition
- Top area should support headline placement
- Lower area should support CTA placement
- Make it feel like a real social media campaign visual
- No text
- No letters
- No typography
- No logo
- No watermark
- No product replica in the center
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
        textPosition: "top-left",
        ctaPosition: "bottom-left",
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
