import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { brandName, sector, slogan, format } = body;

    const prompt = `
Marka adı: ${brandName}
Sektör: ${sector}
Slogan: ${slogan}
Format: ${format}

Bana Türkçe, satış odaklı kısa bir reklam metni üret.
Metin profesyonel, akıcı ve dikkat çekici olsun.
    `;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const text =
      response.output_text || "Metin üretilemedi.";

    return Response.json({ text });
  } catch (error) {
    return Response.json(
      { error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
