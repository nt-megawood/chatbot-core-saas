import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const FORBIDDEN_PACKAGE = "chatbot-company-impl";

function collectTypeScriptFiles(rootDir: string): string[] {
  const files: string[] = [];

  for (const entry of readdirSync(rootDir)) {
    const fullPath = join(rootDir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...collectTypeScriptFiles(fullPath));
      continue;
    }

    if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx")) {
      files.push(fullPath);
    }
  }

  return files;
}

function extractImportSpecifiers(source: string): string[] {
  const patterns = [
    /\b(?:import|export)\s+[^;]*?\bfrom\s*["']([^"']+)["']/g,
    /\bimport\s*["']([^"']+)["']/g,
    /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g,
    /\brequire\s*\(\s*["']([^"']+)["']\s*\)/g
  ];

  const specifiers: string[] = [];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const specifier = match[1];
      if (specifier) {
        specifiers.push(specifier);
      }
    }
  }

  return specifiers;
}

function isForbiddenSpecifier(specifier: string): boolean {
  return specifier === FORBIDDEN_PACKAGE || specifier.startsWith(`${FORBIDDEN_PACKAGE}/`);
}

function findForbiddenImportSpecifiers(source: string): string[] {
  return extractImportSpecifiers(source).filter(isForbiddenSpecifier);
}

describe("package boundary checks", () => {
  it("detects forbidden direct package import patterns", () => {
    const source = [
      `import { ChatbotWidgetImpl } from "${FORBIDDEN_PACKAGE}";`,
      `import "${FORBIDDEN_PACKAGE}";`,
      `const lazyModule = import("${FORBIDDEN_PACKAGE}");`,
      `const legacyModule = require("${FORBIDDEN_PACKAGE}");`
    ].join("\n");

    const matches = findForbiddenImportSpecifiers(source);

    expect(matches).toHaveLength(4);
    expect(matches.every((specifier) => specifier === FORBIDDEN_PACKAGE)).toBe(true);
  });

  it("detects forbidden subpath import patterns", () => {
    const source = [
      `import { ChatbotWidgetImpl } from "${FORBIDDEN_PACKAGE}/core";`,
      `import "${FORBIDDEN_PACKAGE}/styles";`,
      `const lazyModule = import("${FORBIDDEN_PACKAGE}/submodule");`,
      `const legacyModule = require("${FORBIDDEN_PACKAGE}/runtime");`
    ].join("\n");

    expect(findForbiddenImportSpecifiers(source)).toEqual([
      `${FORBIDDEN_PACKAGE}/core`,
      `${FORBIDDEN_PACKAGE}/styles`,
      `${FORBIDDEN_PACKAGE}/submodule`,
      `${FORBIDDEN_PACKAGE}/runtime`
    ]);
  });

  it("does not flag safe non-implementation imports", () => {
    const source = [
      "import { ChatbotWidgetCore } from \"chatbot-core-saas\";",
      "const lazyModule = import(\"chatbot-company-implementation\");",
      "const localModule = require(\"./chatbot-company-impl\");",
      "import \"@vendor/chatbot-company-impl\";"
    ].join("\n");

    expect(findForbiddenImportSpecifiers(source)).toEqual([]);
  });

  it("contains no forbidden imports from chatbot-company-impl", () => {
    const sourceRoot = join(process.cwd(), "src");
    const files = collectTypeScriptFiles(sourceRoot);

    for (const filePath of files) {
      const content = readFileSync(filePath, "utf8");
      const forbiddenSpecifiers = findForbiddenImportSpecifiers(content);
      expect(
        forbiddenSpecifiers,
        `Found forbidden imports in ${relative(process.cwd(), filePath)}: ${forbiddenSpecifiers.join(", ")}`
      ).toEqual([]);
    }
  });

  it("does not declare chatbot-company-impl dependencies", () => {
    const packageJsonPath = join(process.cwd(), "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    const dependencyNames = [
      ...Object.keys(packageJson.dependencies ?? {}),
      ...Object.keys(packageJson.devDependencies ?? {})
    ];

    expect(dependencyNames).not.toContain(FORBIDDEN_PACKAGE);
  });
});
