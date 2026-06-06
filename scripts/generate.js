const fs = require("fs");
const axios = require("axios");

const USER = "0xKanba";

async function getRepos() {
  const res = await axios.get(
    `https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`,
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    }
  );
  return res.data;
}

function buildMarkdown(repos) {
  let md = `# Kanba\n\n## Public Repositories\n\n`;

  repos.forEach((repo) => {
    md += `- [${repo.name}](${repo.html_url}) - ${repo.description || "No description"}\n`;
  });

  return md;
}

(async () => {
  const repos = await getRepos();
  const md = buildMarkdown(repos);
  fs.writeFileSync("README.md", md);
})();
