import re

with open("src/app/admin/studio/ingestion/actions.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("""    });

    }
  }

  // Mark queue item as APPROVED""", """    });

  }

  // Mark queue item as APPROVED""")

with open("src/app/admin/studio/ingestion/actions.ts", "w", encoding="utf-8") as f:
    f.write(content)
