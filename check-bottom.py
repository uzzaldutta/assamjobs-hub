with open(r"src/app/jobs/[id]/page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()
    print("".join(lines[-15:]))
