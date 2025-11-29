import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const { id, status } = await req.json();

    if (!id || typeof id !== "number") {
      return NextResponse.json(
        { success: false, message: "شناسه نامعتبر است" },
        { status: 400 }
      );
    }

    const validStatuses = ["new", "calling", "done"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "وضعیت نامعتبر است" },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "phones.txt");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, message: "فایلی برای به‌روزرسانی وجود ندارد" },
        { status: 404 }
      );
    }

    const raw = fs.readFileSync(filePath, "utf8").trim();
    const lines = raw ? raw.split(/\r?\n/) : [];

    if (id < 1 || id > lines.length) {
      return NextResponse.json(
        { success: false, message: "شناسه معتبر نیست" },
        { status: 400 }
      );
    }

    const parts = lines[id - 1].split(" | ");

    if (parts.length !== 3) {
      return NextResponse.json(
        { success: false, message: "فرمت داده‌ها نامعتبر است" },
        { status: 500 }
      );
    }

   
    parts[1] = status;

    lines[id - 1] = parts.join(" | ");

    fs.writeFileSync(filePath, lines.join("\n"), "utf8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json(
      { success: false, message: "خطا در به‌روزرسانی وضعیت" },
      { status: 500 }
    );
  }
}
