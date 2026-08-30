const fs = require('fs');

const file = 'src/app/admin/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update URL block
content = content.replace(
  /apply_url: urlInput\.value/g,
  'apply_url: json.data.apply_url || urlInput.value,\n                          official_pdf_url: json.data.official_pdf_url || formData.official_pdf_url'
);

// Update Text block
content = content.replace(
  /unique_description_assamese: json\.data\.unique_description_assamese \|\| formData\.unique_description_assamese,/g,
  'unique_description_assamese: json.data.unique_description_assamese || formData.unique_description_assamese,\n                          apply_url: json.data.apply_url || formData.apply_url,\n                          official_pdf_url: json.data.official_pdf_url || formData.official_pdf_url,'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed admin page fields');
