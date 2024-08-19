import { LocalizationManager } from "../scripts/Localization";
import { Panel } from "./Panel";


interface PlayerInfo {
    name: string;
    number: number;
    voted: boolean;
}
const hues = [
    0, 120, 240, 60
];

export class PlayersPanel extends Panel {

    private playerID: number = 0;

    public constructor() {
        super(null);

        this.element.className = "mainContent";

        this.refreshPlayers();
    }

    public setID(playerID: number) {
        this.playerID = playerID;
    }

    public refreshPlayers(playerList: PlayerInfo[] = []) {
        if (playerList.length == 0) {
            const message = document.createElement("h2");
            message.innerText = "There are no players in this session.";
            LocalizationManager.setLocalisationKey(message, "noPlayers");
            this.element.replaceChildren(message);
            return;
        }

        this.element.replaceChildren(
            ...playerList.map(p => this.createPlayerCard(p, this.playerID))
        );
    }

    private createPlayerCard(player: PlayerInfo, playerID: number) {
        const playerCard = document.createElement("div");
        playerCard.classList.add("card", "noflex", "playerCard");

        playerCard.style.setProperty("--hue", hues[player.number].toString());

        const text = document.createElement("h2");
        text.className = "cardText";

        if (player.number != playerID) {
            text.innerText = `${player.name}`;
            LocalizationManager.removeLocalisationKey(text);
        }
        else {
            text.innerText = `${player.name}${(player.number == playerID) ? " (You)" : ""}`;

            const isBaba = player.name.toLowerCase() == "baba" || player.name.toLowerCase() == "kiki";

            const args = {
                name: player.name
            };
            LocalizationManager.setLocalisationKey(text, isBaba ? "playerIsBabaIsYou" : "playerIsYou", args);
        }

        playerCard.appendChild(text);

        if (player.voted) {
            const icon = document.createElement("i");
            icon.className = `playerCardIcon fa-solid fa-question-circle`;
            playerCard.appendChild(icon);
        }

        return playerCard;
    }

}