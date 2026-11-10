import Blog from "./Blog";
function Blogs({ blogs, onToggleLike, userId }) {
  return (
    <div>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          onToggleLike={onToggleLike}
          userId={userId}
        />
      ))}
    </div>
  );
}

export default Blogs;
