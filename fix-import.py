with open("src/app/admin/studio/questions/QuestionBankClient.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('from "../../actions"', 'from "../actions"')

with open("src/app/admin/studio/questions/QuestionBankClient.tsx", "w", encoding="utf-8") as f:
    f.write(content)
