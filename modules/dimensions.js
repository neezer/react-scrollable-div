export default ({ outer, content, fixed, gutterWidth }) => {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  const outerBox = outer.getBoundingClientRect()
  const box = content.getBoundingClientRect()
  const fixedBox = fixed.getBoundingClientRect()

  const width = viewport.width < outerBox.left + outerBox.width
    ? viewport.width - outerBox.left
    : outerBox.width

  const height = viewport.height < outerBox.top + outerBox.height
    ? viewport.height - outerBox.top
    : outerBox.height

  let innerXWidth = width - gutterWidth
  let innerXHeight = height - gutterWidth
  let scrollBarXMaxed = false
  let scrollBarYMaxed = false
  let innerYHeight = innerXHeight - fixedBox.height
  let scrollBarYHeight = innerXHeight

  let scrollerXWidth = Math.min(
    innerXWidth * (innerXWidth / box.width),
    innerXWidth
  )

  let scrollerYHeight = Math.min(
    innerXHeight * ((innerXHeight - fixedBox.height) / box.height),
    height
  )

  if (scrollerXWidth >= innerXWidth) {
    scrollBarXMaxed = true
    innerXHeight += gutterWidth
    scrollBarYHeight = innerXHeight

    scrollerYHeight = Math.min(
      innerXHeight * ((innerXHeight - fixedBox.height) / box.height),
      height
    )
  }

  if (scrollerYHeight >= scrollBarYHeight) {
    scrollBarYMaxed = true
    innerXWidth += gutterWidth
    innerYHeight += gutterWidth

    scrollerXWidth = Math.min(
      innerXWidth * (innerXWidth / box.width),
      innerXWidth
    )
  }

  return {
    content: { width: box.width, height: box.height },
    outer: { width, height },
    fixed: { width: fixedBox.width, height: fixedBox.height },
    innerX: { width: innerXWidth, height: innerXHeight },
    innerY: { width: box.width, height: innerYHeight },
    innerYWrapper: { width: box.width, height: innerYHeight },
    scrollerX: { width: scrollerXWidth, height: gutterWidth },
    scrollerY: { width: gutterWidth, height: scrollerYHeight },
    scrollBarX: {
      width: innerXWidth,
      height: gutterWidth,
      maxed: scrollBarXMaxed
    },
    scrollBarY: {
      width: gutterWidth,
      height: scrollBarYHeight,
      maxed: scrollBarYMaxed
    }
  }
}
