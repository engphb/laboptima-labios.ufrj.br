import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import { resolve, extname } from "path";

const TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
const OWNER = "engphb";
const REPO = "laboptima-labios-website";
const BRANCH = "main";
const BASE = "/home/runner/workspace";

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: "application/vnd.github+json",
  "Content-Type": "application/json",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const BINARY_EXTS = new Set([".png", ".jpg", ".jpeg", ".gif", ".ico", ".webp", ".svg", ".woff", ".woff2", ".ttf", ".eot", ".pdf"]);

async function api(path, method = "GET", body, retries = 5) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await fetch(`https://api.github.com${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { message: text }; }
    if ((res.status === 403 || res.status === 429) && JSON.stringify(data).includes("rate limit")) {
      const wait = (attempt + 1) * 20000;
      console.log(`\n  Rate limit — aguardando ${wait / 1000}s...`);
      await sleep(wait);
      continue;
    }
    if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${JSON.stringify(data)}`);
    return data;
  }
  throw new Error("Máximo de tentativas atingido");
}

async function createBlobForBinary(filePath) {
  const abs = resolve(BASE, filePath);
  const content = readFileSync(abs).toString("base64");
  const data = await api(`/repos/${OWNER}/${REPO}/git/blobs`, "POST", { content, encoding: "base64" });
  await sleep(300);
  return { path: filePath, mode: "100644", type: "blob", sha: data.sha };
}

async function main() {
  console.log("Verificando repositório...");
  let baseSha;
  try {
    const ref = await api(`/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`);
    baseSha = ref.object.sha;
    console.log("Branch main encontrada.");
  } catch {
    console.log("Criando branch main inicial...");
    const initRes = await api(`/repos/${OWNER}/${REPO}/contents/.gitkeep`, "PUT", {
      message: "chore: inicializar",
      content: Buffer.from("").toString("base64"),
    });
    baseSha = initRes.commit.sha;
  }

  const allFiles = execSync("git ls-files", { cwd: BASE })
    .toString().trim().split("\n").filter(Boolean);

  console.log(`Total: ${allFiles.length} arquivos\n`);

  const treeItems = [];

  for (let i = 0; i < allFiles.length; i++) {
    const filePath = allFiles[i];
    const abs = resolve(BASE, filePath);
    if (!existsSync(abs)) continue;

    const ext = extname(filePath).toLowerCase();

    if (BINARY_EXTS.has(ext)) {
      // Binary files: create blob with SHA
      process.stdout.write(`\r  [${i + 1}/${allFiles.length}] (binário) ${filePath.slice(-60)}`);
      const item = await createBlobForBinary(filePath);
      treeItems.push(item);
    } else {
      // Text files: use inline content (no extra API call needed)
      process.stdout.write(`\r  [${i + 1}/${allFiles.length}] ${filePath.slice(-60)}`);
      const content = readFileSync(abs, "utf8");
      treeItems.push({ path: filePath, mode: "100644", type: "blob", content });
    }
  }

  console.log("\n\nCriando árvore de arquivos...");
  const tree = await api(`/repos/${OWNER}/${REPO}/git/trees`, "POST", { tree: treeItems });

  console.log("Criando commit...");
  const commit = await api(`/repos/${OWNER}/${REPO}/git/commits`, "POST", {
    message: "feat: envio completo do projeto LabOPTIMA | LaBioS",
    tree: tree.sha,
    parents: [baseSha],
  });

  console.log("Publicando no GitHub...");
  await api(`/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`, "PATCH", {
    sha: commit.sha,
    force: true,
  });

  console.log("\nPronto! Projeto enviado com sucesso!");
  console.log(`  GitHub: https://github.com/${OWNER}/${REPO}`);
  console.log(`  Site:   https://${OWNER}.github.io/${REPO}/`);
}

main().catch((e) => {
  console.error("\nErro:", e.message.slice(0, 500));
  process.exit(1);
});
