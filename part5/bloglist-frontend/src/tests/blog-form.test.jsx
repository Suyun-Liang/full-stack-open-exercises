import { render, screen } from "@testing-library/react";
import BlogForm from "../components/BlogForm";
import userEvent from "@testing-library/user-event";

const newBlog = {
  title: "Go To Statement Considered Harmful",
  author: "Edsger W. Dijkstra",
  url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
};

test("create form event receives correct properties", async () => {
  const mockHandler = vi.fn();
  render(<BlogForm onCreateBlog={mockHandler} />);
  const user = userEvent.setup();

  const titleInput = screen.getByLabelText("title");
  const authorInput = screen.getByLabelText("author");
  const urlInput = screen.getByLabelText("url");
  const createButton = screen.getByText("create");

  await user.type(titleInput, newBlog.title);
  await user.type(authorInput, newBlog.author);
  await user.type(urlInput, newBlog.url);
  await user.click(createButton);

  expect(mockHandler.mock.calls).toHaveLength(1);
  expect(mockHandler).toHaveBeenCalledWith({
    title: newBlog.title,
    author: newBlog.author,
    url: newBlog.url,
  });
});
