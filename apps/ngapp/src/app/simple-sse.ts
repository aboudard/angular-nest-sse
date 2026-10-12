import { Component, OnDestroy, OnInit, signal } from "@angular/core";

@Component({
  selector: "app-simple-sse",
  template: `
    <h1>Flux Server-Sent Events (SSE)</h1>
    <p>
      Dernier message reçu : <strong>{{ message() }}</strong>
    </p>
    <button type="button" (click)="closeSse()">Fermer le flux SSE</button>
  `,
})
export class SimpleSse implements OnInit, OnDestroy {
  message = signal("En attente de connexion...");
  private eventSource?: EventSource;

  ngOnInit() {
    this.eventSource = new EventSource("/api/sse/stream");
    this.eventSource.onmessage = (event) => {
      this.message.set(event.data);
    };
    this.eventSource.onerror = (error) => {
      console.error("Erreur SSE:", error);
      this.message.set("Erreur de connexion au serveur.");
    };
  }

  ngOnDestroy() {
    this.eventSource?.close();
  }

  closeSse() {
    this.eventSource?.close();
    this.message.set("Connexion SSE fermée.");
  }
}
