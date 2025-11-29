import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const { phone } = await req.json();

    if (
      !phone ||
      typeof phone !== "string" ||
      !phone.trim() ||
      !phone.startsWith("09") ||
      phone.length !== 11
    ) {
      return NextResponse.json(
        { success: false, message: "شماره تماس معتبر نیست" },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "phones.txt");

    const now = new Date();
    const isoDate = now.toISOString(); 

    
    const line = `${phone.trim()} | new | ${isoDate}\n`;

    fs.appendFileSync(filePath, line, "utf8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving phone:", error);
    return NextResponse.json(
      { success: false, message: "خطا در ذخیره شماره" },
      { status: 500 }
    );
  }
}
