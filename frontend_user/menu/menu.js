


// Build items from the DB instead of hardcoded arrays
let allItems = [];
const quantities = {};

function slugify(name) {
  return name.toLowerCase().trim().replace(/\s+/g, "-");
}

function createCard(item, container) {
  const index = slugify(item.name);
  if (!(index in quantities)) quantities[index] = 0;

  const card = document.createElement("div");
  card.className = "item-card";
  const imgSrc = `/images/${(item.img || "").trim()}`; // served by Express
  const price = Number(item.price) || 0;

  card.innerHTML = `
    <img src="${imgSrc}" alt="${item.name}">
    <h3>${item.name}</h3>
    <p>${item.desc || ""}</p>
    <div class="price">₹${price}</div>
    <div class="quantity-control">
      <button onclick="updateQty('${index}', -1, ${price}, '${item.name.replace(/'/g, "\\'")}')">-</button>
      <span id="qty-${index}">0</span>
      <button onclick="updateQty('${index}', 1, ${price}, '${item.name.replace(/'/g, "\\'")}')">+</button>
    </div>
  `;
  container.appendChild(card);
}

function updateQty(index, change, price, name) {
  quantities[index] = Math.max(0, (quantities[index] || 0) + change);
  document.getElementById(`qty-${index}`).innerText = quantities[index];
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");
  cartItems.innerHTML = "";
  let total = 0;

  for (let key in quantities) {
    const qty = quantities[key];
    if (qty > 0) {
      const item = allItems.find(i => key === slugify(i.name));
      if (!item) continue;
      const line = document.createElement("div");
      line.className = "cart-item";
      const linePrice = Number(item.price) * qty;
      line.innerHTML = `<span>${item.name} x ${qty}</span><span>₹${linePrice}</span>`;
      cartItems.appendChild(line);
      total += linePrice;
    }
  }

  totalEl.innerText = `Total: ₹${total}`;
}

async function loadMenu() {
  try {
    const res = await fetch("/api/menu");
    const items = await res.json();

    // Keep a flat list for cart lookups
    allItems = items;

    // Render by category (IDs must exist in HTML)
    items.forEach(item => {
      const container = document.getElementById(item.category);
      if (container) createCard(item, container);
    });
  } catch (err) {
    console.error("Error loading menu:", err);
  }
}

// Keep your existing payNow() function unchanged

window.onload = function () {
  document.getElementById("cart-toggle").addEventListener("click", () => {
    const cart = document.getElementById("cart");
    cart.style.display = cart.style.display === "none" ? "block" : "none";
  });

  loadMenu(); // 🚀 fetch items from MongoDB
};

async function payNow() {
  const total = parseInt(document.getElementById('total').innerText.replace('Total: ₹', ''));
  if (total === 0) {
    alert("Please add items to cart first");
    return;
  }

  // Prepare full cart item data
  const cartItems = [];
  for (let key in quantities) {
    const qty = quantities[key];
    if (qty > 0) {
      const item = allItems.find(i => key === i.name.toLowerCase().replace(/\s+/g, '-'));
      if (item) {
        cartItems.push({
          name: item.name,
          quantity: qty,
          price: item.price
        });
      }
    }
  }

  try {
    // Step 1: Create Razorpay order
    const response = await fetch('/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: total,
        notes: { items: cartItems },
        userId: "user123"
      })
    });

    const orderData = await response.json();

    if (orderData.success) {
      const options = {
        key: 'rzp_test_UkUpsmbnu3jvoD',
        amount: orderData.order.amount,
        currency: "INR",
        name: "Canteen Payment",
        order_id: orderData.order.id,
        handler: async function (response) {
          // Step 2: Verify payment
          const verifyRes = await fetch('/payment/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderDetails: {
                amount: total,
                currency: "INR",
                userId: "user123",
                items: cartItems
              }
            })
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            // Redirect to receipt with paymentId and orderId
            const params = new URLSearchParams({
              paymentId: verifyData.paymentId,
              orderId: verifyData.orderId
            });
            window.location.href = `/payment/receipt.html?${params.toString()}`;
          } else {
            alert("Payment Verification Failed");
          }
        },
        theme: { color: "#F37254" }
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } else {
      alert("Failed to create Razorpay order.");
    }
  } catch (error) {
    console.error("Payment error:", error);
    alert("Payment failed.");
  }
}




thaliItems.forEach(item => createCard(item, document.getElementById('thali')));
curryItems.forEach(item => createCard(item, document.getElementById('curry')));
extraItems.forEach(item => createCard(item, document.getElementById('extrafood')));
muttonItems.forEach(item => createCard(item, document.getElementById('mutton')));
dayspecialSabjidal.forEach(item => createCard(item, document.getElementById('daysabjidal')));
dayextraItems.forEach(item => createCard(item, document.getElementById('dayextra')));
daypurevegItems.forEach(item => createCard(item, document.getElementById('purevegthali')));

window.onload = function() {
  document.getElementById("cart-toggle").addEventListener("click", () => {
    const cart = document.getElementById("cart");
    cart.style.display = cart.style.display === "none" ? "block" : "none";
  });
};