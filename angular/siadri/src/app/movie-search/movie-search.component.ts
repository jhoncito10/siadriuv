/* import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../movies.service';
import { Subject } from 'rxjs/Subject'

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.css']
})
export class MovieSearchComponent implements OnInit {

  movies;
  startAt = new Subject()
  endAt = new Subject()
  constructor(private moviesSvc: MoviesService) { }
  ngOnInit() {
    this.moviesSvc.getMovies(this.startAt, this.endAt)
                  .subscribe(movies => this.movies = movies)
  }
  search($event) {
      const q = $event.target.value
      this.startAt.next(q)
      this.endAt.next(q + '\uf8ff')
  }

} */
