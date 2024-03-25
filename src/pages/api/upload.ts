import type { APIRoute } from "astro";
import fs from 'node:fs/promises';
import path from "node:path";

import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';

cloudinary.config({
    cloud_name: 'dmyopjf0d',
    api_key: '857358535153113',
    api_secret: import.meta.env.CLOUDINARY_SECRET
});

const outputDir = path.join(process.cwd(), 'public/text');


const uploadStream = async (buffer: Uint8Array, options: {
    folder: string,
    ocr?: string
}): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        cloudinary
            .uploader
            .upload_stream(options, (error, result) => {
                if (result) return resolve(result);
                reject(error);
            }).end(buffer)
    });
}

export const POST: APIRoute = async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('file') as File

    if (file == null) {
        return new Response("No file found", { status: 400 })
    }
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    console.log('Uploading file', file.name)
    console.log('File size', uint8Array.length)
    console.log('File type', file.type)
    console.log('arrayBuffer', arrayBuffer)

    const result = await uploadStream(uint8Array, {
        folder: 'pdf',
        ocr: 'adv_ocr'
    })
    const {
        asset_id: id,
        secure_url: url,
        pages,
        info
    } = result

    const data = info?.ocr?.adv_ocr?.data
    console.log(data)
    const text = data.map((blocks: { textAnnotations: { description: string }[] }) => {
        const annotations = blocks['textAnnotations'] ?? {}
        const first = annotations[0] ?? {}
        const content = first['description'] ?? ''
        return content.trim()
    }).filter(Boolean).join('\n')


    fs.writeFile(`${outputDir}/${id}.txt`, text, 'utf-8')
    //fs.writeFile(`${outputDir}/${id}-origin.txt`, data, 'utf-8')


    return new Response(JSON.stringify({
        id,
        url,
        pages
    }));
}