import { Box, Button, TextField } from "@mui/material";
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
      <Box sx={{ width: 380 }}>
        <TextField
          variant="outlined"
          label="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />
        <TextField
          variant="outlined"
          label="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={{ marginTop: 10 }}
          fullWidth
        />
        <TextField
          variant="outlined"
          label="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ marginTop: 10 }}
          fullWidth
        />
      </Box>
      <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
        create
      </Button>
    </form>
  );
}

export default BlogForm;
