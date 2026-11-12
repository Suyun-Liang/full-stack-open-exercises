import { render, screen } from "@testing-library/react";
import Blog from "../components/Blog";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
const blog = {
  id: "5a422a851b54a676234d17f7",
  title: "React patterns",
  author: "Michael Chan",
  url: "https://reactpatterns.com/",
  likes: [],
  user: {
    id: "6aea45c7c3493bfff9977be9",
    username: "mykyta",
    name: "xieyou",
  },
};

test("renders the blog's title and author", () => {
  render(<Blog blog={blog} />);
  const element = screen.getByText("React patterns Michael Chan");
  expect(element).toBeVisible();
  expect(screen.queryByText("0")).not.toBeInTheDocument();
  expect(
    screen.queryByText("https://reactpatterns.com/"),
  ).not.toBeInTheDocument();
});

test("shows blog URL and likes after clicking view", async () => {
  const mockHandler = vi.fn();
  render(
    <Blog
      blog={blog}
      currentUserId="6aea45c7c3493bfff9977be9"
      onToggleLike={mockHandler}
    />,
  );

  const user = userEvent.setup();

  expect(screen.queryByText("0")).not.toBeInTheDocument();
  expect(
    screen.queryByText("https://reactpatterns.com/"),
  ).not.toBeInTheDocument();

  const viewButton = screen.getByText("view");
  await user.click(viewButton);

  expect(screen.getByText("0")).toBeVisible();
  expect(screen.getByText("https://reactpatterns.com/")).toBeVisible();
});
