import {Component} from 'angular2/core'
import Grid from './Grid'
import template from './Grid.example.html'

@Component({
  directives: [Grid],
  selector: 'ng2-virtualized-grid-example',
  template
})
export default class GridExample {
  renderCell ({ columnIndex, rowIndex }) {
    return `columnIndex:${columnIndex}, rowIndex:${rowIndex}`
  }
}
