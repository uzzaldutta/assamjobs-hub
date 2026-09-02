with open(r"src/app/jobs/[id]/page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "return (" in line:
            print("".join(lines[i-2:i+8]))
