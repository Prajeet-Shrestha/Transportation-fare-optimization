import { ArrayType } from '@angular/compiler';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import locationcords from 'src/app/datasets/locationcords.json';
import { DijkstraAlgoService } from 'src/app/algorithm/dijkstra-algo.service';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotifierComponent } from './notifier/notifier/notifier.component';
import { NotifierService } from 'src/app/notifier/notifier.service';
import fare from 'src/app/datasets/travelFare.json';
import { MatPaginator } from '@angular/material/paginator';

export interface DataSetTableTemplate {
  Source: string;
  Destination: string;
  Bus: number | null | undefined | '' | '-' | string;
  Tempo: number | null | undefined | '' | '-' | string;
  Mini: number | null | undefined | '' | '-' | string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  title = 'Fare-Calculation';
  displayedColumns: string[] = ['Source', 'Destination', 'Bus', 'Mini', 'Tempo'];

  lat = 27.720416;
  lng = 85.330014;
  showTable: boolean = false;
  SelectedCurrentSource;
  pageLength = 10;
  ELEMENT_DATA: DataSetTableTemplate[] = [
    { Source: 'Ratna Park', Destination: 'New Baneshowr', Bus: 30, Tempo: 21, Mini: 20 },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  deBugState = {
    mouseClickX: 0,
    mouseClickY: 0,
    stationName: 'None',
  };
  deBugStateList = [
    {
      mouseClickX: 0,
      mouseClickY: 0,
      stationName: 'None',
    },
  ];
  deBugMode: boolean = false;
  SelectedCurrentDestination;
  locations = [];
  features = ['Cheapest Fare', 'Shortest Route(not Avaible)'];
  state: 'pre' | 'mid' | 'post' = 'pre';
  solve_button_status = 'false';
  co = [];
  Canvas;
  ctx;
  route = [];
  dataSource;
  constructor(private _service: DijkstraAlgoService, private _notify: NotifierService) {
    for (let k in locationcords) {
      this.locations.push(k);
    }
    this.FineRawData();
  }
  ALLROUTE = [];
  FineRawData() {
    let FinedData: DataSetTableTemplate[] = [];
    for (let key in fare) {
      let data: DataSetTableTemplate = {
        Source: '',
        Destination: '',
        Bus: 0,
        Mini: 0,
        Tempo: 0,
      };

      let path_Transport = key.split('_');
      data.Source = path_Transport[0];
      // console.log(key, path_Transport);
      let destinationList = [];
      for (let subkey in fare[key]) {
        let Des_path_transport = subkey.split('_');
        if (destinationList.includes(Des_path_transport[0])) {
          // TODO:Do Noting
        } else {
          destinationList.push(Des_path_transport[0]);
        }
      }
      // console.warn('SOURCE::', path_Transport[0], 'DESTINATIONS::', destinationList, 'BY::', path_Transport[1]);
      // console.table([path_Transport[0].toString(), destinationList.toString(), path_Transport[1]], ['Source']);
      // console.log(destinationList);
      for (let d = 0; d < destinationList.length; d++) {
        data.Destination = destinationList[d];
        // console.log(fare[key]);
        for (let dest_key in fare[key]) {
          let dest_key_path_trans = dest_key.split('_');
          // console.log(dest_key_path_trans);
          if (dest_key_path_trans[0] == data.Destination) {
            if (path_Transport[1] == 'tempo') {
              // console.log(path_Transport[1]);
              data.Tempo = fare[key][dest_key];
              data.Mini = '-';
              data.Bus = '-';
            }
            if (path_Transport[1] == 'mini') {
              // console.log(path_Transport[1], fare[key][dest_key]);
              data.Mini = fare[key][dest_key];
              data.Tempo = '-';
              data.Bus = '-';
            }
            if (path_Transport[1] == 'bus') {
              // console.log(path_Transport[1]);
              data.Bus = fare[key][dest_key];
              data.Tempo = '-';
              data.Mini = '-';
            } else {
              // !BREAK!!!
            }
          }
        }
        // console.log(data);
        FinedData.push(data);
        data = {
          Source: path_Transport[0],
          Destination: '',
          Bus: 0,
          Mini: 0,
          Tempo: 0,
        };
      }
    }
    // TempElement = FinedData;
    // console.log(FinedData);

    let TempElement = FinedData;
    // console.log(TempElement);
    // ELEMENT_DATA = fine;
    let sourceDesList = [];

    for (let key in TempElement) {
      if (!sourceDesList.includes(TempElement[key].Source + '_' + TempElement[key].Destination)) {
        sourceDesList.push(TempElement[key].Source + '_' + TempElement[key].Destination);
        this.ALLROUTE.push([TempElement[key].Source, TempElement[key].Destination]);
      }
    }
    // console.log(sourceDesList);
    let UltraFinedData: DataSetTableTemplate[] = [];
    for (let i = 0; i < sourceDesList.length; i++) {
      let common: DataSetTableTemplate[] = [];
      let s_d = sourceDesList[i].split('_');
      for (let j = 0; j < FinedData.length; j++) {
        if (s_d[0] == FinedData[j].Source && s_d[1] == FinedData[j].Destination) {
          common.push(FinedData[j]);
        }
      }
      // console.log(common);
      let target = common[0];
      if (common.length >= 2) {
        length = common.length - 1;
        for (let i = 1; i <= length; i++) {
          if (common[i].Bus != '-') {
            target.Bus = common[i].Bus;
          }
          if (common[i].Mini != '-') {
            target.Mini = common[i].Mini;
          }
          if (common[i].Tempo != '-') {
            target.Tempo = common[i].Tempo;
          }
        }
      }
      UltraFinedData.push(target);
    }
    // console.log(UltraFinedData);
    this.dataSource = new MatTableDataSource(UltraFinedData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.start();
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  response = '';
  SavedPrice = 0;
  longpathresponse = '';
  calculateLowestFare(source, destination) {
    let { shortestpath, highestpath } = this._service.getCheapestFare(source, destination);
    if (shortestpath.travel_fare === Number.MAX_VALUE) {
      console.warn('No route possible');
      this._notify.showNotification('', 'NO POSSIBLE PATH!!', 'error');
      return;
    } else {
      // console.log(shortestpath);
      let path_name: string;
      for (let i = 0; i < shortestpath.path.length; i++) {
        path_name = shortestpath.path[i].split('_');
        this.route.push(path_name[0]);
      }
    }
    console.log(shortestpath);
    this.response = this.CompileResponse(shortestpath);
    this.longpathresponse = 'But ' + this.CompileResponse(highestpath);
    this.SavedPrice = highestpath.travel_fare - shortestpath.travel_fare;
  }
  CompileResponse(TravelDetails) {
    let response = ['If you take a'];
    let path_details;
    let previousTransport = '';
    // console.log();
    for (let i = 0; i < TravelDetails.path.length; i++) {
      path_details = TravelDetails.path[i].split('_');
      // console.log(path_details);
      if (i == TravelDetails.path.length - 1) {
        if (response.slice(-2)[0] == ' to ') {
          response.pop();
          response.push(path_details[0]);
        } else {
          response.push(' to ');
          response.push(path_details[0] + '.');
        }
        response.push(', It will cost you Rs.' + TravelDetails.travel_fare);
        return response.join(' ');
      }

      if (previousTransport == path_details[1]) {
        // console.log(response.slice(-2)[0]);
        if (response.slice(-2)[0] == ' to ') {
          response.pop();
          response.push(path_details[0]);
        } else {
          response.push(' to ');
          response.push(path_details[0]);
        }
      } else {
        if (i >= 1) {
          response.push('then a ' + path_details[1] + ' from ' + path_details[0]);
        } else {
          response.push(path_details[1] + ' from ' + path_details[0]);
        }
      }
      previousTransport = path_details[1];
      // console.log(previousTransport);
    }
  }

  DropdownSelect(location: string, id: 'src' | 'loc') {
    this.resetCanvas();
    if (id == 'src') {
      this.SelectedCurrentSource = {
        name: location,
        position: locationcords[location],
      };
      this.start();
      this.drawCircle(this.SelectedCurrentSource.position);

      // console.log(this.SelectedCurrentSource);
    } else {
      this.SelectedCurrentDestination = {
        name: location,
        position: locationcords[location],
      };
      this.start();
      this.drawCircle(this.SelectedCurrentDestination.position);
      // console.log(this.SelectedCurrentSource);
    }
  }
  Clear(mat1, mat2, mat3, mattog) {
    const matSelect1: MatSelect = mat1;
    const matSelect2: MatSelect = mat2;
    const matSelect3: MatSelect = mat3;
    const matToggle = mattog;
    this.response = '';
    this.deBugState = {
      mouseClickX: 0,
      mouseClickY: 0,
      stationName: 'None',
    };
    this.deBugStateList = [
      {
        mouseClickX: 0,
        mouseClickY: 0,
        stationName: 'None',
      },
    ];
    this.longpathresponse = '';
    matToggle.checked = 'false';
    matSelect1.writeValue('null');
    matSelect2.writeValue('null');
    matSelect3.writeValue('null');
    // let el_S = document.getElementById("mat-select-value-1");
    // let el_D = document.getElementById("mat-select-value-3");
    // let el_Find = document.getElementById("mat-select-value-5");
    // el_D.setAttribute('ng-reflect-ng-switch', 'false');

    // el_D.innerHTML =``;
    this.SelectedCurrentSource = null;
    this.SelectedCurrentDestination = null;
    this.route = [];
    this.resetCanvas();
    this.start();
    if (this.deBugMode) {
      this.solve_button_status = 'true';
    } else {
      this.solve_button_status = 'false';
    }
  }
  Solve() {
    // ! It will break if empty
    if (
      this.SelectedCurrentSource == '' ||
      typeof this.SelectedCurrentSource == 'undefined' ||
      this.SelectedCurrentDestination == '' ||
      typeof this.SelectedCurrentDestination == 'undefined' ||
      this.SelectedCurrentDestination === null ||
      this.SelectedCurrentSource === null
    ) {
      this._notify.showNotification('Please Choose Source and Destination!', 'FAILED!', 'error');
    } else {
      this.resetCanvas();
      this.start();
      this.drawCircle(this.SelectedCurrentSource.position);
      this.drawCircle(this.SelectedCurrentDestination.position);
      this.calculateLowestFare(
        this.SelectedCurrentSource.name.toString(),
        this.SelectedCurrentDestination.name.toString()
      );
      this.solve_button_status = 'true';
    }
  }

  isBetween(x, min, max): boolean {
    return x >= min && x <= max;
  }
  IshowALLROUTE: boolean = false;
  start() {
    this.Canvas = <HTMLCanvasElement>document.getElementById('myCanvas');
    this.ctx = this.Canvas.getContext('2d');
    let elemLeft = this.Canvas.offsetLeft + this.Canvas.clientLeft;

    let elemTop = this.Canvas.offsetTop + this.Canvas.clientTop;
    var image = new Image();
    let this1 = this;
    if (this.deBugMode) {
      this.Canvas.addEventListener('click', function (e) {
        // console.log(e);
        for (let i = 0; i < this1.locations.length; i++) {
          if (
            this1.isBetween(
              e.layerX,
              locationcords[this1.locations[i]][0] - 10,
              locationcords[this1.locations[i]][0] + 10
            ) &&
            this1.isBetween(
              e.layerY,
              locationcords[this1.locations[i]][1] - 10,
              locationcords[this1.locations[i]][1] + 10
            )
          ) {
            // e.target.style.cursor = "pointer";
            // console.log(this1.locations[i]);
            this1.deBugStateList.push({
              mouseClickX: locationcords[this1.locations[i]][0],
              mouseClickY: locationcords[this1.locations[i]][1],
              stationName: this1.locations[i].toString(),
            });
            this1.deBugState = {
              mouseClickX: locationcords[this1.locations[i]][0],
              mouseClickY: locationcords[this1.locations[i]][1],
              stationName: this1.locations[i].toString(),
            };
            this1.ctx.beginPath();
            this1.ctx.fillStyle = '#16AA55';
            this1.ctx.arc(
              locationcords[this1.locations[i]][0],
              locationcords[this1.locations[i]][1],
              10,
              0,
              Math.PI * 2,
              true
            );
            this1.ctx.strokeStyle = '#FF0000';
            this1.ctx.stroke();
          }
        }
      });
    }

    image.onload = function () {
      this1.ctx.drawImage(image, 0, 0);

      switch (this1.state) {
        case 'pre':
          try {
            this1.drawCircle(this1.SelectedCurrentSource.position);
          } catch (e) {}
          try {
            this1.drawCircle(this1.SelectedCurrentDestination.position);
          } catch (e) {}
          break;
        case 'mid':
          // code block
          break;
        case 'post':
        // code block
      }
      let length = this1.route.length;

      if (this1.IshowALLROUTE) {
        for (let i = 0; i < this1.ALLROUTE.length; i++) {
          this1.ctx.beginPath();
          this1.ctx.fillStyle = '#16AA55';
          this1.ctx.strokeStyle = '#f25100';
          // this1.ctx.lineWidth = 2;
          this1.ctx.moveTo(locationcords[this1.ALLROUTE[i][0]][0], locationcords[this1.ALLROUTE[i][0]][1]);
          this1.ctx.lineTo(locationcords[this1.ALLROUTE[i][1]][0], locationcords[this1.ALLROUTE[i][1]][1]);
          this1.ctx.stroke();
        }
      }
      console.log('Route::', this1.route);

      if (length > 0) {
        this1.ctx.fillStyle = '#FF0000';
        this1.ctx.strokeStyle = '#FF0000';
        this1.ctx.font = '17px Arial';
        this1.ctx.fillText(this1.route[0], locationcords[this1.route[0]][0] + 10, locationcords[this1.route[0]][1]);
        for (let r = 1; r < length; r++) {
          // console.log(locationcords[this1.route[r - 1]][0], locationcords[this1.route[r - 1]][1]);
          // console.log(locationcords[this1.route[r]][0], locationcords[this1.route[r]][1]);
          this1.ctx.beginPath();
          this1.ctx.fillStyle = '#16AA55';
          this1.ctx.lineWidth = 2;
          this1.ctx.strokeStyle = '#16AA55';
          this1.ctx.moveTo(locationcords[this1.route[r - 1]][0], locationcords[this1.route[r - 1]][1]);
          this1.ctx.lineTo(locationcords[this1.route[r]][0], locationcords[this1.route[r]][1]);
          this1.ctx.stroke();
          this1.ctx.fillStyle = '#FF0000';
          this1.ctx.strokeStyle = '#FF0000';
          this1.ctx.font = '17px Arial';
          this1.ctx.fillText(this1.route[r], locationcords[this1.route[r]][0] + 10, locationcords[this1.route[r]][1]);
        }
      }
    };

    image.src = 'assets/map.png';
  }

  showAllRoute(event) {
    this.resetCanvas();
    if (event.checked) {
      this.IshowALLROUTE = true;
      this.start();
    } else {
      this.IshowALLROUTE = false;
      this.start();
    }
  }

  drawCircle(pos: ArrayType) {
    this.ctx.beginPath();
    this.ctx.fillStyle = '#16AA55';
    this.ctx.arc(pos[0], pos[1], 10, 0, Math.PI * 2, true);
    this.ctx.strokeStyle = '#FF0000';
    this.ctx.stroke();
  }

  resetCanvas() {
    try {
      document.getElementById('container').innerHTML = '&nbsp;';
      document.getElementById('container').innerHTML = '<canvas id="myCanvas" width="1360" height="393"></canvas>';
    } catch (e) {}
  }

  createaRoute(route) {
    let length = route.length;
    // console.log(length);
    for (let r = 1; r < length; r++) {
      // console.log(locationcords[route[r - 1]][0], locationcords[route[r - 1]][1]);
      // console.log(locationcords[route[r]][0], locationcords[route[r]][1]);
      this.ctx.beginPath();
      this.ctx.moveTo(301, 254);
      this.ctx.lineTo(369, 232);
      this.ctx.stroke();
    }
  }

  showTablePage(event) {
    if (event.checked) {
      this.showTable = true;
    } else {
      this.showTable = false;
    }
  }

  debugMode(event, solveButton, mat1, mat2, mat3, mattog) {
    if (event.checked) {
      this.deBugMode = true;
      this.response = '';
      this.longpathresponse = '';
      const matSelect1: MatSelect = mat1;
      const matSelect2: MatSelect = mat2;
      const matSelect3: MatSelect = mat3;
      const matToggle = mattog;
      this.response = '';
      this.longpathresponse = '';
      matToggle.checked = 'false';
      matSelect1.writeValue('null');
      matSelect2.writeValue('null');
      matSelect3.writeValue('null');
      this.SelectedCurrentSource = null;
      this.SelectedCurrentDestination = null;
      this.route = [];
      this.resetCanvas();
      this.start();
      this.solve_button_status = 'true';
      solveButton.disabled = 'true';
    } else {
      this.deBugState = {
        mouseClickX: 0,
        mouseClickY: 0,
        stationName: 'None',
      };
      this.deBugStateList = [
        {
          mouseClickX: 0,
          mouseClickY: 0,
          stationName: 'None',
        },
      ];
      this.deBugMode = false;
      solveButton.disabled = 'false';
    }
  }
  shownode(event) {
    // console.log(event);
    if (event.checked) {
      for (let k in locationcords) {
        this.ctx.beginPath();
        this.ctx.fillStyle = '#16AA55';
        this.ctx.arc(locationcords[k][0], locationcords[k][1], 10, 0, Math.PI * 2, true);
        this.ctx.strokeStyle = '#FF0000';
        this.ctx.stroke();
      }
    } else {
      this.resetCanvas();
      this.start();
    }
  }
}
