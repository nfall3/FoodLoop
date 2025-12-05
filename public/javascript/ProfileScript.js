/* FOODLOOP USER PROFILE SCRIPT - Database Connected */

// API Base URL
const API_URL = "http://localhost:3001";

// Global state variables
window.userEmail = localStorage.getItem("userEmail") || null;
window.userID = null;
window.userName = null;
window.userRole = null;
window.userPhone = null;
window.userCity = null;
window.userState = null;
window.profilePicture = null;

// Statistics
window.stats = {
  donations: 24,
  rescues: 18,
  meals: 156,
  hours: 42
};

// Initialize on page load
window.addEventListener("DOMContentLoaded", async function () {
  console.log("FoodLoop Profile: Initializing...");
  
  //Check if user is logged in
  if (!window.userEmail) {
    showToast("Please log in first", "error");
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
    return;
  }
  
  // Load profile from database
  await loadUserProfile();
  
  setupFileUpload();
  console.log("FoodLoop Profile: Ready");
});

/* Load User Profile from Database */
async function loadUserProfile() {
  try {
    const response = await fetch(`${API_URL}/api/profile/${window.userEmail}`);
    
    if (response.ok) {
      const userData = await response.json();
      
      // Set window variables
      window.userID = userData.user_id;
      window.userName = userData.name;
      window.userPhone = userData.phone;
      window.userCity = userData.city;
      window.userState = userData.state;
      window.userRole = userData.role;
      window.profilePicture = userData.profile_picture;
      
      // Update display
      displayProfileInfo();
      updateAvatarDisplay();
      displayLocation();
      
      // If profile is incomplete, prompt to complete it
      if (!userData.name || !userData.phone) {
        setTimeout(() => {
          showToast("Please complete your profile", "success");
          setTimeout(() => editProfile(), 1000);
        }, 500);
      }
      
    } else if (response.status === 404) {
      showToast("User not found. Please sign up again.", "error");
      setTimeout(() => {
        localStorage.removeItem("userEmail");
        window.location.href = "login.html";
      }, 2000);
    } else {
      showToast("Error loading profile", "error");
    }
  } catch (error) {
    console.error("Error loading profile:", error);
    showToast("Error connecting to server", "error");
  }
}

