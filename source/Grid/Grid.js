import {Component, Input, OnInit} from 'angular2/core'
import {getVisibleCellIndices, initCellMetadata} from './GridUtils'
import template from './Grid.html'

const IS_SCROLLING_TIMEOUT = 150

@Component({
  selector: 'ng2-virtualized-grid',
  template
})
export default class Grid implements OnInit {
  @Input() columnCount = 0
  @Input() columnSize = 0
  @Input() height = 0
  @Input() renderCell
  @Input() rowCount = 0
  @Input() rowSize = 0
  @Input() width = 0

  isScrolling
  visibleCellIndices

  _columnMetadata = []
  _disablePointerEventsTimeoutId
  _rowMetadata = []
  _scrollLeft = 0
  _scrollTop = 0

  ngOnInit() {
    this._columnMetadata = initCellMetadata({
      cellsCount: this.columnCount,
      size: this.columnSize
    })
    this._rowMetadata = initCellMetadata({
      cellsCount: this.rowCount,
      size: this.rowSize
    })

    this._updateVisibleCellIndices()
  }

  getGridStyle() {
    return {
      width: this.width,
      height: this.height
    }
  }

  getGridCellsStyle() {
    const style:any = {}

    if (this._columnMetadata.length) {
      const lastColumnMetadata = this._columnMetadata[this._columnMetadata.length - 1]
      style.width = lastColumnMetadata.offset + lastColumnMetadata.size
    }

    if (this._rowMetadata.length) {
      const lastRowMetadata = this._rowMetadata[this._rowMetadata.length - 1]
      style.height = lastRowMetadata.offset + lastRowMetadata.size
    }

    return style
  }

  getCellStyle({columnIndex, rowIndex}) {
    return {
      top: rowIndex * this.rowSize,
      left: columnIndex * this.columnSize,
      width: this.columnSize,
      height: this.rowSize
    }
  }

  onScroll($event:any) {
    this._scrollLeft = $event.target.scrollLeft
    this._scrollTop = $event.target.scrollTop
    this._temporarilyDisablePointerEvents()
    this._updateVisibleCellIndices()
  }

  renderCellWrapper({columnIndex, rowIndex}) {
    const rendered = this.renderCell({columnIndex, rowIndex})
    const style = this.getCellStyle({columnIndex, rowIndex})

    return `
      <div style="${JSON.stringify(style)}">
        ${rendered}
      </div>
      `
  }

  _temporarilyDisablePointerEvents () {
    if (this._disablePointerEventsTimeoutId) {
      clearTimeout(this._disablePointerEventsTimeoutId)
    }

    this.isScrolling = true

    this._disablePointerEventsTimeoutId = setTimeout(() => {
      this._disablePointerEventsTimeoutId = null
      this.isScrolling = false
    }, IS_SCROLLING_TIMEOUT)
  }

  _updateVisibleCellIndices() {
    const computedColumnRange:any = getVisibleCellIndices({
      cellsCount: this.columnCount,
      cellMetadata: this._columnMetadata,
      containerSize: this.width,
      currentOffset: this._scrollLeft
    })
    const computedRowRange:any = getVisibleCellIndices({
      cellsCount: this.rowCount,
      cellMetadata: this._rowMetadata,
      containerSize: this.height,
      currentOffset: this._scrollTop
    })

    const visibleCellIndices = []

    for (var rowIndex = computedRowRange.start; rowIndex <= computedRowRange.stop; rowIndex++) {
      for (var columnIndex = computedColumnRange.start; columnIndex <= computedColumnRange.stop; columnIndex++) {
        visibleCellIndices.push({
          columnIndex,
          rowIndex
        })
      }
    }

    this.visibleCellIndices = visibleCellIndices
  }
}
