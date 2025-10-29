document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e) => {
      if (e.target.classList.contains("msgBtn")) {
        // Reset styles on all buttons
        document.querySelectorAll(".msgBtn").forEach(btn => {
          btn.style.background = ""; // or set it to default value
          btn.style.color = "";      // reset to original color
        });
  
        e.target.style.background = "#0077ff";
        e.target.style.color = "white";
  
        console.log("clicked:", e.target.textContent);
        loadStaffReqs(e.target.textContent);
     }
   });
});

function loadStaffReqs(options) 
{
    console.log("loadstaffreqs..");
    fetchDataBasedOnChoice(options)
   
}

function fetchDataBasedOnChoice(options) {
    switch(options)
    {
        case 'Staff Request':
        {
            fetch('/employeeRequests/staff')
                .then(response => response.json())
                .then(data => renderReqCards(data,options))
                .catch(error => console.error('Error:', error));
            break;
        }
        case 'Admin Request':
        {
            fetch('/employeeRequests/admin')
                .then(response => response.json())
                .then(data => renderReqCards(data,options))
                .catch(error => console.error('Error:', error));
            break;
        }
        case 'Feedbacks':
        {
            fetch('/messages')
                .then(response => response.json())
                .then(data => renderFeedbackCards(data))
                .catch(error => console.error('Error:', error));
            break;
        }    
        default:
        {
            console.log("invalid msg selection...");
        }
    }
}

function renderReqCards(staffs, staffType) {

    const container = document.getElementById('displayMessages');
    container.innerHTML = ``;
      container.style.flexDirection = "row";

    console.log(staffs);
    if(staffs.message === "No records found")
    {
        const noMsg = document.createElement('div');
        noMsg.className = 'nomsg';
        noMsg.innerText = `No ${staffType.replace(" Request","")} Requests Found`;
        container.appendChild(noMsg);
        return;
    }

    staffs.forEach(data => {
        const card = document.createElement('div');
        card.className = 'profileCard';

        card.innerHTML = `
            <div class="imgsection"><img src="${data.profilePicture}" alt="Profile"></div>
            <div class="details">
                <h3>${data.username}</h3>
                <p><strong>Mobile:</strong> ${data.mobileNumber}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>User ID:</strong> ${data.userId}</p>
                <div class="profileButtonArea" id="staff_${data._id}">
                    <button class="hire-btn" onclick='hireMember("${staffType}", ${JSON.stringify(data)})'>
                        Hire ${staffType.replace("Request", "")}
                    </button>
                    <button class="reject-btn" onclick='rejectMember("${staffType}", ${JSON.stringify(data)})'>
                        Reject ${staffType.replace("Request", "")}
                    </button>
                </div>
            </div>`;

        container.appendChild(card);
    });
}
   
