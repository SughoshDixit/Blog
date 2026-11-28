const DEFAULT_REPO = "SughoshDixit/Blog";
const DEFAULT_BRANCH = "master";

function getRepoConfig() {
  return {
    repo: process.env.GITHUB_REPO || DEFAULT_REPO,
    branch: process.env.GITHUB_BRANCH || DEFAULT_BRANCH,
    token: process.env.GITHUB_TOKEN || "",
  };
}

function encodeRepoPath(repoPath) {
  return repoPath
    .replace(/^\/+/, "")
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function buildHeaders(token, hasJsonBody = false) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "SughoshDixit-Blog-Writer",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (hasJsonBody) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}

export function hasGitHubCommitConfig() {
  return Boolean(process.env.GITHUB_TOKEN);
}

export async function listRepoDirectory(repoPath) {
  const { repo, branch, token } = getRepoConfig();
  const url = `https://api.github.com/repos/${repo}/contents/${encodeRepoPath(
    repoPath
  )}?ref=${encodeURIComponent(branch)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: buildHeaders(token, false),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GitHub list error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function readRepoFile(repoPath) {
  const { repo, branch, token } = getRepoConfig();
  const url = `https://api.github.com/repos/${repo}/contents/${encodeRepoPath(
    repoPath
  )}?ref=${encodeURIComponent(branch)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: buildHeaders(token, false),
  });

  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GitHub read error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  if (!data || typeof data.content !== "string") {
    throw new Error("Unexpected GitHub file response format.");
  }

  const content = Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf8");
  return {
    content,
    sha: data.sha,
    path: data.path,
  };
}

export async function commitFileToGitHub({ repoPath, contentBase64, message }) {
  const { repo, branch, token } = getRepoConfig();
  if (!token) {
    return { committed: false, reason: "missing_token" };
  }

  const encodedPath = encodeRepoPath(repoPath);
  const getUrl = `https://api.github.com/repos/${repo}/contents/${encodedPath}?ref=${encodeURIComponent(
    branch
  )}`;

  let existingSha = null;
  const existingRes = await fetch(getUrl, {
    method: "GET",
    headers: buildHeaders(token, false),
  });

  if (existingRes.status === 200) {
    const existingData = await existingRes.json();
    existingSha = existingData?.sha || null;
  } else if (existingRes.status !== 404) {
    const errText = await existingRes.text();
    throw new Error(`GitHub lookup error (${existingRes.status}): ${errText}`);
  }

  const putUrl = `https://api.github.com/repos/${repo}/contents/${encodedPath}`;
  const payload = {
    message: message || `Update ${repoPath}`,
    content: contentBase64,
    branch,
    ...(existingSha ? { sha: existingSha } : {}),
  };

  const putRes = await fetch(putUrl, {
    method: "PUT",
    headers: buildHeaders(token, true),
    body: JSON.stringify(payload),
  });

  if (!putRes.ok) {
    const errText = await putRes.text();
    throw new Error(`GitHub commit error (${putRes.status}): ${errText}`);
  }

  const putData = await putRes.json();
  return {
    committed: true,
    repo,
    branch,
    sha: putData?.content?.sha || null,
    commitSha: putData?.commit?.sha || null,
    commitUrl: putData?.commit?.html_url || null,
  };
}
