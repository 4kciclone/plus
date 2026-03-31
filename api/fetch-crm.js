async function main() {
  const loginRes = await fetch("https://plus-sqxw.onrender.com/employee/login", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@plusinternet.com.br", password: "admin123" })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;

  console.log("---- Fetching /crm ----");
  const crmRes = await fetch("https://plus-sqxw.onrender.com/employee/crm", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  console.log("CRM Status:", crmRes.status);
  console.log("CRM Response:", await crmRes.text());
}
main();
