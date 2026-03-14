import sharp from "sharp";

function svgToBuffer(svg: string) {
  return Buffer.from(svg);
}

function createTitleSvg(title: string) {
  return `
  <svg width="1080" height="220" xmlns="http://www.w3.org/2000/svg">
    <style>
      .title {
        fill: #1f2937;
        font-size: 64px;
        font-weight: 800;
        font-family: Arial, Helvetica, sans-serif;
      }
    </style>
    <text x="540" y="110" text-anchor="middle" class="title">${title}</text>
  </svg>`;
}

function createSubtitleSvg(text: string) {
  return `
  <svg width="900" height="90" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" rx="24" ry="24" width="900" height="90" fill="#dbeafe"/>
    <text
      x="450"
      y="58"
      text-anchor="middle"
      fill="#1e3a8a"
      font-size="38"
      font-weight="700"
      font-family="Arial, Helvetica, sans-serif"
    >${text}</text>
  </svg>`;
}

function createCtaSvg(text: string) {
  return `
  <svg width="520" height="120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cta" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#22c55e"/>
        <stop offset="100%" stop-color="#16a34a"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" rx="36" ry="36" width="520" height="120" fill="url(#cta)"/>
    <text
      x="260"
      y="73"
      text-anchor="middle"
      fill="#ffffff"
      font-size="42"
      font-weight="800"
      font-family="Arial, Helvetica, sans-serif"
    >${text}</text>
  </svg>`;
}

function createBulletSvg(lines: string[]) {
  const safeLines = lines.slice(0, 3);
  const textRows = safeLines
    .map(
      (line, i) => `
      <circle cx="34" cy="${42 + i * 74}" r="14" fill="#22c55e"/>
      <text x="70" y="${52 + i * 74}" fill="#111827" font-size="34" font-weight="700" font-family="Arial, Helvetica, sans-serif">${line}</text>
    `
    )
    .join("");

  return `
  <svg width="760" height="250" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" rx="28" ry="28" width="760" height="250" fill="#ffffff" fill-opacity="0.92"/>
    ${textRows}
  </svg>`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productImageBase64, brandName, sector } = body;

    if (!productImageBase64) {
      return Response.json(
        { error: "Ürün görseli gerekli" },
        { status: 400 }
      );
    }

    const title = brandName?.trim() || "Dijivex";
    const subtitle =
      sector?.trim() || "Premium ürün reklam tasarımı";
    const ctaText = "Şimdi Keşfet";
    const bullets = [
      "Şık ve modern tasarım",
      "Dikkat çekici ürün sunumu",
      "Hemen incele",
    ];

    const productBuffer = Buffer.from(productImageBase64, "base64");

    const resizedProduct = await sharp(productBuffer)
      .resize({
        width: 1000,
        height: 780,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    const titleSvg = svgToBuffer(createTitleSvg(title));
    const subtitleSvg = svgToBuffer(createSubtitleSvg(subtitle));
    const ctaSvg = svgToBuffer(createCtaSvg(ctaText));
    const bulletSvg = svgToBuffer(createBulletSvg(bullets));

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
          input: titleSvg,
          top: 50,
          left: 0,
        },
        {
          input: subtitleSvg,
          top: 150,
          left: 90,
        },
        {
          input: resizedProduct,
          top: 300,
          left: 40,
        },
        {
          input: bulletSvg,
          top: 980,
          left: 160,
        },
        {
          input: ctaSvg,
          top: 1210,
          left: 280,
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
