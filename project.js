const profileBtn = document.getElementById("profile-btn");
const profileDropdown = document.getElementById("profile-dropdown");

const popup = document.getElementById("popup");
const closePopupBtn = document.querySelector(".close-popup");

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const guestForm = document.getElementById("guest-form");

const donateBtn = document.getElementById("donate-btn");
const volunteerBtn = document.getElementById("volunteer-btn");
const feedbackBtn = document.getElementById("feedback-btn");

const feedbackForm = document.getElementById("feedback-form");
const feedbackText = document.getElementById("feedback-text");
const submitFeedback = document.getElementById("submit-feedback");
const feedbackList = document.getElementById("feedback-list");

let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(sessionStorage.getItem("currentUser")) || null;

let donateForm = null;
let volunteerForm = null;

if (closePopupBtn) {
    closePopupBtn.addEventListener("click", () => {
        popup.style.display = "none";
    });
}

window.addEventListener("click", e => {
    if (e.target === popup) {
        popup.style.display = "none";
    }
});

function updateProfileBtn() {
    if (!profileDropdown) return;

    profileDropdown.innerHTML = "";

    if (currentUser) {
        profileDropdown.innerHTML = `
            <li><button onclick="goToProfile()">My Profile</button></li>
            <li><button onclick="logout()">Logout</button></li>
        `;
    } else {
        profileDropdown.innerHTML = `
            <li><button id="login-btn">Login</button></li>
            <li><button id="register-btn">Register</button></li>
            <li><button id="guest-btn">Login as Guest</button></li>
        `;
    }

    setupDropdownButtons();
}

function setupDropdownButtons() {
    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");
    const guestBtn = document.getElementById("guest-btn");

    if (loginBtn) loginBtn.onclick = () => {
        popup.style.display = "flex";
        loginForm.style.display = "block";
        registerForm.style.display = "none";
        guestForm.style.display = "none";
    };

    if (registerBtn) registerBtn.onclick = () => {
        popup.style.display = "flex"; 
        loginForm.style.display = "none";
        registerForm.style.display = "block";
        guestForm.style.display = "none";
    };

    if (guestBtn) guestBtn.onclick = () => {
        popup.style.display = "flex"; 
        loginForm.style.display = "none";
        registerForm.style.display = "none";
        guestForm.style.display = "block";
    };
}

if (profileBtn) {
    profileBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle("show");
    });
}

document.addEventListener("click", () => {
    if (profileDropdown && profileDropdown.classList.contains("show")) {
        profileDropdown.classList.remove("show");
    }
});

document.getElementById("login-submit")?.addEventListener("click", () => {
    const username = document.getElementById("login-username").value.trim();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    const user = users.find(
        u => u.username === username && u.email === email && u.password === password
    );

    if (!user) {
        document.getElementById("login-msg").innerText = "Invalid credentials!";
        return;
    }

    currentUser = user;
    sessionStorage.setItem("currentUser", JSON.stringify(user));
    popup.style.display = "none";
    updateProfileBtn();
    enableSupport();
});

document.getElementById("register-submit")?.addEventListener("click", () => {
    const username = document.getElementById("reg-username").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;

    if (!username || !email || !password) {
        document.getElementById("reg-msg").innerText = "Fill all fields!";
        return;
    }

    if (users.some(u => u.username === username || u.email === email)) {
        document.getElementById("reg-msg").innerText = "User already exists!";
        return;
    }

    users.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    document.getElementById("reg-msg").innerText =
        "Registered successfully! Please login.";
});

document.getElementById("guest-login-submit")?.addEventListener("click", () => {
    currentUser = { username: "Guest", email: "guest@demo.com" };
    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
    popup.style.display = "none";
    updateProfileBtn();
    enableSupport();
});

function logoutUser() {
    sessionStorage.removeItem("currentUser");
    window.location.href = "home.html";
}
window.logout = logoutUser; 

function goToProfile() {
    window.location.href = "profile.html";
}
window.goToProfile = goToProfile;

document.addEventListener("DOMContentLoaded", () => 
    {
  const user = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!user) return;

  const nameEl = document.getElementById("profile-username");
  const emailEl = document.getElementById("profile-email");

  if (nameEl) nameEl.innerText = user.username;
  if (emailEl) emailEl.innerText = user.email;
});

function clearDynamicForms() 
{
  if (donateForm) donateForm.remove();
  if (volunteerForm) volunteerForm.remove();
  donateForm = null;
  volunteerForm = null;
  feedbackForm.style.display = "none";
}

function enableSupport() 
{
  if (!donateBtn || donateBtn.dataset.enabled) return;
  donateBtn.dataset.enabled = "true";

  donateBtn.disabled = false;
  volunteerBtn.disabled = false;
  feedbackBtn.disabled = false;


  donateBtn.onclick = () => 
    {
    clearDynamicForms();

    donateForm = document.createElement("div");
    donateForm.innerHTML = `
      <h3>Donate</h3>
      <input placeholder="Name">
      <input placeholder="Email">
      <input placeholder="Card Number">
      <input placeholder="Amount ($)">
      <button>Submit</button>
      <p></p>
    `;

    feedbackForm.before(donateForm);

    donateForm.querySelector("button").onclick = () => {
      donateForm.querySelector("p").innerText =
        "Thank you for your donation!";
    };
  };

  volunteerBtn.onclick = () => 
    {
    clearDynamicForms();

    volunteerForm = document.createElement("div");
    volunteerForm.innerHTML = `
      <h3>Volunteer</h3>
      <select>
        <option value="">Select</option>
        <option>Rescue Volunteer</option>
        <option>Medic Volunteer</option>
        <option>Shelter Support Volunteer</option>
        <option>Logistics & Distribution Volunteer</option>
        <option>Emotional & Psychological Support Volunteer</option>
        <option>Home Repair Volunteer</option>
        <option>Information Gathering Volunteer</option>
        <option>Training & Education Volunteer</option>
        <option>Debris Removal Volunteer</option>
      </select>
      <button>Submit</button>
      <p></p>
    `;

    feedbackForm.before(volunteerForm);

    volunteerForm.querySelector("button").onclick = () => {
      volunteerForm.querySelector("p").innerText =
        "Thank you for volunteering! We will email you for further procedure.";
    };
  };

  feedbackBtn.onclick = () => 
    {
    clearDynamicForms();
    feedbackForm.style.display = "block";
  };

  submitFeedback.onclick = () => 
    {
    if (!feedbackText.value.trim()) return;
    const p = document.createElement("p");
    p.innerText = `${currentUser.username}: ${feedbackText.value}`;
    feedbackList.appendChild(p);
    feedbackText.value = "";
  };
}

updateProfileBtn();
if (currentUser) enableSupport();
