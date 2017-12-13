export default ({ content, fixed, gutterWidth }) => {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  const box = content.getBoundingClientRect()
  const fixedBox = fixed.getBoundingClientRect()

  const width = viewport.width < box.left + box.width
    ? viewport.width - box.left
    : box.width

  const height = viewport.height < box.top + box.height
    ? viewport.height - box.top
    : box.height

  let innerXWidth = width - gutterWidth
  let innerXHeight = height - gutterWidth
  let scrollBarXMaxed = false
  let scrollBarYMaxed = false
  let innerYHeight = innerXHeight - fixedBox.height
  let scrollBarYHeight = innerXHeight

  const scrollerXWidth = Math.min(width * (width / box.width), width)
  const scrollerYHeight = Math.min(height * (height / box.height), height)

  if (scrollerXWidth >= innerXWidth) {
    scrollBarXMaxed = true
    innerXHeight += gutterWidth
    scrollBarYHeight = innerXHeight
  }

  if (scrollerYHeight >= scrollBarYHeight) {
    scrollBarYMaxed = true
    innerXWidth += gutterWidth
    innerYHeight += gutterWidth
  }

  console.log(box)

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