/* Toast Notification System */
function showToast(message, type = 'success') {
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✅' : '❌'}</span>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* Profile Display Functions */
function displayProfileInfo() {
  const userIDElement = document.getElementById('userID');
  const userEmailElement = document.getElementById('userEmail');
  const userPhoneElement = document.getElementById('userPhone');
  const userNameElement = document.querySelector('.profile-name');
  const userRoleElement = document.querySelector('.profile-role');
  
  if (userIDElement) userIDElement.textContent = window.userID || '';
  if (userEmailElement) userEmailElement.textContent = window.userEmail || '';
  if (userPhoneElement) userPhoneElement.textContent = window.userPhone || 'Not set';
  if (userNameElement) userNameElement.textContent = window.userName || 'Set your name';
  if (userRoleElement) userRoleElement.textContent = window.userRole || 'Set your role';
}

function displayLocation() {
  const locationElement = document.querySelector(".profile-location");
  if (locationElement) {
    const city = window.userCity || '';
    const state = window.userState || '';
    if (city || state) {
      locationElement.textContent = `${city}${city && state ? ', ' : ''}${state}`;
    } else {
      locationElement.textContent = 'Set your location';
    }
  }
}

function updateAvatarDisplay() {
  const avatar = document.querySelector(".profile-avatar");
  const profileIcon = document.querySelector(".profile-icon");
  
  const name = window.userName || 'User';
  const initials = name.split(" ").map((word) => word[0]).join("").toUpperCase() || 'U';
  
  if (window.profilePicture) {
    avatar.innerHTML = `<img src="${window.profilePicture}" alt="${name}"><div class="camera-icon" onclick="showPhotoMenu(event)" title="Options">📷</div>`;
    profileIcon.innerHTML = `<img src="${window.profilePicture}" alt="${initials}">`;
  } else {
    avatar.innerHTML = `${initials}<div class="camera-icon" onclick="showPhotoMenu(event)" title="Options">📷</div>`;
    profileIcon.textContent = initials;
  }
}

/* Logout Functionality */
function handleLogout() {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 400px;">
      <h2 style="margin-bottom: 1rem; color: #326A2F; text-align: center;">Confirm Logout</h2>
      <p style="color: #666; margin-bottom: 1.5rem; text-align: center;">
        Are you sure you want to log out of your account?
      </p>
      
      <div style="display: flex; gap: 1rem;">
        <button onclick="confirmLogout()" class="btn btn-primary" style="flex: 1; border: none;">
          Yes, Log Out
        </button>
        <button onclick="closeModal()" class="btn btn-secondary" style="flex: 1;">
          Cancel
        </button>
      </div>
    </div>
  `;
  
  modal.addEventListener("click", function (e) { 
    if (e.target === modal) closeModal(); 
  });
  
  document.body.appendChild(modal);
}

function confirmLogout() {
  localStorage.removeItem("userEmail");
  closeModal();
  showToast("Logged out successfully!", "success");
  setTimeout(() => {
    window.location.href = "/login";
  }, 1000);
}

/* Photo Menu Functions */
function showPhotoMenu(event) {
  event.stopPropagation();
  
  const existingMenu = document.querySelector(".photo-menu");
  if (existingMenu) { 
    existingMenu.remove(); 
    return; 
  }
  
  const menu = document.createElement("div");
  menu.className = "photo-menu";
  
  if (window.profilePicture) {
    menu.innerHTML = `
      <div class="photo-menu-item" onclick="triggerImageUpload()"><span class="menu-icon">📷</span><span>Change Photo</span></div>
      <div class="photo-menu-item photo-menu-danger" onclick="removeProfilePicture()"><span class="menu-icon">🗑️</span><span>Remove Photo</span></div>
      <div class="photo-menu-divider"></div>
      <div class="photo-menu-item" onclick="editProfile()"><span class="menu-icon">✏️</span><span>Edit Profile</span></div>
    `;
  } else {
    menu.innerHTML = `
      <div class="photo-menu-item" onclick="triggerImageUpload()"><span class="menu-icon">📷</span><span>Upload Photo</span></div>
      <div class="photo-menu-divider"></div>
      <div class="photo-menu-item" onclick="editProfile()"><span class="menu-icon">✏️</span><span>Edit Profile</span></div>
    `;
  }

  const cameraIcon = event.target.closest(".camera-icon");
  const rect = cameraIcon.getBoundingClientRect();
  menu.style.position = "fixed";
  menu.style.top = rect.bottom + 10 + "px";
  menu.style.left = rect.left + "px";
  
  document.body.appendChild(menu);
  setTimeout(() => { document.addEventListener("click", closePhotoMenu); }, 0);
}

function closePhotoMenu() {
  const menu = document.querySelector(".photo-menu");
  if (menu) { 
    menu.remove(); 
    document.removeEventListener("click", closePhotoMenu); 
  }
}

async function removeProfilePicture() {
  closePhotoMenu();
  
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 400px;">
      <h2 style="margin-bottom: 1rem; color: #326A2F; text-align: center;">Remove Photo</h2>
      <p style="color: #666; margin-bottom: 1.5rem; text-align: center;">
        Are you sure you want to remove your profile picture?
      </p>
      
      <div style="display: flex; gap: 1rem;">
        <button onclick="confirmRemovePhoto()" class="btn btn-primary" style="flex: 1; background: #d32f2f; border: none;">
          Yes, Remove
        </button>
        <button onclick="closeModal()" class="btn btn-secondary" style="flex: 1;">
          Cancel
        </button>
      </div>
    </div>
  `;
  
  modal.addEventListener("click", function (e) { 
    if (e.target === modal) closeModal(); 
  });
  
  document.body.appendChild(modal);
}

async function confirmRemovePhoto() {
  try {
    window.profilePicture = null;
    
    // Save to database
    const response = await fetch(`${API_URL}/api/profile/${window.userEmail}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: window.userName,
        phone: window.userPhone,
        city: window.userCity,
        state: window.userState,
        role: window.userRole,
        profile_picture: null
      })
    });

    if (response.ok) {
      updateAvatarDisplay();
      closeModal();
      showToast("Profile picture removed successfully!", "success");
    } else {
      showToast("Error removing photo", "error");
    }
  } catch (error) {
    console.error("Error removing photo:", error);
    showToast("Error connecting to server", "error");
  }
}

/* Profile Picture Upload */
function setupFileUpload() {
  const fileInput = document.getElementById("avatarUpload");
  if (fileInput) {
    fileInput.addEventListener("change", handleImageUpload);
  }
}

function triggerImageUpload() {
  closePhotoMenu();
  document.getElementById("avatarUpload").click();
}

async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    showToast("Please select a valid image file (JPG, PNG, GIF, etc.)", "error");
    return;
  }
  
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    showToast("Image size must be less than 5MB. Please choose a smaller image.", "error");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function (e) {
    try {
      window.profilePicture = e.target.result;
      
      // Save to database
      const response = await fetch(`${API_URL}/api/profile/${window.userEmail}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: window.userName,
          phone: window.userPhone,
          city: window.userCity,
          state: window.userState,
          role: window.userRole,
          profile_picture: e.target.result
        })
      });

      if (response.ok) {
        updateAvatarDisplay();
        showToast("Profile picture updated successfully!", "success");
      } else {
        showToast("Error saving photo", "error");
      }
    } catch (error) {
      console.error("Error saving photo:", error);
      showToast("Error connecting to server", "error");
    }
  };
  reader.onerror = function () {
    showToast("Error uploading image. Please try again.", "error");
  };
  reader.readAsDataURL(file);
  
  event.target.value = '';
}

