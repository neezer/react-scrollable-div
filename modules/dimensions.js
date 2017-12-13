export default ({ outer, fixed, gutterWidth }) => {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  const box = outer.getBoundingClientRect()
  const fixedBox = fixed.getBoundingClientRect()

  const width = viewport.width < box.left + box.width
    ? viewport.width - box.left
    : box.width

  const height = viewport.height < box.top + box.height
    ? viewport.height - box.top
    : box.height

  const innerXWidth = width - gutterWidth
  const innerXHeight = height - gutterWidth
  const innerYHeight = innerXHeight - fixedBox.height

  const scrollerXWidth = Math.min(
    innerXWidth * (innerXWidth / box.width),
    innerXWidth
  )

  const scrollerYHeight = Math.min(
    innerXHeight * (innerXHeight / box.height),
    innerXHeight
  )

  return {
    content: { width: box.width, height: box.height },
    outer: { width, height },
    fixed: { width: fixedBox.width, height: fixedBox.height },
    innerX: { width: innerXWidth, height: innerXHeight },
    scrollBarX: { width: innerXWidth, height: gutterWidth },
    scrollBarY: { width: gutterWidth, height: innerXHeight },
    innerY: { width: box.width, height: innerYHeight },
    scrollerX: { width: scrollerXWidth, height: gutterWidth },
    scrollerY: { width: gutterWidth, height: scrollerYHeight }
  }
}

// export default ({ target, columns, data }) => {
//   const existingTable = target.querySelector('.a11y-table')

//   if (existingTable) {
//     existingTable.style.display = 'none'
//   }

//   const rect = target.getBoundingClientRect()

//   if (existingTable) {
//     existingTable.style.display = 'flex'
//   }

//   const sampledDimensions = getSampledDimensions()

//   const dimensions = {
//     height: rect.height,
//     width: rect.width,
//     table: {
//       width: [...columns.values()].reduce((memo, col) => memo + col.size, 0),
//       height: sampledDimensions.header.height +
//         sampledDimensions.row.height * data.length,
//       header: {
//         height: sampledDimensions.header.height
//       },
//       row: {
//         height: sampledDimensions.row.height
//       }
//     },
//     scrollBar: {
//       x: {},
//       y: {}
//     },
//     scroller: {
//       size: 20, // TODO detect!
//       x: {},
//       y: {}
//     }
//   }

//   dimensions.scrollBar.x.width = dimensions.width - dimensions.scroller.size
//   dimensions.scrollBar.x.height = dimensions.scroller.size
//   dimensions.scrollBar.y.width = dimensions.scroller.size
//   dimensions.scrollBar.y.height = dimensions.height - dimensions.scroller.size

//   dimensions.scroller.x.height = dimensions.scrollBar.x.height
//   dimensions.scroller.x.width = Math.min(
//     dimensions.scrollBar.x.width *
//       (dimensions.scrollBar.x.width / dimensions.table.width),
//     dimensions.scrollBar.x.width
//   )

//   dimensions.scroller.y.width = dimensions.scrollBar.y.width
//   dimensions.scroller.y.height = Math.min(
//     dimensions.scrollBar.y.height *
//       (dimensions.scrollBar.y.height / dimensions.table.height),
//     dimensions.scrollBar.y.height
//   )

//   if (dimensions.scrollBar.x.width === dimensions.scroller.x.width) {
//     dimensions.scrollBar.y.height = dimensions.height
//     dimensions.scroller.y.height = Math.min(
//       dimensions.scrollBar.y.height *
//         (dimensions.scrollBar.y.height / dimensions.table.height),
//       dimensions.scrollBar.y.height
//     )
//   }

//   if (dimensions.scrollBar.y.height === dimensions.scroller.y.height) {
//     dimensions.scrollBar.x.width = dimensions.width
//     dimensions.scroller.x.width = Math.min(
//       dimensions.scrollBar.x.width *
//         (dimensions.scrollBar.x.width / dimensions.table.width),
//       dimensions.scrollBar.x.width
//     )
//   }

//   return dimensions
// }
