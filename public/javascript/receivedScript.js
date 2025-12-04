/*
//react is only used for character count function
import { useState } from "react";
import { useEffect } from "react";
*/

function showSideBar(){
    const sideBar = document.querySelector('.sideBar')
    sideBar.style.display= 'flex'
}

function hideSidebar(){
    const sideBar = document.querySelector('.sideBar')
    sideBar.style.display= 'none'
 }


 //rewriting because cant find issue
 //UPDATE: ISSUE FOUND 
 

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




//ISSUE            
//Likely because i tried to implement with react since the professor called for it suddenly:
//Funtionality stops working
//WHAT WAS ATTEMPTED HERE:
//Adding a character counter for the comment text box
//Commented out for now
//Some parts also ommited in receivedMain.html because of this issue.
/*
function CharacterCounter(){
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        const textarea = document.getElementById('free-text');

        if(!textarea){
            return;
        }

        const updateCount = () =>{
            setCount(textarea.value.length);
        };

        textarea.addEventListener("input", updateCount);
        count();

        return () => textarea.removeEventListener("input", updateCount);
    },
    );

    return(
        <div>{count}/300</div>
    );
}

ReactDom.createRoot(document.getElementById("react-root")).render(<CharacterCounter/>);
*/
