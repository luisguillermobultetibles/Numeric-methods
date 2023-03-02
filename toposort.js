// Topological sorting (Ordenar un conjunto de tareas dependientes una de otra en una posible secuencia de realización).
// let tasks = [{name: "tarea 2", dependencies : ["tarea 3", "tarea 4"]}, {name: "tarea 1", dependencies : ["tarea 2", "tarea 3"]}];
function topologicalSort(tasks) {
    const notDependant = -1;
    const dependant = +1;

    function depVis(task1, task2) {
        if (!task1 || !task2 || task1.name > task2.name) return notDependant;
        if (tasks.some((element) => element.name === task1.name && element.dependencies.indexOf(task2.name) !== -1)) return dependant;
        else {
            return task1.dependencies.some((element) => {
                const it = tasks.find((el) => element === el.name);
                return depVis(task1, it) === dependant && depVis(it, task2) === dependant;
            }) ? dependant : notDependant;
        }
    }

    return tasks.sort((a, b) => a.name < b.name ? dependant : notDependant).sort((task1, task2) => -depVis(task1, task2)).reverse();
}
