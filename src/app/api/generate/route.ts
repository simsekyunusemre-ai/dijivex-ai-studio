import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ProductAnalysis = {
  productType: string;
  category: string;
  colors: string[];
  materials: string[];
  usageArea: string;
  styleNotes: string;
  compositionHint: string;
  sceneSuggestion: string;
};

type ScenePlan = {
  environment: string;
  lighting: string;
  mood: string;
  backgroundElements: string[];
  cameraAngle: string;
  placement: string;
  textSafeArea: string;
};

type GeneratedCopy = {
  title: string;
  description: string;
  cta: string;
  hashtags: string[];
};

type CreativeVariant = {
  id: "A" | "B" | "C";
  name: string;
  styleLabel: string;
  prompt: string;
};

function fileToBase64(buffer: ArrayBuffer) {
  return Buffer.from(buffer).toString("base64");
}

function cleanJsonString(text: string) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

function safeJsonParse<T>(text: string): T {
  try {
    return JSON.parse(cleanJsonString(text)) as T;
  } catch (error) {
    console.error("JSON parse error:", text);
    throw new Error("AI JSON parse edilemedi.");
  }
}

const sectorSceneMap: Record<string, string> = {
  mobilya: "modern living room interior with realistic furniture styling",
  taki: "luxury jewelry studio setup with elegant reflective surface",
  takı: "luxury jewelry studio setup with elegant reflective surface",
  kozmetik: "clean beauty studio with soft gradients and premium product staging",
  bebek: "warm family-friendly interior with soft natural light",
  elektronik: "modern tech desk setup with premium lighting",
  emlak: "architectural interior with refined depth and spacious composition",
  restoran: "warm restaurant table scene with cinematic ambiance",
  fitness: "energetic gym or wellness studio environment",
  otomotiv: "clean automotive showroom or dynamic road backdrop",
  oto: "clean automotive showroom or dynamic road backdrop",
  turizm: "premium travel-inspired destination composition",
  egitim: "clean academic workspace or modern classroom atmosphere",
  eğitim: "clean academic workspace or modern classroom atmosphere",
  saglik: "bright clinical-yet-warm healthcare environment",
  sağlık: "bright clinical-yet-warm healthcare environment",
  gida: "appetizing tabletop composition with realistic food styling",
  gıda: "appetizing tabletop composition with realistic food styling",
  moda: "editorial fashion campaign scene with premium styling",
};

const styleMap: Record<string, string> = {
  minimal: "minimal premium advertising style, clean composition, spacious layout",
  premium: "premium commercial photography style, rich lighting, elegant composition",
  campaign: "high-conversion campaign visual style, dynamic arrangement, promotional energy",
  luxury: "luxury brand aesthetic, sophisticated materials, polished reflections",
  instagram: "social media optimized modern ad style, punchy composition, trendy look",
  catalog: "clean catalog photography style, product clarity, balanced neutral layout",
};

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

Beklenen format:
{
  "productType": "",
  "category": "",
  "colors": [],
  "materials": [],
  "usageArea": "",
  "styleNotes": "",
  "compositionHint": "",
  "sceneSuggestion": ""
}

Kurallar:
- Kısa ama net yaz
- Tahmin yapman gerekirse mantıklı tahmin yap
- JSON dışında hiçbir şey yazma
            `.trim(),
          },
          {
            type: "input_image",
            image_url: `data:image/png;base64,${imageBase64}`,
          },
        ],
      },
    ],
  });

  return safeJsonParse<ProductAnalysis>(response.output_text);
}

async function generateScenePlan(params: {
  analysis: ProductAnalysis;
  sector: string;
  style: string;
}): Promise<ScenePlan> {
  const { analysis, sector, style } = params;

  const sectorKey = sector.toLowerCase().trim();
  const styleKey = style.toLowerCase().trim();

  const sectorContext = sectorSceneMap[sectorKey] || sector;
  const styleContext = styleMap[styleKey] || style;

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: `
Aşağıdaki ürün için profesyonel reklam sahne planı oluştur.
SADECE geçerli JSON döndür.

ÜRÜN ANALİZİ:
${JSON.stringify(analysis, null, 2)}

SEKTÖR BAĞLAMI:
${sectorContext}

STİL:
${styleContext}

Format:
{
  "environment": "",
  "lighting": "",
  "mood": "",
  "backgroundElements": [],
  "cameraAngle": "",
  "placement": "",
  "textSafeArea": ""
}

Kurallar:
- ürün merkezde kalmalı
- ürünün çevresindeki dekorlar ürünü gölgelememeli
- metin için boş güvenli alan bırakılmalı
- gerçek reklam kompozisyonu mantığında yaz
- JSON dışında hiçbir şey yazma
    `.trim(),
  });

  return safeJsonParse<ScenePlan>(response.output_text);
}

async function generateCopy(params: {
  brandName: string;
  sector: string;
  campaign: string;
  targetAudience: string;
}): Promise<GeneratedCopy> {
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: `
Sen profesyonel reklam metin yazarısın.

Aşağıdaki bilgilerle Türkçe reklam metni üret.
SADECE JSON döndür.

Marka: ${params.brandName}
Sektör: ${params.sector}
Kampanya: ${params.campaign}
Hedef kitle: ${params.targetAudience}

