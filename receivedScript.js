function showSideBar(){
    const sideBar = document.querySelector('.sideBar')
    sideBar.style.display= 'flex'
}

function hideSidebar(){
    const sideBar = document.querySelector('.sideBar')
    sideBar.style.display= 'none'
 }


 //rewriting because cant find issue
 /*

function updateForm(){

        const yes = document.getElementById('yesExpir');
         const no = document.getElementById('noExpir');
         const date = document.getElementById('actualExpirationContainor');
        const expiration = document.getElementById('actualExpiration');

         if(no.checked == true){
                date.style.display = 'block';
            }else{
                date.style.display = 'none';
            }
    }

    document.querySelectorAll('input name="expirationDate').forEach(radio => {
        radio.addEventListener('change', updateForm);
           
        });
        
            updateForm(); // called here to set initial state of field

})

*/


