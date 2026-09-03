import fs

with open("src/app/layout.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add import
content = content.replace('import NotificationBell from "@/components/NotificationBell";', 'import NotificationBell from "@/components/NotificationBell";\nimport AccountPlaceholder from "@/components/AccountPlaceholder";')

# Replace the comment with the component
content = content.replace('{/* Removed Sign In button per user request */}', '{/* Optional Personalization Placeholder (No Auth Logic) */}\n                    <AccountPlaceholder />')

with open("src/app/layout.tsx", "w", encoding="utf-8") as f:
    f.write(content)
