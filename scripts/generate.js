const fs = require("fs");
const axios = require("axios");

const USER = "0xKanba";

async function getRepos() {
  const res = await axios.get(
    `https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`,
    {
      headers: {
        "User-Agent": "kanba-profile-generator",
      },
    }
  );
  return res.data.filter(r => !r.private);
}

function formatNumber(n) {
  return n > 999 ? (n / 1000).toFixed(1) + "k" : n;
}

function buildMarkdown(repos) {
  const totalStars = repos.reduce((a, b) => a + b.stargazers_count, 0);
  const totalForks = repos.reduce((a, b) => a + b.forks_count, 0);

  let md = "";

  // HEADER
  md += `# Kanba\n\n`;
  md += `> Trader • AI Builder • Web Automation Engineer\n\n`;

  md += `## 📊 Overview\n\n`;
  md += `- 📦 Total Repositories: **${repos.length}**\n`;
  md += `- ⭐ Total Stars: **${totalStars}**\n`;
  md += `- 🍴 Total Forks: **${totalForks}**\n\n`;

  // TOP REPOS
  const top = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6);

  md += `## 🚀 Top Projects\n\n`;
  md += `| Project | Stars | Forks | Language |\n`;
  md += `|--------|------|------|----------|\n`;

  top.forEach(r => {
    md += `| [${r.name}](${r.html_url}) | ⭐ ${r.stargazers_count} | 🍴 ${r.forks_count} | ${r.language || "—"} |\n`;
  });

  md += `\n`;

  // ALL REPOS
  md += `## 📁 All Repositories\n\n`;
  md += `| Repository | Description | Stars | Language |\n`;
  md += `|------------|-------------|-------|----------|\n`;

  repos
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .forEach(r => {
      md += `| [${r.name}](${r.html_url}) | ${r.description || "—"} | ⭐ ${r.stargazers_count} | ${r.language || "—"} |\n`;
    });

  md += `\n---\n`;
  md += `*Auto-generated profile powered by GitHub Actions*\n`;

  return md;
}

(async () => {
  try {
    const repos = await getRepos();
    const md = buildMarkdown(repos);
    fs.writeFileSync("README.md", md);
    console.log("README generated successfully");
  } catch (err) {
    console.error("Error:", err.message);
  }
})();
