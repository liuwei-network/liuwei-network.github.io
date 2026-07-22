(() => {
  const year = document.querySelector("#current-year");
  if (year) year.textContent = new Date().getFullYear();

  const numberFormatter = new Intl.NumberFormat("en-US");

  const loadGitHubStats = async (element) => {
    const repo = element.dataset.githubRepo;
    const stars = element.querySelector("[data-github-stars]");
    const forks = element.querySelector("[data-github-forks]");

    try {
      const response = await fetch(`https://api.github.com/repos/${repo}`);

      if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);

      const data = await response.json();
      if (!Number.isFinite(data.stargazers_count) || !Number.isFinite(data.forks_count)) {
        throw new Error("GitHub API response is missing repository statistics");
      }

      stars.textContent = numberFormatter.format(data.stargazers_count);
      forks.textContent = numberFormatter.format(data.forks_count);
      element.dataset.state = "loaded";
    } catch (error) {
      element.dataset.state = "error";
      element.title = "GitHub statistics are temporarily unavailable";
    }
  };

  document.querySelectorAll("[data-github-repo]").forEach(loadGitHubStats);
})();
