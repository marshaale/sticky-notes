import { promises as fs } from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "notes.json");
let queue = Promise.resolve();

export async function readNotes() {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    return [];
  }
}

// Serialize writes so quick edits never corrupt the file
export function mutate(fn) {
  const run = queue.then(async () => {
    const notes = await readNotes();
    const result = await fn(notes);
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(notes, null, 2));
    return result;
  });
  queue = run.catch(() => {});
  return run;
}
