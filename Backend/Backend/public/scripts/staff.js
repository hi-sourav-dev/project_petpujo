window.onload = function()
{
    const resultDiv = document.getElementById('result');
    const video = document.createElement('video');

    resultDiv.style.marginLeft = '0';
    resultDiv.style.marginRight = '0';

    video.src = '/videos/foodVideo3.mp4';
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    resultDiv.appendChild(video);
    loadimg();
}

loadimg = async()=>{
    const userImg = document.querySelector(".staffImg");
    const url = userImg.dataset.url;
    userImg.style.backgroundImage = `url('${url}')`;
};


async function searchByBillNo() {
    const billNo = document.getElementById("billNoInput").value;
    const resultBox = document.getElementById("result");
    resultBox.style.marginLeft = '1rem';
    resultBox.style.marginRight = '1rem';
    resultBox.innerHTML = "";

    const res = await fetch(`/unclaimed/${billNo}`);
    const data = await res.json();

    if (res.ok && data.length) {
    data.forEach(order => {
        const container = document.createElement("div");
        container.className = "result-container";
        container.id = `order-${order._id}`;

        // Card 1 - Order Info
        const card1 = document.createElement("div");
        card1.className = "card";
        card1.innerHTML = `
                <h3>Bill No: ${order.billNumber}</h3>
                <div class="order-info">
                <p>Payment ID &nbsp;: &nbsp;&nbsp;${order.paymentId}</p>
                <p>User ID &nbsp;: &nbsp;&nbsp;${order.userId}</p>
                <p>Amount &nbsp;: &nbsp;&nbsp;₹${order.amount} ${order.currency}</p>
                </div>
                <div class="action-buttons">
                <button onclick="checkout('${order._id}')">Checkout</button>
                <button style = "background-color:#9f3030;" onclick="cancel('${order.paymentId}', '${order._id}')">Cancel</button>
                </div>
                <div id="message-${order._id}" class="action-message" style="margin-top: 0.7rem;"></div>
            `;

        // Card 2 - Item List
        const card2 = document.createElement("div");
        card2.className = "card";
        card2.innerHTML = '<h3>Order List</h3>';

        order.items.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "item";
        if(typeof item === "object" && item !== null)
        {
            itemDiv.innerHTML = `${item.name} &nbsp;&nbsp;x${item.quantity}`;
        }
        else
        {
            itemDiv.textContent = item;
        }
        card2.appendChild(itemDiv);
        });

        container.appendChild(card1);
        container.appendChild(card2);
        resultBox.appendChild(container);
    });
    } else {
    resultBox.innerHTML = "<p style='margin-top: 1rem;'>No record found...</p>";
    }
}

async function checkout(orderId) {
    const res = await fetch(`/unclaimed/checkout/${orderId}`, { method: "POST" });
    const data = await res.json();
    const msg = document.getElementById(`message-${orderId}`);
    if (res.ok) {
        msg.innerHTML = `<p style="color: lightgreen;">${data.message}</p>`;
    } else {
        msg.innerHTML = `<p style="color: red;">${data.error}</p>`;
    }
}

async function cancel(paymentId, orderId) {
    const res = await fetch(`/unclaimed/cancel/${paymentId}`, { method: "POST" });
    const data = await res.json();
    const box = document.getElementById(`order-${orderId}`);
    if (res.ok) {
    box.innerHTML += `<p style="color: orange;">${data.message}</p>`;
    } else {
    box.innerHTML += `<p style="color: red;">${data.error}</p>`;
    }
}

  function showDateSearch(options) {
    let popOut = document.getElementsByClassName("popOut")[0];
    popOut.innerHTML = `
        <input type="date" id="fromDate" />
        <label for="dateInput">To</label>
        <input type="date" id="toDate" />
        <button id="dateBtn" onclick="searchByDate('${options}')">${options}</button>
      <div id="orders"></div>
      `;
      console.log(options)
      const todayDate = new Date();
      const today = todayDate.toISOString().split('T')[0];
      todayDate.setDate(todayDate.getDate()-1);
      const yesterday = todayDate.toISOString().split('T')[0];
      document.getElementById("fromDate").value = yesterday;
      document.getElementById("toDate").value = today;
  }

  
  async function searchByDate(choise) {
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;
    const resultBox = document.getElementById("result");
    resultBox.innerHTML = '';
    
    let res = '';
    if(choise === 'unclaimed')
        {
            res = await fetch(`/unclaimed/date/${fromDate}/${toDate}`);
        }  
    else
    {
        res = await fetch(`/claimed/date/${fromDate}/${toDate}`);
    }  
    const data = await res.json();
    
    if (res.ok && data.length) {
        
        const resultHeader = document.createElement("div");
        resultHeader.classList.add("resultHeader");
        resultHeader.innerHTML = `<span style="color:#00d1b2;">${choise} Items From </span> &nbsp; ${fromDate} &nbsp; To &nbsp; ${toDate}`;
        resultBox.appendChild(resultHeader);
        resultBox.style.marginLeft = '1rem';
        resultBox.style.marginRight = '1rem';
        
        data.forEach(order => {
            const container = document.createElement("div");
            
            container.className = "result-container";
            container.id = `order-${order._id}`;
            
            // Card 1 - Order Info
            const card1 = document.createElement("div");
            card1.className = "card";
            let card1Content = ``;
            if(choise === 'unclaimed')
            {
                card1Content =  `
                <h3>Bill No: ${order.billNumber}</h3>
                <div class="order-info">
                <p>Payment ID &nbsp;: &nbsp;&nbsp;${order.paymentId}</p>
                <p>User ID &nbsp;: &nbsp;&nbsp;${order.userId}</p>
                <p>Amount &nbsp;: &nbsp;&nbsp;₹${order.amount} ${order.currency}</p>
                </div>
                <div class="action-buttons">
                    <button  onclick="checkout('${order._id}')">Checkout</button>
                    <button style = "background-color:red;" onclick="cancel('${order.paymentId}', '${order._id}')">Cancel</button>
                </div>
                <div id="message-${order._id}" class="action-message" style="margin-top: 0.7rem;"></div>
                `;
            }
            else
            {
                card1Content =  `
                <h3>Bill No: ${order.billNumber}</h3>
                <div class="order-info">
                    <p>Payment ID &nbsp;: &nbsp;&nbsp;${order.paymentId}</p>
                    <p>User ID &nbsp;: &nbsp;&nbsp;${order.userId}</p>
                    <p>Amount &nbsp;: &nbsp;&nbsp;₹${order.amount} ${order.currency}</p>
                </div>
                <div style="margin-top: 0.7rem; color:lightgreen;">Order Already Claimed</div>
                `;
            }
            card1.innerHTML = card1Content;

        // Card 2 - Item List
        const card2 = document.createElement("div");
        card2.className = "card";
        card2.innerHTML = '<h3>Order List</h3>';

        order.items.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "item";
        if(typeof item === "object" && item !== null)
        {
            itemDiv.innerHTML = `${item.name} &nbsp;&nbsp;x${item.quantity}`;
        }
        else
        {
            itemDiv.textContent = item;
        }
        card2.appendChild(itemDiv);
        });

        container.appendChild(card1);
        container.appendChild(card2);
        resultBox.appendChild(container);
    });
    } else {
    resultBox.innerHTML = "<p style='margin-top: 1rem;'>No record found...</p>";
    }
  }
  