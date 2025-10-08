# Customizing the Gemini CLI for Your Workflow: A `gas-fakes` Case Study

**By Martin Hawksey**

I'm excited to share a project I've been working on that I believe showcases the incredible power and flexibility of the Gemini CLI: the `gas-fakes` Gemini CLI Extension. This extension is a case study in how you can customize the Gemini CLI to your specific requirements, particularly in the context of software development.

This project pulls together the pioneering work of [Bruce Mcpherson](https://github.com/brucemcpherson) on his [`gas-fakes`](https://github.com/brucemcpherson/gas-fakes) library and the invaluable contributions of [Kanshi Tanaike](https://github.com/tanaikech) to create a seamless and secure workflow for Google Apps Script development. I'll be joining Bruce at the upcoming Google Workspace Developer Summit in Paris to talk more about this.

## The Power of Gemini CLI Extensions

The true power of the Gemini CLI lies in its extensibility. With extensions, you can package together a collection of tools and resources to create a customized experience that is tailored to your specific needs. This is particularly useful in software development, but the possibilities are endless.

A Gemini CLI extension can be composed of three key components:

*   **System Prompts (`GEMINI.md`):** A `GEMINI.md` file allows you to provide the model with custom instructions and context. This is a powerful way to guide the model's behavior and ensure that it generates code that is compatible with your specific requirements.
*   **Custom Commands:** You can create custom commands to automate common tasks and streamline your workflow. These commands can be as simple or as complex as you need them to be.
*   **MCP Tools:** The Model Context Protocol (MCP) allows you to integrate external tools and services with the Gemini CLI. 

## The `gas-fakes` Extension: A Case Study

The `gas-fakes` Gemini CLI Extension is a practical example of how these three components can be used to create a powerful and customized development environment.

The extension addresses a common challenge in Google Apps Script development: the security risks of running AI-generated code. By packaging together a `GEMINI.md` file, custom commands, and an MCP tool for `gas-fakes`, the extension provides a secure and efficient way to develop and test Google Apps Script code.

Here's how it works:

*   **`GEMINI.md`:** The `GEMINI.md` file provides the model with detailed instructions on how to use the `gas-fakes` library, ensuring that the generated code is compatible with the sandboxed environment.
*   **Custom Commands:** The extension includes custom commands like `/gas:init` and `/gas:new` that automate the process of setting up a new project and generating code.
*   **MCP Tool:** The packaged MCP tool allows the Gemini CLI to interact with the `gas-fakes` sandbox, enabling it to execute code and get feedback in a secure environment. This This opens up a world of possibilities for creating powerful and interactive experiences. This extension also includes the new official [Model Context Protocol (MCP) for Google Workspace Development](https://developers.google.com/workspace/guides/build-with-llms#mcp) to interact directly with Google Workspace APIs.

## Getting Started

Getting started with Gemini CLI Extensions is easy. To learn more about managing extensions, including installation, uninstallation, and updates, please see the [official documentation](https://google-gemini.github.io/gemini-cli/docs/extensions/).

To install this extension, run the following command:

```bash
gemini extension install https://github.com/mhawksey/gas-fakes-ext
```

## Beyond Software Development

While this extension is focused on software development, the same principles can be applied to a wide range of other contexts. Imagine creating a custom extension for:

*   **Scientific research:** An extension that integrates with scientific databases and analysis tools.
*   **Education:** An extension that provides interactive learning experiences and personalized feedback.
*   **Personal productivity:** An extension that automates your personal workflows and integrates with your favorite apps.

## Conclusion

The Gemini CLI is more than just a command-line interface; it's a powerful platform for creating customized and intelligent experiences. The `gas-fakes` Gemini CLI Extension is just one example of what is possible. I encourage you to explore the world of Gemini CLI extensions and see what you can create.

## Acknowledgements

This extension stands on the shoulders of giants. It directly builds upon the pioneering work of [Bruce Mcpherson](https://github.com/brucemcpherson) and his `gas-fakes` library. I'd also like to express my sincere gratitude to [Kanshi Tanaike](https://github.com/tanaikech), whose work on the `gas-fakes` sandbox and MCP server has been instrumental in the development of this extension.