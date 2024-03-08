import { Component, inject } from '@angular/core';
import { LoaderService } from '../loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
})
export class LoaderComponent {
  loader = inject(LoaderService);

  loaderState: boolean = false;

  ngOnInit() {
    this.loader.loaderState.subscribe((state) => {
      this.loaderState = state;
    });
  }
}
