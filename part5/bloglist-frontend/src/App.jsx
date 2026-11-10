import { useState, useEffect } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Blogs from "./components/Blogs";
import Togglable from "./components/Togglable";

function App() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  // type:"success"|"error"
  const [notification, setNotification] = useState({ type: "", message: "" });

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
  }

  async function handleCreateBlog({ title, author, url }) {
    try {
      const newBlog = await blogService.create({ title, author, url });
      setBlogs((prevBlogs) => [...prevBlogs, newBlog]);
      setNotification({
        type: "success",
        message: `A new blog: ${title} by ${author} added`,
      });
    } catch (error) {
      console.log(error.response);
      setNotification({
        type: "error",
        message: error.response?.data?.error || "Create blog failed",
      });
    }
  }

  async function handleToggleLike(blog, userLikeBlog) {
    try {
      let updatedBlog;
      if (!userLikeBlog) {
        updatedBlog = await blogService.likeBlog(blog.id);
      } else {
        updatedBlog = await blogService.unlikeBlog(blog.id);
      }
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === updatedBlog.id ? updatedBlog : blog,
        ),
      );
    } catch (error) {
      console.log(error.response);
      setNotification({
        type: "error",
        message: error.response?.data?.error || "update Like failed",
      });
    }
  }

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification} />
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p>
        {user.name} logged in <button onClick={handleLogout}>log out</button>
      </p>
      <div>
        <h2>create new</h2>
        <Togglable buttonLabel="create new blog">
          <BlogForm onCreateBlog={handleCreateBlog} />
        </Togglable>
      </div>

      <Blogs blogs={blogs} onToggleLike={handleToggleLike} userId={user.id} />
    </div>
  );
}

export default App;
