import os
def search_files(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith((".ts", ".tsx", ".js")):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        if "prep_mock_test" in content and "jobs" in content:
                            print(f"Match: {path}")
                except:
                    pass
search_files("src")
