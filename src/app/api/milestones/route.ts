import { NextResponse } from "next/server";
import { milestones } from "@/data/milestones";

export async function GET() {
    return NextResponse.json(milestones)
}