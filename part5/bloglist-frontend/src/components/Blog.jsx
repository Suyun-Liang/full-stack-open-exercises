import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import blogService from "../services/blogs";

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

  if (!blog) return <p>Loading...</p>;
  return (
    <div className="blogContainer">
      <div>
        <h2>
          {blog.author}: {blog.title}
        </h2>
      </div>
      <div>
        <a href={blog.url}>{blog.url}</a>
        <p>
          <span>likes: {blog.likes.length}</span>
          {currentUserId && (
            <button onClick={handleLikeClick}>
              {!userLikeBlog ? "like" : "unlike"}
            </button>
          )}
        </p>
        <p>{blog.user?.name}</p>
        {canCurrentUserDeleteBlog && (
          <button onClick={handleDeleteClick}>delete</button>
        )}
      </div>
    </div>
  );
};

export default Blog;
