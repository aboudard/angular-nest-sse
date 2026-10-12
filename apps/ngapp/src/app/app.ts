import { httpResource } from "@angular/common/http";
import { Component, OnDestroy, OnInit, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { User } from "@ng-nest-sse/datatypes";

@Component({
  imports: [RouterModule],
  selector: "app-root",
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App implements OnInit, OnDestroy {
  protected title = signal("ngapp");
  user = httpResource<User>(() => "/api/user");
  private eventSource!: EventSource;
  message = signal<string>("En attente de connexion...");

  ngOnInit() {
    // Initialise la connexion SSE vers le backend NestJS
    this.eventSource = new EventSource("/api/sse/stream");

    // Écoute les messages entrants
    this.eventSource.onmessage = (event) => {
      this.message.set(event.data);
    };

    // Gestion des erreurs / reconnexions automatiques
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
