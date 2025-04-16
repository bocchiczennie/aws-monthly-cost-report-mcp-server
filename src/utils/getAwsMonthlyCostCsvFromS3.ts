import dotenv from "dotenv";
dotenv.config();
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-providers";
import { gunzipSync } from "zlib";
import { parse } from "csv-parse/sync";

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: fromIni({ profile: process.env.AWS_PROFILE || "default" }),
    endpoint: process.env.AWS_S3_ENDPOINT,
});

function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        stream.on("data", chunk => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
    });
}

export async function getAwsMonthlyCostCsvFromS3(year: string, month: string) {
    const bucket = process.env.AWS_COST_REPORT_BUCKET;
    if (!bucket) throw new Error("AWS_COST_REPORT_BUCKET is not defined in environment variables");

    const key = `monthly-costs/${year}-${month}.csv.gz`;    // keyは各々の構成に置き換えること

    const response = await s3.send(
        new GetObjectCommand({
            Bucket: bucket,
            Key: key
        }),
    );
    if (!response.Body) {
        throw new Error("S3 response body is undefined");
    }
    const gzBuffer = await streamToBuffer(response.Body as NodeJS.ReadableStream);
    const csvData = gunzipSync(gzBuffer).toString("utf-8");

    return parse(csvData, {
        columns: true,
        skip_empty_lines: true,
    });
}