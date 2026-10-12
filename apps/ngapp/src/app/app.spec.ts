import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { App } from "./app";
import { appRoutes } from "./app.routes";

describe("App", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(appRoutes)],
    }).compileComponents();
  });

  it("should render links to both SSE routes", async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const links = Array.from(compiled.querySelectorAll("nav a"));

    expect(links.map((link) => link.textContent?.trim())).toEqual([
      "Simple SSE",
      "Stream SSE",
    ]);
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/simple-sse",
      "/stream-sse",
    ]);
  });

  it("should lazy-load both route components", () => {
    expect(appRoutes[0].loadComponent).toBeDefined();
    expect(appRoutes[1].loadComponent).toBeDefined();
  });
});
