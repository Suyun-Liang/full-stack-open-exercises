import { useState } from "react";

function BlogForm({ onCreateBlog }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !url) {
      window.alert("title and url must be provided");
      return;
    }
    await onCreateBlog({ title, author, url });
    setTitle("");
    setAuthor("");
    setUrl("");
  }
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          title
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          author
          <input value={author} onChange={(e) => setAuthor(e.target.value)} />
        </label>
        <div>
          <label>
            url
            <input value={url} onChange={(e) => setUrl(e.target.value)} />
          </label>
        </div>
      </div>
      <button type="submit">create</button>
    </form>
  );
}

export default BlogForm;
