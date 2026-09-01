import re

with open("src/app/practice/[topicId]/PracticeEngineClient.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('setError(err.message || "Failed to start session.");', 'setError(String(err.message || "Failed to start session."));')
content = content.replace('setError("Failed to restart.");', 'setError("Failed to restart.");') # Ensure this one is fine
# Wait, let's just make sure all err.message are cast to string or handled properly
content = content.replace('err.message', 'String(err.message)')
# Or I could just change the error interface
with open("src/app/practice/[topicId]/PracticeEngineClient.tsx", "w", encoding="utf-8") as f:
    f.write(content)
