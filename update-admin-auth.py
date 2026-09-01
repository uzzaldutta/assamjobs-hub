import re

with open("src/app/admin/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Import adminLogin from actions
if "adminLogin" not in content:
    content = content.replace(
        'import PrepDashboard from "@/components/admin/PrepDashboard";',
        'import PrepDashboard from "@/components/admin/PrepDashboard";\nimport { adminLogin } from "./actions";'
    )

# 2. Update verifyToken to use adminLogin
verify_token_new = """
  const verifyToken = async (token: string) => {
    setIsLoggingIn(true);
    try {
      // Use the secure server action to set the HTTP-only cookie
      const res = await adminLogin(token);
      if (res.success) {
        setIsAuthenticated(true);
        localStorage.setItem("adminToken", token); // keeping this for legacy routes if any
        fetchJobs();
        fetchBanners();
        fetchBannedKeywords();
      } else {
        alert("Invalid password");
        localStorage.removeItem("adminToken");
      }
    } catch(err) {
      console.error(err);
    } finally {
      setIsLoggingIn(false);
    }
  };
"""

content = re.sub(
    r'const verifyToken = async \(token: string\) => \{.*?\n  \};',
    verify_token_new.strip(),
    content,
    flags=re.DOTALL
)

with open("src/app/admin/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated admin page auth.")
