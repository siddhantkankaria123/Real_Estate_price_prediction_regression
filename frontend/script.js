const API_BASE = "http://localhost:5000";

// Populate dropdown
fetch(`${API_BASE}/get_locations`)
  .then(res => res.json())
  .then(data => {
    const select = document.getElementById("location");
    data.locations.forEach(loc => {
      const option = document.createElement("option");
      option.value = loc;
      option.textContent = loc;
      select.appendChild(option);
    });
  });

// Handle form submit
document.getElementById("predict-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const input = {
    location: document.getElementById("location").value,
    sqft: parseFloat(document.getElementById("sqft").value),
    bhk: parseInt(document.getElementById("bhk").value),
    bath: parseInt(document.getElementById("bath").value)
  };

  fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  })
    .then(res => res.json())
    .then(data => {
      const result = document.getElementById("result");
      if (data.estimated_price) {
        result.textContent = `🏷 Estimated Price: ₹${data.estimated_price} lakhs`;
      } else {
        result.textContent = `❌ Error: ${data.error || "Something went wrong"}`;
      }
    })
    .catch(err => {
      console.error("Request failed:", err);
      document.getElementById("result").textContent = "❌ Error reaching server.";
    });
});
