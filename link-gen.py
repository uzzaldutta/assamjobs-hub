with open("src/app/admin/studio/layout.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'href: "/admin/studio/questions/import",',
    'href: "/admin/studio/questions/import",\n    icon: <UploadCloud size={18} />\n  },\n  {\n    label: "AI Factory",\n    href: "/admin/studio/generator",'
)
content = content.replace('<UploadCloud size={18} />\n  },\n  {\n    label: "AI Factory",', 'label: "AI Factory",')

with open("src/app/admin/studio/layout.tsx", "w", encoding="utf-8") as f:
    f.write(content)
