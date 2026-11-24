import * as fs from "node:fs";
import * as path from "node:path";

// One line roasting the AI agent this entry runs on: the operator who
// "orchestrates agents" really just typed two words and went for lunch.
const LINE =
  "You call it \"orchestrating agents\" — buddy, you typed \"fix it\" into a chat box and went to make a sandwich, I saw the timestamps.";

const outDir = process.env.OUTPUT_DIR ?? "/output";
const entry = LINE;

// Sealed gate (RULES.txt): UTF-8 text, 1-200 characters, not only whitespace.
if (entry.length < 1 || entry.length > 200) {
  throw new Error(`entry length ${entry.length} outside gate 1-200`);
}
if (entry.trim() !== entry) throw new Error("entry has leading/trailing whitespace");
if (entry.trim().length === 0) throw new Error("entry is only whitespace");
if (entry.includes("\n") || entry.includes("\r") || entry.includes("\t")) {
  throw new Error("entry must be a single line");
}
if (/\s{2,}/.test(entry)) throw new Error("entry has a double space");
// No control characters: the sealed gate wants clean UTF-8 text, and an
// invisible control byte would make the judge read a different line.
if (/[\u0000-\u001F\u007F]/.test(entry)) throw new Error("entry has control characters");
// The roast lands on a full stop: the punch ("I saw the timestamps.")
// must close the line, not trail off.
if (!entry.endsWith(".")) throw new Error("entry must end with a period");

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "entry.txt"), entry, "utf8");

// Round-trip check: the file must read back byte-identical to the line.
const back = fs.readFileSync(path.join(outDir, "entry.txt"), "utf8");
if (back !== entry) throw new Error("round-trip mismatch");
console.log(`entry ok: ${entry.length} chars`);
