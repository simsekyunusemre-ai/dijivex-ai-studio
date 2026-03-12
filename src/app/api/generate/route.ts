import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const brandName = String(formData.get("brandName") || "");
    const sector = String(formData.get("sector") || "");
    const slogan = String(formData.get("slogan") || "");
    const format = String(formData.get("format") || "");
    const targetAudience = String(formData.get("targetAudience") || "");
    const campaign = String(formData.get("campaign") || "");

    const logoFile = formData.get("logoFile") as File | null;
    const referenceFile = formData.get("referenceFile") as File | null;

    const hasLogo = !!logoFile && logoFile.size > 0;
    const hasReference = !!referenceFile && referenceFile.size > 0;

    const textPrompt = `
Sen profesyonel bir Turkce reklam metni yazari ve sosyal medya icerik uzmanisin.

Gorev:
Kullanicinin verdigi bilgilere gore Meta Ads ve Instagram post icin satis odakli, profesyonel ve akici bir Turkce reklam metni uret.

Kurallar:
- Turkce karakterleri dogru kullan
- Yazim hatasi yapma
- Metin dikkat cekici ama temiz olsun
- Kisa ve guclu bir baslik yaz
- Kisa reklam aciklamasi yaz
- Net bir cagrida bulun
- En sonda 3 kisa hashtag ver
- Asiri uzun yazma
- Profesyonel reklam dili kullan

Ciktiyi tam olarak su formatta ver:

BASLIK:
...

ACIKLAMA:
...

CAGRI:
...

HASHTAG:
#...
#...
#...

Bilgiler:
Marka adi: ${brandName}
Sektor: ${sector}
Slogan: ${slogan}
Format: ${format}
Kampanya: ${campaign}
Hedef kitle: ${targetAudience}
`;

    const imagePrompt = `
Create a premium advertising background layout for a social media creative.

Brand: ${brandName}
Sector: ${sector}
Campaign theme: ${campaign}
Audience: ${targetAudience}
Format: ${format}

Important rules:
- Create ONLY the visual background and composition
- Leave clean empty space areas for headline, description and CTA
- Do NOT add any text
- Do NOT add letters
- Do NOT add words
- Do NOT add typography
- Do NOT add watermark
- Do NOT add logo
- Make it look like a premium ad creative base template
- Balanced composition
- Strong but clean visual hierarchy
- Modern, premium, minimal, conversion-focused look
- Suitable for Turkish e-commerce and Meta Ads aesthetics
${hasLogo ? "- Leave a suitable clean corner area for later logo placement" : ""}
${
  hasReference
    ? "- Make the composition product-focused, as if a premium product visual will be placed or highlighted in the layout"
    : "- Create a flexible premium promotional composition without a fixed product object"
}
`;

    const textResponse = await client.responses.create({
      model: "gpt-4.1-mini",
      input: textPrompt,
    });

    const imageResponse = await client.images.generate({
      model: "gpt-image-1",
      prompt: imagePrompt,
      size: "1024x1024",
    });

    const text = textResponse.output_text || "Metin uretilemedi.";
    const imageBase64 = imageResponse.data?.[0]?.b64_json || null;

    return Response.json({
      success: true,
      text,
      imageBase64,
      hasLogo,
      hasReference,
      note: "Gorsel sadece zemin olarak uretildi. Metin sonradan yerlestirilmelidir.",
    });
  } catch (error) {
    console.error("Generate route error:", error);

    return Response.json(
      {
        success: false,
        error: "Bir hata olustu.",
      },
      { status: 500 }
    );
  }
}
