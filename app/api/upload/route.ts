import mammoth from "mammoth";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await mammoth.extractRawText({ buffer });

    return Response.json({
      text: result.value,
    });
  } catch (err: any) {
    console.error(err);

    return Response.json(
      { error: "Word oxunmadı", details: err?.message },
      { status: 500 }
    );
  }
}