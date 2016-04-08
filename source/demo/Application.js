import {Component} from 'angular2/core'
import {bootstrap} from 'angular2/platform/browser'
import GridExample from '../Grid/Grid.example'
import '../../styles.css'

@Component({
  directives: [GridExample],
  selector: 'demo',
  template: `
    <h1>ng2 Virtualized</h1>
    <ng2-virtualized-grid-example></ng2-virtualized-grid-example>
  `
})
export class Demo {
}

bootstrap(Demo)
