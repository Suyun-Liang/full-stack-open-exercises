async function loginWith(page, username, password) {
  await page.getByLabel("username").fill(username);
  await page.getByLabel("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
}

async function createBlog(page, blog) {
  await page.getByRole("button", { name: "create new blog" }).click();
  await page.getByLabel("title").fill(blog.title);
  await page.getByLabel("author").fill(blog.author);
  await page.getByLabel("url").fill(blog.url);
  await page.getByRole("button", { name: "create" }).click();
  await page.getByText(`${blog.title} ${blog.author}`).waitFor();
}

module.exports = { loginWith, createBlog };
