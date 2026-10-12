import { Controller, Sse } from "@nestjs/common";
import { interval, map, Observable } from "rxjs";

interface MessageEvent {
  data: string | object;
}

@Controller("sse")
export class SseController {
  @Sse("stream") // Définit le endpoint: http://localhost:3000/sse/stream
  sendEvents(): Observable<MessageEvent> {
    // Émet un événement toutes les 2 secondes
    return interval(2000).pipe(
      map((num) => ({ data: `Message en temps réel n°${num}` })),
    );
  }
}
