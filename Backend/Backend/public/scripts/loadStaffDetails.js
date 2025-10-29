function loadStaffDetails() {
    console.log("loadstaff..");
    const toggle = document.getElementById("color_mode");
    const label = document.querySelector(".btn-color-mode-switch-inner");

    function fetchDataBasedOnToggle() {
        const value = toggle.checked ? label.getAttribute("data-on") : label.getAttribute("data-off");
        if (value === 'Admin') {
            fetch('/employeeDetails/admins')
                .then(response => response.json())
                .then(data => renderStaffCards(data))
                .catch(error => console.error('Error:', error));
                let stafflabel = document.getElementById("stafflabel").innerText = `Showing ${value} Members...`;
        } else {
            fetch('/employeeDetails/staffs')
                .then(response => response.json())
                .then(data => renderStaffCards(data))
                .catch(error => console.error('Error:', error));
                let stafflabel = document.getElementById("stafflabel").innerText = `Showing ${value} Members...`;
        }
    }

    // Call once on page load
    fetchDataBasedOnToggle();

    // Then also call on toggle change
    toggle.addEventListener("change", fetchDataBasedOnToggle);
}

function renderStaffCards(choices) {

    const container = document.getElementById('adminCardsContainer');
    container.innerHTML = ``;
    choices.forEach(data => {
        const card = document.createElement('div');
        card.className = 'profileCard';

        card.innerHTML = `
                        <div class="imgsection"><img src="${data.profilePicture}" alt="Profile"></div>
                        <div class="details">
                            <h3>${data.username}</h3>
                            <p><strong>Mobile:</strong> ${data.mobileNumber}</p>
                            <p><strong>Email:</strong> ${data.email}</p>
                            <p><strong>User ID:</strong> ${data.userId}</p>
                            <div id="staff_${data._id}" class = "profileButtonArea">
                                <button class="fire-btn" onclick='fireMember( ${JSON.stringify(data)})'>Fire</button>
                                <button class="message-btn">Message</button>
                            </div>
                        </div>`;

        container.appendChild(card);
      });
}
      

  async function fireMember(data) {
  try {
    const response = await fetch(`/fireMember`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error("Failed to fire member");

    const result = await response.json();
    console.log("Fire successful:", result);
    let succbox = document.getElementById(`staff_${result.id}`);
    let successLabel = document.createElement("div");
    succbox.innerHTML = ``;
    successLabel.className = "success-label";
    successLabel.innerText = result.message;
    successLabel.style.color = 'red';
    succbox.appendChild(successLabel);

    // Remove label after 3 seconds
    setTimeout(() => {
      successLabel.remove();
    }, 3000);

  } catch (error) {
    console.error("Error firing member:", error);
  }
}
