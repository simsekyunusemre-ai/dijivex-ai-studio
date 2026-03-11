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

    const prompt = `
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

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const text = response.output_text || "Metin üretilemedi.";

    return Response.json({ text });
  } catch (error) {
    return Response.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}
