let mockData = [
  { id: crypto.randomUUID(), title: "Test1", time: 1 },
  { id: crypto.randomUUID(), title: "Test2", time: 2 },
];

vi.mock("@/service/studyRecordService", () => ({
  fetchStudyRecord: vi.fn(() => {
    return Promise.resolve([...mockData]);
  }),
  insertStudy: vi.fn((newData) => {
    const item = { ...newData, id: crypto.randomUUID() };
    mockData.push(item);
    return Promise.resolve([item]);
  }),
  deleteStudy: vi.fn((id) => {
    mockData = mockData.filter((d) => d.id !== id);
    return Promise.resolve();
  }),
  fetchStudyIdFromTitle: vi.fn((v) => {
    const id = mockData.find((d) => d.title === v)?.id;
    return Promise.resolve(id);
  }),
  __esModule: true,
}));

import App from "@/App";
import { render, screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

beforeEach(() => {
  mockData = [
    { id: crypto.randomUUID(), title: "Test1", time: 1 },
    { id: crypto.randomUUID(), title: "Test2", time: 2 },
  ];
});

describe("App.tsxテスト", () => {
  it("タイトルが表示されていること", async () => {
    render(<App />);
    const result = await screen.findByText("学習記録一覧");
    expect(result).toBeInTheDocument();
  });

  it("フォームに学習内容と時間を入力して登録ボタンを押すと新たに記録が追加されていること", async () => {
    render(<App />);
    const result = await screen.findByText("学習記録一覧");
    expect(result).toBeInTheDocument();
    const titleField = screen.getByPlaceholderText("学習内容");
    await userEvent.type(titleField, "Test3");
    expect((titleField as HTMLInputElement).value).toBe("Test3");
    const timeField = screen.getByPlaceholderText("学習時間");
    await userEvent.type(timeField, "10");
    expect((timeField as HTMLInputElement).value).toBe("10");
    await userEvent.click(screen.getByRole("button", { name: "登録" }));

    await waitFor(async () => {
      const items = await screen.findAllByRole("listitem");
      expect(items).toHaveLength(3);
    });
  });

  it("削除ボタンを押すと学習記録が削除される", async () => {
    render(<App />);
    const item = await screen.findByText("Test2");
    const listItem = item.closest("li");
    const delete_button = within(listItem!).getByRole("button", {
      name: "削除",
    });
    await userEvent.click(delete_button);

    await waitFor(async () => {
      const items = await screen.findAllByRole("listitem");
      expect(items).toHaveLength(1);
    });
  });

  it("入力をしないで登録を押すとエラーが表示される", async () => {
    render(<App />);
    const h1 = await screen.findByText("学習記録一覧");
    expect(h1).toBeInTheDocument();
    const beforeErrorField =
      screen.queryByText("入力されていない項目があります。");
    expect(beforeErrorField).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "登録" }));
    await waitFor(() => {
      const afterErrorField =
        screen.queryByText("入力されていない項目があります。");
      console.log(afterErrorField);
      expect(afterErrorField).toBeInTheDocument();
    });
  });
});
