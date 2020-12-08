import { Component, OnInit, Inject } from '@angular/core';
import { NotifierService } from 'src/app/notifier/notifier.service';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.css'],
})
export class NotifierComponent implements OnInit {
  msg: string;
  btnmsg: string;
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, public snackBarRef: MatSnackBarRef<NotifierComponent>) {}

  ngOnInit(): void {}
}
