/* FOODLOOP USER PROFILE SCRIPT */
// Global state variables
window.userID = window.userID || "FL-" + Math.random().toString(36).substr(2, 9).toUpperCase(); // Unique user ID
window.userEmail = window.userEmail || "keanna.mckinney@foodloop.com"; // User email
window.userPhone = window.userPhone || "(225) 555-0123"; // User phone
window.userCity = window.userCity || "Baton Rouge"; // User city
window.userState = window.userState || "Louisiana"; // User state
window.profilePicture = window.profilePicture || localStorage.getItem("profilePicture") || null; // Profile picture from storage

// Initialize on page load
window.addEventListener("DOMContentLoaded", function () {
  console.log("FoodLoop Profile: Initializing...");
  displayProfileInfo();
  updateAvatarDisplay("Ke'Anna McKinney");
  displayLocation();
  console.log("FoodLoop Profile: Ready");
});

/* Profile Display Functions */
function displayProfileInfo() {
  const roleElement = document.querySelector(".profile-role");
  let contactDetails = document.querySelector(".contact-details");
  if (!contactDetails) { // Create if doesn't exist
    contactDetails = document.createElement("div");
    contactDetails.className = "contact-details";
    contactDetails.style.cssText = "margin: 1rem 0; padding: 1rem; background: #f8f9fd; border-radius: 10px; text-align: left;";
  }

  contactDetails.innerHTML = `
    <p style="color: #999; font-size: 0.85rem; margin: 0.5rem 0; font-family: 'Courier New', monospace;">
      <strong style="color: #326A2F;">User ID:</strong> ${window.userID}
    </p>
    <p style="color: #666; font-size: 0.9rem; margin: 0.5rem 0;">
      <strong style="color: #326A2F;">Email:</strong> ${window.userEmail}
    </p>
    <p style="color: #666; font-size: 0.9rem; margin: 0.5rem 0;">
      <strong style="color: #326A2F;">Phone:</strong> ${window.userPhone}
    </p>
  `;

  if (!document.querySelector(".contact-details")) { // Insert into DOM if new
    const locationElement = document.querySelector(".profile-location");
    if (locationElement) {
      locationElement.parentNode.insertBefore(contactDetails, locationElement.nextSibling);
    } else {
      roleElement.parentNode.insertBefore(contactDetails, roleElement.nextSibling);
    }
  }
}

function displayLocation() {
  let locationElement = document.querySelector(".profile-location");
  if (!locationElement) { // Create if doesn't exist
    locationElement = document.createElement("div");
    locationElement.className = "profile-location";
  }
  locationElement.textContent = `${window.userCity}, ${window.userState}`;
  if (!document.querySelector(".profile-location")) { // Insert into DOM if new
    const roleElement = document.querySelector(".profile-role");
    roleElement.parentNode.insertBefore(locationElement, roleElement.nextSibling);
  }
}

function updateAvatarDisplay(fullName) {
  const avatar = document.querySelector(".profile-avatar");
  const profileIcon = document.querySelector(".profile-icon");
  const initials = fullName.split(" ").map((word) => word[0]).join("").toUpperCase(); // Generate initials
  if (window.profilePicture) { // Show uploaded photo
    avatar.innerHTML = `<img src="${window.profilePicture}" alt="${fullName}"><div class="camera-icon" onclick="showPhotoMenu(event)" title="Options">📷</div>`;
    profileIcon.innerHTML = `<img src="${window.profilePicture}" alt="${initials}">`;
  } else { // Show initials
    avatar.innerHTML = `${initials}<div class="camera-icon" onclick="showPhotoMenu(event)" title="Options">📷</div>`;
    profileIcon.textContent = initials;
  }
}

