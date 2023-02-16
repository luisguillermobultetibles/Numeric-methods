// Topological sorting 
// let tasks = [{name: "tarea 2", dependencies : ["tarea 2", "tarea 1"]}, {name: "tarea 1", dependencies : ["tarea 4", "tarea 5"]}];
function solve(tasks) {
    function depends(name1, name2) {
        let vis = [];
        function depVis(me, me_of) {
            if (vis.indexOf(me) !== -1) {
                return false;
            } else {
                vis.push(me);
                return (tasks.dependencies.some((element) => {
                    return element.name === me_of && this.depVis(element.name, me_of); // <- o al revés
                }));
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
