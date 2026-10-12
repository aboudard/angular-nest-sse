import { Component, OnDestroy, OnInit, signal } from "@angular/core";
import { TaskData } from "@ng-nest-sse/datatypes";

@Component({
  selector: "app-stream-sse",
  template: `
    <h1>Progression de la tâche</h1>

    <div style="margin: 20px 0; background: #eee; width: 300px; border-radius: 4px;">
      <!-- Barre de progression visuelle -->
      <div [style.width.%]="task().progress"
           [style.background-color]="task().status === 'FAILED' ? 'red' : 'green'"
           style="height: 24px; color: white; text-align: center; transition: width 0.3s;">
        {{ task().progress }}%
      </div>
    </div>

    <p>Statut actuel : <strong>{{ task().status }}</strong></p>
    @if (task().message) {
      <p style="color: red;">Erreur : {{ task().message }}</p>
    }
  `,
})
export class StreamSse implements OnInit, OnDestroy {
  private eventSource!: EventSource;

  // Signal pour suivre l'état de la tâche
  task = signal<TaskData>({ progress: 0, status: 'PROCESSING' });

  ngOnInit() {
    this.eventSource = new EventSource('/api/sse/progress');

    this.eventSource.onmessage = (event) => {
      // Le format SSE transmet du texte, on doit donc parser le JSON reçu
      const parsedData: TaskData = JSON.parse(event.data);
      this.task.set(parsedData);

      // 🛑 Condition de fermeture de la connexion
      if (parsedData.status === 'COMPLETED' || parsedData.status === 'FAILED') {
        console.log(`Fermeture propre de la connexion SSE. Raison: ${parsedData.status}`);
        this.disconnect();
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('Erreur réseau ou SSE:', error);
      this.task.update(prev => ({ ...prev, status: 'FAILED', message: 'Connexion interrompue' }));
      this.disconnect();
    };
  }

  private disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }

  ngOnDestroy() {
    // Sécurité si l'utilisateur quitte la page avant la fin de la tâche
    this.disconnect();
  }
}
