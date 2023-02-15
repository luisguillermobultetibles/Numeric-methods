// Topological sorting (task dependency scheduling) (NOT TESTED I AM WORKING IN THIS RIGHT NOW).
// let tasks = [{name: "tarea 2", dependencias : ["tarea 4", "tarea 5"]}, {name: "tarea 1", dependencias : ["tarea 2", "tarea 3"]}];
function solve(tasks) {
    function depends(name1, name2) {
        let vis = [];
        function depVis(me, n2) {
            if (vis.indexOf(me) !== -1) {
                return false;
            } else {
                vis.push(me);
                return tasks.some((task) => {
                    return (task.dependencies.some((element) => {
                        return element.name === n2 && (task.dependencies.indexOf(me !== -1) || this.depVis(me, element.name)); // <- o al revés
                    }));
                })
            }
            return `Referencia circular entre ${name1} y ${name2}.`;
        }
        return depVis(name1, name2);
    }
    // main
    for (let i = 0; i < tasks.length - 1; i++) {
        const first = tasks[i].name;
        for (let j = i + 1; j < tasks.length; j++) {
            const next = tasks[j].name;
            if (depends(first, next)) {
                [tasks[i], tasks[j]] = [tasks[j], tasks[i]];
            }
        }
    }
    return tasks;
}
