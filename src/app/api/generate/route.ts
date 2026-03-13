import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function fileToBase64(buffer: ArrayBuffer) {
  return Buffer.from(buffer).toString("base64");
}

function cleanJsonString(text: string) {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
}

function parseTextSections(text: string) {
  const safeText = cleanJsonString(text);

  const titleMatch = safeText.match(/BASLIK:\s*(.*)/i);
  const descMatch = safeText.match(/ACIKLAMA:\s*(.*)/i);
  const ctaMatch = safeText.match(/CAGRI:\s*(.*)/i);
  const hashtagMatch = safeText.match(/HASHTAG:\s*(.*)/i);

  return {
    title: titleMatch?.[1]?.trim() || "Yeni Koleksiyon",
    description: descMatch?.[1]?.trim() || "Markanı öne çıkaran güçlü reklam metni.",
    cta: ctaMatch?.[1]?.trim() || "Hemen İncele",
    hashtags: hashtagMatch?.[1]?.trim() || "#reklam #kampanya #marka",
  };
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

    const logo = formData.get("logo") as File | null;
    const referenceImage = formData.get("referenceImage") as File | null;

    if (!brandName) {
      return Response.json({ error: "Marka adı zorunlu." }, { status: 400 });
    }

    const textPrompt = `
Sen profesyonel bir Türkçe reklam metni yazarı ve sosyal medya içerik uzmanısın.

Aşağıdaki bilgilerle kısa, etkili ve satış odaklı reklam içeriği üret:

Marka Adı: ${brandName}
Sektör: ${sector}
Slogan: ${slogan}
Format: ${format}
Hedef Kitle: ${targetAudience}
Kampanya: ${campaign}

Lütfen cevabı tam olarak şu formatta ver:

BASLIK: ...
ACIKLAMA: ...
CAGRI: ...
HASHTAG: ...
    `.trim();

    const textResponse = await client.responses.create({
      model: "gpt-4.1-mini",
      input: textPrompt,
    });

    const parsedText = parseTextSections(textResponse.output_text);

    let imagePrompt = `
Create a premium Turkish advertising campaign visual.

Brand: ${brandName}
Sector: ${sector}
Campaign: ${campaign}
Target audience: ${targetAudience}
Style: premium commercial ad design
Composition: product-focused hero banner
Lighting: cinematic, realistic, polished
Layout: leave clean safe areas for later text overlay
No text in image
No letters
No typography
No symbols
No watermark
No logos printed inside the scene
    `.trim();

    let referenceBase64 = "";

    if (referenceImage) {
      const referenceBuffer = await referenceImage.arrayBuffer();
      referenceBase64 = fileToBase64(referenceBuffer);

      const analysisResponse = await client.responses.create({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `
Bu ürün görselini analiz et.
Kısa ve net şekilde ürün tipi, renk, materyal, kullanım alanı ve sahne önerisi ver.
Türkçe yaz.
                `.trim(),
              },
              {
                type: "input_image",
                image_url: `data:image/png;base64,${referenceBase64}`,
                detail: "auto",
              },
            ],
          },
        ],
      });

      imagePrompt += `

Reference product analysis:
${analysisResponse.output_text}

Important rules:
- keep the uploaded product visually very close to the original
- place product at center
- build a realistic ad composition around it
- include decorative scene elements suitable for the sector
- preserve product identity as much as possible
      `.trim();
    }

    const imageResponse = await client.images.generate({
      model: "gpt-image-1",
      size: "1024x1024",
      prompt: imagePrompt,
    });

    const imageBase64 = imageResponse.data?.[0]?.b64_json || "";

    return Response.json({
      success: true,
      image: imageBase64,
      text: parsedText,
      meta: {
        brandName,
        sector,
        format,
      },
    });
  } catch (error) {
    console.error("generate route error:", error);

    return Response.json(
      {
        success: false,
        error: "Görsel oluşturulurken hata oluştu.",
      },
      { status: 500 }
    );
  }
}
