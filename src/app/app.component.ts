import { ArrayType } from '@angular/compiler';
import { Component, AfterViewInit } from '@angular/core';
import locationcords from "src/app/datasets/locationcords.json";
import { DijkstraAlgoService } from "src/app/algorithm/dijkstra-algo.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {
  title = 'Fare-Calculation';
  lat = 27.720416;
  lng = 85.330014;
  SelectedCurrentSource;
  SelectedCurrentDestination;
  locations = [];
  features = ["Cheapest Fare","Shortest Route"]
  state: "pre" | 'mid' | 'post' = 'pre';
  constructor(private _service: DijkstraAlgoService) {
    for (let k in locationcords) {
      this.locations.push(k);
    }
  }

  calculateLowestFare(source, destination) {
    let path = this._service.getCheapestFare(source, destination);
    if (path.travel_fare === Number.MAX_VALUE)
      console.log("No route possible");
    else{
      console.log(path);
      let path_name:string;
      for(let i = 0; i<path.path.length;i++){
        path_name = path.path[i].split("_");
        this.route.push(path_name[0]);
      }
      // console.log(this.route);
    }
      
  }

  DropdownSelect(location: string, id: 'src' | 'loc') {
    this.resetCanvas()
    if (id == 'src') {
      this.SelectedCurrentSource = {
        name: location,
        position: locationcords[location]
      }
      this.start(); 
      this.drawCircle(this.SelectedCurrentSource.position)
    
      console.log(this.SelectedCurrentSource);
    }
    else{
      this.SelectedCurrentDestination = {
        name: location,
        position: locationcords[location]
      }
      // this.route = [];
      this.start();
      this.drawCircle(this.SelectedCurrentDestination.position)
      // this.createaRoute();
      console.log(this.SelectedCurrentSource);
    }
  }
  Clear(){
    this.SelectedCurrentSource = null;
    this.SelectedCurrentDestination = null;
    this.route = [];
    this.resetCanvas();
    this.start();
  }
  Solve(){
    this.resetCanvas();
    this.start();
    this.drawCircle(this.SelectedCurrentSource.position);
    this.drawCircle(this.SelectedCurrentDestination.position);
    this.calculateLowestFare(this.SelectedCurrentSource.name.toString(),this.SelectedCurrentDestination.name.toString());
  }

  ngAfterViewInit() {
    this.start();
  
  }
  co = []
  Canvas;
  ctx;
  route =[];
  start() {
    this.Canvas = <HTMLCanvasElement>document.getElementById("myCanvas");
    this.ctx = this.Canvas.getContext("2d");
    let elemLeft = this.Canvas.offsetLeft + this.Canvas.clientLeft;

    let elemTop = this.Canvas.offsetTop + this.Canvas.clientTop;
    var image = new Image();
    let this1 = this

    this.Canvas.addEventListener('click', function (e) {
      console.log(e.pageX - 10, e.pageY - 10);
      this1.co.push([e.pageX - 10, e.pageY - 10])

     
      // console.log('clicked on sropt')

      // console.log(this1.co)
    })
    image.onload = function () {
      this1.ctx.drawImage(image, 0, 0);

      switch (this1.state) {
        case 'pre':
          try {
              this1.drawCircle(this1.SelectedCurrentSource.position);
          }
          catch(e){ }
          try{
            this1.drawCircle(this1.SelectedCurrentDestination.position);
          }
          catch(e){}
          break;
        case 'mid':
          // code block
          break;
        case 'post':
        // code block
      }
      // this1.ctx.beginPath();
      // this1.ctx.fillStyle = "#16AA55";
      // this1.ctx.arc(404,
      //   81, 10, 0, Math.PI * 2, true);
      // this1.ctx.strokeStyle = "#FF0000";
      // this1.ctx.stroke();

      // ctx.beginPath();
      // ctx.fillStyle = "#16AA55";
      // ctx.arc(369, 232, 10, 0, Math.PI * 2, true);
      // ctx.strokeStyle = "#FF0000";
      // ctx.stroke();


      // this1.ctx.beginPath();
      // this1.ctx.moveTo(301, 254);
      // this1.ctx.lineTo(369, 232);
      // this1.ctx.stroke();
      let length = this1.route.length;
      if(length>0){
        console.log(length);
        for(let r =1;r<(length);r++){
          console.log(locationcords[this1.route[r-1]][0],locationcords[this1.route[r-1]][1]);
          console.log(locationcords[this1.route[r]][0],locationcords[this1.route[r]][1]);
          this1.ctx.beginPath();
          this1.ctx.fillStyle = "#16AA55";
          this1.ctx.strokeStyle = "#FF0000"
          this1.ctx.moveTo(locationcords[this1.route[r-1]][0],locationcords[this1.route[r-1]][1]);
          this1.ctx.lineTo(locationcords[this1.route[r]][0],locationcords[this1.route[r]][1]);
          this1.ctx.stroke();
        }
      }
    
    };

    image.src = 'assets/map.png';
  }

  drawCircle(pos: ArrayType) {
    this.ctx.beginPath();
    this.ctx.fillStyle = "#16AA55";
    this.ctx.arc(pos[0], pos[1], 10, 0, Math.PI * 2, true);
    this.ctx.strokeStyle = "#FF0000";
    this.ctx.stroke();
  }

  resetCanvas() {
    try {
      document.getElementById("container").innerHTML = '&nbsp;';
      document.getElementById("container").innerHTML = '<canvas id="myCanvas" width="1360" height="393"></canvas>';
    }
    catch (e) { }

  }

  createaRoute(route){
    let length = route.length;
    console.log(length);
    for(let r =1;r<(length);r++){
      console.log(locationcords[route[r-1]][0],locationcords[route[r-1]][1]);
      console.log(locationcords[route[r]][0],locationcords[route[r]][1]);
      this.ctx.beginPath();
      this.ctx.moveTo(301,254);
      this.ctx.lineTo(369, 232);
      this.ctx.stroke();
    }
  }

  shownode(event){
    console.log(event);
    if(event.checked){
       for(let k in locationcords){

        this.ctx.beginPath();
        this.ctx.fillStyle = "#16AA55";
        this.ctx.arc(locationcords[k][0],locationcords[k][1] , 10, 0, Math.PI * 2, true);
        this.ctx.strokeStyle = "#FF0000";
        this.ctx.stroke();
      }
    }
    else{
      this.resetCanvas();
      this.start();
    }
  }
}
