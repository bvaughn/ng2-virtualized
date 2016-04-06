export function initCellMetadata ({
  cellsCount,
  size
}) {
  const sizeGetter = size instanceof Function
    ? size
    : (index) => size

  const cellMetadata = []
  let offset = 0

  for (var i = 0; i < cellsCount; i++) {
    let size = sizeGetter(i)

    if (size == null || isNaN(size)) {
      throw Error(`Invalid size returned for cell ${i} of value ${size}`)
    }

    cellMetadata[i] = {
      size,
      offset
    }

    offset += size
  }

  return cellMetadata
}

export function getVisibleCellIndices ({
  cellsCount,
  cellMetadata,
  containerSize,
  currentOffset
}) {
  if (cellsCount === 0) {
    return {}
  }

  // TODO Add better guards here against NaN offset

  const lastDatum = cellMetadata[cellMetadata.length - 1]
  const totalCellSize = lastDatum.offset + lastDatum.size

  // Ensure offset is within reasonable bounds
  currentOffset = Math.max(0, Math.min(totalCellSize - containerSize, currentOffset))

  const maxOffset = Math.min(totalCellSize, currentOffset + containerSize)

  let start = findNearestCell({
    cellMetadata,
    mode: getVisibleCellIndices.EQUAL_OR_LOWER,
    offset: currentOffset
  })

  let datum = cellMetadata[start]
  currentOffset = datum.offset + datum.size

  let stop = start

  while (currentOffset < maxOffset && stop < cellsCount - 1) {
    stop++

    currentOffset += cellMetadata[stop].size
  }

  return {
    start,
    stop
  }
}

getVisibleCellIndices.EQUAL_OR_LOWER = 1
getVisibleCellIndices.EQUAL_OR_HIGHER = 2

export function findNearestCell ({
  cellMetadata,
  mode,
  offset
}) {
  let high = cellMetadata.length - 1
  let low = 0
  let middle
  let currentOffset

  // TODO Add better guards here against NaN offset

  while (low <= high) {
    middle = low + Math.floor((high - low) / 2)
    currentOffset = cellMetadata[middle].offset

    if (currentOffset === offset) {
      return middle
    } else if (currentOffset < offset) {
      low = middle + 1
    } else if (currentOffset > offset) {
      high = middle - 1
    }
  }

  if (mode === getVisibleCellIndices.EQUAL_OR_LOWER && low > 0) {
    return low - 1
  } else if (mode === getVisibleCellIndices.EQUAL_OR_HIGHER && high < cellMetadata.length - 1) {
    return high + 1
  }
}
