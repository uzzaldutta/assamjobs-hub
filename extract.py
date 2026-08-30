import json

transcript_path = r'C:\Users\SONY\.gemini\antigravity\brain\c32e4699-7971-4328-8aa4-075b27288892\.system_generated\logs\transcript_full.jsonl'

with open(transcript_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for line in reversed(lines):
    data = json.loads(line)
    if data.get('source') == 'USER_EXPLICIT' and 'add these to study material section' in data.get('content', ''):
        content = data['content']
        # The content has 4 HTML blocks separated by <!DOCTYPE html>
        html_blocks = content.split('<!DOCTYPE html>')
        
        # We ignore the first block (it's the text before the first HTML)
        materials = []
        for block in html_blocks[1:]:
            html = '<!DOCTYPE html>' + block
            
            # Extract title from <title> tag
            title = "Study Material"
            import re
            title_match = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE)
            if title_match:
                title = title_match.group(1).replace(' – Assam Entrance Exams', '').replace(' | Assam Job Hub', '').replace(' — Complete Study Guide for Competitive Exams', '').replace(' – Competitive Exam Book', '').strip()
            
            materials.append({
                "title": title,
                "html": html.strip()
            })
            
        import json
        with open('extracted_materials.json', 'w', encoding='utf-8') as out:
            json.dump(materials, out)
        print(f"Extracted {len(materials)} materials.")
        break
