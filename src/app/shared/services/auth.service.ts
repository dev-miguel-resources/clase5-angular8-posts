import { Injectable } from '@angular/core';
import { UserI } from '../models/user.interface';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { FileI } from '../models/file.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userData$: Observable<firebase.User>; //usuario autenticado en ese momento en firebase
  private filePath: string;

  constructor(private afAuth: AngularFireAuth, private storage: AngularFireStorage) {
    this.userData$ = afAuth.authState; //guardo el estado del usuario de firebase
  }

  loginByEmail(user: UserI) {
    const { email, password } = user; //destructuración para obtener email y password del user
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    this.afAuth.auth.signOut();
  }
  preSaveUserProfile(user: UserI, image?: FileI): void {
    if (image) {
      this.uploadImage(user, image); //sube la imagen para ese user
    } else {
      this.saveUserProfile(user); //guardo la info del usuario sin imagen
    }
  }

  private uploadImage(user: UserI, image: FileI): void {
    this.filePath = `images/${image.name}`;
    const fileRef = this.storage.ref(this.filePath); //referencia el path de la imagen en mi storage de firebase
    const task = this.storage.upload(this.filePath, image); //guardo el file y su path
    task.snapshotChanges() //quedo actualizando los cambios del documento
      .pipe(
        finalize(() => { //ejecuta cierta función cuando el observable se complete
          fileRef.getDownloadURL().subscribe(urlImage => {
            user.photoURL = urlImage; //url de la imagen la guardo en mi usuario
            this.saveUserProfile(user); //lo guardo en el profile del storage
          });
        })
      ).subscribe();
  }

  private saveUserProfile(user: UserI) {
    this.afAuth.auth.currentUser.updateProfile({ //este metodo devuelve una promesa
      displayName: user.displayName,
      photoURL: user.photoURL
    })
      .then(() => console.log('User updated!'))
      .catch(err => console.log('Error', err));
  }
}
