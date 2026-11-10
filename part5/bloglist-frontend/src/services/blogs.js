import axios from "axios";
const baseUrl = "/api/blogs";
let token = null;

function setToken(newToken) {
  if (newToken === null) {
    token = null;
  } else {
    token = `Bearer ${newToken}`;
  }
}

async function getAll() {
  const response = await axios.get(baseUrl);
  return response.data;
}

async function create(blog) {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, blog, config);
  return response.data;
}

async function update(blogId, updateBlog) {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.put(`${baseUrl}/${blogId}`, updateBlog, config);
  return response.data;
}

async function likeBlog(blogId) {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.put(
    `${baseUrl}/${blogId}/likes/me`,
    undefined,
    config,
  );
  return response.data;
}
async function unlikeBlog(blogId) {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(`${baseUrl}/${blogId}/likes/me`, config);
  return response.data;
}

export default { getAll, setToken, create, update, likeBlog, unlikeBlog };