async function hireMember(staffType, data) {
    try {
      const response = await fetch(`/hireMember/${staffType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) throw new Error("Failed to hire member");
  
    const result = await response.json();
    console.log("Hire successful:", result);
    showSuccessMessage("Successfully Hired!",data._id , true);
    } catch (error) {
      console.error("Error hiring member:", error);
    }
}

async function rejectMember(staffType, data) {
  try {
    const response = await fetch(`/rejectMember/${staffType}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error("Failed to reject member");

    const result = await response.json();
    console.log("Reject successful:", result);
    showSuccessMessage("Successfully Rejected!", data._id , false);
  } catch (error) {
    console.error("Error rejecting member:", error);
  }
}

function showSuccessMessage(message, id , staffType) {
  console.log(id);
  const succbox = document.querySelector("#staff_" + id);

  if (!succbox) {
    console.warn(`Element with id "${id}" not found in DOM`);
    return;
  }

  succbox.innerHTML = ``;

  const successLabel = document.createElement("div");
  successLabel.className = "success-label";
  successLabel.innerText = message;

  if(!staffType)
    successLabel.style.color = 'red';

  succbox.appendChild(successLabel);

  setTimeout(() => {
    successLabel.remove();
  }, 3000);
}

function getWeeksAgo(dateStr) {
  const created = new Date(dateStr);
  const now = new Date();
  const diffInWeeks = Math.floor((now - created) / (1000 * 60 * 60 * 24 * 7));
  return diffInWeeks;
}

function renderFeedbackCards(data) {
  const container = document.getElementById('displayMessages');
  container.innerHTML = '';
  container.style.flexDirection = "column";

  if(data.message === 'No records found'){
     container.innerHTML = `<div style="color: #888; text-align: center; font-size: 16px;">
                              No Messages Found...
                            </div>`;

    return;
  }

  data.forEach(user => {
    const card = document.createElement("div");
    card.style.display = "flex";
    card.style.flexDirection = "column";
    // card.style.marginBottom = "12px";
    card.style.padding = "10px";
    card.style.borderBottom = "1px solid #ddd";

    const leftSide = document.createElement("div");
    leftSide.style.display = "flex";
    leftSide.style.alignItems = "center";

    const profileImg = document.createElement("img");
    profileImg.src = user.profilePicture ? 'uploads/' + user.profilePicture : "default-avatar.png";
    profileImg.alt = user.username;
    profileImg.style.width = "50px";
    profileImg.style.height = "50px";
    profileImg.style.borderRadius = "50%";
    profileImg.style.marginRight = "12px";

    const textContainer = document.createElement("div");

    const nameEl = document.createElement("div");
    nameEl.style.fontWeight = "bold";
    nameEl.textContent = user.username;

    const msgEl = document.createElement("div");
    msgEl.style.color = "gray";
    msgEl.style.fontSize = "14px";
    msgEl.textContent = user.data || "No message";

    const time = document.createElement("div");
    time.style.fontSize = "12px";
    time.style.color = "#999";
    const weeksAgo = getWeeksAgo(user.createdAt);
    time.textContent = `${weeksAgo}w`;

    textContainer.appendChild(nameEl);
    textContainer.appendChild(msgEl);
    textContainer.appendChild(time);

    leftSide.appendChild(profileImg);
    leftSide.appendChild(textContainer);

    const rightSide = document.createElement("div");
    rightSide.style.marginLeft = "3.8rem";
    rightSide.style.marginTop = ".5rem";
    rightSide.style.display = "flex";
    
    // Mark as Read Button
    const markBtn = document.createElement("button");
    markBtn.textContent = "Mark as Read";
    markBtn.className = "mark-btn"
    markBtn.style.marginRight = "8px";
    markBtn.onclick = () => {
      fetch(`/mark-as-read/${user._id}`, { method: 'PATCH' })
        .then(res => {
          if (res.ok) {
            card.style.opacity = "0.5";
            markBtn.disabled = true;
            markBtn.textContent = "Marked";
          }
        })
        .catch(err => console.error(err));
    };

    // Reply Button
    const replyBtn = document.createElement("button");
    replyBtn.textContent = "Reply";
    replyBtn.className = "reply-btn";
    replyBtn.onclick = () => {
      replyBox.style.display = replyBox.style.display === "none" ? "flex" : "none";
    };

    // Reply Box
    const replyBox = document.createElement("div");
    replyBox.style.display = "none";
    replyBox.style.marginTop = "10px";
    replyBox.className = "reply-container"
    // replyBox.style.display = "flex";

    const textarea = document.createElement("textarea");
    textarea.rows = 2;
    textarea.cols = 30;
    textarea.placeholder = "Type your reply...";
    textarea.style.resize = "none";
    textarea.style.marginBottom = "5px";
    textarea.className = "reply-input";

    const sendBtn = document.createElement("button");
    sendBtn.className = "send-reply-btn";

    // Create span for text
    const btnText = document.createElement("span");
    btnText.textContent = "Send";
    btnText.className = "btnText"; // use class instead of ID

    // Create spinner
    const btnSpinner = document.createElement("span");
    btnSpinner.className = "spinner";
    btnSpinner.style.display = "none";

    // Append spans to button
    sendBtn.appendChild(btnText);
    sendBtn.appendChild(btnSpinner);

    // sendBtn.onclick = () => {
    //   const replyText = textarea.value.trim();
    //   if (!replyText) return;
    //   // Post the reply to your backend
    //   fetch('/send-reply', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({to:user.email, message: replyText })
    //   }).then(res => {
    //     if (res.ok) {
    //       textarea.value = '';
    //       alert(`Reply sent successfully to ${user.email}`);
    //     }
    //   }).catch(err => console.error(err));
    // };

    sendBtn.onclick = () => {
      const replyText = textarea.value.trim();
      if (!replyText) return;

      btnText.textContent = 'Sending...';
      btnSpinner.style.display = 'inline-block';
      sendBtn.disabled = true;

      fetch('/send-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: user.email, message: replyText })
      }).then(res => {
        if (res.ok) {
          textarea.value = '';
          alert(`Reply sent to ${user.email}`);
        } else {
          alert('Failed to send.');
        }
      }).catch(err => {
        console.error(err);
        alert('Error sending message.');
      }).finally(() => {
        btnText.textContent = 'Send';
        btnSpinner.style.display = 'none';
        sendBtn.disabled = false;
      });
    };

    replyBox.appendChild(textarea);
    replyBox.appendChild(sendBtn);

    rightSide.appendChild(markBtn);
    rightSide.appendChild(replyBtn);
    // rightSide.appendChild(replyBox);

    card.appendChild(leftSide);
    card.appendChild(rightSide);
    card.appendChild(replyBox);

    container.appendChild(card);
  });
}

