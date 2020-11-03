import { ArrayType } from '@angular/compiler';
import { Component, AfterViewInit } from '@angular/core';
import locationcords from "src/app/datasets/locationcords.json";
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
  constructor() {
    for (let k in locationcords) {
      this.locations.push(k);
    }
  }

  DropdownSelect(location: string, id: 'src' | 'loc') {
    this.resetCanvas()
    if (id == 'src') {
      this.SelectedCurrentSource = {
        name: location,
        position: locationcords[location]
      }

      this.drawCircle(this.SelectedCurrentSource.position)
      this.start();
      console.log(this.SelectedCurrentSource);
    }
    else{
      this.SelectedCurrentDestination = {
        name: location,
        position: locationcords[location]
      }

      this.drawCircle(this.SelectedCurrentDestination.position)
      this.start();
      console.log(this.SelectedCurrentSource);
    }
  }


  ngAfterViewInit() {
    this.start();
  }
  co = []
  Canvas;
  ctx;
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


      // ctx.beginPath();
      // ctx.moveTo(301, 254);
      // ctx.lineTo(369, 232);
      // ctx.stroke();
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
