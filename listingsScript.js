function showSideBar(){
    const sideBar = document.querySelector('.sideBar')
    sideBar.style.display= 'flex'
}

function hideSidebar(){
    const sideBar = document.querySelector('.sideBar')
    sideBar.style.display= 'none'
 }

 //My attempted code for dynamically updating listings page with resources avaialble to me
 //unsure how well it will work
 //still needs to be linked with database as well

 document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("listingContainer");

    const response = await fetch("/getDonations"); //again unsure what would be used as no access to database, used /getDonations as placeholder
    const donations = await response.json(); //assuming will use json to connect to backend(unsure what was used before)

    if (donations.length === 0) {
        container.innerHTML = "<h3>No current listings.</h3>";
        return;
    }

    donations.forEach(donation => {
        const item = document.createElement("div");
        item.classList.add("listingCard"); //indvidual listings "cards"

        //dynamically update listings page with information from donation form
        //added ID immediately after name because i thought it was a better stylistic choice than having it appear in the same order it appears in the form
        item.innerHTML = `
            <h3>${donation.name}</h3>
            <p><strong>ID:</strong> ${donation.donationID}</p> 
            <p><strong>Expiration:</strong> ${donation.expiration}</p>
            <p><strong>Allergens:</strong> ${donation.allergens}</p>
            <p><strong>Description:</strong> ${donation.description}</p>
            <p><strong>Serving Size:</strong> ${donation.servingSize}</p>
            <p><strong>Pick Up:</strong> ${donation.pickUpStart} - ${donation.pickUpEnd}</p>
        `;

        container.appendChild(item); 
    });
});