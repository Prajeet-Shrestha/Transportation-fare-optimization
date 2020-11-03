import { Injectable } from '@angular/core';
import route from "src/app/datasets/route.json";

import fare from "src/app/datasets/travelFare.json";

export interface DijkstraOutput {
  path: string[];
  travel_fare: number;
}

@Injectable({
  providedIn: 'root'
})

export class DijkstraAlgoService {

  constructor() { }

  getCheapestFare(source, destination) {

    let shortest = null;
    let minFare: number = Number.MAX_VALUE;
    let results: DijkstraOutput[] = [];

    results.push(this._findShortestPath(fare, source + "_bus", destination + "_bus"));
    results.push(this._findShortestPath(fare, source + "_bus", destination + "_mini"));
    results.push(this._findShortestPath(fare, source + "_bus", destination + "_tempo"));
    results.push(this._findShortestPath(fare, source + "_mini", destination + "_bus"));
    results.push(this._findShortestPath(fare, source + "_mini", destination + "_mini"));
    results.push(this._findShortestPath(fare, source + "_mini", destination + "_tempo"));
    results.push(this._findShortestPath(fare, source + "_tempo", destination + "_bus"));
    results.push(this._findShortestPath(fare, source + "_tempo", destination + "_mini"));
    results.push(this._findShortestPath(fare, source + "_tempo", destination + "_tempo"));

    for (let i=0; i<results.length; i++)
      if (shortest === null || results[i].travel_fare < minFare) {
        minFare = results[i].travel_fare;
        shortest = results[i];
      }

    return shortest;
  }


  _shortestDistanceNode(distances, visited) {

    let shortest = null;
    for (let node in distances)
      if ((shortest === null || distances[node] < distances[shortest]) && !visited.includes(node))
        shortest = node;
    return shortest;
  };

  _findShortestPath(graph, startNode, endNode) {

    let distances = {};
    distances[endNode] = Number.MAX_VALUE;
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
