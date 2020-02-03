import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewPostComponent } from './components/posts/new-post/new-post.component';
import { NewPostModule } from './components/posts/new-post/new-post.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';

/* Firebase */
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule, StorageBucket } from '@angular/fire/storage'; //gestionar la subida de imagenes
import { AngularFireModule } from '@angular/fire'; //funciones o metodos de firebase
import { AngularFireAuthModule } from '@angular/fire/auth';
//trabajar con la autenticacion de firebase

import { environment } from '../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
//para trabajar con forms reactivos con validaciones y sus directivas
import { ContainerAppComponent } from './components/pages/container-app/container-app.component';
import { ModalComponent } from './shared/components/modal/modal.component';
import { EditPostComponent } from './components/posts/edit-post/edit-post.component';
import { EditPostModule } from './components/posts/edit-post/edit-post.module';
import { DetailsPostComponent } from './components/posts/details-post/details-post.component';

@NgModule({
  declarations: [
    AppComponent,
    NewPostComponent,
    ToolbarComponent,
    ContainerAppComponent,
    ModalComponent,
    EditPostComponent,
    DetailsPostComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig), //inicializamos nuestra app con la config de firebase
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AppRoutingModule,
    NewPostModule,
    MaterialModule,
    ReactiveFormsModule,
    EditPostModule
  ],
  entryComponents: [ModalComponent],
  providers: [
    { provide: StorageBucket, useValue: 'gs://ngpost-33a8e.appspot.com' } //le pasamos la cadena del storage bucket de firebase
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
