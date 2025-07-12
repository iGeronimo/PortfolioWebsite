async function fetchRSS() {
  const proxy = "https://corsproxy.io/?";
  const rssURL = "https://www.rockpapershotgun.com/feed";
  const fullURL = proxy + encodeURIComponent(rssURL);

  try {
    const res = await fetch(fullURL);
    const xmlText = await res.text();
    
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "text/xml");
    const items = xml.querySelectorAll("item");

    const container = document.getElementById("news-feed");
    document.querySelector(".loading").style.display = "none";

    items.forEach((item) => {
      const pubDateText = item.querySelector("pubDate").textContent;
      const pubDate = new Date(pubDateText);

      // Get today's and yesterday's dates
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      // Get only date portion for comparison (no time)
      const itemDate = new Date(
        pubDate.getFullYear(),
        pubDate.getMonth(),
        pubDate.getDate()
      );

      const isToday = itemDate.getTime() === today.getTime();
      const isYesterday = itemDate.getTime() === yesterday.getTime();

      if (isToday || isYesterday) {
        const title = item.querySelector("title").textContent;
        const link = item.querySelector("link").textContent;
        const desc = item.querySelector("description").textContent;

        const article = document.createElement("div");
        article.className = "article";
        article.innerHTML = `
        <p>${pubDate.getFullYear() + "/" + pubDate.getMonth() + "/" + pubDate.getDate()} </p>
      <a href="${link}" target="_blank">${title}</a>
      <p>${desc}</p>
    `;
        container.appendChild(article);
      }
    });

  } catch (err) {
    document.querySelector(".loading").textContent = "Failed to load news.";
    console.error("RSS fetch error:", err);
  }
}


fetchRSS();