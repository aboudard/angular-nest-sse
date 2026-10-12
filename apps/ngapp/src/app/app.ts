import { httpResource } from "@angular/common/http";
import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { User } from "@ng-nest-sse/datatypes";

@Component({
  imports: [RouterLink, RouterOutlet],
  selector: "app-root",
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  user = httpResource<User>(() => "/api/user");
}