/* Profile Editing */
function editProfile() {
  console.log("Opening profile edit modal...");
  closePhotoMenu();

  const currentName = window.userName || "";
  const currentRole = window.userRole || "";
  const currentEmail = window.userEmail || "";
  const currentPhone = window.userPhone || "";
  const currentCity = window.userCity || "";
  const currentState = window.userState || "";

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-content">
      <h2 style="margin-bottom: 1.5rem; color: #333; text-align: center;">✏️ Edit Your Profile</h2>
      
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #326A2F;">User ID <span style="color: #999; font-size: 0.85rem;">(Cannot be changed)</span></label>
        <input type="text" value="${window.userID || ''}" readonly style="width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #ccc; border-radius: 4px; background: #f5f5f5; color: #444; cursor: not-allowed;">
      </div>
      
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #326A2F;">Full Name <span style="color: red;">*</span></label>
        <input type="text" id="editName" value="${currentName}" required placeholder="Enter your full name" style="width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #ccc; border-radius: 4px;">
      </div>
      
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #326A2F;">Email Address <span style="color: red;">*</span></label>
        <input type="email" id="editEmail" value="${currentEmail}" readonly style="width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #ccc; border-radius: 4px; background: #f5f5f5; cursor: not-allowed;">
        <small style="color: #666;">Email cannot be changed</small>
      </div>
      
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #326A2F;">Phone Number <span style="color: red;">*</span></label>
        <input type="tel" id="editPhone" value="${currentPhone}" required placeholder="(225) 555-0123" style="width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #ccc; border-radius: 4px;">
      </div>
      
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #326A2F;">City <span style="color: red;">*</span></label>
        <input type="text" id="editCity" value="${currentCity}" required placeholder="e.g., Baton Rouge" style="width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #ccc; border-radius: 4px;">
      </div>
      
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #326A2F;">State <span style="color: red;">*</span></label>
        <input type="text" id="editState" value="${currentState}" required placeholder="e.g., Louisiana" style="width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #ccc; border-radius: 4px;">
      </div>
      
      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #326A2F;">Role/Title <span style="color: red;">*</span></label>
        <input type="text" id="editRole" value="${currentRole}" required placeholder="e.g., Food Rescue Volunteer" style="width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #ccc; border-radius: 4px;">
      </div>
      
      <div style="display: flex; gap: 1rem;">
        <button onclick="saveProfile()" class="btn btn-primary" style="flex: 1;">Save Changes</button>
        <button onclick="closeModal()" class="btn btn-secondary" style="flex: 1;">Cancel</button>
      </div>
      
      <p style="margin-top: 1rem; font-size: 0.85rem; color: #444; text-align: center;"><span style="color: red;">*</span> Required fields</p>
    </div>
  `;
  
  modal.addEventListener("click", function (e) { 
    if (e.target === modal) closeModal(); 
  });
  
  document.body.appendChild(modal);
  setTimeout(() => document.getElementById("editName").focus(), 100);
}

async function saveProfile() {
  const newName = document.getElementById("editName").value.trim();
  const newRole = document.getElementById("editRole").value.trim();
  const newPhone = document.getElementById("editPhone").value.trim();
  const newCity = document.getElementById("editCity").value.trim();
  const newState = document.getElementById("editState").value.trim();

  if (!newName || !newRole || !newPhone || !newCity || !newState) {
    showToast("Please fill in all required fields before saving.", "error");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/profile/${window.userEmail}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: newName,
        phone: newPhone,
        city: newCity,
        state: newState,
        role: newRole,
        profile_picture: window.profilePicture
      })
    });

    if (response.ok) {
      // Update window variables
      window.userName = newName;
      window.userRole = newRole;
      window.userPhone = newPhone;
      window.userCity = newCity;
      window.userState = newState;

      // Update display
      displayLocation();
      displayProfileInfo();
      updateAvatarDisplay();
      closeModal();
      showToast("Profile updated successfully!", "success");
    } else {
      showToast("Error saving profile", "error");
    }
  } catch (error) {
    console.error("Error saving profile:", error);
    showToast("Error connecting to server", "error");
  }
}

function closeModal() {
  const modal = document.querySelector(".modal-overlay");
  if (modal) { 
    modal.remove(); 
  }
}

/* Activity Logging - Would be saved to database in future */
function logActivity() {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-content">
      <h2 style="margin-bottom: 1.5rem; color: #326A2F; text-align: center;">Log Your Activity</h2>
      <p style="color: #666; margin-bottom: 1.5rem; text-align: center;">Help us track the amazing impact you're making in Louisiana!</p>
      
      <form id="activityForm" onsubmit="submitActivity(event)">
        <div class="form-group">
          <label for="activityType">Activity Type <span style="color: red;">*</span></label>
          <select id="activityType" required>
            <option value="">-- Select Activity Type --</option>
            <option value="donation">Food Donation</option>
            <option value="rescue">Food Rescue/Pickup</option>
            <option value="distribution">Food Distribution</option>
            <option value="volunteer">General Volunteering</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="activityDate">Date <span style="color: red;">*</span></label>
          <input type="date" id="activityDate" required max="${new Date().toISOString().split("T")[0]}">
          <small>When did this activity occur?</small>
        </div>
        
        <div class="form-group">
          <label for="hoursSpent">Hours Spent <span style="color: red;">*</span></label>
          <input type="number" id="hoursSpent" min="0.5" step="0.5" placeholder="e.g., 2.5" required>
          <small>How many hours did you dedicate?</small>
        </div>
        
        <div class="form-group">
          <label for="mealsCount">Meals Saved / Items Collected</label>
          <input type="number" id="mealsCount" min="1" placeholder="e.g., 25">
          <small>Approximate number of meals or food items (optional)</small>
        </div>
        
        <div class="form-group">
          <label for="activityLocation">Location <span style="color: red;">*</span></label>
          <input type="text" id="activityLocation" placeholder="e.g., Baton Rouge Food Bank" required>
          <small>Where did this activity take place?</small>
        </div>
        
        <div class="form-group">
          <label for="activityDescription">Description</label>
          <textarea id="activityDescription" placeholder="Tell us about your experience..."></textarea>
          <small>Share details about your contribution (optional)</small>
        </div>
        
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
          <button type="submit" class="btn btn-primary" style="flex: 1;">Submit Activity</button>
          <button type="button" onclick="closeModal()" class="btn btn-secondary" style="flex: 1;">Cancel</button>
        </div>
      </form>
    </div>
  `;
  
  modal.addEventListener("click", function (e) { 
    if (e.target === modal) closeModal(); 
  });
  
  document.body.appendChild(modal);
  setTimeout(() => (document.getElementById("activityDate").valueAsDate = new Date()), 100);
}

