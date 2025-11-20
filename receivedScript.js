
function showSideBar(){
    const sideBar = document.querySelector('.sideBar')
    sideBar.style.display= 'flex'
}

function hideSidebar(){
    const sideBar = document.querySelector('.sideBar')
    sideBar.style.display= 'none'
 }


 //rewriting because cant find issue
 

function updateForm(){

        const yes = document.getElementById('yesExpir');
         const no = document.getElementById('noExpir');
         const date = document.getElementById('actualExpirationContainor');
        const expiration = document.getElementById('actualExpiration');

          if(no.checked){
                date.style.display = 'block';
            }else{
                date.style.display = 'none';
            }
    }

    document.querySelectorAll('input[name="expirationDate"]').forEach(radio => { //Error was found here, there was a space between 'input' and '['
        radio.addEventListener('change', updateForm);
           
        });
        
            updateForm(); // called to set initial state of field


