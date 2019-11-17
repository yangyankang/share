/**
 * 解决1像素问题的vue指令
 * 食用方法：
 * 在给对应的DOM上加上对应指令即可
 * v-onepx: 四边
 * v-onepx-t: 顶边
 * v-onepx-b: 底边
 * v-onepx-l: 左边
 * v-onepx-r: 右边
 * data-border-color="#9d9d9d" 给边框加上自定义颜色
 * 传参：如果参数为falsy（除了undefined），则不渲染border，undefined默认渲染
 *
 * 自定义颜色：先读取标签属性data-border-color => 再读取css的border-color值 => 最后使用默认颜色
 *
 * 注意：
 * 1、绑定的元素必须显示声明其position值为：relative、fixed、absolute之一
 * 2、务必给对应的DOM清除掉border样式
 * 3、不能用于<input type="text" />标签等内部不能插入元素的标签
 */
const dpr = devicePixelRatio
const DEFAULT_BORDER_COLOR = `"#d9d9d9"`

let directive = {
  onepx: {
    inserted(el, binding) {
      onepx(el, binding)
    },
    update(el, binding) {
      onepx(el, binding)
    }
  },
  'onepx-b': {
    inserted(el, binding) {
      onepx(el, binding, '-bottom')
    },
    update(el, binding) {
      onepx(el, binding, '-bottom')
    }
  },
  'onepx-t': {
    inserted(el, binding) {
      onepx(el, binding, '-top')
    },
    update(el, binding) {
      onepx(el, binding, '-top')
    }
  },
  'onepx-l': {
    inserted(el, binding) {
      onepx(el, binding, '-left')
    },
    update(el, binding) {
      onepx(el, binding, '-left')
    }
  },
  'onepx-r': {
    inserted(el, binding) {
      onepx(el, binding, '-right')
    },
    update(el, binding) {
      onepx(el, binding, '-right')
    }
  }
}

function onepx(el, binding, side = '') {
  if (binding.value !== undefined && !binding.value) return
  let id
  let elId = el.getAttribute('id')
  if (elId) {
    id = elId
  } else {
    id = `onepx_${parseInt(Math.random() * 10000000, 10)}`
    el.setAttribute('id', id)
  }

  let elStyle = getComputedStyle(el)
  if (!(elStyle.width && elStyle.height && elStyle.borderRadius)) return

  let cssBorderColor = elStyle.borderBottomColor
  let borderColor =
    el.getAttribute('data-border-color') ||
    cssBorderColor ||
    DEFAULT_BORDER_COLOR

  let computedBorder = ''
  elStyle.borderRadius.split(' ').map(v => {
    computedBorder += ' ' + parseFloat(v) * dpr + 'px'
  })
  let onepxStyle = `
                border-radius: ${computedBorder};
                width: ${getWidth(elStyle) * dpr}px;
                height: ${getHeight(elStyle) * dpr}px;
                position: absolute;
                left: 0;top: 0;
                transform: scale(${1 / dpr}, ${1 / dpr});
                transform-origin: 0 0;
                z-index: 1;
                pointer-events: none;
            `

  if (side) {
    onepxStyle += `border${side}: 1px solid ${borderColor};`
  } else {
    onepxStyle += `box-shadow: inset 0 0 0 1px ${borderColor};`
  }

  let onepx = el.querySelector(`.${id}`)
  if (onepx) {
    onepx.setAttribute('style', onepxStyle)
  } else {
    onepx = document.createElement('div')
    onepx.setAttribute('class', id)
    onepx.setAttribute('style', onepxStyle)
    onepx.classList.add('onepx')
    el.appendChild(onepx)
  }
}

function getWidth(elStyle) {
  if (elStyle['boxSizing'] === 'content-box') {
    return (
      parseFloat(elStyle['width']) +
      parseFloat(elStyle['padding-left']) +
      parseFloat(elStyle['padding-right'])
    )
  }
  return parseFloat(elStyle.width)
}

function getHeight(elStyle) {
  if (elStyle['boxSizing'] === 'content-box') {
    return (
      parseFloat(elStyle.height) +
      parseFloat(elStyle['padding-top']) +
      parseFloat(elStyle['padding-bottom'])
    )
  }
  return parseFloat(elStyle.height)
}

function debug(el) {
  return el.getAttribute('data-border-debug')
}

export default function(Vue) {
  Vue.mixin({
    directives: directive
  })
}
