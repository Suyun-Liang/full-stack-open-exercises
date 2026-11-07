import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

function App() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const filteredBlogs = !user
    ? null
    : blogs.filter((blog) => blog.user.username === user.username);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const rawLoggedInUser = window.localStorage.getItem("loggedBlogUser");
    if (rawLoggedInUser) {
      const loggedInUser = JSON.parse(rawLoggedInUser);
      setUser(loggedInUser);
      blogService.setToken(loggedInUser.token);
    }
  }, []);

  function clearLoginForm() {
    setUsername("");
    setPassword("");
  }

  function clearBlogForm() {
    setTitle("");
    setAuthor("");
    setUrl("");
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (!username || !password) {
      window.alert("username and password must be provided");
      return;
    }
    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedBlogUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      clearLoginForm();
    } catch (error) {
      console.log(error);
    }
  }

  function handleLogout() {
    setUser(null);
    window.localStorage.removeItem("loggedBlogUser");
    blogService.setToken(null);
  }

  async function handleCreateBlog(e) {
    e.preventDefault();
    if (!title || !url) {
      window.alert("title and url must be provided");
      return;
    }
    try {
      await blogService.create({ title, author, url });
      const blogs = await blogService.getAll();
      setBlogs(blogs);

      clearBlogForm();
    } catch (error) {
      console.log(error);
    }
  }

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in <button onClick={handleLogout}>log out</button>
      </p>

      <div>
        <h2>create new</h2>
        <form onSubmit={handleCreateBlog}>
          <div>
            <label>
              title
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
          </div>
          <div>
            <label>
              author
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </label>
            <div>
              <label>
                url
                <input value={url} onChange={(e) => setUrl(e.target.value)} />
              </label>
            </div>
          </div>
          <button type="submit">create</button>
        </form>
      </div>

      {filteredBlogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
}

export default App;
