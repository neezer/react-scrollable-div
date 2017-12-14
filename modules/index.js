import React from 'react'
import getDimensions from './dimensions'
import * as most from '@most/core'
import * as mostDOM from '@most/dom-event'
import { newDefaultScheduler } from '@most/scheduler'
import classnames from 'classnames'
import makeDraggable, { GRAB, DROP } from './drag'
import get from './style'

const classNames = {
  base: 'scrollable-div',
  scroll: {
    bar: 'scroll-bar',
    handle: 'scroll-bar-handle'
  },
  state: {
    dragging: 'dragging',
    x: 'x',
    y: 'y'
  }
}

class Outer extends React.Component {
  render () {
    const { outerRef, children, dimensions = {} } = this.props
    const styles = get.outer.style(dimensions)

    return <div ref={outerRef} style={styles}>{children}</div>
  }
}

const InnerX = ({ onScroll, innerXRef, children, dimensions = {} }) => {
  const styles = get.innerX.style(dimensions)

  return (
    <div onScroll={onScroll} ref={innerXRef} style={styles}>{children}</div>
  )
}

const ScrollbarX = ({ children, dimensions = {} }) => {
  const styles = get.scrollBarX.style(dimensions)
  const className = classnames([
    `${classNames.base}__${classNames.scroll.bar}`,
    `${classNames.base}__${classNames.scroll.bar}--${classNames.state.x}`
  ])

  return (
    <div style={styles} className={className}>
      {children}
    </div>
  )
}

const ScrollbarY = ({ children, dimensions = {} }) => {
  const styles = get.scrollBarY.style(dimensions)
  const className = classnames([
    `${classNames.base}__${classNames.scroll.bar}`,
    `${classNames.base}__${classNames.scroll.bar}--${classNames.state.y}`
  ])

  return (
    <div style={styles} className={className}>
      {children}
    </div>
  )
}

const InnerYWrapper = ({ children, dimensions = {} }) => {
  const styles = get.innerYWrapper.style(dimensions)

  return <div style={styles}>{children}</div>
}

const InnerY = ({ onScroll, innerYRef, children, dimensions = {} }) => {
  const styles = get.innerY.style(dimensions)

  return (
    <div onScroll={onScroll} ref={innerYRef} style={styles}>{children}</div>
  )
}

const ScrollbarYHandle = ({ scrollerYRef, dimensions = {} }) => {
  const styles = get.scrollerY.style(dimensions)
  const className = classnames([
    `${classNames.base}__${classNames.scroll.handle}`,
    `${classNames.base}__${classNames.scroll.handle}--${classNames.state.y}`
  ])

  return <div ref={scrollerYRef} style={styles} className={className} />
}

const ScrollbarXHandle = ({ scrollerXRef, dimensions = {} }) => {
  const styles = get.scrollerX.style(dimensions)
  const className = classnames([
    `${classNames.base}__${classNames.scroll.handle}`,
    `${classNames.base}__${classNames.scroll.handle}--${classNames.state.x}`
  ])

  return <div ref={scrollerXRef} style={styles} className={className} />
}

