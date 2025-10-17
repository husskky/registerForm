const APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyZ1A2Jb8nTVKn-y9VadBPSyjo6iF-HU9bYswSi9ucrBX96ERoql23igAqVXuojeDM/exec"

function validateEmail(email) {
  email = email.trim();
  if (!email.includes("@")) return false;
  if (email.indexOf("@") === 0) return false; 
  if (!email.includes(".")) return false;
  if (email.lastIndexOf(".") < email.indexOf("@")) return false;
  return true;
}

function validatePassword(password) {
  password = password.trim();
  if (password.length < 8) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[A-Z]/.test(password)) return false;
  return true;
}

function showToast(message, type) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

document.getElementById("sub-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = {};

  formData.forEach((value, key) => {
    data[key] = value;
  });

  if (!validateEmail(data.userEmail)) {
    showToast("Please enter a valid email address.", "error");
    return;
  }
  if (!validatePassword(data.userPassword)) {
    showToast("Password must be at least 8 characters, include a number and an uppercase letter.", "error");
    return;
  }


  data.timestamp = new Date().toLocaleString();

  try {
    showToast("Submitting your data...", "loading");

    await fetch(APP_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    showToast("Data submitted successfully!", "success");
    form.reset();
  } catch (error) {
    showToast("Failed to submit data. Try again.", "error");
    console.error("Error submitting data", error);
  }
});

