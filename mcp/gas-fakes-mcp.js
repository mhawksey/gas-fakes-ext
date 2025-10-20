import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { exec } from "child_process";
import { promisify } from "util";
import { z } from "zod";

const server = new McpServer({
  name: "MCP server for gas-fakes",
  version: "1.0.0",
});

const execAsync = promisify(exec);

const tool = {
  name: "run-gas-fakes-test",
  schema: {
    description:
      "Use this to safely execute a script of Google Apps Script in a sandbox using gas-fakes.",
    inputSchema: {
      run_js_path: z
        .string()
        .describe("The path to the run.js file."),
    },
  },
  func: async (object = {}) => {
    const { run_js_path } = object;

    try {
      const { stdout } = await execAsync(`node ${run_js_path}`);
      return {
        content: [{ type: "text", text: stdout || "Done." }],
        isError: false,
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: err.message }],
        isError: true,
      };
    }
  },
};

const { name, schema, func } = tool;
server.registerTool(name, schema, func);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});