Format:
{
  "title": "",
  "description": "",
  "cta": "",
  "hashtags": ["", "", ""]
}

Kurallar:
- başlık kısa ve güçlü olsun
- açıklama reklam diliyle yazılsın
- CTA net olsun
- hashtagler kısa olsun
- JSON dışında hiçbir şey yazma
    `.trim(),
  });

  return safeJsonParse<GeneratedCopy>(response.output_text);
}

function generateCreativePrompts(params: {
  brandName: string;
  style: string;
  sector: string;
  analysis: ProductAnalysis;
  scenePlan: ScenePlan;
}): CreativeVariant[] {
  const { brandName, style, sector, analysis, scenePlan } = params;

  const styleKey = style.toLowerCase().trim();
  const sectorKey = sector.toLowerCase().trim();

  const styleContext = styleMap[styleKey] || style;
  const sectorContext = sectorSceneMap[sectorKey] || sector;

  const basePrompt = `
Create a premium commercial advertising visual.

Brand context: ${brandName}
Sector context: ${sectorContext}
Product type: ${analysis.productType}
Category: ${analysis.category}
Colors: ${analysis.colors.join(", ")}
Materials: ${analysis.materials.join(", ")}
Usage area: ${analysis.usageArea}
Style notes: ${analysis.styleNotes}
Composition hint: ${analysis.compositionHint}
Scene suggestion: ${analysis.sceneSuggestion}

Environment: ${scenePlan.environment}
Lighting: ${scenePlan.lighting}
Mood: ${scenePlan.mood}
Background elements: ${scenePlan.backgroundElements.join(", ")}
Camera angle: ${scenePlan.cameraAngle}
Product placement: ${scenePlan.placement}
Text safe area: ${scenePlan.textSafeArea}
Style direction: ${styleContext}

Critical rules:
- product must remain visually very close to the reference product
- centered premium composition
- realistic commercial lighting
- realistic shadows and depth
- polished advertising quality
- leave clean negative space for overlay text
- no text inside image
- no letters
- no typography
- no watermark
- no printed logo in scene
`.trim();

  return [
    {
      id: "A",
      name: "Creative A",
      styleLabel: "Clean Premium",
      prompt: `${basePrompt}
Variant direction:
clean premium composition, balanced spacing, refined elegant environment, hero product centered.`,
    },
    {
      id: "B",
      name: "Creative B",
      styleLabel: "Campaign Focus",
      prompt: `${basePrompt}
Variant direction:
more dynamic campaign energy, richer decorative elements, stronger depth, promotional ad composition.`,
    },
    {
      id: "C",
      name: "Creative C",
      styleLabel: "Social Media Impact",
      prompt: `${basePrompt}
Variant direction:
Instagram-friendly framing, bold visual hierarchy, modern composition, high stopping power.`,
    },
  ];
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const brandName = String(formData.get("brandName") || "").trim();
    const sector = String(formData.get("sector") || "").trim();
    const campaign = String(formData.get("campaign") || "").trim();
    const targetAudience = String(formData.get("targetAudience") || "").trim();
    const style = String(formData.get("style") || "premium").trim();

    const referenceImage = formData.get("referenceImage") as File | null;

    if (!brandName) {
      return Response.json(
        { error: "Marka adı zorunlu." },
        { status: 400 }
      );
    }

    if (!sector) {
      return Response.json(
        { error: "Sektör zorunlu." },
        { status: 400 }
      );
    }

    if (!campaign) {
      return Response.json(
        { error: "Kampanya mesajı zorunlu." },
        { status: 400 }
      );
    }

    if (!targetAudience) {
      return Response.json(
        { error: "Hedef kitle zorunlu." },
        { status: 400 }
      );
    }

    if (!referenceImage) {
      return Response.json(
        { error: "Referans ürün görseli zorunlu." },
        { status: 400 }
      );
    }

    const arrayBuffer = await referenceImage.arrayBuffer();
    const imageBase64 = fileToBase64(arrayBuffer);

    const analysis = await analyzeProduct(imageBase64);

    const scenePlan = await generateScenePlan({
      analysis,
      sector,
      style,
    });

    const copy = await generateCopy({
      brandName,
      sector,
      campaign,
      targetAudience,
    });

    const variants = generateCreativePrompts({
      brandName,
      style,
      sector,
      analysis,
      scenePlan,
    });

    const creatives = await Promise.all(
      variants.map(async (variant) => {
        const imageResponse = await client.images.generate({
          model: "gpt-image-1",
          size: "1024x1024",
          prompt: variant.prompt,
        });

        const imageBase64Result = imageResponse.data?.[0]?.b64_json || "";

        return {
          variantId: variant.id,
          variantName: variant.name,
          styleLabel: variant.styleLabel,
          imageBase64: imageBase64Result,
          copy,
        };
      })
    );

    return Response.json({
      success: true,
      analysis,
      scenePlan,
      creatives,
    });
  } catch (error) {
    console.error("generate-creatives route error:", error);

    return Response.json(
      {
        success: false,
        error: "Creative üretimi sırasında hata oluştu.",
      },
      { status: 500 }
    );
  }
}
