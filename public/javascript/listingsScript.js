function showSideBar(){
    const sideBar = document.querySelector('.sideBar')
    sideBar.style.display= 'flex'
}

function hideSidebar(){
    const sideBar = document.querySelector('.sideBar')
    sideBar.style.display= 'none'
 }

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById('listingsContainer');
    container.innerHTML = "Loading...";

    try {
        const res = await fetch('http://localhost:3001/listDonations');
        const donations = await res.json();

        if (donations.length === 0) {
          container.innerHTML = "<p>No donations found.</p>";
          return;
        }

        container.innerHTML = '';

        donations.forEach(donation => {
          const div = document.createElement('div');
          div.className = 'donation';
          div.innerHTML = `
            <h3>${donation.donationName}</h3>
            <p><strong>Description:</strong> ${donation.donationDesc}</p>
            <p><strong>Allergies:</strong> ${donation.allergies || 'None'}</p>
            <p><strong>Address:</strong> ${donation.homeAddress}</p>
            <p><strong>Pickup Date:</strong> ${new Date(donation.pickupDate).toLocaleDateString()}</p>
            <p><strong>Pickup Time:</strong> ${donation.pickupStart} - ${donation.pickupEnd}</p>
          `;
          container.appendChild(div);
        });
      } catch (err) {
        container.innerHTML = "<p>Error loading donations.</p>";
        console.error(err);
      }
    window.addEventListener('DOMContentLoaded', loadDonations);
});