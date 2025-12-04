
function showSideBar(){
    const sideBar = document.querySelector('.sideBar')
    sideBar.style.display= 'flex'
}

function hideSidebar(){
    const sideBar = document.querySelector('.sideBar')
    sideBar.style.display= 'none'
 }

 function generateDonationId(){
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";

    for(let i = 0; i<9; i++){
        id += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return id;
 }

 document.addEventListener("DOMContentLoaded", () =>{
    const form = document.querySelector(".donateForm");

    form.addEventListener("submit", async (Event) =>{
        Event.preventDefault();

        let donationID;
        let isUnique = false;

        while(!isUnique){
            donationID = generateDonationId();

            const response = await fetch('/checkID/${donationID}');//checks if ID already exists, does this by asking backend
            const result = await response.text();

            if(result.trim() == "not_exists"){
                isUnique = true;
            }
        }

        console.log("ID: ", donationID);
    })
 })