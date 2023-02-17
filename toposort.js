// Topological sorting (Ordenar un conjunto de tareas dependientes una de otra en una posible secuencia de realización).
// let tasks = [{name: "tarea 2", dependencies : ["tarea 3", "tarea 4"]}, {name: "tarea 1", dependencies : ["tarea 2", "tarea 3"]}];
function solve(tasks) {
    function depends(task1, task2) { // task2 depends of task1 ?
        let vis = [];
        function depVis(t1, t2) {
            if (vis.indexOf(t1.name) !== -1) {
                return -1;
            } else {
                vis.push(t1.name);
                return (task1.dependencies.some((element) => {
                    return element.name === t2 && (element.dependencies.indexOf(t1) !== -1 || (this.depVis(t1, element.name) && this.depVis(element.name, t2)));
                })) ? 1 : -1;
            }
        }
        return depVis(task1, task2);
    }
    return tasks.sort((task1, task2) => depends(task1, task2));
}
