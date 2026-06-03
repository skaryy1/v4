import { access, readFile } from "node:fs/promises";

const requiredFiles = ["index.html", "src/styles.css", "src/attention-dimension.js"];

await Promise.all(requiredFiles.map((file) => access(file)));
const html = await readFile("index.html", "utf8");

for (const marker of ["THE ATTENTION DIMENSION", "START A PROJECT", "BOOK A STRATEGY CALL"]) {
  if (!html.includes(marker)) {
    throw new Error(`Missing required experience marker: ${marker}`);
  }
}

console.log("Static cinematic experience verified.");
