const tryToPx = maybe(toPx)

export default {
  // const xScrollMaxed = scrollBar.x.width === scroller.x.width
  // const yScrollMaxed = scrollBar.y.height === scroller.y.height

  outer: {
    style: ({ outer }) => ({
      overflow: 'hidden',
      width: tryToPx(outer, ['width']),
      height: tryToPx(outer, ['height']),
      backgroundColor: 'red',
      display: 'flex',
      flexWrap: 'wrap'
    })
  },
  innerX: {
    style: ({ innerX }) => ({
      overflowX: 'scroll',
      paddingBottom: toPx(40),
      marginBottom: compose(toPx, negate)(40),
      width: tryToPx(innerX, ['width']),
      height: tryToPx(innerX, ['height'])
    })
  },
  scrollBarX: {
    style: ({ scrollBarX }) => ({
      position: 'relative',
      height: tryToPx(scrollBarX, ['height']),
      width: tryToPx(scrollBarX, ['width'])
    }),
    handle: {}
  },
  scrollBarY: {
    style: ({ scrollBarY }) => ({
      position: 'relative',
      height: tryToPx(scrollBarY, ['height']),
      width: tryToPx(scrollBarY, ['width'])
    }),
    handle: {}
  },
  innerYWrapper: {
    style: ({ content }) => ({
      overflow: 'hidden',
      width: tryToPx(content, ['width'])
    })
  },
  innerY: {
    style: ({ innerY, fixed }) => ({
      overflowY: 'scroll',
      overflowX: 'hidden',
      width: tryToPx(innerY, ['width']),
      height: tryToPx(innerY, ['height']),
      paddingRight: toPx(40)
    })
  },
  scrollerX: {
    style: ({ scrollerX }) => ({
      width: tryToPx(scrollerX, ['width']),
      height: tryToPx(scrollerX, ['height'])
    })
  },
  scrollerY: {
    style: ({ scrollerY }) => ({
      width: tryToPx(scrollerY, ['width']),
      height: tryToPx(scrollerY, ['height'])
    })
  }

  // if (xScrollMaxed) {
  //   styles.innerX.scroll.bar.style.display = 'none'
  // }

  // if (yScrollMaxed) {
  //   styles.innerY.scroll.bar.style.display = 'none'
  // }
}

function toPx (value) {
  return `${value}px`
}

function negate (value) {
  return value * -1
}

function maybe (fn) {
  return (value, segments) =>
    compose(ifElse(v => v === null, () => null, fn), path(segments))(value)
}

function ifElse (cond, ifFn, elseFn) {
  return value => {
    if (cond(value)) {
      return ifFn(value)
    }

    return elseFn(value)
  }
}

function compose (...args) {
  return value => args.reverse().reduce((acc, arg) => arg(acc), value)
}

function path (segments) {
  return obj =>
    segments.reduce((memo, segment) => {
      if (memo === null || memo === undefined) {
        return null
      }

      return memo[segment]
    }, obj)
}
