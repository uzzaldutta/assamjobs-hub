import os

with open("src/app/mock-test/[testId]/MockTestEngine.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import_stmt = 'import { StorageService } from "@/lib/storage";\n'
content = content.replace('import Link from "next/link";', 'import Link from "next/link";\n' + import_stmt)

# Update initial load
load_repl = """
  // 1. Initial Load & Recovery
  useEffect(() => {
    const init = async () => {
      try {
        const active = await StorageService.get<any>(storageKey);
        if (active) {
          if (Date.now() < active.expiresAt) {
            setSession({ token: active.sessionToken, expiresAt: active.expiresAt });
            setQuestions(active.questions);
            setAnswers(active.answers || {});
            setMarkedForReview(active.marked || {});
            setVisited(active.visited || {});
            setCurrentIndex(active.currentIndex || 0);
            setView("ACTIVE");
          } else {
            executeSubmission(active.sessionToken, active.answers || {});
          }
        }
      } catch (e) {}
    };
    init();
  }, []);
"""
import re
content = re.sub(r'\/\/ 1\. Initial Load & Recovery.*?\}, \[\]\);', load_repl, content, flags=re.DOTALL)

# Update Sync state to local storage when active
sync_repl = """
  // Sync state to local storage when active
  useEffect(() => {
    if (view === "ACTIVE" && session) {
      StorageService.set(storageKey, {
        sessionToken: session.token,
        expiresAt: session.expiresAt,
        questions,
        answers,
        marked: markedForReview,
        visited,
        currentIndex
      });
    }
  }, [view, answers, markedForReview, visited, currentIndex]);
"""
content = re.sub(r'\/\/ Sync state to local storage when active.*?\}, \[view, answers, markedForReview, visited, currentIndex\]\);', sync_repl, content, flags=re.DOTALL)

# Update localStorage.removeItem(storageKey)
content = content.replace('localStorage.removeItem(storageKey)', 'StorageService.remove(storageKey)')

with open("src/app/mock-test/[testId]/MockTestEngine.tsx", "w", encoding="utf-8") as f:
    f.write(content)
