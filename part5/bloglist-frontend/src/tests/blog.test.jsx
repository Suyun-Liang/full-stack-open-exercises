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
  // 5. Wait for the blog to load
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

//  test("renders the blog's title and author", () => {
//   render(<Blog blog={blog} />);
//   const element = screen.getByText("React patterns Michael Chan");
//   expect(element).toBeVisible();
//   expect(screen.queryByText("0")).not.toBeInTheDocument();
//   expect(
//     screen.queryByText("https://reactpatterns.com/"),
//   ).not.toBeInTheDocument();
// });

// test("shows blog URL and likes after clicking view", async () => {
//   const mockHandler = vi.fn();
//   render(
//     <Blog
//       blog={blog}
//       currentUserId="6aea45c7c3493bfff9977be9"
//       onToggleLike={mockHandler}
//     />,
//   );

//   const user = userEvent.setup();

//   expect(screen.queryByText("0")).not.toBeInTheDocument();
//   expect(
//     screen.queryByText("https://reactpatterns.com/"),
//   ).not.toBeInTheDocument();

//   const viewButton = screen.getByText("view");
//   await user.click(viewButton);

//   expect(screen.getByText("0")).toBeVisible();
//   expect(screen.getByText("https://reactpatterns.com/")).toBeVisible();
// });

// test("like eventHandler called twice after clicking twice", async () => {
//   const mockHandler = vi.fn();
//   render(
//     <Blog
//       blog={blog}
//       currentUserId="6aea45c7c3493bfff9977be9"
//       onToggleLike={mockHandler}
//     />,
//   );

//   const user = userEvent.setup();
//   const viewButton = screen.getByText("view");
//   await user.click(viewButton);
//   const likeButton = screen.getByText("like");
//   await user.click(likeButton);
//   await user.click(likeButton);

//   expect(mockHandler.mock.calls).toHaveLength(2);
// });
