const fs = require("fs");
const axios = require("axios");

const USER = "0xKanba";

async function getRepos() {
  const res = await axios.get(
    `https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`,
    {
      headers: {
        "User-Agent": "profile-generator",
      },
    }
  );

  return res.data.filter(r => !r.private);
}

function buildMarkdown(repos) {
  let md = "";

  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);

  md += `# Kanba\n\n`;
  md += `## Repositories\n\n`;
  md += `- Total: ${repos.length} | Stars: ${totalStars}\n\n`;

  md += `| Repository | Stars | Forks | Language |\n`;
  md += `|------------|-------|-------|----------|\n`;

  repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .forEach(r => {
      md += `| [${r.name}](${r.html_url}) | ${r.stargazers_count} | ${r.forks_count} | ${r.language || "—"} |\n`;
    });

  return md;
}

(async () => {
  try {
    const repos = await getRepos();
    const md = buildMarkdown(repos);
    fs.writeFileSync("README.md", md);
  } catch (e) {
    console.error(e.message);
  }
})();
