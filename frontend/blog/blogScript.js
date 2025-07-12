const postList = document.getElementById("post-list");

// Define posts you want to load
fetch("posts/index.json")
.then(res => res.json())
.then(posts => {
    const fetchPromises = posts.map(slug =>
    fetch(`posts/${slug}.json`)
    .then(res => res.json())
    .then(data => ({ slug, ...data }))
  );
  
  Promise.all(fetchPromises).then(allPosts => {
    // Sort by combined date and time
    allPosts.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateB - dateA; // change to `dateB - dateA` for descending
    });
    
    // Render after sorting
    allPosts.forEach(data => {
      const preview = document.createElement("div");
      preview.className = "post-preview";
      preview.innerHTML = `
      <a href="blogPostPage.html?slug=${data.slug}">
      <h2>${data.title}</h2>
      </a>
      <small>${data.date} ${data.time}</small>
      <p>${data.content.substring(0, 100)}...</p>
      `;
      postList.appendChild(preview);
    });
  });
});