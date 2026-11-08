import Blog from "./Blog";
function Blogs({ blogs }) {
  return (
    <div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
}

export default Blogs;
