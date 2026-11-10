import { useState } from "react";

const Blog = ({ blog, onToggleLike, userId }) => {
  const [visible, setVisible] = useState(false);
  const userLikeBlog = blog.likes.includes(userId);

  function handleLikeClick() {
    onToggleLike(blog, userLikeBlog);
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
            {blog.likes.length}{" "}
            <button onClick={handleLikeClick}>
              {!userLikeBlog ? "like" : "unlike"}
            </button>
          </p>
          <p>{blog.user?.name}</p>
        </div>
      )}
    </div>
  );
};

export default Blog;
