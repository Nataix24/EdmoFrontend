//add logic behind the help button 
function addButtonListenerr() {
    console.log("load button");
    const button = document.getElementById('buttonHelp') as HTMLButtonElement;
    if(button){
        button.addEventListener('click', () => {
                button.disabled = true; //Disable the button so that you cant spam yes votes
                // <---- Here add logic to send your yes vote
                let numberOfParticipants = 0; //receive number of participants from server 
                let totalYesVotes = 0; //receive yes votes from server 
                button.textContent = totalYesVotes+"/"+numberOfParticipants;
        });
    }else {console.error("button is null");}
}
//add login begind the pop up
// change display to visible wheen you receive information from the server 
// and after 10 sec let if dissapear

// you can add area if you click on robot it will appear again with the previous message ?