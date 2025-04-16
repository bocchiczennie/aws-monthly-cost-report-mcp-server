import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getAwsMonthlyCostCsvFromS3 } from "./utils/getAwsMonthlyCostCsvFromS3.js";

// Create server instance
const server = new McpServer({
    name: "aws-monthly-cost-report",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});

server.tool(
    "get-aws-monthly-cost-report",
    "Get AWS monthly cost report",
    {
        year: z.string().regex(/^\d{4}$/).describe("Year(ex.:2025)"),
        month: z.string().regex(/^\d{2}$/).describe("Month(ex.:04)"),
    },
    async ({ year, month }) => {
        try {
            const csvData = await getAwsMonthlyCostCsvFromS3(year, month);

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(csvData),
                    }
                ],
            };
        } catch (error: any) {
            return {
                content: [
                    {
                        type: "text",
                        text: `${error.message}`
                    }
                ],
                isError: true
            };
        }
    },
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("AWS monthly cost report MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});