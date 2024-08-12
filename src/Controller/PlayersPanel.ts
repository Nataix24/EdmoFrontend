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
    public constructor() {
        super(null);

        this.element.className = "mainContent";

        this.refreshPlayers();
    }

    public refreshPlayers(playerList: PlayerInfo[] = [], playerID: number = 0) {
        if (playerList.length == 0) {
            this.element.innerHTML = "There are no players in this session.";
            return;
        }

        this.element.replaceChildren(
            ...playerList.map(p => this.createPlayerCard(p, playerID))
        );
    }

    private createPlayerCard(player: PlayerInfo, playerID: number) {
        const playerCard = document.createElement("div");
        playerCard.classList.add("card", "noflex", "playerCard");

        playerCard.style.setProperty("--hue", hues[player.number].toString());

        const text = document.createElement("h2");
        text.className = "cardText";
        text.innerText = `${player.name}${(player.number == playerID) ? " (You)" : ""}`;
        playerCard.appendChild(text);

        if (player.voted) {
            const icon = document.createElement("i");
            icon.className = `playerCardIcon fa-solid fa-question-circle`;
            playerCard.appendChild(icon);
        }

        return playerCard;
    }

}