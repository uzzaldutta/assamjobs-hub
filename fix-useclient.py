code = """"use client";
"""
with open("src/app/practice/[topicId]/PracticeEngineClient.tsx", "r", encoding="utf-8") as f:
    original = f.read()
    
with open("src/app/practice/[topicId]/PracticeEngineClient.tsx", "w", encoding="utf-8") as f:
    f.write(code + "\n" + original)