function submitActivity(event) {
  event.preventDefault();

  const activityData = {
    type: document.getElementById("activityType").value,
    date: document.getElementById("activityDate").value,
    hours: parseFloat(document.getElementById("hoursSpent").value),
    meals: document.getElementById("mealsCount").value || 0,
    location: document.getElementById("activityLocation").value,
    description: document.getElementById("activityDescription").value,
  };

  closeModal();
  updateStatistics(activityData);
  celebrateCompletion();
}

function updateStatistics(activityData) {
  if (activityData.type === "donation") {
    window.stats.donations += 1;
    document.getElementById("donationsCount").textContent = window.stats.donations;
  } else if (activityData.type === "rescue") {
    window.stats.rescues += 1;
    document.getElementById("rescuesCount").textContent = window.stats.rescues;
  }

  if (activityData.meals > 0) {
    window.stats.meals += parseInt(activityData.meals);
    document.getElementById("mealsCount").textContent = window.stats.meals;
  }

  window.stats.hours += Math.ceil(activityData.hours);
  document.getElementById("hoursCount").textContent = window.stats.hours;
}

/* Confetti Celebration */
function celebrateCompletion() {
  const userName = window.userName ? window.userName.split(" ")[0] : "Friend";

  const canvas = document.createElement("canvas");
  canvas.id = "confettiCanvas";
  document.body.appendChild(canvas);

  const thankYouDiv = document.createElement("div");
  thankYouDiv.className = "thank-you-overlay";
  thankYouDiv.innerHTML = `
    <h2>🎉 Thank You, ${userName}! 🎉</h2>
    <p>Your contribution is making a real difference<br>in fighting food waste and hunger in Louisiana!</p>
    <p style="margin-top: 1rem; font-size: 1rem; color: #326A2F; font-weight: bold;">Together, we're building a better community! 💚</p>
  `;
  document.body.appendChild(thankYouDiv);

  startConfetti(canvas);
  setTimeout(() => { 
    canvas.remove(); 
    thankYouDiv.remove(); 
  }, 5000);
}

