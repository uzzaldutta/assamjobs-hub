import re

with open('src/app/admin/page.tsx', 'r') as f:
    content = f.read()

# Replace in URL Autofill block
url_pattern = r'apply_url: urlInput\.value\n\s*\}\);'
url_repl = 'apply_url: json.data.apply_url || urlInput.value,\n                          official_pdf_url: json.data.official_pdf_url || formData.official_pdf_url\n                        });'
content = re.sub(url_pattern, url_repl, content)

# Replace in Text Autofill block
text_pattern = r'unique_description_assamese: json\.data\.unique_description_assamese \|\| formData\.unique_description_assamese,\n\s*\}\);'
text_repl = 'unique_description_assamese: json.data.unique_description_assamese || formData.unique_description_assamese,\n                          apply_url: json.data.apply_url || formData.apply_url,\n                          official_pdf_url: json.data.official_pdf_url || formData.official_pdf_url\n                        });'
content = re.sub(text_pattern, text_repl, content)

with open('src/app/admin/page.tsx', 'w') as f:
    f.write(content)

print('Success')
