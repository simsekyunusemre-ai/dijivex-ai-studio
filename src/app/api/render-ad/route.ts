import sharp from "sharp";

function escapeXml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function svgToBuffer(svg: string) {
  return Buffer.from(svg, "utf-8");
}

function createTitleSvg(title: string) {
  const safeTitle = escapeXml(title);

  return `
  <svg width="1080" height="180" viewBox="0 0 1080 180" xmlns="http://www.w3.org/2000/svg">
    <rect width="1080" height="180" fill="transparent"/>
    <text
      x="540"
      y="95"
      text-anchor="middle"
      font-size="64"
      font-weight="800"
      font-family="DejaVu Sans, Arial, sans-serif"
      fill="#1f2937"
    >${safeTitle}</text>
  </svg>`;
}

function createSubtitleSvg(text: string) {
  const safeText = escapeXml(text);

  return `
  <svg width="900" height="100" viewBox="0 0 900 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" rx="24" ry="24" width="900" height="100" fill="#dbeafe"/>
    <text
      x="450"
      y="62"
      text-anchor="middle"
      font-size="38"
      font-weight="700"
      font-family="DejaVu Sans, Arial, sans-serif"
      fill="#1e3a8a"
    >${safeText}</text>
  </svg>`;
}

function createCtaSvg(text: string) {
  const safeText = escapeXml(text);

  return `
  <svg width="520" height="120" viewBox="0 0 520 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cta" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#22c55e"/>
        <stop offset="100%" stop-color="#16a34a"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" rx="36" ry="36" width="520" height="120" fill="url(#cta)"/>
    <text
      x="260"
      y="74"
      text-anchor="middle"
      font-size="42"
      font-weight="800"
      font-family="DejaVu Sans, Arial, sans-serif"
      fill="#ffffff"
    >${safeText}</text>
  </svg>`;
}

function createBulletSvg(lines: string[]) {
  const safeLines = lines.slice(0, 3).map(escapeXml);

  return `
  <svg width="760" height="250" viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" rx="28" ry="28" width="760" height="250" fill="#ffffff" fill-opacity="0.96"/>
    
    <circle cx="34" cy="48" r="14" fill="#22c55e"/>
    <text x="70" y="58" font-size="34" font-weight="700" font-family="DejaVu Sans, Arial, sans-serif" fill="#111827">
      ${safeLines[0] || ""}
    </text>

    <circle cx="34" cy="122" r="14" fill="#22c55e"/>
    <text x="70" y="132" font-size="34" font-weight="700" font-family="DejaVu Sans, Arial, sans-serif" fill="#111827">
      ${safeLines[1] || ""}
    </text>

    <circle cx="34" cy="196" r="14" fill="#22c55e"/>
    <text x="70" y="206" font-size="34" font-weight="700" font-family="DejaVu Sans, Arial, sans-serif" fill="#111827">
      ${safeLines[2] || ""}
    </text>
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
    const subtitle = sector?.trim() || "Premium urun reklami";
    const ctaText = "Simdi Kesfet";
    const bullets = [
      "Sik ve modern tasarim",
      "Dikkat cekici urun sunumu",
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
          top: 40,
          left: 0,
        },
        {
          input: subtitleSvg,
          top: 140,
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
        error: "Render hatasi",
        details: error?.message || "Bilinmeyen hata",
      },
      { status: 500 }
    );
  }
}
