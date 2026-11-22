import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import blogService from "../services/blogs";
import {
  Paper,
  Stack,
  Typography,
  Link,
  Button,
  CircularProgress,
} from "@mui/material";

const Blog = ({ onToggleLike, currentUserId, onDeleteBlog }) => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const userLikeBlog = blog?.likes?.includes(currentUserId);
  const canCurrentUserDeleteBlog = blog?.user?.id === currentUserId;
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;
    setBlog(null);
    async function fetchBlog() {
      try {
        const result = await blogService.getById(id);
        console.log("Fetched blog:", result);
        if (!ignore) setBlog(result);
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      }
    }
    fetchBlog();
    return () => {
      ignore = true;
    };
  }, [id]);

  async function handleLikeClick() {
    const updatedBlog = await onToggleLike(blog.id, userLikeBlog);
    if (updatedBlog) setBlog(updatedBlog);
  }

  async function handleDeleteClick() {
    const isConfirmed = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`,
    );
    if (!isConfirmed) return;
    const deleted = await onDeleteBlog(blog.id);
    if (deleted) navigate("/");
  }

  if (!blog) return <CircularProgress aria-label="Loading…" />;
  return (
    <Paper sx={{ p: 3, maxWidth: 700 }}>
      <Stack spacing={1.5}>
        <Typography variant="h5">{blog.title}</Typography>
        <Typography color="textSecondary">by {blog.author}</Typography>

        <Link href={blog.url}>{blog.url}</Link>
        <Typography variant="body2" color="textSecondary">
          Added by {blog.user?.name}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography>{blog.likes.length} likes</Typography>
          {currentUserId && (
            <Button variant="outlined" onClick={handleLikeClick}>
              {!userLikeBlog ? "like" : "unlike"}
            </Button>
          )}

          {canCurrentUserDeleteBlog && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleDeleteClick}
            >
              delete
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Blog;
