export class Task {
    private readonly description: string;
    private completed: boolean;

    constructor(description: string) {
        this.description = description;
        this.completed = false;
    }

    completeTask() {
        this.completed = true;
    }
    notComplete() {
        this.completed = false;
    }

    toString() {
        return `${this.completed ? '[X]' : '[ ]'} ${this.description}`;
    }
}

export class TaskManager {
    private readonly tasks: Array<Task> = [];

    addTask(task: Task) {
        this.tasks.push(task);
    }

    completeTask(taskIndex: number) {
        const task = this.tasks[taskIndex];
        if (task) {
            task.completeTask();
        } else {
            console.error('Invalid task index.');
        }
    }
    getTask(taskIndex: number) {
        const task = this.tasks[taskIndex];
    }

    listTasks() {
        console.log('Tasks:');
        this.tasks.forEach((task, index) => {
            console.log(`${index + 1}. ${task.toString()}`);
        });
    }
}