function startConfetti(canvas) {
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  class ConfettiPiece {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height - canvas.height;
      this.size = Math.random() * 10 + 5;
      this.speedY = Math.random() * 3 + 2;
      this.speedX = Math.random() * 2 - 1;
      this.color = this.randomColor();
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 10 - 5;
    }

    randomColor() {
      const colors = ["#326A2F", "#4a8f45", "#5ea955", "#FFD700", "#FF6B6B", "#4ECDC4", "#95E1D3"];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;
      if (this.y > canvas.height) { 
        this.y = -20; 
        this.x = Math.random() * canvas.width; 
      }
    }
    
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      ctx.restore();
    }
  }
  
  const confettiPieces = [];
  for (let i = 0; i < 150; i++) { 
    confettiPieces.push(new ConfettiPiece()); 
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiPieces.forEach((piece) => { 
      piece.update(); 
      piece.draw(); 
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* Statistics Detail View */
function showDetails(type) {
  const details = {
    donations: {
      title: "Your Donations",
      message: `You've made ${window.stats.donations} food donations helping Louisiana families. Keep up the great work!`,
      breakdown: ["🥫 12 non-perishable items", "🍎 8 fresh produce donations", "🍞 4 bakery contributions"],
    },
    rescues: {
      title: "Food Rescues",
      message: `You've completed ${window.stats.rescues} food rescue missions in the Baton Rouge area.`,
      breakdown: ["🏪 10 grocery store pickups", "🍽️ 5 restaurant rescues", "🎓 3 campus event collections"],
    },
    impact: {
      title: "Meals Impact",
      message: `Your efforts have saved ${window.stats.meals} meals from going to waste!`,
      breakdown: ["👨‍👩‍👧‍👦 Equivalent to feeding 52 families", "🌍 Reduced 312 lbs of food waste", "♻️ Saved 468 lbs CO2 emissions"],
    },
    hours: {
      title: "Volunteer Hours",
      message: `You've dedicated ${window.stats.hours} hours to fighting hunger in Louisiana.`,
      breakdown: ["🚗 24 hours in food transportation", "📋 10 hours in coordination", "🤝 8 hours in community outreach"],
    },
  };

  const detail = details[type];
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-content">
      <h2 style="margin-bottom: 1rem; color: #326A2F; text-align: center;">${detail.title}</h2>
      <p style="margin-bottom: 1.5rem; color: #666; line-height: 1.6;">${detail.message}</p>
      <div style="background: #f8f9fd; padding: 1rem; border-radius: 10px; margin-bottom: 1.5rem;">
        <h3 style="color: #326A2F; font-size: 1rem; margin-bottom: 0.5rem;">Breakdown:</h3>
        <ul style="list-style: none; padding: 0;">
          ${detail.breakdown.map((item) => `<li style="padding: 0.5rem 0; color: #666; border-bottom: 1px solid #e0e0e0;">${item}</li>`).join("")}
        </ul>
      </div>
      <button onclick="closeModal()" class="btn btn-primary" style="width: 100%;">Close</button>
    </div>
  `;
  
  modal.addEventListener("click", function (e) { 
    if (e.target === modal) closeModal(); 
  });
  
  document.body.appendChild(modal);
}

console.log("FoodLoop Profile Script: Loaded successfully");