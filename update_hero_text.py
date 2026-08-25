import codecs

with codecs.open('src/components/LanguageContext.tsx', 'r', 'utf-8') as f:
    content = f.read()

# Replace English hero text
content = content.replace(
    'hero_title: "Accelerate your career in Assam",',
    'hero_title: "Unlock Your Dream Job in Assam",'
)
content = content.replace(
    'hero_subtitle: "Get instant updates on Govt & Private jobs, take free mock tests, and use AI tools.",',
    'hero_subtitle: "Get live Govt & Private job alerts, download premium study materials, and outsmart the competition with our free AI tools.",'
)

# Replace Assamese hero text (approximate translation to maintain alignment)
content = content.replace(
    'hero_title: "অসমত আপোনাৰ কেৰিয়াৰ ত্বৰান্বিত কৰক",',
    'hero_title: "অসমত আপোনাৰ সপোনৰ চাকৰি আনলক কৰক",'
)
content = content.replace(
    'hero_subtitle: "চৰকাৰী আৰু ব্যক্তিগত চাকৰিৰ তৎক্ষণাৎ আপডেট পাওক, বিনামূলীয়া মক টেষ্ট দিয়ক আৰু AI সঁজুলি ব্যৱহাৰ কৰক।",',
    'hero_subtitle: "চৰকাৰী আৰু ব্যক্তিগত চাকৰিৰ তৎক্ষণাৎ আপডেট পাওক, প্ৰিমিয়াম অধ্যয়ন সামগ্ৰী ডাউনলোড কৰক আৰু AI সঁজুলি ব্যৱহাৰ কৰক।",'
)

with codecs.open('src/components/LanguageContext.tsx', 'w', 'utf-8') as f:
    f.write(content)

print("Hero text updated.")
