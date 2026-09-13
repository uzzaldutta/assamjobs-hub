import os
def search_files(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith((".ts", ".tsx", ".js")):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        if "MOCK_TEST" in content and "insert" in content:
                            print(f"Match: {path}")
                except:
                    pass
search_files("src")
