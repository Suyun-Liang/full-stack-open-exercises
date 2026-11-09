import { useState } from "react";

const Blog = ({ blog, onLike }) => {
  const [visible, setVisible] = useState(false);

  function handleLikeClick() {
    onLike(blog);
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
            {blog.likes} <button onClick={handleLikeClick}>likes</button>
          </p>
          <p>{blog.user?.name}</p>
        </div>
      )}
    </div>
  );
};

export default Blog;