/* Photo Menu Functions */
function showPhotoMenu(event) {
  event.stopPropagation();
  const existingMenu = document.querySelector(".photo-menu");
  if (existingMenu) { existingMenu.remove(); return; } // Toggle menu if already open
  const menu = document.createElement("div");
  menu.className = "photo-menu";
  // Build menu based on whether photo exists
  if (window.profilePicture) {
    menu.innerHTML = `
      <div class="photo-menu-item" onclick="triggerImageUpload()"><span class="menu-icon">📷</span><span>Change Photo</span></div>
      <div class="photo-menu-item photo-menu-danger" onclick="removeProfilePicture()"><span class="menu-icon"></span><span>Remove Photo</span></div>
      <div class="photo-menu-divider"></div>
      <div class="photo-menu-item" onclick="editProfile()"><span class="menu-icon"></span><span>Edit Profile</span></div>
    `;
  } else {
    menu.innerHTML = `
      <div class="photo-menu-item" onclick="triggerImageUpload()"><span class="menu-icon">📷</span><span>Upload Photo</span></div>
      <div class="photo-menu-divider"></div>
      <div class="photo-menu-item" onclick="editProfile()"><span class="menu-icon"></span><span>Edit Profile</span></div>
    `;
  }

  // Position menu near camera icon
  const cameraIcon = event.target.closest(".camera-icon");
  const rect = cameraIcon.getBoundingClientRect();
  menu.style.position = "fixed";
  menu.style.top = rect.bottom + 10 + "px";
  menu.style.left = rect.left + "px";
  document.body.appendChild(menu);
  setTimeout(() => { document.addEventListener("click", closePhotoMenu); }, 0); // Close on outside click
}
function closePhotoMenu() {
  const menu = document.querySelector(".photo-menu");
  if (menu) { menu.remove(); document.removeEventListener("click", closePhotoMenu); }
}

function removeProfilePicture() {
  closePhotoMenu();
  if (confirm("Are you sure you want to remove your profile picture?")) {
    window.profilePicture = null;
    localStorage.removeItem("profilePicture");
    const userName = document.querySelector(".profile-name").textContent;
    updateAvatarDisplay(userName);
    alert("✅ Profile picture removed successfully!");
    console.log("Profile picture removed");
  }
}

/* Profile Picture Upload */
function triggerImageUpload() {
  let fileInput = document.getElementById("avatarUpload");
  if (!fileInput) { // Create hidden file input if doesn't exist
    fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.id = "avatarUpload";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";
    fileInput.addEventListener("change", handleImageUpload);
    document.body.appendChild(fileInput);
  }
  fileInput.click();
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) { // Validate file type
    alert("❌ Please select a valid image file (JPG, PNG, GIF, etc.)");
    return;
  }
  const maxSize = 5 * 1024 * 1024; // 5MB limit
  if (file.size > maxSize) {
    alert("❌ Image size must be less than 5MB. Please choose a smaller image.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) { // Save to storage and update display
    window.profilePicture = e.target.result;
    localStorage.setItem("profilePicture", e.target.result);
    const userName = document.querySelector(".profile-name").textContent;
    updateAvatarDisplay(userName);
    console.log("Profile picture uploaded successfully");
    alert("Profile picture updated successfully!");
  };
  reader.onerror = function () {
    alert("❌ Error uploading image. Please try again.");
    console.error("Error reading file");
  };
  reader.readAsDataURL(file); // Convert to base64
}

/* Profile Editing */
function editProfile() {
  console.log("Opening profile edit modal...");
  closePhotoMenu(); // Close photo menu if open

  // Get current values
  const currentName = document.querySelector(".profile-name").textContent;
  const currentRole = document.querySelector(".profile-role").textContent;

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;";

  modal.innerHTML = `
    <div class="modal-content" style="background: white; padding: 2rem; border-radius: 15px; max-width: 500px; width: 90%;">
      <h2 style="margin-bottom: 1.5rem; color: #333; text-align: center;">✏️ Edit Your Profile</h2>
      
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #326A2F;">User ID <span style="color: #999; font-size: 0.85rem;">(Cannot be changed)</span></label>
        <input type="text" value="${window.userID}" readonly style="width: 100%; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; background: #f5f5f5; color: #666; cursor: not-allowed;">
      </div>
      
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #326A2F;">Full Name <span style="color: red;">*</span></label>
        <input type="text" id="editName" value="${currentName}" required placeholder="Enter your full name" style="width: 100%; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;">
      </div>
      
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #326A2F;">Email Address <span style="color: red;">*</span></label>
        <input type="email" id="editEmail" value="${window.userEmail}" required placeholder="your.email@foodloop.com" style="width: 100%; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;">
      </div>
      
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #326A2F;">Phone Number <span style="color: red;">*</span></label>
        <input type="tel" id="editPhone" value="${window.userPhone}" required placeholder="(225) 555-0123" style="width: 100%; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;">
      </div>
      
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #326A2F;">City <span style="color: red;">*</span></label>
        <input type="text" id="editCity" value="${window.userCity}" required placeholder="e.g., Baton Rouge" style="width: 100%; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;">
      </div>
      
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #326A2F;">State <span style="color: red;">*</span></label>
        <input type="text" id="editState" value="${window.userState}" required placeholder="e.g., Louisiana" style="width: 100%; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;">
      </div>
      
      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #326A2F;">Role/Title <span style="color: red;">*</span></label>
        <input type="text" id="editRole" value="${currentRole}" required placeholder="e.g., Food Rescue Volunteer" style="width: 100%; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;">
      </div>
      
      <div style="display: flex; gap: 1rem;">
        <button onclick="saveProfile()" class="btn btn-primary" style="flex: 1; padding: 0.8rem; background: linear-gradient(135deg, #326A2F, #4a8f45); color: white; border: none; border-radius: 25px; cursor: pointer; font-weight: 500;">💾 Save Changes</button>
        <button onclick="closeModal()" class="btn btn-secondary" style="flex: 1; padding: 0.8rem; background: white; color: #326A2F; border: 2px solid #326A2F; border-radius: 25px; cursor: pointer; font-weight: 500;">❌ Cancel</button>
      </div>
      
      <p style="margin-top: 1rem; font-size: 0.85rem; color: #999; text-align: center;"><span style="color: red;">*</span> Required fields</p>
    </div>
  `;
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); }); // Close on overlay click
  document.body.appendChild(modal);
  setTimeout(() => document.getElementById("editName").focus(), 100); // Focus first input
}

