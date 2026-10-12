import { Route } from "@angular/router";

export const appRoutes: Route[] = [
  {
    path: "simple-sse",
    loadComponent: () =>
      import("./simple-sse").then((component) => component.SimpleSse),
  },
  {
    path: "stream-sse",
    loadComponent: () =>
      import("./stream-sse").then((component) => component.StreamSse),
  },
  { path: "", pathMatch: "full", redirectTo: "simple-sse" },
];
