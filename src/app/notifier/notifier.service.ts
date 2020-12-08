import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThrowStmt } from '@angular/compiler';
import { NotifierComponent } from './notifier/notifier.component';
@Injectable({
  providedIn: 'root'
})
export class NotifierService {
  constructor(private _snakbar: MatSnackBar) { }
  showNotification(msg: string,titlemsg:string, messagetype: 'error' | 'success', pos: 'left' | 'right' = 'left'){
    this._snakbar.openFromComponent(NotifierComponent,{
      data:{message: msg,title: titlemsg},
      duration:5000,
      horizontalPosition: pos,
      panelClass: messagetype
    })
  }
}
