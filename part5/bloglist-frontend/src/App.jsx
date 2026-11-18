import { useState, useEffect, useRef } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Blogs from "./components/Blogs";
import { Link, Route, Routes, useMatch, useNavigate } from "react-router-dom";
import Blog from "./components/Blog";

function App() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  // type:"success"|"error"
  const [notification, setNotification] = useState({ type: "", message: "" });
  const sortedBlogs = [...blogs].sort(
    (a, b) => b.likes.length - a.likes.length,
  );
  const navigate = useNavigate();
  // get blogs
  useEffect(() => {
    async function fetchBlogs() {
      const blogs = await blogService.getAll();
      setBlogs(blogs);
    }
    fetchBlogs();
  }, []);

  // renew the login state
  useEffect(() => {
    const rawLoggedInUser = window.localStorage.getItem("loggedBlogUser");
    if (rawLoggedInUser) {
      const loggedInUser = JSON.parse(rawLoggedInUser);
      setUser(loggedInUser);
      blogService.setToken(loggedInUser.token);
    }
  }, []);

  // clear notification
  useEffect(() => {
    if (!notification.message) return;
    const timer = window.setTimeout(() => {
      setNotification({ type: "", message: "" });
    }, 2000);

    return () => clearTimeout(timer);
  }, [notification]);

  async function handleLogin({ username, password }) {
    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedBlogUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
    } catch (error) {
      console.log(error.response);
      setNotification({
        type: "error",
        message: error.response?.data?.error || "Login failed",
      });
    }
  }

  function handleLogout() {
    setUser(null);
    window.localStorage.removeItem("loggedBlogUser");
    blogService.setToken(null);
    navigate("/");
  }

  async function handleCreateBlog({ title, author, url }) {
    try {
      const newBlog = await blogService.create({ title, author, url });
      setBlogs((prevBlogs) => [...prevBlogs, newBlog]);
      setNotification({
        type: "success",
        message: `A new blog: ${title} by ${author} added`,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
      console.log(error.response);
      setNotification({
        type: "error",
        message: error.response?.data?.error || "Create blog failed",
      });
    }
  }

  async function handleToggleLike(blogId, userLikeBlog) {
    try {
      let updatedBlog;
      if (!userLikeBlog) {
        updatedBlog = await blogService.likeBlog(blogId);
      } else {
        updatedBlog = await blogService.unlikeBlog(blogId);
      }
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === updatedBlog.id ? updatedBlog : blog,
        ),
      );
      return updatedBlog;
    } catch (error) {
      console.log(error.response);
      setNotification({
        type: "error",
        message: error.response?.data?.error || "update Like failed",
      });
    }
  }

  async function handleDeleteBlog(blogId) {
    try {
      await blogService.deleteBlog(blogId);
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
      return true;
    } catch (error) {
      console.log(error.response);
      setNotification({
        type: "error",
        message: error.response?.data?.error || "delete blog failed",
      });
      return false;
    }
  }

  return (
    <div>
      <nav>
        <Link to="/">blogs</Link>
        {!user ? (
          <Link to="/login">login</Link>
        ) : (
          <>
            <Link to="/create">new blog</Link>
            <button onClick={handleLogout}>log out</button>
          </>
        )}
      </nav>
      <Notification notification={notification} />
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h2>blogs</h2>
              <Blogs blogs={sortedBlogs} />
            </div>
          }
        />
        <Route
          path="/login"
          element={
            <div>
              <h2>Log in to application</h2>
              <LoginForm onLogin={handleLogin} />
            </div>
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              onToggleLike={handleToggleLike}
              currentUserId={user?.id}
              onDeleteBlog={handleDeleteBlog}
            />
          }
        />
        <Route
          path="/create"
          element={
            <div>
              <h2>create new</h2>
              <BlogForm onCreateBlog={handleCreateBlog} />
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
