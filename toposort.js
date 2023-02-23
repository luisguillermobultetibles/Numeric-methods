    // Topological sorting (Ordenar un conjunto de tareas dependientes una de otra en una posible secuencia de realización).
    // let tasks = [{name: "tarea 2", dependencies : ["tarea 3", "tarea 4"]}, {name: "tarea 1", dependencies : ["tarea 2", "tarea 3"]}];
    function solve(tasks) {
        function depends(task1, task2) {
            let vis = [];
            function depVis(t1, t2) {
                let result;
                if (tasks.some((element) => {
                    return element.name === t1 && element.dependencies.indexOf(t2) !== 1
                })) {
                    result = 1;
                } else if (vis.indexOf(t1) !== -1) {
                    result = -1;
                } else {
                    vis.push(t1); // Clausuramos la entrada, si sobrevive: no aplica.
                    result = tasks.some((element) => {
                        result = depVis(element.name, t2) !== -1 && depVis(t1, element.name) !== -1;
                    }) ? 1 : -1;
                }
                // console.warn(`Dependencia circular de ${t1} de ${t2} = ${result}.`);
                return result;
            }
            return depVis(task1.name, task2.name);
        }
        return tasks.sort((task1, task2) => {
            return depends(task1, task2) - depends(task2, task1)
        });
    }
