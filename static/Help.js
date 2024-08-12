function addButtonListener() {
    console.log("load button");
    var button = document.getElementById('buttonHelp');
    if (button) {
        button.addEventListener('click', function() {
            button.disabled = true; // Disable the button so that you can't spam yes votes
            // <---- Here add logic to send your yes vote
            var numberOfParticipants = 0; // receive number of participants from server
            var totalYesVotes = 0; // receive yes votes from server
            button.textContent = totalYesVotes + "/" + numberOfParticipants;
        });
    } else {
        console.error("button is null");
    }
}