window.onload = async function () {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("orderId");
    const paymentId = params.get("paymentId");


    document.getElementById("orderId").innerText = orderId;
    document.getElementById("paymentId").innerText = paymentId;
    document.getElementById("dateTime").innerText = new Date().toLocaleString();
  
    try {
        const res = await fetch(`/payment/local-payment/${paymentId}`);
const data = await res.json();


  
      if (data.success) {
        document.getElementById("billNumber").innerText = data.payment.billNumber;

        const storedItems = data.payment.notes?.items || data.payment.items || [];
        const container = document.getElementById("items");
        let total = 0;
  
        storedItems.forEach(item => {
          const qty = parseInt(item.quantity);
          const price = parseInt(item.price);
          const name = item.name;
          const subtotal = qty * price;
          total += subtotal;
  
          const div = document.createElement("div");
          div.className = "order-item";
          div.innerHTML = `<span>${name} x ${qty}</span><span>₹${subtotal}</span>`;
          container.appendChild(div);
        });
  
        document.getElementById("total").innerText = total;
      } else {
        alert("Unable to fetch payment details");
      }
    } catch (err) {
      console.error("Error loading receipt:", err);
      alert("Failed to load receipt.");
    }
  };
  