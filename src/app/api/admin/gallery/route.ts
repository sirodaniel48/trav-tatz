import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const supabase = getServiceRoleClient();
    const { data, error } = await supabase.from("gallery_images").select("*").order("display_order", { ascending: true });
    
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching gallery images:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const category = formData.get("category") as string;
    const caption = formData.get("caption") as string;

    if (!file || !category) {
      return NextResponse.json({ error: "File and category are required" }, { status: 400 });
    }

    // Convert file to base64 for Cloudinary upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(base64Data, {
      folder: "trav_tatz_gallery",
    });

    // Save to Supabase
    const supabase = getServiceRoleClient();
    const { data, error } = await supabase
      .from("gallery_images")
      .insert([{
        cloudinary_id: uploadRes.public_id,
        url: uploadRes.secure_url,
        category,
        caption: caption || null,
        display_order: 0 // Default order
      }])
      .select()
      .single();

    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const cloudinaryId = searchParams.get("cloudinaryId");

    if (!id || !cloudinaryId) {
      return NextResponse.json({ error: "ID and cloudinaryId are required" }, { status: 400 });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(cloudinaryId);

    // Delete from Supabase
    const supabase = getServiceRoleClient();
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting image:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const items = await req.json(); // Expecting [{ id, display_order }]
    const supabase = getServiceRoleClient();
    
    // Supabase JS doesn't have a built-in bulk update for different rows easily without looping or rpc.
    // We will just do a Promise.all since the gallery size is small.
    const promises = items.map((item: any) => 
      supabase.from("gallery_images").update({ display_order: item.display_order }).eq("id", item.id)
    );
    
    await Promise.all(promises);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error reordering gallery:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
