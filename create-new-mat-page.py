code = """
import NewMaterialClient from "./NewMaterialClient";

export const metadata = {
  title: "Upload Material | Content Studio",
};

export default function NewMaterialPage() {
  return <NewMaterialClient />;
}
"""
import os
os.makedirs("src/app/admin/studio/materials/new", exist_ok=True)
with open("src/app/admin/studio/materials/new/page.tsx", "w", encoding="utf-8") as f:
    f.write(code)
