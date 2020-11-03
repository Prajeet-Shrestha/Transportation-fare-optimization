import { Injectable } from '@angular/core';
import route from "src/app/datasets/route.json";

@Injectable({
  providedIn: 'root'
})
export class DijkstraAlgoService {

  constructor() { }

getCheapestFare(source,destination){
  
  this._findShortestPath(route, source+"_bus", destination+"_bus");
  this._findShortestPath(route, source+"_bus", destination+"_mini");
  this._findShortestPath(route, source+"_bus", destination+"_tempo");
  this._findShortestPath(route, source+"_mini", destination+"_bus");
  this._findShortestPath(route, source+"_mini", destination+"_mini");
  this._findShortestPath(route, source+"_mini", destination+"_tempo");
  this._findShortestPath(route, source+"_tempo", destination+"_bus");
  this._findShortestPath(route, source+"_tempo", destination+"_mini");
  this._findShortestPath(route, source+"_tempo", destination+"_tempo");

}


_shortestDistanceNode(distances, visited){

  let shortest = null;
  for (let node in distances)
      if ((shortest === null || distances[node] < distances[shortest]) && !visited.includes(node))
          shortest = node;
  return shortest;
};

_findShortestPath(graph, startNode, endNode){

  let distances = {};
  distances[endNode] = "Infinity";
  distances = Object.assign(distances, graph[startNode]);

  let parents = { endNode: null };
  for (let child in graph[startNode]) {
      parents[child] = startNode;
  }

  let visited = [];
  let node = this._shortestDistanceNode(distances, visited);

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
      node = this._shortestDistanceNode(distances, visited);
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
}