function saveProfile() {
  console.log("Saving profile changes...");

  // Get all input values
  const newName = document.getElementById("editName").value.trim();
  const newRole = document.getElementById("editRole").value.trim();
  const newEmail = document.getElementById("editEmail").value.trim();
  const newPhone = document.getElementById("editPhone").value.trim();
  const newCity = document.getElementById("editCity").value.trim();
  const newState = document.getElementById("editState").value.trim();

  if (!newName || !newRole || !newEmail || !newPhone || !newCity || !newState) { // Validate required fields
    alert("❌ Please fill in all required fields before saving.");
    return;
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation
  if (!emailPattern.test(newEmail)) {
    alert("❌ Please enter a valid email address.");
    document.getElementById("editEmail").focus();
    return;
  }

  // Update global variables
  window.userEmail = newEmail;
  window.userPhone = newPhone;
  window.userCity = newCity;
  window.userState = newState;

  // Update UI
  document.querySelector(".profile-name").textContent = newName;
  document.querySelector(".profile-role").textContent = newRole;
  displayLocation();
  displayProfileInfo();
  updateAvatarDisplay(newName);
  closeModal();
  alert("Profile updated successfully!");
  console.log("Profile saved:", { newName, newRole, newEmail, newPhone, newCity, newState });
}

function closeModal() {
  const modal = document.querySelector(".modal-overlay");
  if (modal) { modal.remove(); console.log("Modal closed"); }
}

/* Activity Logging */
function logActivity() {
  console.log("Opening activity logging form...");
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-content">
      <h2 style="margin-bottom: 1.5rem; color: #326A2F; text-align: center;">📝 Log Your Activity</h2>
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
          <button type="submit" class="btn btn-primary" style="flex: 1;">✅ Submit Activity</button>
          <button type="button" onclick="closeModal()" class="btn btn-secondary" style="flex: 1;">❌ Cancel</button>
        </div>
      </form>
    </div>
  `;
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); }); // Close on overlay click
  document.body.appendChild(modal);
  setTimeout(() => (document.getElementById("activityDate").valueAsDate = new Date()), 100); // Set today's date
}

function submitActivity(event) {
  event.preventDefault();

  // Collect form data
  const activityData = {
    type: document.getElementById("activityType").value,
    date: document.getElementById("activityDate").value,
    hours: parseFloat(document.getElementById("hoursSpent").value),
    meals: document.getElementById("mealsCount").value || 0,
    location: document.getElementById("activityLocation").value,
    description: document.getElementById("activityDescription").value,
  };

  console.log("Activity submitted:", activityData);
  closeModal();
  updateStatistics(activityData); // Update stat counters
  celebrateCompletion(); // Show confetti celebration
}

function updateStatistics(activityData) {
  const statItems = document.querySelectorAll(".stat-item");

  if (activityData.type === "donation") { // Increment donations counter
    const donationsStat = statItems[0].querySelector(".stat-number");
    donationsStat.textContent = parseInt(donationsStat.textContent) + 1;
  } else if (activityData.type === "rescue") { // Increment rescues counter
    const rescuesStat = statItems[1].querySelector(".stat-number");
    rescuesStat.textContent = parseInt(rescuesStat.textContent) + 1;
  }

  if (activityData.meals > 0) { // Add meals saved
    const mealsStat = statItems[2].querySelector(".stat-number");
    mealsStat.textContent = parseInt(mealsStat.textContent) + parseInt(activityData.meals);
  }

  const hoursStat = statItems[3].querySelector(".stat-number"); // Add volunteer hours
  hoursStat.textContent = parseInt(hoursStat.textContent) + Math.ceil(activityData.hours);
}

/* Confetti Celebration */
function celebrateCompletion() {
  const userName = document.querySelector(".profile-name").textContent.split(" ")[0]; // Get first name

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
  setTimeout(() => { canvas.remove(); thankYouDiv.remove(); }, 5000); // Remove after 5 seconds
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
      if (this.y > canvas.height) { this.y = -20; this.x = Math.random() * canvas.width; } // Reset when off screen
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
  for (let i = 0; i < 150; i++) { confettiPieces.push(new ConfettiPiece()); } // Create 150 pieces

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiPieces.forEach((piece) => { piece.update(); piece.draw(); });
    requestAnimationFrame(animate); // Continuous animation loop
  }
  animate();
}

/* Statistics Detail View */
function showDetails(type) {
  console.log("Showing details for:", type);

  const details = { // Data for each stat type
    donations: {
      title: "Your Donations",
      message: "You've made 24 food donations helping Louisiana families. Keep up the great work!",
      breakdown: ["🥫 12 non-perishable items", "🍎 8 fresh produce donations", "🍞 4 bakery contributions"],
    },
    rescues: {
      title: "Food Rescues",
      message: "You've completed 18 food rescue missions in the Baton Rouge area.",
      breakdown: ["🏪 10 grocery store pickups", "🍽️ 5 restaurant rescues", "🎓 3 campus event collections"],
    },
    impact: {
      title: "Meals Impact",
      message: "Your efforts have saved 156 meals from going to waste!",
      breakdown: ["👨‍👩‍👧‍👦 Equivalent to feeding 52 families", "🌍 Reduced 312 lbs of food waste", "♻️ Saved 468 lbs CO2 emissions"],
    },
    hours: {
      title: "Volunteer Hours",
      message: "You've dedicated 42 hours to fighting hunger in Louisiana.",
      breakdown: ["🚗 24 hours in food transportation", "📋 10 hours in coordination", "🤝 8 hours in community outreach"],
    },
  };

  const detail = details[type];
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-content" style="background: white; padding: 2rem; border-radius: 15px; max-width: 500px; width: 90%;">
      <h2 style="margin-bottom: 1rem; color: #326A2F; text-align: center;">${detail.title}</h2>
      <p style="margin-bottom: 1.5rem; color: #666; line-height: 1.6;">${detail.message}</p>
      <div style="background: #f8f9fd; padding: 1rem; border-radius: 10px; margin-bottom: 1.5rem;">
        <h3 style="color: #326A2F; font-size: 1rem; margin-bottom: 0.5rem;">Breakdown:</h3>
        <ul style="list-style: none; padding: 0;">
          ${detail.breakdown.map((item) => `<li style="padding: 0.5rem 0; color: #666; border-bottom: 1px solid #e0e0e0;">${item}</li>`).join("")}
        </ul>
      </div>
      <button onclick="closeModal()" class="btn btn-primary" style="width: 100%; padding: 0.8rem; background: linear-gradient(135deg, #326A2F, #4a8f45); color: white; border: none; border-radius: 25px; cursor: pointer; font-weight: 500;">Close</button>
    </div>
  `;
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); }); // Close on overlay click
  document.body.appendChild(modal);
}

/* Navigation */
function showTab(tabName) {
  console.log("Navigating to:", tabName);
  alert(`🔄 Navigating to ${tabName.charAt(0).toUpperCase() + tabName.slice(1)} section...\n\n(Tab switching UI would be implemented here)`);
}

/* Utility Functions */
function formatPhoneNumber(phone) { // Format phone as (XXX) XXX-XXXX
  const cleaned = ("" + phone).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) return "(" + match[1] + ") " + match[2] + "-" + match[3];
  return phone;
}
console.log("FoodLoop Profile Script: Loaded successfully");