function buildMarkdown(repos) {
  let md = `# Kanba\n\n`;
  md += `## Public Repositories\n\n`;

  md += `| Repository | Description | Stars | Language |\n`;
  md += `|------------|-------------|-------|----------|\n`;

  repos.forEach((repo) => {
    md += `| [${repo.name}](${repo.html_url}) | ${repo.description || "—"} | ⭐ ${repo.stargazers_count} | ${repo.language || "—"} |\n`;
  });

  return md;
}
