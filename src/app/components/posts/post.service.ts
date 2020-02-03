import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore'; //trabajar collections con angular_firebase
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
//map recorre una data y el contenido lo puede modificar
//finalize: describe que se ha terminado un proceso de un observable
import { PostI } from '../../shared/models/post.interface';
import { FileI } from '../../shared/models/file.interface';
import { AngularFireStorage } from '@angular/fire/storage';
//para almacenar archivos/imagenes
@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postsCollection: AngularFirestoreCollection<PostI>;
  private filePath: any;
  private downloadURL: Observable<string>;

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.postsCollection = afs.collection<PostI>('posts');
    //conectar angular a firebase y esa va a mi bdd en firebase
  }

  public getAllPosts(): Observable<PostI[]> {
    return this.postsCollection
      .snapshotChanges() //guardo los cambios instantaneos de mi colect
      .pipe( //observable asociado a varias funcionalidades
        map(actions => //map me permite recorrer la info y poder modificar su estructura
          actions.map(a => {
            const data = a.payload.doc.data() as PostI; //payload es todo el cuerpo de la info, doc es la info afectada por los cambios, data te devuelve todo el contenido como un objeto
            const id = a.payload.doc.id;
            return { id, ...data }; //toda la data de cada post con su id, unificamos esa info
          })
        )
      );
  }

  public getOnePost(id: PostI): Observable<PostI> {
    return this.afs.doc<PostI>(`posts/${id}`).valueChanges(); //retornando los cambios de los valores del elemento afectado
  }

  public deletePostById(post: PostI) {
    return this.postsCollection.doc(post.id).delete();
  }

  public editPostById(post: PostI, newImage?: FileI) {
    if (newImage) {
      this.uploadImage(post, newImage);
    } else {
      return this.postsCollection.doc(post.id).update(post);
    }
  }

  public preAddAndUpdatePost(post: PostI, image: FileI): void {
    this.uploadImage(post, image);
  }

  private savePost(post: PostI) {
    const postObj = {
      titlePost: post.titlePost,
      contentPost: post.contentPost,
      imagePost: this.downloadURL,
      fileRef: this.filePath,
      tagsPost: post.tagsPost
    };

    if (post.id) { //cuando guardo algún documento ya existente,ej:despues de un cambio
      return this.postsCollection.doc(post.id).update(postObj);
    } else { //cuando agrego una nueva
      return this.postsCollection.add(postObj);
    }

  }

  private uploadImage(post: PostI, image: FileI) {
    this.filePath = `images/${image.name}`; //referencia de la ruta de la imagen
    const fileRef = this.storage.ref(this.filePath);
    //referenciar la imagen con su path en firebase storage
    const task = this.storage.upload(this.filePath, image);
    //ya la subo en el storage de firebase
    task.snapshotChanges()
      .pipe(
        finalize(() => { //termina el proceso luego de que ya se haya 
          //guardado la imagen en storage y haya guardado el post
          fileRef.getDownloadURL().subscribe(urlImage => {
            this.downloadURL = urlImage;
            this.savePost(post);
          });
        })
      ).subscribe();
  }
}
