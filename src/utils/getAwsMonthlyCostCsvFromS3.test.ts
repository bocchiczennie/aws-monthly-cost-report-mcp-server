import { describe, it, expect, vi } from "vitest";
import { getAwsMonthlyCostCsvFromS3 } from "./getAwsMonthlyCostCsvFromS3.js";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { gzipSync } from "zlib";

// モックCSVデータ
const sampleCsv = `Service,Date,Cost
AWS Lambda,2025-04-01,0.02
Amazon EC2,2025-04-01,1.25
`;

vi.mock("@aws-sdk/client-s3", async () => {
    const actual = await vi.importActual<any>("@aws-sdk/client-s3");

    return {
        ...actual,
        S3Client: vi.fn().mockImplementation(() => ({
            send: vi.fn().mockImplementation(() => {
                const gzipped = gzipSync(sampleCsv);
                const stream = Readable.from(gzipped);
                return Promise.resolve({ Body: stream });
            }),
        })),
    };
});

describe("getAwsMonthlyCostCsvFromS3", () => {
    it("should parse and return CSV content as JSON", async () => {
        const data = await getAwsMonthlyCostCsvFromS3("2025", "04");

        expect(data).toEqual([
            { Service: "AWS Lambda", Date: "2025-04-01", Cost: "0.02" },
            { Service: "Amazon EC2", Date: "2025-04-01", Cost: "1.25" },
        ]);
    });
});