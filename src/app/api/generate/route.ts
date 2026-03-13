import OpenAI from "openai";

const client = new OpenAI({
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
  return JSON.parse(cleanJsonString(text)) as T;
}

async function analyzeProduct(imageBase64: string): Promise<ProductAnalysis> {
  const response = await client.responses.create({
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
  const response = await client.responses.create({
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
- slogan hissi taşısın
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

  const formatMap: Record<string, string> = {
    square: "1:1 social media ad composition",
    portrait: "4:5 vertical premium ad composition",
    landscape: "16:9 banner ad composition",
  };

  return `
Create a premium advertising background scene only.

Brand context: ${brandName}
Sector: ${sector}
Campaign: ${campaign}
Format: ${formatMap[format] || "1:1 ad composition"}

Reference product info:
- Product type: ${analysis.productType}
- Colors: ${analysis.colors.join(", ")}
- Materials: ${analysis.materials.join(", ")}
- Usage area: ${analysis.usageArea}
- Scene suggestion: ${analysis.sceneSuggestion}

Creative variation hint: ${randomSeedHint}

Important rules:
- DO NOT generate the product itself
- center area must be reserved for placing the real uploaded product later
- leave strong clean composition space around the center
- create realistic premium lighting and decorative advertising environment
- background should support product placement
- top area should support headline placement
- lower area should support CTA / campaign labels
- no text
- no letters
- no typography
- no watermark
- no logo
- no furniture/product replica in the center
- empty center hero area for product compositing
`.trim();
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

    const backgroundResponse = await client.images.generate({
      model: "gpt-image-1",
      size: "1024x1024",
      prompt: backgroundPrompt,
    });

    const backgroundBase64 = backgroundResponse.data?.[0]?.b64_json || "";

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
        error: "Sahne oluşturulurken hata oluştu.",
      },
      { status: 500 }
    );
  }
}
