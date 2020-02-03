import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  public appName = 'ngPost';
  constructor(public authSvc: AuthService) {} //cuando lo defino publico lo puedo ocupar en mi html

  ngOnInit() {}

  onLogout(): void {
    this.authSvc.logout(); //para desloguearme
  }
}
