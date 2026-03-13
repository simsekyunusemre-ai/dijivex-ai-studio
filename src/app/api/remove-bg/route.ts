export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File | null;

    if (!image) {
      return Response.json(
        { success: false, error: "Görsel zorunlu." },
        { status: 400 }
      );
    }

    if (!process.env.REMOVE_BG_API_KEY) {
      return Response.json(
        { success: false, error: "REMOVE_BG_API_KEY tanımlı değil." },
        { status: 500 }
      );
    }

    const removeBgForm = new FormData();
    removeBgForm.append("image_file", image);
    removeBgForm.append("size", "auto");

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": process.env.REMOVE_BG_API_KEY,
      },
      body: removeBgForm,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("remove.bg error:", errorText);

      return Response.json(
        { success: false, error: "Arka plan kaldırma başarısız oldu." },
        { status: 500 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return Response.json({
      success: true,
      image: base64,
      mimeType: "image/png",
    });
  } catch (error) {
    console.error("remove-bg route error:", error);

    return Response.json(
      { success: false, error: "Arka plan kaldırılırken hata oluştu." },
      { status: 500 }
    );
  }
}
