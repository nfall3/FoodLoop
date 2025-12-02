// Generate user ID and display all profile info on page load
window.addEventListener('DOMContentLoaded', function() {
    // Generate a unique user ID (format: FL-XXXXXXXXX)
    if (!window.userID) {
        window.userID = 'FL-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    
    // Store default user info
    if (!window.userEmail) window.userEmail = 'keanna.mckinney@foodloop.com';
    if (!window.userPhone) window.userPhone = '(555) 123-4567';
    
    // Display all profile information on the card
    const profileInfo = document.querySelector('.profile-info');
    const roleElement = document.querySelector('.profile-role');
    
    // Create container for contact details
    const contactDetails = document.createElement('div');
    contactDetails.style.cssText = 'margin-bottom: 1rem; text-align: center;';
    contactDetails.innerHTML = `
        <p style="color: #999; font-size: 0.85rem; margin: 0.3rem 0; font-family: monospace;">
            <strong>ID:</strong> ${window.userID}
        </p>
        <p style="color: #666; font-size: 0.9rem; margin: 0.3rem 0;">
            <strong>Email:</strong> ${window.userEmail}
        </p>
        <p style="color: #666; font-size: 0.9rem; margin: 0.3rem 0;">
            <strong>Phone:</strong> ${window.userPhone}
        </p>
    `;
    
    // Insert after role element
    roleElement.parentNode.insertBefore(contactDetails, roleElement.nextSibling);
});
 function editProfile() {
    //Create model overlay 
    const modal = document.createElement('div');
    modal.style.cssText = `
    position: fixed; 
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center; 
    z-index: 1000;
    `;
    //Create modal content 
    modal.innerHTML = `
    <div style = "background: white; padding: 2rem; border-radius: 15px; max-width: 500px; width: 90%;">
    <h2 style = "margin-bottom: 1.5rem; color: #333;"> Edit Profile</h2>

    <div style = "margin-bottom: 1rem;">
    <label style = "display: block; margin-bottom: 0.5rem; font-weight: 500;">User ID: </label>
    <input type = "text" value = "${window.userID}" readonly 
    style = "width: 100%; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px;
    font-size: 1rem; background: #f5f5f5; color: #666; cursor: not-allowed;">
    </div>
            
            
    <div style = "margin-bottom: 1rem;">
    <label style = "display: block; margin-bottom: 0.5rem; font-weight: 500;"> Name: </label>
    <input type = "text" id = "editName" value = "Ke'Anna Mckinney" 
    style = "width: 100%; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;">
    </div>

    <div style = "margin-bottom: 1rem;">
    <label style = "display: block; margin-bottom: 0.5rem; font-weight: 500;"> Email: </label> 
    <input type = "email" id = "editEmail" value = "kmcki25@lsu.edu" style = "width: 100%; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px;
    font-size: 1rem;">
    </div>

        
    <div style = "margin-bottom: 1.5rem:">
    <label style = "display: block; margin-bottom: 0.5rem; font-weight: 500;"> Role: </label>
    <input type = "text" id = "editRole" value = "Food Rescue Volunteer" style = "width: 100%; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;">
    </div>
    
    <div style = "display: flex; gap: 1rem;">
    <button onclick = "saveProfile()"
    style = "flex: 1; padding: 0.8rem; background: linear-gradient(135deg, #6b7c3d, #8ba652);
    color: white; border: none; border-radius: 25px; cursor: pointer; font-weight: 500;"> Save Changes 
    </button>
    
    <button onclick = "closeModal()"
    style = "flex: 1; padding: 0.8rem; background: white; color: #6b7c3d;
    border: 2px solid #6b7c3d; border-radius: 25px; cursor: pointer; font-weight: 500;"> Cancel 
    </button>
    </div>
    </div>
     `;
     //Close modal when clicking outside 
     modal.addEventListener('click', function(e){
        if (e.target === modal){
            closeModal();
        }
    });
    document.body.appendChild(modal);
}
//Save profile changes and update the display 
function saveProfile(){
const newName = document.getElementById('editName').value;
const newRole = document.getElementById('editRole').value;
const newEmail = document.getElementById('editEmail').value;
const newPhone = document.getElementById('editPhone').value;

// Update stored values
window.userEmail = newEmail;
window.userPhone = newPhone;

//Update the profile display 
document.querySelector('.profile-name').textContent = newName;
document.querySelector('.profile-role').textContent = newRole;
document.querySelector('.profile-email').textContent = newEmail;
document.querySelector('.profile-phone').textContent = newPhone;

// Update contact details on the card
    const contactDetails = document.querySelector('.contact-details');
    contactDetails.innerHTML = `
        <p style="color: #999; font-size: 0.85rem; margin: 0.3rem 0; font-family: monospace;">
            <strong>ID:</strong> ${window.userID}
        </p>
        <p style="color: #666; font-size: 0.9rem; margin: 0.3rem 0;">
            <strong>Email:</strong> ${window.userEmail}
        </p>
        <p style="color: #666; font-size: 0.9rem; margin: 0.3rem 0;">
            <strong>Phone:</strong> ${window.userPhone}
        </p>
    `;


const initials = newName.split(' ').map(word => word[0]).join('').toUpperCase();
 document.querySelector('.profile-avatar').innerHTML = `
 ${initials}
 <div class = "edit-icon">✏️</div>
 `;
 closeModal();
 alert('Profile updated successfully!');
}

//Close and remove the modal 
 function closeModal(){
    const modal = document.querySelector('div[style*="position: fixed"]');
    if(modal){
        modal.remove();
    }
}