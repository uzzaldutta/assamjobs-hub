import json
with open('src/data/db.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
jobs = data.get('jobs', [])
study_materials = [j for j in jobs if j.get('category') == 'STUDY_MATERIAL' or j.get('job_type') == 'STUDY_MATERIAL']
for m in study_materials:
    print(m.get('title'), m.get('category'), m.get('job_type'))
