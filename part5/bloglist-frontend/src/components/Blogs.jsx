import Blog from "./Blog";
function Blogs({ blogs, onToggleLike, currentUserId, onDeleteBlog }) {
  return (
    <div>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          onToggleLike={onToggleLike}
          currentUserId={currentUserId}
          onDeleteBlog={onDeleteBlog}
        />
      ))}
    </div>
  );
}

export default Blogs;
