import { Panel } from "./Panel";

interface TaskInfo {
    Title: string;
    Value: boolean;
}

export class TaskPanel extends Panel {
    public constructor() {
        super(null);

        this.element.className = "mainContent";

        this.refreshTasks();
    }

    public refreshTasks(taskList: TaskInfo[] = []) {
        if (taskList.length == 0) {
            this.element.innerHTML = "There are no tasks in this session.";
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
        text.innerText = task.Title;
        taskCard.appendChild(text);
        if (task.Value) //  If it is completed
            text.classList.add("taskCompleted");

        return taskCard;
    }

}