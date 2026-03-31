async function main() {
  const loginRes = await fetch("https://plus-sqxw.onrender.com/employee/login", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@plusinternet.com.br", password: "admin123" })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;

  console.log("Token:", token.substring(0, 15) + "...");
  
  // Find a subscription
  const crmRes = await fetch("https://plus-sqxw.onrender.com/employee/crm", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const users = await crmRes.json();
  const subId = users[0].subscriptions[0].id;
  console.log("Sub ID:", subId);

  // Test PUT
  const putRes = await fetch(`https://plus-sqxw.onrender.com/employee/subscriptions/${subId}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ status: "ACTIVE", installationDate: new Date().toISOString() })
  });
  console.log("PUT Status:", putRes.status);
  console.log("PUT Response:", await putRes.text());
}
main();