export default class ScrollableDiv extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}

    this._scrollingX = false
    this._scrollingY = false
    this._scrollX = 0
    this._scrollY = 0

    this.outerRef = node => (this.outerNode = node)
    this.contentRef = node => (this.contentNode = node)
    this.fixedRef = node => (this.fixedNode = node)
    this.innerXRef = node => (this.innerXNode = node)
    this.innerYRef = node => (this.innerYNode = node)
    this.scrollerXRef = node => (this.scrollerXNode = node)
    this.scrollerYRef = node => (this.scrollerYNode = node)

    this.onHorizontalScroll = dimensions => event => {
      this._scrollX = event.target.scrollLeft
      this.requestHorizontalScrollUpdate(dimensions, this.scrollerXNode)
    }

    this.onVerticalScroll = dimensions => event => {
      this._scrollY = event.target.scrollTop
      this.requestVerticalScrollUpdate(dimensions, this.scrollerYNode)
    }
  }

  componentDidMount () {
    this.redraw()

    most.runEffects(
      most.tap(
        this.redraw.bind(this),
        most.debounce(160, mostDOM.resize(window))
      ),
      newDefaultScheduler()
    )
  }

  redraw () {
    const dimensions = getDimensions({
      outer: this.outerNode,
      content: this.contentNode,
      fixed: this.fixedNode,
      gutterWidth: this.props.gutterWidth
    })

    this.setState({ dimensions })

    handleScrolling(dimensions, {
      innerX: this.innerXNode,
      innerY: this.innerYNode,
      scrollerX: this.scrollerXNode,
      scrollerY: this.scrollerYNode
    })
  }

  requestHorizontalScrollUpdate (dimensions, node) {
    if (!this._scrollingX) {
      window.requestAnimationFrame(() => {
        this._scrollingX = false

        const currentPos = this._scrollX
        const ratio = currentPos / dimensions.content.width
        const leftOffset = dimensions.scrollBarX.width * ratio

        node.style.left = `${leftOffset}px`
      })
    }

    this._scrollingX = true
  }

  requestVerticalScrollUpdate (dimensions, node) {
    if (!this._scrollingY) {
      window.requestAnimationFrame(() => {
        this._scrollingY = false

        const currentPos = this._scrollY
        const ratio = currentPos / dimensions.content.height
        const topOffset = dimensions.scrollBarY.height * ratio

        node.style.top = `${topOffset}px`
      })
    }

    this._scrollingY = true
  }

  render () {
    const { Content, FixedContent } = this.props
    const { dimensions } = this.state

    return (
      <Outer dimensions={dimensions} outerRef={this.outerRef}>
        <InnerX
          dimensions={dimensions}
          innerXRef={this.innerXRef}
          onScroll={this.onHorizontalScroll(dimensions)}
        >
          <FixedContent fixedRef={this.fixedRef} />
          <InnerYWrapper dimensions={dimensions}>
            <InnerY
              dimensions={dimensions}
              innerYRef={this.innerYRef}
              onScroll={this.onVerticalScroll(dimensions)}
            >
              <Content contentRef={this.contentRef} />
            </InnerY>
          </InnerYWrapper>
        </InnerX>
        <ScrollbarY dimensions={dimensions}>
          <ScrollbarYHandle
            dimensions={dimensions}
            scrollerYRef={this.scrollerYRef}
          />
        </ScrollbarY>
        <ScrollbarX dimensions={dimensions}>
          <ScrollbarXHandle
            dimensions={dimensions}
            scrollerXRef={this.scrollerXRef}
          />
        </ScrollbarX>
      </Outer>
    )
  }
}

ScrollableDiv.defaultProps = {
  gutterWidth: 20
}

function handleScrolling (dimensions, nodes) {
  const draggingClass = 'scrollable-div__scroll-bar-handle--dragging'

  const ratio = {
    x: dimensions.content.width / dimensions.scrollBarX.width,
    y: dimensions.content.height / dimensions.scrollBarY.height
  }

  const handleDrag = scroller => ({ dragInfo, distance }) => {
    const el = dragInfo.target

    if (dragInfo.action === GRAB) {
      el.classList.add(draggingClass)
      document.body.classList.add(draggingClass)
      return
    }

    if (dragInfo.action === DROP) {
      el.classList.remove(draggingClass)
      document.body.classList.remove(draggingClass)
      return
    }

    scroller(distance)
  }

  const horizontalContainer = nodes.innerX
  const verticalContainer = nodes.innerY
  const horizontalScrollbarHandle = nodes.scrollerX
  const verticalScrollbarHandle = nodes.scrollerY

  const horizontalDragScroll = most.tap(
    handleDrag(distance => {
      horizontalContainer.scrollLeft = distance * ratio.x
    }),
    most.map(dragInfo => {
      const min = 0
      const max = dimensions.content.width - dimensions.scrollBarX.width

      if (!dragInfo.offset) {
        return { dragInfo, distance: horizontalContainer.scrollLeft }
      }

      const distance = dragInfo.x - dragInfo.offset.dx

      if (distance < min) {
        return { dragInfo, distance: min }
      } else if (distance > max) {
        return { dragInfo, distance: max }
      } else {
        return { dragInfo, distance }
      }
    }, makeDraggable(document.body, horizontalScrollbarHandle, ratio))
  )

  const verticalDragScroll = most.tap(
    handleDrag(distance => {
      verticalContainer.scrollTop = distance * ratio.y
    }),
    most.map(dragInfo => {
      const min = 0
      const max =
        dimensions.content.height -
        (dimensions.scrollBarY.height - dimensions.fixed.height)

      if (!dragInfo.offset) {
        return { dragInfo, distance: verticalContainer.scrollTop }
      }

      const distance = dragInfo.y - dragInfo.offset.dy

      if (distance < min) {
        return { dragInfo, distance: min }
      } else if (distance > max) {
        return { dragInfo, distance: max }
      } else {
        return { dragInfo, distance }
      }
    }, makeDraggable(document.body, verticalScrollbarHandle, ratio))
  )

  most.runEffects(
    most.merge(horizontalDragScroll, verticalDragScroll),
    newDefaultScheduler()
  )
}
