// Topological sorting --- WARNING INESTABLE BLUE CCPY WORKING DRAFT ---
// let tasks = [{name: "tarea 2", dependencies : ["tarea 2", "tarea 1"]}, {name: "tarea 1", dependencies : ["tarea 4", "tarea 5"]}];
function solve(tasks) {
    function depends(task1, task2) { // task2 depends of task1 ?
        let vis = [];
        function deps(t1, t2) {
            if (vis.indexOf(t1) !== -1) {
                return false;
            } else {
                vis.push(t1);
                return (tasks.dependencies.some((element) => {
                    return element.name === t2 && (element.dependencies.indexOf(t1) !== -1 || this.depVis(element.name, t2)); // <- o al revés
                }));
            }
            return `Referencia circular entre ${task1} y ${task2}.`;
        }
        return deps(task1, task2);
    }
    // main
    for (let i = 0; i < tasks.length - 1; i++) {
        const first = tasks[i];
        for (let j = i + 1; j < tasks.length; j++) {
            const next = tasks[j];
            if (depends(first, next)) {
                [tasks[i], tasks[j]] = [tasks[j], tasks[i]];
            }
        }
    }
    return tasks;
}
