const { describe, beforeEach, test, expect } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    const res = await request.post("/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "1998",
      },
    });
    await expect(res).toBeOK();
    await page.goto("/login");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByLabel("username")).toBeVisible();
    await expect(page.getByLabel("password")).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "mluukkai", "1998");
      await expect(page).toHaveURL("/");
      await expect(page.getByRole("link", { name: "new blog" })).toBeVisible();
      await expect(page.getByRole("button", { name: "log out" })).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "mluukkai", "wrong");
      const errorDiv = page.locator(".error");
      await expect(errorDiv).toBeVisible();
      await expect(errorDiv).toContainText("invalid username or password");
      await expect(page).toHaveURL("/login");
      await expect(page.getByRole("button", { name: "log out" })).toHaveCount(
        0,
      );
      await expect(page.getByRole("link", { name: "new blog" })).toHaveCount(0);
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "mluukkai", "1998");
    });

    test("a new blog can be created", async ({ page }) => {
      await page.getByRole("link", { name: "new blog" }).click();
      await expect(page).toHaveURL("/create");
      await expect(page.getByRole("button", { name: "create" })).toBeVisible();
      await createBlog(page, {
        title: "a note created by playwright",
        author: "Some one famous",
        url: "https://reactpatterns.com/",
      });
      await expect(page).toHaveURL("/");
      const successDiv = page.locator(".success");
      await expect(successDiv).toBeVisible();
      await expect(successDiv).toContainText(
        "A new blog: a note created by playwright by Some one famous added",
      );
      await expect(
        page.getByRole("link", { name: "a note created by playwright" }),
      ).toBeVisible();
      await expect(page.getByRole("listitem")).toHaveCount(1);
    });

    describe("When a blog is added", () => {
      beforeEach(async ({ page }) => {
        await page.getByRole("link", { name: "new blog" }).click();
        await createBlog(page, {
          title: "a note created by playwright",
          author: "Some one famous",
          url: "https://reactpatterns.com/",
        });
        await expect(page).toHaveURL("/");
      });

      test("a blog can be liked", async ({ page }) => {
        await page
          .getByRole("link", { name: "a note created by playwright" })
          .click();
        await expect(page).toHaveURL(/\/blogs\/.+/);
        await expect(page.getByText("likes: 0")).toBeVisible();
        await page.getByRole("button", { name: "like" }).click();
        await expect(page.getByText("likes: 1")).toBeVisible();
        await expect(
          page.getByRole("button", { name: "unlike" }),
        ).toBeVisible();
      });

      test("a blog can be deleted", async ({ page }) => {
        await page
          .getByRole("link", { name: "a note created by playwright" })
          .click();
        await expect(page).toHaveURL(/\/blogs\/.+/);
        await expect(
          page.getByRole("button", { name: "delete" }),
        ).toBeVisible();
        page.once("dialog", (dialog) => dialog.accept());
        await page.getByRole("button", { name: "delete" }).click();
        await expect(page).toHaveURL("/");
        await expect(page.getByRole("listitem")).toHaveCount(0);
      });

      test("a non-creator cannot see the delete button", async ({
        page,
        request,
      }) => {
        await page.getByRole("button", { name: "log out" }).click();
        await request.post("/api/users", {
          data: {
            name: "New User",
            username: "newuser",
            password: "1998",
          },
        });
        await page.getByRole("link", { name: "login" }).click();
        await loginWith(page, "newuser", "1998");
        await page
          .getByRole("link", { name: "a note created by playwright" })
          .click();
        await expect(page.getByRole("button", { name: "like" })).toBeVisible();
        await expect(page.getByRole("button", { name: "delete" })).toHaveCount(
          0,
        );
      });
    });

    describe("several blogs exist", () => {
      beforeEach(async ({ request }) => {
        const response = await request.post("/api/users", {
          data: {
            username: "user1",
            name: "User One",
            password: "password",
          },
        });
        const user1 = await response.json();
        const response2 = await request.post("/api/users", {
          data: {
            username: "user2",
            name: "User Two",
            password: "password",
          },
        });
        const user2 = await response2.json();
        const response3 = await request.post("/api/users", {
          data: {
            username: "user3",
            name: "User Three",
            password: "password",
          },
        });
        const user3 = await response3.json();

        await request.post("/api/testing/blogs", {
          data: {
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
            likes: [],
            user: user1.id,
          },
        });
        await request.post("/api/testing/blogs", {
          data: {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: [user1.id, user3.id],
            user: user1.id,
          },
        });
        await request.post("/api/testing/blogs", {
          data: {
            title: "First class tests",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
            likes: [user3.id, user1.id, user2.id],
            user: user2.id,
          },
        });
      });

      test("blogs are sorted by likes in descending order", async ({
        page,
      }) => {
        await page.reload();
        const blogs = page.getByRole("listitem");
        await expect(blogs).toHaveCount(3);
        await expect(blogs.nth(0)).toContainText("First class tests");
        await expect(blogs.nth(1)).toContainText("Canonical string reduction");
        await expect(blogs.nth(2)).toContainText(
          "Go To Statement Considered Harmful",
        );
      });
    });
  });
});
