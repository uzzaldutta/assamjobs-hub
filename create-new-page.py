import os
os.makedirs("src/app/admin/studio/questions/new", exist_ok=True)
wrapper = """
import QuestionEditorClient from "./QuestionEditorClient";

export const metadata = {
  title: "New Question | Content Studio",
};

export default function NewQuestionPage() {
  return <QuestionEditorClient />;
}
"""
with open("src/app/admin/studio/questions/new/page.tsx", "w", encoding="utf-8") as f:
    f.write(wrapper)
