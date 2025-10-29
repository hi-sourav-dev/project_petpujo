// Wait for DOM to fully load
let adminRequests;

loadimg = async()=>{
    const userImg = document.querySelector(".admin-profile");
    const url = userImg.dataset.url;
    userImg.style.backgroundImage = `url('${url}')`;
};

async function loadRequestStats() {
  try {
    const res = await fetch('/loadRequestsStats');
    const data = await res.json();
    document.querySelector(".notification-badge").textContent = data.staffRequests + data.adminRequests + data.messageCount;
    adminRequests = data.adminRequests;
  } catch (error) {
    console.error("Error fetching request stats:", error);
  }
}


document.addEventListener('DOMContentLoaded', function() {
    // Get all menu items
    loadimg();
    loadRequestStats();
    const menuItems = document.querySelectorAll('.menu-item');
    
    // Add click event to each menu item
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get the section name from data attribute
            const section = this.getAttribute('data-section');
            
            // Update page title
            const pageTitle = document.querySelector('.page-title');
            pageTitle.textContent = this.textContent.trim();
            
            // Here you would typically load the appropriate content
            // For demonstration purposes, we'll just update the message
            const contentMessage = document.querySelector('.section-label');
            contentMessage.innerHTML = `Loading ${section} content...<br>`;
            
            fetchSectionContent(section);
        });
    });
    
    // Function to handle notifications
    const bellIcon = document.querySelector('.bell-icon');
    bellIcon.addEventListener('click', function () {
        const messageMenuItem = document.querySelector('.menu-item[data-section="messages"]');
        if (messageMenuItem) {
            messageMenuItem.click();
            //  if(adminRequests !== 0)
            // {
            //     document.querySelector(".admin-btn").style.border = "2px solid red";
            // } // Triggers the same logic as clicking the menu item
        }
    });
    
    // Function to handle profile clicks
    const adminProfile = document.querySelector('.admin-profile');
    adminProfile.addEventListener('click', function() {
        alert('Profile menu would open here');
        // In a real implementation, you would toggle a profile dropdown
    });
});

