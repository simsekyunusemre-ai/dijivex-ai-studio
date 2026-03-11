import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      brandName,
      sector,
      slogan,
      format,
      targetAudience,
      campaign,
    } = body;

    const textPrompt = `
Sen profesyonel bir Türkçe reklam metni yazarı ve sosyal medya içerik uzmanısın.

Görev:
Kullanıcının verdiği bilgilere göre Instagram post için satış odaklı, profesyonel ve akıcı bir Türkçe metin üret.

Kurallar:
- Türkçe karakterleri eksiksiz ve doğru kullan: Ç, Ğ, İ, Ö, Ş, Ü
- Yazım hatası yapma
- Metin satış odaklı olsun
- Dikkat çekici bir başlık olsun
- Kısa ama güçlü açıklama olsun
- Sonunda harekete geçirici çağrı olsun
- En sonda 3 kısa hashtag ekle
- Çıktıyı düzenli ver

Çıktı formatı tam olarak şöyle olsun:

BAŞLIK:
...

AÇIKLAMA:
...

ÇAĞRI:
...

HASHTAG:
#...
#...
#...

Bilgiler:
Marka adı: ${brandName}
Sektör: ${sector}
Slogan: ${slogan}
Format: ${format}
Kampanya: ${campaign}
Hedef kitle: ${targetAudience}
`;

    const imagePrompt = `
Create a premium Instagram post background for a Turkish brand.

Brand name: ${brandName}
Sector: ${sector}
Campaign: ${campaign}
Target audience: ${targetAudience}
Style: modern, premium, clean, high-converting social media ad design
Composition: leave clear empty space for headline, description, call-to-action, and logo
Important: do NOT add any text, letters, words, typography, watermark, or logos in the image.
Important: the image must look like a professional Instagram ad background.
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

    const text = textResponse.output_text || "Metin üretilemedi.";
    const imageBase64 = imageResponse.data?.[0]?.b64_json || null;

    return Response.json({
      text,
      imageBase64,
    });
  } catch (error) {
    return Response.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}
