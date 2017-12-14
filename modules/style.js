const tryToPx = maybe(toPx)

export default {
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
      overflowY: 'hidden',
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
      width: tryToPx(scrollBarX, ['width']),
      display: maybe(v => (v ? 'none' : null), scrollBarX, ['maxed'])
    }),
    handle: {}
  },
  scrollBarY: {
    style: ({ scrollBarY }) => ({
      position: 'relative',
      height: tryToPx(scrollBarY, ['height']),
      width: tryToPx(scrollBarY, ['width']),
      display: maybe(v => (v ? 'none' : null), scrollBarY, ['maxed'])
    }),
    handle: {}
  },
  innerYWrapper: {
    style: ({ innerYWrapper }) => ({
      overflow: 'hidden',
      width: tryToPx(innerYWrapper, ['width']),
      height: tryToPx(innerYWrapper, ['height'])
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
      position: 'relative',
      width: tryToPx(scrollerX, ['width']),
      height: tryToPx(scrollerX, ['height'])
    })
  },
  scrollerY: {
    style: ({ scrollerY }) => ({
      position: 'relative',
      width: tryToPx(scrollerY, ['width']),
      height: tryToPx(scrollerY, ['height'])
    })
  }
}

function toPx (value) {
  return `${value}px`
}

function negate (value) {
  return value * -1
}

function curry (fx) {
  var arity = fx.length

  return function f1 () {
    var args = Array.prototype.slice.call(arguments, 0)

    if (args.length >= arity) {
      return fx.apply(null, args)
    } else {
      return function f2 () {
        var args2 = Array.prototype.slice.call(arguments, 0)

        return f1.apply(null, args.concat(args2))
      }
    }
  }
}

function maybe (...args) {
  return curry((fn, value, segments) =>
    compose(ifElse(v => v === null, () => null, fn), path(segments))(value)
  )(...args)
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
