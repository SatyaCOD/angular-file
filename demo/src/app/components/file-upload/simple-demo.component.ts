import { Component } from '@angular/core'
import { Observable, Subscription } from 'rxjs'
import { string as template } from "./simple-demo.template"
import { HttpClient, HttpRequest, HttpResponse, HttpEvent } from '@angular/common/http'

@Component({
  selector: 'simple-demo',
  template:template
})
export class SimpleDemoComponent {
  files:File[] = []
  progress:number
  url = 'https://evening-anchorage-3159.herokuapp.com/api/'
  hasBaseDropZoneOver:boolean = false
  
  httpEmitter:Subscription
  httpEvent:HttpEvent<any>

  constructor(public HttpClient:HttpClient){}

  cancel(){
    this.progress = 0
    if( this.httpEmitter ){
      console.log('cancelled')
      this.httpEmitter.unsubscribe()
    }
  }

  uploadFiles(files:File[]):Subscription{
    const formData:FormData = new FormData();
    for (let file of files) {
      formData.append('file', file, file.name)//input-name, file-contents, filename
    }

    const req = new HttpRequest<FormData>('POST', this.url, formData, {
      reportProgress: true//, responseType: 'text'
    })
    
    return this.httpEmitter = this.HttpClient.request(req).subscribe(event=>{
      this.httpEvent = event
      
      if (event instanceof HttpResponse) {
        delete this.httpEmitter
        console.log('request done', event)
      }
    })
  }
}
