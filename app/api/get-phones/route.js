import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req) {
  const adminKey = process.env.ADMIN_KEY;
  const sentKey = req.headers.get("x-admin-key");

  if (!sentKey || sentKey !== adminKey) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  const filePath = path.join(process.cwd(), "phones.txt");

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ phones: [] });
  }

  try {
    const raw = fs.readFileSync(filePath, "utf8").trim();
    const lines = raw ? raw.split(/\r?\n/) : [];

    const phones = lines.map((line, i) => {
      const parts = line.split(" | ");

      return {
        id: i + 1,
        phone: parts[0],
        status: parts[1] || "new",
        date: parts[2] || "",
      };
    });

    return NextResponse.json({ phones });
  } catch (error) {
    console.error("Error reading phones.txt:", error);
    return NextResponse.json(
      { error: "خطا در خواندن شماره‌ها" },
      { status: 500 }
    );
  }
}
