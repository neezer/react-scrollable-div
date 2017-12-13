import React from 'react'
import getDimensions from './dimensions'
// import drag from './drag'
import get from './style'

class Outer extends React.Component {
  render () {
    const { children, dimensions = {} } = this.props
    const styles = get.outer.style(dimensions)

    return <div style={styles}>{children}</div>
  }
}

const InnerX = ({ children, dimensions = {} }) => {
  const styles = get.innerX.style(dimensions)

  return <div style={styles}>{children}</div>
}

const ScrollbarX = ({ children, dimensions = {} }) => {
  const styles = get.scrollBarX.style(dimensions)

  return (
    <div
      style={styles}
      className='scrollable-div__scroll-bar scrollable-div__scroll-bar--x'
    >
      {children}
    </div>
  )
}

const ScrollbarY = ({ children, dimensions = {} }) => {
  const styles = get.scrollBarY.style(dimensions)

  return (
    <div
      style={styles}
      className='scrollable-div__scroll-bar scrollable-div__scroll-bar--y'
    >
      {children}
    </div>
  )
}

const InnerYWrapper = ({ children, dimensions = {} }) => {
  const styles = get.innerYWrapper.style(dimensions)

  return <div style={styles}>{children}</div>
}

const InnerY = ({ children, dimensions = {} }) => {
  const styles = get.innerY.style(dimensions)

  return <div style={styles}>{children}</div>
}

const ScrollbarYHandle = ({ dimensions = {} }) => {
  const styles = get.scrollerY.style(dimensions)

  return (
    <div
      style={styles}
      className='scrollable-div__scroll-bar-handle scrollable-div__scroll-bar-handle--y'
    />
  )
}

const ScrollbarXHandle = ({ dimensions = {} }) => {
  const styles = get.scrollerX.style(dimensions)

  return (
    <div
      style={styles}
      className='scrollable-div__scroll-bar-handle scrollable-div__scroll-bar-handle--x'
    />
  )
}

export default class ScrollableDiv extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}

    this.contentRef = node => (this.contentNode = node)
    this.fixedRef = node => (this.fixedNode = node)
  }

  componentDidMount () {
    this.setState({
      dimensions: getDimensions({
        content: this.contentNode,
        fixed: this.fixedNode,
        gutterWidth: this.props.gutterWidth
      })
    })
  }

  render () {
    const { Content, FixedContent } = this.props
    const { dimensions } = this.state

    return (
      <Outer dimensions={dimensions}>
        <InnerX dimensions={dimensions}>
          <FixedContent fixedRef={this.fixedRef} />
          <InnerYWrapper dimensions={dimensions}>
            <InnerY dimensions={dimensions}>
              <Content contentRef={this.contentRef} />
            </InnerY>
          </InnerYWrapper>
        </InnerX>
        <ScrollbarY dimensions={dimensions}>
          <ScrollbarYHandle dimensions={dimensions} />
        </ScrollbarY>
        <ScrollbarX dimensions={dimensions}>
          <ScrollbarXHandle dimensions={dimensions} />
        </ScrollbarX>
      </Outer>
    )
  }
}

ScrollableDiv.defaultProps = {
  gutterWidth: 20
}
