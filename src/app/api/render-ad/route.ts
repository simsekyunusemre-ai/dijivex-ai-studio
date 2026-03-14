import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productImageBase64 } = body;

    if (!productImageBase64) {
      return Response.json(
        { error: "Ürün görseli gerekli" },
        { status: 400 }
      );
    }

    const productBuffer = Buffer.from(productImageBase64, "base64");

    const resizedProduct = await sharp(productBuffer)
      .resize({
        width: 1000,
        height: 800,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    const finalImage = await sharp({
      create: {
        width: 1080,
        height: 1350,
        channels: 4,
        background: { r: 245, g: 240, b: 235, alpha: 1 },
      },
    })
      .composite([
        {
          input: resizedProduct,
          top: 300,
          left: 40,
        },
      ])
      .png()
      .toBuffer();

    return new Response(new Uint8Array(finalImage), {
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
