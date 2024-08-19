import { LocalizationManager } from "../scripts/Localization";
import { Panel } from "./Panel";

interface TaskInfo {
    key: string;
    strings: Record<string, string>;
    completed: boolean;
}

export class TaskPanel extends Panel {
    public constructor() {
        super(null);

        this.element.className = "mainContent";

        this.refreshTasks();
    }

    public refreshTasks(taskList: TaskInfo[] = []) {
        if (taskList.length == 0) {
            const message = document.createElement("h2");
            message.innerText = "There are no tasks in this session.";
            LocalizationManager.setLocalisationKey(message, "noTasks");
            this.element.replaceChildren(message);
            return;
        }


        this.element.replaceChildren(
            ...taskList.map(t => this.createTaskCard(t))
        );
    }

    private createTaskCard(task: TaskInfo) {
        const taskCard = document.createElement("div");
        taskCard.classList.add("card", "noflex");

        const text = document.createElement("h2");
        text.className = "cardText";

        const currentLanguage = LocalizationManager.CurrentLanguage;
        text.innerText = task.strings[currentLanguage];
        taskCard.appendChild(text);
        if (task.completed) //  If it is completed
            text.classList.add("taskCompleted");

        return taskCard;
    }

}