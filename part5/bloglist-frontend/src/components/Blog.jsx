import { useState } from "react";

const Blog = ({ blog, onToggleLike, currentUserId, onDeleteBlog }) => {
  const [visible, setVisible] = useState(false);
  const userLikeBlog = blog.likes.includes(currentUserId);
  const canCurrentUserDeleteBlog = blog.user.id === currentUserId;

  function handleLikeClick() {
    onToggleLike(blog.id, userLikeBlog);
  }

  function handleDeleteClick() {
    const isConfirmed = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`,
    );
    if (!isConfirmed) return;
    onDeleteBlog(blog.id);
  }
  return (
    <div className="blogContainer">
      <div>
        <span>
          {blog.title} {blog.author}
        </span>
        <button onClick={() => setVisible(!visible)}>
          {!visible ? "view" : "hide"}
        </button>
      </div>
      {visible && (
        <div>
          <p>{blog.url}</p>
          <p>
            <span>{blog.likes.length}</span>
            <button onClick={handleLikeClick}>
              {!userLikeBlog ? "like" : "unlike"}
            </button>
          </p>
          <p>{blog.user?.name}</p>
          {canCurrentUserDeleteBlog && (
            <button onClick={handleDeleteClick}>delete</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
