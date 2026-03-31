

async function main() {
  let attempt = 0;
  while (attempt < 20) {
    try {
      console.log(`Attempt ${attempt+1}...`);
      const loginRes = await fetch("https://plus-sqxw.onrender.com/employee/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@plusinternet.com.br", password: "admin123" })
      });
      const loginData = await loginRes.json();
      const token = loginData.token;

      const crmRes = await fetch("https://plus-sqxw.onrender.com/employee/crm", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const users = await crmRes.json();
      const subId = users[0].subscriptions[0].id;

      const putRes = await fetch(`https://plus-sqxw.onrender.com/employee/subscriptions/${subId}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACTIVE", installationDate: new Date().toISOString() })
      });
      
      const status = putRes.status;
      if (status !== 404) {
        console.log("Success! Status:", status);
        const text = await putRes.text();
        console.log("Response:", text);
        process.exit(0);
      }
    } catch (e) {
      console.error(e.message);
    }
    await new Promise(r => setTimeout(r, 10000));
    attempt++;
  }
}
main();
