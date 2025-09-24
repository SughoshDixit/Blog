import GithubSlugger from "github-slugger";

export async function getHeadings(source) {
  const safeSource = typeof source === "string" ? source : "";
  const headingLines = safeSource.split("\n").filter((line) => line.match(/^###*\s/));

  const slugger = new GithubSlugger();
  let uid = 1000;

  return headingLines.map((raw) => {
    const text = raw
      .replace(/^###*\s/, "")
      .replace(/ *\{[^)]*\} */g, "")
      .trim();

    const id = slugger.slug(text);
    const level = raw.slice(0, 3) === "###" ? 3 : 2;
    uid++;
    return { text, level, id, uid };
  });
}
