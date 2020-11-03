let graph_fare = {
    dhulikhel_bus: {suryabinayak_bus: 4, suryabinayak_tempo: 7},
    dhulikhel_mini: {suryabinayak_mini: 3, sinamangal_mini: 1},
    dhulikhel_tempo: {sinamangal_bus: 5},

};

let graph_route = {
    A: {B: 5, C: 4},
    B: {F: 2, D: 1},
    C: {A: 3, D: 4},
    D: {E: 4, F: 7},
    F: {A: 2, B: 6}
};

let shortestDistanceNode = (distances, visited)  => {

    let shortest = null;
    for (let node in distances)
        if ((shortest === null || distances[node] < distances[shortest]) && !visited.includes(node))
            shortest = node;
    return shortest;
};

let findShortestPath = (graph, startNode, endNode) => {

    let distances = {};
    distances[endNode] = "Infinity";
    distances = Object.assign(distances, graph[startNode]);

    let parents = { endNode: null };
    for (let child in graph[startNode]) {
        parents[child] = startNode;
    }

    let visited = [];
    let node = shortestDistanceNode(distances, visited);

    while (node) {
        let distance = distances[node];
        let children = graph[node];

        for (let child in children) {

            if (String(child) === String(startNode)) {
                continue;
            } else {
                let newdistance = distance + children[child];
                if (!distances[child] || distances[child] > newdistance) {
                    distances[child] = newdistance;
                    parents[child] = node;
                }
            }
        }
        visited.push(node);
        node = shortestDistanceNode(distances, visited);
    }

    let shortestPath = [endNode];
    let parent = parents[endNode];
    while (parent) {
        shortestPath.push(parent);
        parent = parents[parent];
    }
    shortestPath.reverse();

    let results = {
        path: shortestPath,
        travel_fare: distances[endNode]
    };
    return results;
};

console.log(findShortestPath(graph_route, "dhulikhel_bus", "sinamangal_bus"))
console.log(findShortestPath(graph_route, "dhulikhel_bus", "sinamangal_mini"))
console.log(findShortestPath(graph_route, "dhulikhel_bus", "sinamangal_tempo"))
console.log(findShortestPath(graph_route, "dhulikhel_mini", "sinamangal_bus"))
console.log(findShortestPath(graph_route, "dhulikhel_mini", "sinamangal_mini"))
console.log(findShortestPath(graph_route, "dhulikhel_mini", "sinamangal_tempo"))
console.log(findShortestPath(graph_route, "dhulikhel_tempo", "sinamangal_bus"))
console.log(findShortestPath(graph_route, "dhulikhel_tempo", "sinamangal_mini"))
console.log(findShortestPath(graph_route, "dhulikhel_tempo", "sinamangal_tempo"))
