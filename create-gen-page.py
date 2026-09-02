code = """
import GeneratorClient from "./GeneratorClient";

export const metadata = {
  title: "AI Question Generator | Content Studio",
};

export default function GeneratorPage() {
  return <GeneratorClient />;
}
"""
with open("src/app/admin/studio/generator/page.tsx", "w", encoding="utf-8") as f:
    f.write(code)
