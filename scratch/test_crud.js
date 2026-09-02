async function test() {
  console.log("Creating doc...");
  const postRes = await fetch("http://localhost:3000/api/quotations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      doc_type: "quotation",
      client_name: "Test Client",
      doc_date: new Date().toISOString().slice(0, 10),
      items: [{ description: "Test item", qty: 1, rate: 100 }]
    })
  });
  if (!postRes.ok) {
    console.error("POST failed", await postRes.text());
    return;
  }
  const data = await postRes.json();
  const id = data.id;
  console.log("Created doc with ID:", id);

  console.log("Editing doc...");
  const putRes = await fetch(`http://localhost:3000/api/quotations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_name: "Test Client Edited",
      doc_date: new Date().toISOString().slice(0, 10),
      items: [{ description: "Test item edited", qty: 2, rate: 150 }]
    })
  });
  if (!putRes.ok) {
    console.error("PUT failed", await putRes.text());
  } else {
    console.log("PUT successful");
  }

  console.log("Deleting doc...");
  const delRes = await fetch(`http://localhost:3000/api/quotations/${id}`, {
    method: "DELETE"
  });
  if (!delRes.ok) {
    console.error("DELETE failed", await delRes.text());
  } else {
    console.log("DELETE successful");
  }
}

test();
