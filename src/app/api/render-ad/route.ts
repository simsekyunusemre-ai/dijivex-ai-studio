import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productImageBase64, mimeType } = body;

    if (!productImageBase64) {
      return Response.json({ error: "Ürün görseli gerekli" }, { status: 400 });
    }

    const productBuffer = Buffer.from(productImageBase64, "base64");

    const canvas = sharp({
      create: {
        width: 1080,
        height: 1350,
        channels: 4,
        background: { r: 245, g: 240, b: 235, alpha: 1 },
      },
    });

    const resizedProduct = await sharp(productBuffer)
      .resize({ width: 700, height: 700, fit: "contain" })
      .toBuffer();

    const finalImage = await canvas
      .composite([
        {
          input: resizedProduct,
          top: 260,
          left: 190,
        },
      ])
      .png()
      .toBuffer();

    return new Response(finalImage, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error: any) {
    return Response.json(
      {
        error: "Render hatası",
        details: error?.message || "Bilinmeyen hata",
      },
      { status: 500 }
    );
  }
}
