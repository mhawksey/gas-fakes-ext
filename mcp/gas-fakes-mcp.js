import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { exec } from "child_process";
import fs from "fs/promises";
import { setTimeout } from "node:timers/promises";
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
      gas_script: z
        .string()
        .describe(
          `Provide a Google Apps Script. The Google Apps Script is the generated script or the script provided by a prompt. When you put the script in a function like \`function sample() { script }\`, it is required to add \`sample();\` to run the function. When you directly put the script, the script can be run. In the current stage, gas-fakes cannot use \`Logger.log\`. So, please use \`console.log\` instead of it. If an error occurs, modify the script by referring to StackOverflow again.`
        ),
      sandbox: z
        .boolean()
        .describe(
          `The default is true. When this is true, the script is run with the sandbox. When this is false, the script is run without the sandbox.`
        )
        .optional(),
      strictSandbox: z
        .boolean()
        .describe(
          `The default is true. When this is true (and sandboxMode is active), attempts to access non-whitelisted, non-session files will throw an error. If false, access is allowed.`
        )
        .optional(),
      cleanup: z
        .boolean()
        .describe(
          `The default is true. If true, ScriptApp.__behavior.trash() moves all session-created files to Google Drive trash. Set to false to leave artifacts for inspection.`
        )
        .optional(),
      whitelistItems: z
        .array(
          z.object({
            id: z.string().describe("File ID of file on Google Drive"),
            read: z.boolean().optional().describe("Allow read operations"),
            write: z.boolean().optional().describe("Allow write operations"),
            trash: z.boolean().optional().describe("Allow trashing the file"),
          })
        )
        .describe(
          `Use this to access the existing files on Google Drive. Provide an array of objects, where each object has a file ID and optional read/write/trash permissions.`
        )
        .optional(),
      serviceControls: z
        .record(
          z.object({
            enabled: z.boolean().optional(),
            sandboxMode: z.boolean().optional(),
            strictSandbox: z.boolean().optional(),
          })
        )
        .describe(
          `Per-service settings that override global settings. The key is the service name (e.g., 'DriveApp').`
        )
        .optional(),
      methodWhitelist: z
        .record(z.array(z.string()))
        .describe(
          `An object where the key is the service name and the value is an array of permitted method names.`
        )
        .optional(),
    },
  },
  func: async (object = {}) => {
    const {
      sandbox = true,
      strictSandbox,
      cleanup,
      whitelistItems = [],
      serviceControls = {},
      methodWhitelist = {},
      gas_script,
    } = object;
    const importFile = "./mcp-sample.js";

    function getImportScript() {
      const importScriptAr = [
        `import "./node_modules/@mcpher/gas-fakes/main.js"`,
        "",
        `const behavior = ScriptApp.__behavior;`,
      ];

      if (sandbox) {
        importScriptAr.push(`behavior.sandboxMode = true;`);
        if (strictSandbox !== undefined) {
          importScriptAr.push(`behavior.strictSandbox = ${strictSandbox};`);
        }
        if (cleanup !== undefined) {
          importScriptAr.push(`behavior.cleanup = ${cleanup};`);
        }
      }

      if (whitelistItems.length > 0) {
        const wl = whitelistItems
          .map((item) => {
            let wlItem = `behavior.newIdWhitelistItem("${item.id}")`;
            if (item.read !== undefined) {
              wlItem += `.setRead(${item.read})`;
            }
            if (item.write !== undefined) {
              wlItem += `.setWrite(${item.write})`;
            }
            if (item.trash !== undefined) {
              wlItem += `.setTrash(${item.trash})`;
            }
            return wlItem;
          })
          .join(",");
        importScriptAr.push(`behavior.setIdWhitelist([${wl}]);`);
      }

      for (const service in serviceControls) {
        const controls = serviceControls[service];
        importScriptAr.push(
          `const ${service}Controls = behavior.sandboxService.${service};`
        );
        if (controls.enabled !== undefined) {
          importScriptAr.push(
            `${service}Controls.enabled = ${controls.enabled};`
          );
        }
        if (controls.sandboxMode !== undefined) {
          importScriptAr.push(
            `${service}Controls.sandboxMode = ${controls.sandboxMode};`
          );
        }
        if (controls.strictSandbox !== undefined) {
          importScriptAr.push(
            `${service}Controls.strictSandbox = ${controls.strictSandbox};`
          );
        }
      }

      for (const service in methodWhitelist) {
        const methods = methodWhitelist[service];
        importScriptAr.push(
          `const ${service}Whitelist = behavior.sandboxService.${service};`
        );
        importScriptAr.push(
          `${service}Whitelist.clearMethodWhitelist();`
        );
        for (const method of methods) {
          importScriptAr.push(
            `${service}Whitelist.addMethodWhitelist("${method}");`
          );
        }
      }

      importScriptAr.push(`\n\n${gas_script}\n\n`);

      if (sandbox) {
        importScriptAr.push(`behavior.trash();`);
      }

      return importScriptAr.join("\n");
    }

    try {
      const importScript = getImportScript();
      await fs.writeFile(importFile, importScript);
      await setTimeout(500);

      const { stdout } = await execAsync(`node ./${importFile}`);
      return {
        content: [{ type: "text", text: stdout || "Done." }],
        isError: false,
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: err.message }],
        isError: true,
      };
    } finally {
      try {
        await fs.unlink(importFile);
      } catch (err) {
        console.error(err.message);
      }
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