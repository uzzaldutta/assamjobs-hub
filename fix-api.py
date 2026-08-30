with open('src/app/api/admin/add-job/route.ts', 'r', encoding='utf-8') as f:
    content = f.read()

old_check = """    if (!hasVacancies && !hasLastDate) {
      return NextResponse.json({ 
        success: false, 
        error: "Strict Mode Active: You must provide a Number of Posts (Vacancies) OR a Last Date of Submission to add this feed." 
      }, { status: 400 });
    }"""

new_check = """    if (!hasVacancies && !hasLastDate && data.category !== 'STUDY_MATERIAL' && data.category !== 'PREVIOUS_PAPERS') {
      return NextResponse.json({ 
        success: false, 
        error: "Strict Mode Active: You must provide a Number of Posts (Vacancies) OR a Last Date of Submission to add this feed." 
      }, { status: 400 });
    }"""

content = content.replace(old_check, new_check)

with open('src/app/api/admin/add-job/route.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed API route validation")
