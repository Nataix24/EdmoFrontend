export class Task {
    constructor(description) {
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
    constructor() {
        this.tasks = [];
    }

    addTask(task) {
        if (task instanceof Task) {
            this.tasks.push(task);
        } else {
            console.error('Invalid task object. Expected an instance of Task.');
        }
    }

    completeTask(taskIndex) {
        const task = this.tasks[taskIndex];
        if (task) {
            task.complete();
        } else {
            console.error('Invalid task index.');
        }
    }
    getTask(taskIndex) {
        const task = this.tasks[taskIndex];
        return task.toString();
    }

    listTasks() {
        console.log('Tasks:');
        this.tasks.forEach((task, index) => {
            console.log(`${index + 1}. ${task.toString()}`);
        });
    }
}