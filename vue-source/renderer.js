// 生成vnode
function h(tag, properties, children) {
  return {
    tag,
    properties,
    children
  }
}

// vnode上树
function mount(vnode, container) {
  const el = vnode.el = document.createElement(vnode.tag)

  // 处理props
  if (vnode.properties) {
    for (const key in vnode.properties) {
      let value = vnode.properties[key]
      if (key.startsWith('on')) {
        // 对于事件属性,使用addEventListener来监听
        el.addEventListener(key.slice(2).toLowerCase(), value)
      } else {
        el.setAttribute(key, value)
      }
    }
  }

  // 处理真实DOM的child
  if (vnode.children) {
    if (typeof vnode.children === 'string') {
      el.textContent = vnode.children
    } else {
      vnode.children.forEach(element => {
        mount(element, el)
      });
    }
  }

  container.appendChild(el)

}

// 写了一个新的template,要替换旧的DOM,怎么替换
function patch(n1, n2) {
  if (n1.tag !== n2.tag) {
    const n1ParentNode = n1.el.parentElement
    n1ParentNode.removeChild(n1.el)
    mount(n2, n1ParentNode)
  } else {
    // 处理props
    const el = n1.el
    n2.el = el;
    // 1.获取所有新的props到el
    const n1Props = n1.properties || {}
    const n2Props = n2.properties || {}
    for (let key in n1Props) {
      if (n1Props[key] !== n2Props[key]) {
        if (key.startsWith('on')) {
          el.addEventListener(key.slice(2).toLowerCase(), n2Props[key])
        } else {
          el.setAttribute(key, n2Props[key])
        }
        // 有新的props,修改现成的DOM属性
      }
    }
  }
}