import { render, screen } from "@testing-library/react";
import Blog from "../components/Blog";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import blogService from "../services/blogs";

// 1. Mock API
vi.mock("../services/blogs", () => ({ default: { getById: vi.fn() } }));

test("unauthenticated users can view blog information but not buttons", async () => {
  // 2. Prepare test data
  const blog = {
    id: "123",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: ["user1", "user2"],
    user: {
      id: "user1",
      username: "mykyta",
      name: "xieyou",
    },
  };
  // 3. Mock the backend response
  blogService.getById.mockResolvedValue(blog);

  render(
    <MemoryRouter initialEntries={["/blogs/123"]}>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <Blog
              currentUserId={null}
              onToggleLike={vi.fn()}
              onDeleteBlog={vi.fn()}
            />
          }
        />
      </Routes>
    </MemoryRouter>,
  );
  // 4. Wait for the blog to load
  expect(
    await screen.findByText("Michael Chan: React patterns"),
  ).toBeInTheDocument();
  expect(screen.getByText("likes: 2")).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "like" }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "delete" }),
  ).not.toBeInTheDocument();
  expect(blogService.getById).toHaveBeenCalledWith("123");
});

test("authenticated users who are not the creator are shown only the like button", async () => {
  const blog = {
    id: "123",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: ["user1", "user2"],
    user: {
      id: "user1",
      username: "mykyta",
      name: "xieyou",
    },
  };
  blogService.getById.mockResolvedValue(blog);
  render(
    <MemoryRouter initialEntries={["/blogs/123"]}>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <Blog
              currentUserId={"user3"}
              onToggleLike={vi.fn()}
              onDeleteBlog={vi.fn()}
            />
          }
        />
      </Routes>
    </MemoryRouter>,
  );
  expect(
    await screen.findByRole("button", { name: "like" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "delete" }),
  ).not.toBeInTheDocument();
});

test("the blog’s creator is also shown the delete button", async () => {
  const blog = {
    id: "123",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: ["user1", "user2"],
    user: {
      id: "user1",
      username: "mykyta",
      name: "xieyou",
    },
  };
  blogService.getById.mockResolvedValue(blog);

  render(
    <MemoryRouter initialEntries={["/blogs/123"]}>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <Blog
              currentUserId={"user1"}
              onToggleLike={vi.fn()}
              onDeleteBlog={vi.fn()}
            />
          }
        />
      </Routes>
    </MemoryRouter>,
  );

  expect(
    await screen.findByRole("button", { name: "unlike" }),
  ).toBeInTheDocument();
  expect(
    await screen.findByRole("button", { name: "delete" }),
  ).toBeInTheDocument();
});
