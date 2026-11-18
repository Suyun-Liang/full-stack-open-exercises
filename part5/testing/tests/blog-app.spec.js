const { describe, beforeEach, test, expect } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "1998",
      },
    });
    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByLabel("username")).toBeVisible();
    await expect(page.getByLabel("password")).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "mluukkai", "1998");
      await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "mluukkai", "wrong");

      const errorDiv = page.locator(".error");
      await expect(errorDiv).toContainText("invalid username or password");
      await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");
      await expect(errorDiv).toHaveCSS("border-style", "solid");
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "mluukkai", "1998");
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(page, {
        title: "a note created by playwright",
        author: "Some one famous",
        url: "https://reactpatterns.com/",
      });
      await expect(
        page.getByText("a note created by playwright Some one famous"),
      ).toBeVisible();
    });

    describe("When a blog is added", () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, {
          title: "a note created by playwright",
          author: "Some one famous",
          url: "https://reactpatterns.com/",
        });
      });

      test("a blog can be liked", async ({ page }) => {
        await page.getByRole("button", { name: "view" }).click();
        await expect(page.getByText("0", { exact: true })).toBeVisible();
        await page.getByRole("button", { name: "like" }).click();
        await expect(page.getByText("1", { exact: true })).toBeVisible();
      });

      test("a blog can be deleted", async ({ page }) => {
        await page.getByRole("button", { name: "view" }).click();
        page.once("dialog", (dialog) => dialog.accept());
        await page.getByRole("button", { name: "delete" }).click();
        await expect(
          page.getByText("a note created by playwright Some one famous"),
        ).toHaveCount(0);
      });

      test("only creator user can delete blog", async ({ page, request }) => {
        await page.getByRole("button", { name: "log out" }).click();
        await expect(page.getByLabel("username")).toBeVisible();
        await expect(page.getByLabel("password")).toBeVisible();

        await request.post("http://localhost:3003/api/users", {
          data: {
            name: "New User",
            username: "newuser",
            password: "1998",
          },
        });

        await loginWith(page, "newuser", "1998");
        await expect(page.getByText("New User logged in")).toBeVisible();
        await expect(
          page.getByText("a note created by playwright Some one famous"),
        ).toBeVisible();
        await page.getByRole("button", { name: "view" }).click();
        await expect(page.getByRole("button", { name: "delete" })).toHaveCount(
          0,
        );
      });
    });

    describe("several blogs exist", () => {
      beforeEach(async ({ page, request }) => {
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

      test("blogs are arranged in the order according to the likes", async ({
        page,
      }) => {
        await page.reload();
        const blogs = page.locator(".blogContainer");
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
