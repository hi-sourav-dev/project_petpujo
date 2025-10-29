window.addEventListener('DOMContentLoaded', async () => {
    await bills(); 
    setupDateChangeListener(); 
});

function setupDateChangeListener() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    
    dateInputs.forEach(dateInput => {
        dateInput.addEventListener('change', () => {
            console.log('Date changed!');
            handleSwitchChange(); 
        });
    });
}

function handleSwitchChange() 
{
    const checkbox = document.getElementById('color_mode');
    
    if(checkbox.checked)
    {
        console.log('Switch ON (chart) - calling chart()');
        chart();
    }
    else
    {
        console.log('Switch OFF (bill) - calling bills()');
        bills();
    }
}

async function clearResult() {
    if (window.myChart instanceof Chart) {
        window.myChart.destroy();
        window.myChart = null; // Clear the reference
        const canvasEle= document.getElementsByTagName("canvas");
        while(canvasEle.length > 0)
        {
            canvasEle[0].parentElement.removeChild(canvasEle[0]);
        }
    }


    let childElement;

    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;

    let res = await fetch(`/claimed/date/${fromDate}/${toDate}`); 
    const data = await res.json();

    data.forEach(items => {
        childElement = document.querySelector(`#order-${items._id}`);
        if (childElement) {
            childElement.remove();
        }
    });
}


async function bills() {
    console.log('bills() function called');
    await clearResult();
    const fromDate = await document.getElementById("fromDate").value;
    const toDate = await document.getElementById("toDate").value;
    const resultBox = document.getElementById("result");
    
    let res = await fetch(`/claimed/date/${fromDate}/${toDate}`); 
    const data = await res.json();
    
    if (res.ok && data.length) 
        {
            data.forEach(order => {
            const container = document.createElement("div");
            
            container.className = "result-container";
            container.id = `order-${order._id}`;
            
            // Card 1 - Order Info
            const card1 = document.createElement("div");
            card1.className = "card";
            let card1Content =  `
            <h3>Bill No: ${order.billNumber}</h3>
            <div class="order-info">
            <p>Payment ID &nbsp;: &nbsp;&nbsp;${order.paymentId}</p>
                                    <p>User ID &nbsp;: &nbsp;&nbsp;${order.userId}</p>
                                    <p>Amount &nbsp;: &nbsp;&nbsp;₹${order.amount} ${order.currency}</p>
                                    </div>
                                    <div style="margin-top: 0.7rem; color:green;">Order Already Claimed</div>`;
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

async function chart() {
    console.log('chart() function called');

    await clearResult();
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;
    const resultBox = document.getElementById("result");
    try {
        const res = await fetch(`/claimed/date/${fromDate}/${toDate}`);
        const data = await res.json();

        if (res.ok && data.length) {
            const itemTotals = {};

            data.forEach(order => {
                if (order.items && Array.isArray(order.items)) {
                    order.items.forEach(item => {
                        if (item && typeof item === "object" && item.name) {
                            itemTotals[item.name] = (itemTotals[item.name] || 0) + (item.quantity || 0);
                        }
                    });
                }
            });

            const itemNames = Object.keys(itemTotals);
            const itemQuantities = Object.values(itemTotals);

            // Create canvas
            const canvas = document.createElement('canvas');
            canvas.id = 'orderChart';
            canvas.style.width = '100%';
            canvas.style.height = '300px';
            resultBox.appendChild(canvas);

            const ctx = canvas.getContext('2d');

            // Destroy previous chart if exists
            if (window.myChart) {
                window.myChart.destroy();
            }

            window.myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: itemNames,
                    datasets: [{
                        label: 'Total Quantity',
                        data: itemQuantities,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

        } else {
            resultBox.innerHTML = "<p>No record found for chart...</p>";
        }
    } catch (err) {
        console.error('Error fetching or drawing chart:', err);
        resultBox.innerHTML = "<p>Error loading data.</p>";
    }
}
