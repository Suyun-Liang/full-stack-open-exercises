import Blogs from "./Blogs";

function Home(params) {
  return (
    <div>
      <h2>blogs</h2>
      <Blogs
        blogs={sortedBlogs}
        onToggleLike={handleToggleLike}
        currentUserId={user.id}
        onDeleteBlog={handleDeleteBlog}
      />
    </div>
  );
}

export default Home;
