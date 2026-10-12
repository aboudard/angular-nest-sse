import { Controller, Sse } from "@nestjs/common";
import { concat, interval, map, Observable, of, takeWhile } from "rxjs";
import { TaskEvent } from "@ng-nest-sse/datatypes";

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

  @Sse("progress") // Endpoint: http://localhost:3000/task/progress
  getTaskProgress(): Observable<TaskEvent> {
    const maxSteps = 10; // 10 étapes x 10% = 100%

    // 1. Flux de progression (0% à 90%)
    const processing$ = interval(1000).pipe(
      takeWhile((val) => val < maxSteps),
      map((val) => ({
        data: {
          progress: val * 10,
          status: "PROCESSING" as const,
        },
      })),
    );

    // 2. Événement final (100% et terminé) à enchaîner à la fin du flux
    const completion$ = of({
      data: {
        progress: 100,
        status: "COMPLETED" as const,
      },
    });

    /*
    💡 Note pour simuler une erreur :
    Si vous vouliez simuler un échec à la place, vous pourriez enchaîner ceci :
    const completion$ = of({ data: { progress: 60, status: 'FAILED' as const, message: 'Disque plein' } });
    */

    return concat(processing$, completion$);
  }
}
