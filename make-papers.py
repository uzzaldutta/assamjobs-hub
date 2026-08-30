import os
import shutil

# Create previous-papers directory
os.makedirs('src/app/previous-papers', exist_ok=True)

# Read study-materials page and adjust it
with open('src/app/study-materials/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace StudyMaterialsLibrary with PreviousPapersLibrary
content = content.replace("StudyMaterialsLibrary", "PreviousPapersLibrary")
content = content.replace("STUDY_MATERIAL", "PREVIOUS_PAPERS")
content = content.replace("Interactive Study Library", "Previous Year Question Papers")
content = content.replace("Select a subject to dive into high-quality, auto-generated interactive HTML guides.", "Download official previous year question papers for various exams.")
content = content.replace("study-materials", "jobs") # Link to the standard job view
content = content.replace("Read Interactive Book", "View Question Paper")
content = content.replace("BookOpen", "FileText")

with open('src/app/previous-papers/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Created /previous-papers/page.tsx")
