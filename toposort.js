        // Topological sorting (Ordenar un conjunto de tareas dependientes una de otra en una posible secuencia de realización).
    // let tasks = [{name: "tarea 2", dependencies : ["tarea 3", "tarea 4"]}, {name: "tarea 1", dependencies : ["tarea 2", "tarea 3"]}];
    function topologicalSort(tasks) {
        function depVis(task1, task2) {
            if (!task1 || !task2 || task1.name > task2.name) {
                return -1;
            }
            if (tasks.some((element) =>
                element.name === task1.name && element.dependencies.indexOf(task2.name) !== -1
            )) {
                return 1;
            } else {
                return task1.dependencies.some((element) => {
                    let it = tasks.find((el) => element === el.name);
                    return depVis(task1, it) === 1 && depVis(it, task2) === 1;
                }) ? 1 : -1;
            }
        }
        return tasks.sort((a, b) => a.name < b.name ? 1 : -1).sort((task1, task2) => depVis(task1, task2));
    }
