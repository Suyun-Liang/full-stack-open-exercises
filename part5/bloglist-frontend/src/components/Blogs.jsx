import Blog from "./Blog";
function Blogs({ blogs, onLike }) {
  return (
    <div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} onLike={onLike} />
      ))}
    </div>
  );
}

export default Blogs;
