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
      hasReference,
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
Instagram için modern ve premium bir reklam postu arka planı oluştur.

Marka: ${brandName}
Sektör: ${sector}
Slogan teması: ${slogan}
Kampanya: ${campaign}
Hedef kitle: ${targetAudience}

Tasarım kuralları:
- Profesyonel Instagram reklam postu gibi görünsün
- Premium, modern, temiz ve satış odaklı olsun
- Başlık, slogan, kampanya ve marka adı için boş alan bırak
- Görsel düzeni dengeli olsun
- Arka plan güçlü ama metin alanlarını boğmasın
- Türk pazarı için uygun reklam estetiği taşısın
- Kesinlikle yazı, harf, kelime, tipografi, watermark veya logo ekleme

${
  hasReference
    ? `
Ek kural:
- Kullanıcı referans / ürün görseli yükledi.
- Bu yüzden kompozisyon ürün odaklı düşünülmeli.
- Ürün merkeze yakın, dikkat çekici ve reklam postuna uygun şekilde yerleştirilmiş hissi vermeli.
- Görsel sanki ürün tanıtımı için hazırlanmış profesyonel bir sosyal medya post zemini gibi olsun.
`
    : ""
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

    const text = textResponse.output_text || "Metin üretilemedi.";
    const imageBase64 = imageResponse.data?.[0]?.b64_json || null;

    return Response.json({
      text,
      imageBase64,
    });
  } catch (error) {
    console.error("Generate route error:", error);

    return Response.json(
      { error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