async function fetchSectionContent(section)
{
    console.log(`yes ${section}`);

    let sectionLabel = document.getElementsByClassName("section-label")[0];
    let contentMessage = document.getElementsByClassName("content-message")[0];
    sectionLabel.innerHTML = ``;
    contentMessage.innerHTML = ``;

    switch(section)
    {
        case 'search':
        {
            sectionLabel.innerHTML = `<div class="search">
                                <div class="search-box">
                                    <div class="search-field">
                                        <input placeholder="Bill No..." class="searchinput" id="billNoInput" type="text" onkeypress="if(event.key === 'Enter'){searchByBillNo()}" autofocus>
                                        <div class="search-box-icon">
                                            <button class="btn-icon-content" onclick="searchByBillNo()">
                                                <i class="search-icon">
                                                <svg xmlns="://www.w3.org/2000/svg" version="1.1" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" fill="#fff"></path></svg>
                                                </i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
            contentMessage.innerHTML = `search by Bill Number....`;
            break;
        }
        case 'unclaimed':
        {
            sectionLabel.innerHTML = `  <input type="date" id="fromDate" onchange = "searchByDate('unclaimed')"/>
                                        <label for="dateInput">To</label>
                                        <input type="date" id="toDate"/>
                                        <button id="dateBtn" onclick="searchByDate('unclaimed')">Unclaimed</button>
                                        <div id="orders"></div>`;
            
            const todayDate = new Date();
            const today = todayDate.toISOString().split('T')[0];
            todayDate.setDate(todayDate.getDate()-1);
            const yesterday = todayDate.toISOString().split('T')[0];
            document.getElementById("fromDate").value = yesterday;
            document.getElementById("toDate").value = today;

            contentMessage.innerHTML = `search unclaimed Bills by Date....`;
            break;
        }
        case 'claimed':
        {
            sectionLabel.innerHTML = `  <input type="date" id="fromDate" />
                                        <label for="dateInput">To</label>
                                        <input type="date" id="toDate" onchange = "searchByDate('claimed')"/>
                                        <button id="dateBtn" onclick="searchByDate('claimed')">Claimed</button>`;
            
            const todayDate = new Date();
            const today = todayDate.toISOString().split('T')[0];
            todayDate.setDate(todayDate.getDate()-1);
            const yesterday = todayDate.toISOString().split('T')[0];
            document.getElementById("fromDate").value = yesterday;
            document.getElementById("toDate").value = today;

            contentMessage.innerHTML = `search claimed Bills by Date....`;
            break;
        }
        case 'payment-list':
        {
            break;
        }
        case 'total-sell':
        {
            sectionLabel.innerHTML = `  <input type="date" id="fromDate" onchange = 'totalSell()'/>
                                        <label for="dateInput">To</label>
                                        <input type="date" id="toDate" onchange = 'totalSell()'/>
                                        <button id="dateBtn" onclick="totalSell()">Total Sell</button>`;

            const todayDate = new Date();
            const today = todayDate.toISOString().split('T')[0];
            todayDate.setDate(todayDate.getDate()-1);
            const yesterday = todayDate.toISOString().split('T')[0];
            document.getElementById("fromDate").value = yesterday;
            document.getElementById("toDate").value = today;

            contentMessage.innerHTML = `watch total sell by Date....`;
            break;
        }
        case 'chart-statistics':
        {
            break;
        }
        case 'messages':
        {
            sectionLabel.innerHTML = `<header class="messageHeader">
                                        <button class="staff-btn msgBtn">Staff Request</button>
                                        <button class="admin-btn msgBtn">Admin Request</button>
                                        <button class="messages-btn msgBtn">Feedbacks</button>
                                      </header>`;

            contentMessage.innerHTML = `<div id="displayMessages">Click on the buttons for contents</div>`;                          
            break;
        }
        case 'employee-details':
        {
            sectionLabel.innerHTML = `<div class="btn-container">
                                            <label class="switch btn-color-mode-switch">
                                            <input value="1" id="color_mode" name="color_mode" type="checkbox" onchange="loadStaffDetails()">
                                            <label class="btn-color-mode-switch-inner" data-off="Staff" data-on="Admin" for="color_mode"></label>
                                            </label>
                                        </div>`;

            contentMessage.innerHTML = `<h2 id="stafflabel" style="margin-bottom:1rem;margin-left:1rem;"></h2>
                                        <div id="adminCardsContainer" class="card-container"></div>`;                            
            break;
        }
        default:
        {
            console.log("error nav selection");
        }
    }

}

async function checkout(orderId) {
    const res = await fetch(`/unclaimed/checkout/${orderId}`, { method: "POST" });
    const data = await res.json();
    const msg = document.getElementById(`message-${orderId}`);
    if (res.ok) {
        msg.innerHTML = `<p style="color: green;">${data.message}</p>`;
    } else {
        msg.innerHTML = `<p style="color: red;">${data.error}</p>`;
    }
}

async function searchByBillNo()
{
    const billNo = document.getElementById("billNoInput").value;
    const resultBox = document.getElementById("result");
    resultBox.style.marginLeft = '1rem';
    resultBox.style.marginRight = '1rem';
    resultBox.innerHTML = "";

    // let billNo = 2549;
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
    } 
    else 
    {
        resultBox.innerHTML = "<p style='margin-top: 1rem;'>No record found...</p>";
    }
}

async function totalSell()
{
    console.log("totalsell..");
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;
    const resultBox = document.getElementById("result");
    resultBox.innerHTML = '';

    const res = await fetch(`/claimed/date/${fromDate}/${toDate}`);
    const data = await res.json();

    if(res.ok && data.length)
    {
        const resultHeader = document.createElement("div");
        resultHeader.classList.add("resultHeader");
        resultHeader.innerHTML = `<span style="color:#00d1b2;">Total sells From </span> &nbsp; ${fromDate} &nbsp; To &nbsp; ${toDate}`;
        resultBox.appendChild(resultHeader);
        resultBox.style.marginLeft = '1rem';
        resultBox.style.marginRight = '1rem';

        let totalSellAmount = 0;
        data.forEach(order =>{
            totalSellAmount += order.amount;
        });

        const container = document.createElement("div");
        container.className = "result-container";

        const totalSellCard = document.createElement("div");
        totalSellCard.className = "card";
        let totalSellCardContent = `<header style="display: flex;justify-content: space-between;"><h3>Total sell Ammount : ${totalSellAmount}</h3>
                                        <div class="btn-container">
                                            <label class="switch btn-color-mode-switch">
                                            <input value="1" id="color_mode" name="color_mode" type="checkbox" onchange="handleSwitchChange()">
                                            <label class="btn-color-mode-switch-inner" data-off="Bills" data-on="Chart" for="color_mode"></label>
                                            </label>
                                        </div>
                                    </header>`;
        totalSellCard.innerHTML = totalSellCardContent;
        container.appendChild(totalSellCard);
        resultBox.appendChild(container);
    }

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
                <div style="margin-top: 0.7rem; color:green;">Order Already Claimed</div>
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
    resultBox.innerHTML = "<p>No record found...</p>";
    }
}


  

