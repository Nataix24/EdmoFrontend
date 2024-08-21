import { LocalizationManager } from "../scripts/Localization";
import { Panel } from "./Panel";

interface TaskInfo {
    key: string;
    strings: Record<string, string>;
    completed: boolean;
}

export class TaskPanel extends Panel {
    private readonly taskBubble: HTMLElement;
    public constructor(taskBubble: HTMLElement) {
        super(null);

        this.taskBubble = taskBubble;
        this.element.className = "mainContent";

        this.refreshTasks();
    }

    public refreshTasks(taskList: TaskInfo[] = []) {
        if (taskList.length == 0) {
            const message = document.createElement("h2");

            this.taskBubble.innerText = message.innerText = "There are no tasks in this session.";
            LocalizationManager.setLocalisationKey(message, "noTasks");
            LocalizationManager.setLocalisationKey(this.taskBubble, "noTasks");

            this.element.replaceChildren(message);

            return;
        }

        const firstUncompleted = taskList.find(t => !t.completed);
        if (firstUncompleted) {
            const currentLanguage = LocalizationManager.CurrentLanguage;
            this.taskBubble.innerText = firstUncompleted.strings[currentLanguage];
        }
        else {
            this.taskBubble.innerText = "You've completed all tasks";
            LocalizationManager.setLocalisationKey(this.taskBubble, "tasksCompleted");
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