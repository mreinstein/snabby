function vnode(sel, data, children, text, elm) {
  const key = data === undefined ? undefined : data.key;
  return { sel, data, children, text, elm, key };
}

const array = Array.isArray;
function primitive(s) {
  return typeof s === 'string' || typeof s === 'number';
}

function createElement(tagName) {
  return document.createElement(tagName);
}
function createElementNS(namespaceURI, qualifiedName) {
  return document.createElementNS(namespaceURI, qualifiedName);
}
function createTextNode(text) {
  return document.createTextNode(text);
}
function createComment(text) {
  return document.createComment(text);
}
function insertBefore(parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}
function removeChild(node, child) {
  node.removeChild(child);
}
function appendChild(node, child) {
  node.appendChild(child);
}
function parentNode(node) {
  return node.parentNode;
}
function nextSibling(node) {
  return node.nextSibling;
}
function tagName(elm) {
  return elm.tagName;
}
function setTextContent(node, text) {
  node.textContent = text;
}
function getTextContent(node) {
  return node.textContent;
}
function isElement(node) {
  return node.nodeType === 1;
}
function isText(node) {
  return node.nodeType === 3;
}
function isComment(node) {
  return node.nodeType === 8;
}
const htmlDomApi = {
  createElement,
  createElementNS,
  createTextNode,
  createComment,
  insertBefore,
  removeChild,
  appendChild,
  parentNode,
  nextSibling,
  tagName,
  setTextContent,
  getTextContent,
  isElement,
  isText,
  isComment };

function isUndef(s) {
  return s === undefined;
}
function isDef(s) {
  return s !== undefined;
}
const emptyNode = vnode('', {}, [], undefined, undefined);
function sameVnode(vnode1, vnode2) {
  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}
function isVnode(vnode) {
  return vnode.sel !== undefined;
}
function createKeyToOldIdx(children, beginIdx, endIdx) {
  var _a;
  const map = {};
  for (let i = beginIdx; i <= endIdx; ++i) {
    const key = (_a = children[i]) === null || _a === void 0 ? void 0 : _a.key;
    if (key !== undefined) {
      map[key] = i;
    }
  }
  return map;
}
const hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
function init$1(modules, domApi) {
  let i;
  let j;
  const cbs = {
    create: [],
    update: [],
    remove: [],
    destroy: [],
    pre: [],
    post: [] };

  const api = domApi !== undefined ? domApi : htmlDomApi;
  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      const hook = modules[j][hooks[i]];
      if (hook !== undefined) {
        cbs[hooks[i]].push(hook);
      }
    }
  }
  function emptyNodeAt(elm) {
    const id = elm.id ? '#' + elm.id : '';
    const c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
    return vnode(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);
  }
  function createRmCb(childElm, listeners) {
    return function rmCb() {
      if (--listeners === 0) {
        const parent = api.parentNode(childElm);
        api.removeChild(parent, childElm);
      }
    };
  }
  function createElm(vnode, insertedVnodeQueue) {
    var _a, _b;
    let i;
    let data = vnode.data;
    if (data !== undefined) {
      const init = (_a = data.hook) === null || _a === void 0 ? void 0 : _a.init;
      if (isDef(init)) {
        init(vnode);
        data = vnode.data;
      }
    }
    const children = vnode.children;
    const sel = vnode.sel;
    if (sel === '!') {
      if (isUndef(vnode.text)) {
        vnode.text = '';
      }
      vnode.elm = api.createComment(vnode.text);
    } else
    if (sel !== undefined) {
      // Parse selector
      const hashIdx = sel.indexOf('#');
      const dotIdx = sel.indexOf('.', hashIdx);
      const hash = hashIdx > 0 ? hashIdx : sel.length;
      const dot = dotIdx > 0 ? dotIdx : sel.length;
      const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
      const elm = vnode.elm = isDef(data) && isDef(i = data.ns) ?
      api.createElementNS(i, tag) :
      api.createElement(tag);
      if (hash < dot)
      elm.setAttribute('id', sel.slice(hash + 1, dot));
      if (dotIdx > 0)
      elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '));
      for (i = 0; i < cbs.create.length; ++i)
      cbs.create[i](emptyNode, vnode);
      if (array(children)) {
        for (i = 0; i < children.length; ++i) {
          const ch = children[i];
          if (ch != null) {
            api.appendChild(elm, createElm(ch, insertedVnodeQueue));
          }
        }
      } else
      if (primitive(vnode.text)) {
        api.appendChild(elm, api.createTextNode(vnode.text));
      }
      const hook = vnode.data.hook;
      if (isDef(hook)) {
        (_b = hook.create) === null || _b === void 0 ? void 0 : _b.call(hook, emptyNode, vnode);
        if (hook.insert) {
          insertedVnodeQueue.push(vnode);
        }
      }
    } else
    {
      vnode.elm = api.createTextNode(vnode.text);
    }
    return vnode.elm;
  }
  function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx];
      if (ch != null) {
        api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
      }
    }
  }
  function invokeDestroyHook(vnode) {
    var _a, _b;
    const data = vnode.data;
    if (data !== undefined) {
      (_b = (_a = data === null || data === void 0 ? void 0 : data.hook) === null || _a === void 0 ? void 0 : _a.destroy) === null || _b === void 0 ? void 0 : _b.call(_a, vnode);
      for (let i = 0; i < cbs.destroy.length; ++i)
      cbs.destroy[i](vnode);
      if (vnode.children !== undefined) {
        for (let j = 0; j < vnode.children.length; ++j) {
          const child = vnode.children[j];
          if (child != null && typeof child !== 'string') {
            invokeDestroyHook(child);
          }
        }
      }
    }
  }
  function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
    var _a, _b;
    for (; startIdx <= endIdx; ++startIdx) {
      let listeners;
      let rm;
      const ch = vnodes[startIdx];
      if (ch != null) {
        if (isDef(ch.sel)) {
          invokeDestroyHook(ch);
          listeners = cbs.remove.length + 1;
          rm = createRmCb(ch.elm, listeners);
          for (let i = 0; i < cbs.remove.length; ++i)
          cbs.remove[i](ch, rm);
          const removeHook = (_b = (_a = ch === null || ch === void 0 ? void 0 : ch.data) === null || _a === void 0 ? void 0 : _a.hook) === null || _b === void 0 ? void 0 : _b.remove;
          if (isDef(removeHook)) {
            removeHook(ch, rm);
          } else
          {
            rm();
          }
        } else
        {// Text node
          api.removeChild(parentElm, ch.elm);
        }
      }
    }
  }
  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    let oldKeyToIdx;
    let idxInOld;
    let elmToMove;
    let before;
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (oldStartVnode == null) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
      } else
      if (oldEndVnode == null) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else
      if (newStartVnode == null) {
        newStartVnode = newCh[++newStartIdx];
      } else
      if (newEndVnode == null) {
        newEndVnode = newCh[--newEndIdx];
      } else
      if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else
      if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else
      if (sameVnode(oldStartVnode, newEndVnode)) {// Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else
      if (sameVnode(oldEndVnode, newStartVnode)) {// Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else
      {
        if (oldKeyToIdx === undefined) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        }
        idxInOld = oldKeyToIdx[newStartVnode.key];
        if (isUndef(idxInOld)) {// New element
          api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
        } else
        {
          elmToMove = oldCh[idxInOld];
          if (elmToMove.sel !== newStartVnode.sel) {
            api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
          } else
          {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
      if (oldStartIdx > oldEndIdx) {
        before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
        addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
      } else
      {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
      }
    }
  }
  function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
    var _a, _b, _c, _d, _e;
    const hook = (_a = vnode.data) === null || _a === void 0 ? void 0 : _a.hook;
    (_b = hook === null || hook === void 0 ? void 0 : hook.prepatch) === null || _b === void 0 ? void 0 : _b.call(hook, oldVnode, vnode);
    const elm = vnode.elm = oldVnode.elm;
    const oldCh = oldVnode.children;
    const ch = vnode.children;
    if (oldVnode === vnode)
    return;
    if (vnode.data !== undefined) {
      for (let i = 0; i < cbs.update.length; ++i)
      cbs.update[i](oldVnode, vnode);
      (_d = (_c = vnode.data.hook) === null || _c === void 0 ? void 0 : _c.update) === null || _d === void 0 ? void 0 : _d.call(_c, oldVnode, vnode);
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch)
        updateChildren(elm, oldCh, ch, insertedVnodeQueue);
      } else
      if (isDef(ch)) {
        if (isDef(oldVnode.text))
        api.setTextContent(elm, '');
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else
      if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else
      if (isDef(oldVnode.text)) {
        api.setTextContent(elm, '');
      }
    } else
    if (oldVnode.text !== vnode.text) {
      if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      }
      api.setTextContent(elm, vnode.text);
    }
    (_e = hook === null || hook === void 0 ? void 0 : hook.postpatch) === null || _e === void 0 ? void 0 : _e.call(hook, oldVnode, vnode);
  }
  return function patch(oldVnode, vnode) {
    let i, elm, parent;
    const insertedVnodeQueue = [];
    for (i = 0; i < cbs.pre.length; ++i)
    cbs.pre[i]();
    if (!isVnode(oldVnode)) {
      oldVnode = emptyNodeAt(oldVnode);
    }
    if (sameVnode(oldVnode, vnode)) {
      patchVnode(oldVnode, vnode, insertedVnodeQueue);
    } else
    {
      elm = oldVnode.elm;
      parent = api.parentNode(elm);
      createElm(vnode, insertedVnodeQueue);
      if (parent !== null) {
        api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
        removeVnodes(parent, [oldVnode], 0, 0);
      }
    }
    for (i = 0; i < insertedVnodeQueue.length; ++i) {
      insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
    }
    for (i = 0; i < cbs.post.length; ++i)
    cbs.post[i]();
    return vnode;
  };
}

function addNS(data, children, sel) {
  data.ns = 'http://www.w3.org/2000/svg';
  if (sel !== 'foreignObject' && children !== undefined) {
    for (let i = 0; i < children.length; ++i) {
      const childData = children[i].data;
      if (childData !== undefined) {
        addNS(childData, children[i].children, children[i].sel);
      }
    }
  }
}
function h(sel, b, c) {
  var data = {};
  var children;
  var text;
  var i;
  if (c !== undefined) {
    if (b !== null) {
      data = b;
    }
    if (array(c)) {
      children = c;
    } else
    if (primitive(c)) {
      text = c;
    } else
    if (c && c.sel) {
      children = [c];
    }
  } else
  if (b !== undefined && b !== null) {
    if (array(b)) {
      children = b;
    } else
    if (primitive(b)) {
      text = b;
    } else
    if (b && b.sel) {
      children = [b];
    } else
    {
      data = b;
    }
  }
  if (children !== undefined) {
    for (i = 0; i < children.length; ++i) {
      if (primitive(children[i]))
      children[i] = vnode(undefined, undefined, undefined, children[i], undefined);
    }
  }
  if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' && (
  sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
    addNS(data, children, sel);
  }
  return vnode(sel, data, children, text, undefined);
}

function copyToThunk(vnode, thunk) {
  vnode.data.fn = thunk.data.fn;
  vnode.data.args = thunk.data.args;
  thunk.data = vnode.data;
  thunk.children = vnode.children;
  thunk.text = vnode.text;
  thunk.elm = vnode.elm;
}
function init(thunk) {
  const cur = thunk.data;
  const vnode = cur.fn.apply(undefined, cur.args);
  copyToThunk(vnode, thunk);
}
function prepatch(oldVnode, thunk) {
  let i;
  const old = oldVnode.data;
  const cur = thunk.data;
  const oldArgs = old.args;
  const args = cur.args;
  if (old.fn !== cur.fn || oldArgs.length !== args.length) {
    copyToThunk(cur.fn.apply(undefined, args), thunk);
    return;
  }
  for (i = 0; i < args.length; ++i) {
    if (oldArgs[i] !== args[i]) {
      copyToThunk(cur.fn.apply(undefined, args), thunk);
      return;
    }
  }
  copyToThunk(oldVnode, thunk);
}
const thunk = function thunk(sel, key, fn, args) {
  if (args === undefined) {
    args = fn;
    fn = key;
    key = undefined;
  }
  return h(sel, {
    key: key,
    hook: { init, prepatch },
    fn: fn,
    args: args });

};

var hyperscriptAttributeToProperty = attributeToProperty;

var transform = {
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
};

function attributeToProperty (h) {
  return function (tagName, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr];
        delete attrs[attr];
      }
    }
    return h(tagName, attrs, children)
  }
}

var VAR = 0, TEXT = 1, OPEN = 2, CLOSE = 3, ATTR = 4;
var ATTR_KEY = 5, ATTR_KEY_W = 6;
var ATTR_VALUE_W = 7, ATTR_VALUE = 8;
var ATTR_VALUE_SQ = 9, ATTR_VALUE_DQ = 10;
var ATTR_EQ = 11, ATTR_BREAK = 12;
var COMMENT = 13;

var hyperx = function (h, opts) {
  if (!opts) opts =  { };

  var concat = opts.concat || function (a, b) {
    return String(a) + String(b)
  };

  if (opts.attrToProp !== false)
    h = hyperscriptAttributeToProperty(h);


  return function (strings) {

    var state = TEXT, reg = '', isSelfClosing = false;
    var arglen = arguments.length;
    var parts = [];

    for (var i = 0; i < strings.length; i++) {

      if (i < arglen - 1) {
        var arg = arguments[i+1];
        var p = parse(strings[i]);
        var xstate = state;
        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE;
        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE;
        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE;
        if (xstate === ATTR) xstate = ATTR_KEY;
        if (xstate === OPEN) {
          if (reg === '/') {
            p.push([ OPEN, '/', arg ]);
            reg = '';
          } else {
            p.push([ OPEN, arg ]);
          }
        } else if (xstate === COMMENT && opts.comments) {
          reg += String(arg);
        } else if (xstate !== COMMENT) {
          p.push([ VAR, xstate, arg ]);
        }
        parts.push.apply(parts, p);
      } else {
        parts.push.apply(parts, parse(strings[i]));
      }
    }

    var tree = [ null, {}, [] ];
    var stack = [ [ tree, -1 ] ];

    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length-1][0];
      var p = parts[i], state = p[0];

      if (state === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length-1][1];
        if (stack.length > 1) {
          stack.pop();
          stack[stack.length-1][0][2][ix] = h(cur[0], cur[1], cur[2].length ? cur[2] : undefined);
        }

      } else if (state === OPEN) {
        var c = [p[1],{},[]];
        cur[2].push(c);
        stack.push([c,cur[2].length-1]);

      } else if (state === ATTR_KEY || (state === VAR && p[1] === ATTR_KEY)) {
        var key = '';
        var copyKey;
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1]);

          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === 'object' && !key) {
              for (copyKey in parts[i][2])
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey])
                  cur[1][copyKey] = parts[i][2][copyKey];

            } else {
              key = concat(key, parts[i][2]);
            }

          } else {
            break
          }
        }

        if (parts[i][0] === ATTR_EQ)
          i++;

        var j = i;

        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key])
                cur[1][key] = strfn(parts[i][1]);
            else
                parts[i][1]==="" || (cur[1][key] = concat(cur[1][key], parts[i][1]));

          } else if (parts[i][0] === VAR && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key])
                cur[1][key] = strfn(parts[i][2]);
            else
                parts[i][2]==="" || (cur[1][key] = concat(cur[1][key], parts[i][2]));

          } else {
            if (key.length && !cur[1][key] && i === j && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase();
            }

            if (parts[i][0] === CLOSE)
              i--;

            break
          }
        }

      } else if (state === ATTR_KEY) {
        cur[1][p[1]] = true;

      } else if (state === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true;

      } else if (state === CLOSE) {
        
        const isSelfClosing = p[1] || selfClosingVoid(cur[0]);
        //if (selfClosing(cur[0]) && stack.length) {
        if (isSelfClosing && stack.length) {
          var ix = stack[stack.length-1][1];
          stack.pop();
          stack[stack.length-1][0][2][ix] = h(cur[0], cur[1], cur[2].length ? cur[2] : undefined);
        }

      } else if (state === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null)
            p[2] = '';
        else if (!p[2])
            p[2] = concat('', p[2]);

        if (Array.isArray(p[2][0]))
          cur[2].push.apply(cur[2], p[2]);
        else
          cur[2].push(p[2]);

      } else if (state === TEXT) {
        cur[2].push(p[1]);

      } else if (state === ATTR_EQ || state === ATTR_BREAK) ; else {
        throw new Error('unhandled: ' + state)

      }
    }

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0]))
      tree[2].shift();

    if (tree[2].length > 2 || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
      if (opts.createFragment)
        return opts.createFragment(tree[2])
      
      throw new Error(
        'multiple root elements must be wrapped in an enclosing tag'
      )
    }

    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string' && Array.isArray(tree[2][0][2]))
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2]);

    return tree[2][0]

    function parse (str) {
      var res = [ ];

      if (state === ATTR_VALUE_W)
        state = ATTR;

      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i);
        if (state === TEXT && c === '<') {
          if (reg.length)
            res.push([TEXT, reg]);
          reg = '';
          state = OPEN;
        } else if (c === '>' && !quot(state) && state !== COMMENT) {
          if (state === OPEN && reg.length) {
            res.push([OPEN,reg]);
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY,reg]);
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE,reg]);
          }
          res.push([CLOSE, isSelfClosing]);
          isSelfClosing = false;
          reg = '';
          state = TEXT;
        } else if (state === COMMENT && /-$/.test(reg) && c === '-') {
          if (opts.comments) {
            res.push([ATTR_VALUE,reg.substr(0, reg.length - 1)]);
          }
          reg = '';
          isSelfClosing = true;
          state = TEXT;
        } else if (state === OPEN && /^!--$/.test(reg)) {
          if (opts.comments) {
            res.push([OPEN, reg],[ATTR_KEY,'comment'],[ATTR_EQ]);
          }
          reg = c;
          state = COMMENT;
        } else if (state === TEXT || state === COMMENT) {
          reg += c;
        } else if (state === OPEN && c === '/' && reg.length) {
          // self closing tag without a space <br/>
          isSelfClosing = true;

        } else if (state === OPEN && /\s/.test(c)) {
          if (reg.length)
            res.push([OPEN, reg]);

          reg = '';
          state = ATTR;
        } else if (state === OPEN) {
          reg += c;
        } else if (state === ATTR && /[^\s"'=/]/.test(c)) {
          state = ATTR_KEY;
          reg = c;
        } else if (state === ATTR && /\s/.test(c)) {
          if (reg.length)
            res.push([ATTR_KEY,reg]);
          res.push([ATTR_BREAK]);
        } else if (state === ATTR_KEY && /\s/.test(c)) {
          res.push([ATTR_KEY,reg]);
          reg = '';
          state = ATTR_KEY_W;
        } else if (state === ATTR_KEY && c === '=') {
          res.push([ATTR_KEY,reg],[ATTR_EQ]);
          reg = '';
          state = ATTR_VALUE_W;
        } else if (state === ATTR_KEY && c === '/') {
          isSelfClosing = true;
          reg='';
          state = ATTR;
        } else if (state === ATTR_KEY) {
          reg += c;
        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
          res.push([ATTR_EQ]);
          state = ATTR_VALUE_W;
        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
          res.push([ATTR_BREAK]);
          if (/[\w-]/.test(c)) {
            reg += c;
            state = ATTR_KEY;
          } else if (c === '/') {
            isSelfClosing = true;
          } else {
            state = ATTR;
          }
        } else if (state === ATTR_VALUE_W && c === '"') {
          state = ATTR_VALUE_DQ;
        } else if (state === ATTR_VALUE_W && c === "'") {
          state = ATTR_VALUE_SQ;
        } else if (state === ATTR_VALUE_DQ && c === '"') {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK]);
          reg = '';
          state = ATTR;
        } else if (state === ATTR_VALUE_SQ && c === "'") {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK]);
          reg = '';
          state = ATTR;
        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
          state = ATTR_VALUE;
          i--;
        } else if (state === ATTR_VALUE && /\s/.test(c)) {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK]);
          reg = '';
          state = ATTR;
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ
        || state === ATTR_VALUE_DQ) {
          reg += c;
        }
      }
      if (state === TEXT && reg.length) {
        res.push([TEXT,reg]);
        reg = '';
      } else if (state === ATTR_VALUE && reg.length) {
        res.push([ATTR_VALUE,reg]);
        reg = '';
      } else if (state === ATTR_VALUE_DQ && reg.length) {
        res.push([ATTR_VALUE,reg]);
        reg = '';
      } else if (state === ATTR_VALUE_SQ && reg.length) {
        res.push([ATTR_VALUE,reg]);
        reg = '';
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY,reg]);
        reg = '';
      }
      return res
    }
  }

  function strfn (x) {
    if (typeof x === 'function') return x
    else if (typeof x === 'string') return x
    else if (x && typeof x === 'object') return x
    else if (x === null || x === undefined) return x
    else return concat('', x)
  }
};

function quot (state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ
}

//area, base, br, col, command, embed, hr, img, input, keygen, link, meta, param, source, track, wbr
var voidCloseRE = RegExp('^(' + [
  'area', 'base', 'br', 'col', 'command', 'embed',
  'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr'
].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$');

function selfClosingVoid (tag) { return voidCloseRE.test(tag) }

function create (modules, options={}) {

  const directive = options.directive || '@';

  function createElement (sel, input, content) {
    if (sel === '!--')
      return h('!', input.comment)

    if (content && content.length) {
      if (content.length === 1)
        content = content[0];
      else
        content = [].concat.apply([], content);  // flatten nested arrays
    }

    // attribute names, and handling none faster:
    const names = Object.keys(input);
    if (!names || !names.length)
      return h(sel, content)

    // parse Snabbdom's `data` from attributes:
    const data = { };
    for (let i = 0, max = names.length; max > i; i++) {
      const name = names[i];
      if (input[name] === 'false')
        input[name] = false;

      // directive attributes
      if (name.indexOf(directive) === 0) {
        const parts = name.slice(1).split(':');
        let previous = data;
        for (let p = 0, pmax = parts.length, last = pmax - 1; p < pmax; p++) {
          const part = parts[p];
          if (p === last)
            previous[part] = input[name];
          else if (!previous[part])
            previous = previous[part] = { };
          else
            previous = previous[part];
        }
      }

      // put all other attributes into `data.attrs`
      else {
        if (!data.attrs)
          data.attrs = { };
        data.attrs[name] = input[name];
      }
    }

    // return vnode:
    return h(sel, data, content)
  }

  // create the snabbdom + hyperx functions
  const patch = init$1(modules || [ ]);
  
  // create snabby function
  const snabby = hyperx(createElement, { comments: true, attrToProp: false });
  
  // create yo-yo-like update function
  snabby.update = function update (dest, src) {
    return patch(dest, src)
  };

  snabby.thunk = thunk;

  return snabby
}

const xlinkNS = 'http://www.w3.org/1999/xlink';
const xmlNS = 'http://www.w3.org/XML/1998/namespace';
const colonChar = 58;
const xChar = 120;
function updateAttrs(oldVnode, vnode) {
  var key;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs;
  var attrs = vnode.data.attrs;
  if (!oldAttrs && !attrs)
  return;
  if (oldAttrs === attrs)
  return;
  oldAttrs = oldAttrs || {};
  attrs = attrs || {};
  // update modified attributes, add new attributes
  for (key in attrs) {
    const cur = attrs[key];
    const old = oldAttrs[key];
    if (old !== cur) {
      if (cur === true) {
        elm.setAttribute(key, '');
      } else
      if (cur === false) {
        elm.removeAttribute(key);
      } else
      {
        if (key.charCodeAt(0) !== xChar) {
          elm.setAttribute(key, cur);
        } else
        if (key.charCodeAt(3) === colonChar) {
          // Assume xml namespace
          elm.setAttributeNS(xmlNS, key, cur);
        } else
        if (key.charCodeAt(5) === colonChar) {
          // Assume xlink namespace
          elm.setAttributeNS(xlinkNS, key, cur);
        } else
        {
          elm.setAttribute(key, cur);
        }
      }
    }
  }
  // remove removed attributes
  // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
  // the other option is to remove all attributes with value == undefined
  for (key in oldAttrs) {
    if (!(key in attrs)) {
      elm.removeAttribute(key);
    }
  }
}
const attributesModule = { create: updateAttrs, update: updateAttrs };

function updateClass(oldVnode, vnode) {
  var cur;
  var name;
  var elm = vnode.elm;
  var oldClass = oldVnode.data.class;
  var klass = vnode.data.class;
  if (!oldClass && !klass)
  return;
  if (oldClass === klass)
  return;
  oldClass = oldClass || {};
  klass = klass || {};
  for (name in oldClass) {
    if (oldClass[name] &&
    !Object.prototype.hasOwnProperty.call(klass, name)) {
      // was `true` and now not provided
      elm.classList.remove(name);
    }
  }
  for (name in klass) {
    cur = klass[name];
    if (cur !== oldClass[name]) {
      elm.classList[cur ? 'add' : 'remove'](name);
    }
  }
}
const classModule = { create: updateClass, update: updateClass };

function updateProps(oldVnode, vnode) {
  var key;
  var cur;
  var old;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.props;
  var props = vnode.data.props;
  if (!oldProps && !props)
  return;
  if (oldProps === props)
  return;
  oldProps = oldProps || {};
  props = props || {};
  for (key in props) {
    cur = props[key];
    old = oldProps[key];
    if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
      elm[key] = cur;
    }
  }
}
const propsModule = { create: updateProps, update: updateProps };

// Bindig `requestAnimationFrame` like this fixes a bug in IE/Edge. See #360 and #409.
var raf = typeof window !== 'undefined' && window.requestAnimationFrame.bind(window) || setTimeout;
var nextFrame = function (fn) {
  raf(function () {
    raf(fn);
  });
};
var reflowForced = false;
function setNextFrame(obj, prop, val) {
  nextFrame(function () {
    obj[prop] = val;
  });
}
function updateStyle(oldVnode, vnode) {
  var cur;
  var name;
  var elm = vnode.elm;
  var oldStyle = oldVnode.data.style;
  var style = vnode.data.style;
  if (!oldStyle && !style)
  return;
  if (oldStyle === style)
  return;
  oldStyle = oldStyle || {};
  style = style || {};
  var oldHasDel = ('delayed' in oldStyle);
  for (name in oldStyle) {
    if (!style[name]) {
      if (name[0] === '-' && name[1] === '-') {
        elm.style.removeProperty(name);
      } else
      {
        elm.style[name] = '';
      }
    }
  }
  for (name in style) {
    cur = style[name];
    if (name === 'delayed' && style.delayed) {
      for (const name2 in style.delayed) {
        cur = style.delayed[name2];
        if (!oldHasDel || cur !== oldStyle.delayed[name2]) {
          setNextFrame(elm.style, name2, cur);
        }
      }
    } else
    if (name !== 'remove' && cur !== oldStyle[name]) {
      if (name[0] === '-' && name[1] === '-') {
        elm.style.setProperty(name, cur);
      } else
      {
        elm.style[name] = cur;
      }
    }
  }
}
function applyDestroyStyle(vnode) {
  var style;
  var name;
  var elm = vnode.elm;
  var s = vnode.data.style;
  if (!s || !(style = s.destroy))
  return;
  for (name in style) {
    elm.style[name] = style[name];
  }
}
function applyRemoveStyle(vnode, rm) {
  var s = vnode.data.style;
  if (!s || !s.remove) {
    rm();
    return;
  }
  if (!reflowForced) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    vnode.elm.offsetLeft;
    reflowForced = true;
  }
  var name;
  var elm = vnode.elm;
  var i = 0;
  var compStyle;
  var style = s.remove;
  var amount = 0;
  var applied = [];
  for (name in style) {
    applied.push(name);
    elm.style[name] = style[name];
  }
  compStyle = getComputedStyle(elm);
  var props = compStyle['transition-property'].split(', ');
  for (; i < props.length; ++i) {
    if (applied.indexOf(props[i]) !== -1)
    amount++;
  }
  elm.addEventListener('transitionend', function (ev) {
    if (ev.target === elm)
    --amount;
    if (amount === 0)
    rm();
  });
}
function forceReflow() {
  reflowForced = false;
}
const styleModule = {
  pre: forceReflow,
  create: updateStyle,
  update: updateStyle,
  destroy: applyDestroyStyle,
  remove: applyRemoveStyle };

function invokeHandler(handler, vnode, event) {
  if (typeof handler === 'function') {
    // call function handler
    handler.call(vnode, event, vnode);
  } else
  if (typeof handler === 'object') {
    // call multiple handlers
    for (var i = 0; i < handler.length; i++) {
      invokeHandler(handler[i], vnode, event);
    }
  }
}
function handleEvent(event, vnode) {
  var name = event.type;
  var on = vnode.data.on;
  // call event handler(s) if exists
  if (on && on[name]) {
    invokeHandler(on[name], vnode, event);
  }
}
function createListener() {
  return function handler(event) {
    handleEvent(event, handler.vnode);
  };
}
function updateEventListeners(oldVnode, vnode) {
  var oldOn = oldVnode.data.on;
  var oldListener = oldVnode.listener;
  var oldElm = oldVnode.elm;
  var on = vnode && vnode.data.on;
  var elm = vnode && vnode.elm;
  var name;
  // optimization for reused immutable handlers
  if (oldOn === on) {
    return;
  }
  // remove existing listeners which no longer used
  if (oldOn && oldListener) {
    // if element changed or deleted we remove all existing listeners unconditionally
    if (!on) {
      for (name in oldOn) {
        // remove listener if element was changed or existing listeners removed
        oldElm.removeEventListener(name, oldListener, false);
      }
    } else
    {
      for (name in oldOn) {
        // remove listener if existing listener removed
        if (!on[name]) {
          oldElm.removeEventListener(name, oldListener, false);
        }
      }
    }
  }
  // add new listeners which has not already attached
  if (on) {
    // reuse existing listener or create new
    var listener = vnode.listener = oldVnode.listener || createListener();
    // update vnode for listener
    listener.vnode = vnode;
    // if element changed or added we add all needed listeners unconditionally
    if (!oldOn) {
      for (name in on) {
        // add listener if element was changed or new listeners added
        elm.addEventListener(name, listener, false);
      }
    } else
    {
      for (name in on) {
        // add listener if new listener added
        if (!oldOn[name]) {
          elm.addEventListener(name, listener, false);
        }
      }
    }
  }
}
const eventListenersModule = {
  create: updateEventListeners,
  update: updateEventListeners,
  destroy: updateEventListeners };

var global$1 = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
var MapShim = function () {
  if (typeof Map !== "undefined") {
    return Map;
  }
  function getIndex(arr, key) {
    var result = -1;
    arr.some(function (entry, index2) {
      if (entry[0] === key) {
        result = index2;
        return true;
      }
      return false;
    });
    return result;
  }
  return function () {
    function class_1() {
      this.__entries__ = [];
    }
    Object.defineProperty(class_1.prototype, "size", {
      get: function () {
        return this.__entries__.length;
      },
      enumerable: true,
      configurable: true });

    class_1.prototype.get = function (key) {
      var index2 = getIndex(this.__entries__, key);
      var entry = this.__entries__[index2];
      return entry && entry[1];
    };
    class_1.prototype.set = function (key, value) {
      var index2 = getIndex(this.__entries__, key);
      if (~index2) {
        this.__entries__[index2][1] = value;
      } else {
        this.__entries__.push([key, value]);
      }
    };
    class_1.prototype.delete = function (key) {
      var entries = this.__entries__;
      var index2 = getIndex(entries, key);
      if (~index2) {
        entries.splice(index2, 1);
      }
    };
    class_1.prototype.has = function (key) {
      return !!~getIndex(this.__entries__, key);
    };
    class_1.prototype.clear = function () {
      this.__entries__.splice(0);
    };
    class_1.prototype.forEach = function (callback, ctx) {
      if (ctx === void 0) {
        ctx = null;
      }
      for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
        var entry = _a[_i];
        callback.call(ctx, entry[1], entry[0]);
      }
    };
    return class_1;
  }();
}();
var isBrowser = typeof window !== "undefined" && typeof document !== "undefined" && window.document === document;
var global$1$1 = function () {
  if (typeof global$1 !== "undefined" && global$1.Math === Math) {
    return global$1;
  }
  if (typeof self !== "undefined" && self.Math === Math) {
    return self;
  }
  if (typeof window !== "undefined" && window.Math === Math) {
    return window;
  }
  return Function("return this")();
}();
var requestAnimationFrame$1 = function () {
  if (typeof requestAnimationFrame === "function") {
    return requestAnimationFrame.bind(global$1$1);
  }
  return function (callback) {
    return setTimeout(function () {
      return callback(Date.now());
    }, 1e3 / 60);
  };
}();
var trailingTimeout = 2;
function throttle(callback, delay) {
  var leadingCall = false,trailingCall = false,lastCallTime = 0;
  function resolvePending() {
    if (leadingCall) {
      leadingCall = false;
      callback();
    }
    if (trailingCall) {
      proxy();
    }
  }
  function timeoutCallback() {
    requestAnimationFrame$1(resolvePending);
  }
  function proxy() {
    var timeStamp = Date.now();
    if (leadingCall) {
      if (timeStamp - lastCallTime < trailingTimeout) {
        return;
      }
      trailingCall = true;
    } else {
      leadingCall = true;
      trailingCall = false;
      setTimeout(timeoutCallback, delay);
    }
    lastCallTime = timeStamp;
  }
  return proxy;
}
var REFRESH_DELAY = 20;
var transitionKeys = ["top", "right", "bottom", "left", "width", "height", "size", "weight"];
var mutationObserverSupported = typeof MutationObserver !== "undefined";
var ResizeObserverController = function () {
  function ResizeObserverController2() {
    this.connected_ = false;
    this.mutationEventsAdded_ = false;
    this.mutationsObserver_ = null;
    this.observers_ = [];
    this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
    this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
  }
  ResizeObserverController2.prototype.addObserver = function (observer) {
    if (!~this.observers_.indexOf(observer)) {
      this.observers_.push(observer);
    }
    if (!this.connected_) {
      this.connect_();
    }
  };
  ResizeObserverController2.prototype.removeObserver = function (observer) {
    var observers2 = this.observers_;
    var index2 = observers2.indexOf(observer);
    if (~index2) {
      observers2.splice(index2, 1);
    }
    if (!observers2.length && this.connected_) {
      this.disconnect_();
    }
  };
  ResizeObserverController2.prototype.refresh = function () {
    var changesDetected = this.updateObservers_();
    if (changesDetected) {
      this.refresh();
    }
  };
  ResizeObserverController2.prototype.updateObservers_ = function () {
    var activeObservers = this.observers_.filter(function (observer) {
      return observer.gatherActive(), observer.hasActive();
    });
    activeObservers.forEach(function (observer) {
      return observer.broadcastActive();
    });
    return activeObservers.length > 0;
  };
  ResizeObserverController2.prototype.connect_ = function () {
    if (!isBrowser || this.connected_) {
      return;
    }
    document.addEventListener("transitionend", this.onTransitionEnd_);
    window.addEventListener("resize", this.refresh);
    if (mutationObserverSupported) {
      this.mutationsObserver_ = new MutationObserver(this.refresh);
      this.mutationsObserver_.observe(document, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true });

    } else {
      document.addEventListener("DOMSubtreeModified", this.refresh);
      this.mutationEventsAdded_ = true;
    }
    this.connected_ = true;
  };
  ResizeObserverController2.prototype.disconnect_ = function () {
    if (!isBrowser || !this.connected_) {
      return;
    }
    document.removeEventListener("transitionend", this.onTransitionEnd_);
    window.removeEventListener("resize", this.refresh);
    if (this.mutationsObserver_) {
      this.mutationsObserver_.disconnect();
    }
    if (this.mutationEventsAdded_) {
      document.removeEventListener("DOMSubtreeModified", this.refresh);
    }
    this.mutationsObserver_ = null;
    this.mutationEventsAdded_ = false;
    this.connected_ = false;
  };
  ResizeObserverController2.prototype.onTransitionEnd_ = function (_a) {
    var _b = _a.propertyName,propertyName = _b === void 0 ? "" : _b;
    var isReflowProperty = transitionKeys.some(function (key) {
      return !!~propertyName.indexOf(key);
    });
    if (isReflowProperty) {
      this.refresh();
    }
  };
  ResizeObserverController2.getInstance = function () {
    if (!this.instance_) {
      this.instance_ = new ResizeObserverController2();
    }
    return this.instance_;
  };
  ResizeObserverController2.instance_ = null;
  return ResizeObserverController2;
}();
var defineConfigurable = function (target, props) {
  for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
    var key = _a[_i];
    Object.defineProperty(target, key, {
      value: props[key],
      enumerable: false,
      writable: false,
      configurable: true });

  }
  return target;
};
var getWindowOf = function (target) {
  var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;
  return ownerGlobal || global$1$1;
};
var emptyRect = createRectInit(0, 0, 0, 0);
function toFloat(value) {
  return parseFloat(value) || 0;
}
function getBordersSize(styles) {
  var positions = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    positions[_i - 1] = arguments[_i];
  }
  return positions.reduce(function (size, position) {
    var value = styles["border-" + position + "-width"];
    return size + toFloat(value);
  }, 0);
}
function getPaddings(styles) {
  var positions = ["top", "right", "bottom", "left"];
  var paddings = {};
  for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
    var position = positions_1[_i];
    var value = styles["padding-" + position];
    paddings[position] = toFloat(value);
  }
  return paddings;
}
function getSVGContentRect(target) {
  var bbox = target.getBBox();
  return createRectInit(0, 0, bbox.width, bbox.height);
}
function getHTMLElementContentRect(target) {
  var clientWidth = target.clientWidth,clientHeight = target.clientHeight;
  if (!clientWidth && !clientHeight) {
    return emptyRect;
  }
  var styles = getWindowOf(target).getComputedStyle(target);
  var paddings = getPaddings(styles);
  var horizPad = paddings.left + paddings.right;
  var vertPad = paddings.top + paddings.bottom;
  var width = toFloat(styles.width),height = toFloat(styles.height);
  if (styles.boxSizing === "border-box") {
    if (Math.round(width + horizPad) !== clientWidth) {
      width -= getBordersSize(styles, "left", "right") + horizPad;
    }
    if (Math.round(height + vertPad) !== clientHeight) {
      height -= getBordersSize(styles, "top", "bottom") + vertPad;
    }
  }
  if (!isDocumentElement(target)) {
    var vertScrollbar = Math.round(width + horizPad) - clientWidth;
    var horizScrollbar = Math.round(height + vertPad) - clientHeight;
    if (Math.abs(vertScrollbar) !== 1) {
      width -= vertScrollbar;
    }
    if (Math.abs(horizScrollbar) !== 1) {
      height -= horizScrollbar;
    }
  }
  return createRectInit(paddings.left, paddings.top, width, height);
}
var isSVGGraphicsElement = function () {
  if (typeof SVGGraphicsElement !== "undefined") {
    return function (target) {
      return target instanceof getWindowOf(target).SVGGraphicsElement;
    };
  }
  return function (target) {
    return target instanceof getWindowOf(target).SVGElement && typeof target.getBBox === "function";
  };
}();
function isDocumentElement(target) {
  return target === getWindowOf(target).document.documentElement;
}
function getContentRect(target) {
  if (!isBrowser) {
    return emptyRect;
  }
  if (isSVGGraphicsElement(target)) {
    return getSVGContentRect(target);
  }
  return getHTMLElementContentRect(target);
}
function createReadOnlyRect(_a) {
  var x = _a.x,y = _a.y,width = _a.width,height = _a.height;
  var Constr = typeof DOMRectReadOnly !== "undefined" ? DOMRectReadOnly : Object;
  var rect = Object.create(Constr.prototype);
  defineConfigurable(rect, {
    x,
    y,
    width,
    height,
    top: y,
    right: x + width,
    bottom: height + y,
    left: x });

  return rect;
}
function createRectInit(x, y, width, height) {
  return { x, y, width, height };
}
var ResizeObservation = function () {
  function ResizeObservation2(target) {
    this.broadcastWidth = 0;
    this.broadcastHeight = 0;
    this.contentRect_ = createRectInit(0, 0, 0, 0);
    this.target = target;
  }
  ResizeObservation2.prototype.isActive = function () {
    var rect = getContentRect(this.target);
    this.contentRect_ = rect;
    return rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight;
  };
  ResizeObservation2.prototype.broadcastRect = function () {
    var rect = this.contentRect_;
    this.broadcastWidth = rect.width;
    this.broadcastHeight = rect.height;
    return rect;
  };
  return ResizeObservation2;
}();
var ResizeObserverEntry = function () {
  function ResizeObserverEntry2(target, rectInit) {
    var contentRect = createReadOnlyRect(rectInit);
    defineConfigurable(this, { target, contentRect });
  }
  return ResizeObserverEntry2;
}();
var ResizeObserverSPI = function () {
  function ResizeObserverSPI2(callback, controller, callbackCtx) {
    this.activeObservations_ = [];
    this.observations_ = new MapShim();
    if (typeof callback !== "function") {
      throw new TypeError("The callback provided as parameter 1 is not a function.");
    }
    this.callback_ = callback;
    this.controller_ = controller;
    this.callbackCtx_ = callbackCtx;
  }
  ResizeObserverSPI2.prototype.observe = function (target) {
    if (!arguments.length) {
      throw new TypeError("1 argument required, but only 0 present.");
    }
    if (typeof Element === "undefined" || !(Element instanceof Object)) {
      return;
    }
    if (!(target instanceof getWindowOf(target).Element)) {
      throw new TypeError('parameter 1 is not of type "Element".');
    }
    var observations = this.observations_;
    if (observations.has(target)) {
      return;
    }
    observations.set(target, new ResizeObservation(target));
    this.controller_.addObserver(this);
    this.controller_.refresh();
  };
  ResizeObserverSPI2.prototype.unobserve = function (target) {
    if (!arguments.length) {
      throw new TypeError("1 argument required, but only 0 present.");
    }
    if (typeof Element === "undefined" || !(Element instanceof Object)) {
      return;
    }
    if (!(target instanceof getWindowOf(target).Element)) {
      throw new TypeError('parameter 1 is not of type "Element".');
    }
    var observations = this.observations_;
    if (!observations.has(target)) {
      return;
    }
    observations.delete(target);
    if (!observations.size) {
      this.controller_.removeObserver(this);
    }
  };
  ResizeObserverSPI2.prototype.disconnect = function () {
    this.clearActive();
    this.observations_.clear();
    this.controller_.removeObserver(this);
  };
  ResizeObserverSPI2.prototype.gatherActive = function () {
    var _this = this;
    this.clearActive();
    this.observations_.forEach(function (observation) {
      if (observation.isActive()) {
        _this.activeObservations_.push(observation);
      }
    });
  };
  ResizeObserverSPI2.prototype.broadcastActive = function () {
    if (!this.hasActive()) {
      return;
    }
    var ctx = this.callbackCtx_;
    var entries = this.activeObservations_.map(function (observation) {
      return new ResizeObserverEntry(observation.target, observation.broadcastRect());
    });
    this.callback_.call(ctx, entries, ctx);
    this.clearActive();
  };
  ResizeObserverSPI2.prototype.clearActive = function () {
    this.activeObservations_.splice(0);
  };
  ResizeObserverSPI2.prototype.hasActive = function () {
    return this.activeObservations_.length > 0;
  };
  return ResizeObserverSPI2;
}();
var observers = typeof WeakMap !== "undefined" ? new WeakMap() : new MapShim();
var ResizeObserver = function () {
  function ResizeObserver2(callback) {
    if (!(this instanceof ResizeObserver2)) {
      throw new TypeError("Cannot call a class as a function.");
    }
    if (!arguments.length) {
      throw new TypeError("1 argument required, but only 0 present.");
    }
    var controller = ResizeObserverController.getInstance();
    var observer = new ResizeObserverSPI(callback, controller, this);
    observers.set(this, observer);
  }
  return ResizeObserver2;
}();
[
"observe",
"unobserve",
"disconnect"].
forEach(function (method) {
  ResizeObserver.prototype[method] = function () {
    var _a;
    return (_a = observers.get(this))[method].apply(_a, arguments);
  };
});
var index$1 = function () {
  if (typeof global$1$1.ResizeObserver !== "undefined") {
    return global$1$1.ResizeObserver;
  }
  return ResizeObserver;
}();

// inspired by https://philipwalton.com/articles/responsive-components-a-solution-to-the-container-queries-problem/


// today it's more performant to have 1 resizeObserver observe multiple elements rather than 1 per element.
// see https://groups.google.com/a/chromium.org/g/blink-dev/c/z6ienONUb5A/m/F5-VcUZtBAAJ
const observer = new index$1(function (entries) {
	for (const entry of entries) {
		const breakpoints = JSON.parse(entry.target.dataset.breakpoints);

		// the rule iteration order depends on the order the object keys, and this varies from browser to browser.
		// keep track of a high water mark so we always apply the widest matching rule regardless of iteration order.
		let highWaterMark = 0;

		let selectedClass = '';

		for (const breakpoint of Object.keys(breakpoints)) {
			const minWidth = breakpoints[breakpoint];
	        if (entry.contentRect.width >= minWidth && minWidth > highWaterMark) {
	        	selectedClass = breakpoint;
	        	highWaterMark = minWidth;
	        }
	    }

	    for (const breakpoint of Object.keys(breakpoints)) {
	    	if (breakpoint === selectedClass) {
	    		if (!entry.target.classList.contains(breakpoint))
	    			entry.target.classList.add(breakpoint);

	    	} else if (entry.target.classList.contains(breakpoint)) {
	    		entry.target.classList.remove(breakpoint);
	    	}
	    }
	}
});


function update (oldVnode, vnode) {
	if (vnode.elm.dataset && vnode.elm.dataset.breakpoints) {
		try {
			// ensure that the data attribute parses as valid json before we start observing it
			JSON.parse(vnode.elm.dataset.breakpoints);
			observer.observe(vnode.elm);
		} catch (er) {
			// TODO: should invalid json in the data-breakpoints attribute throw an error?
		}
	} else if (vnode.elm instanceof Element) {
		observer.unobserve(vnode.elm);
	}
}


function destroy (vnode/*, removeCallback*/) {
	observer.unobserve(vnode.elm);
}


var containerQueryModule = {
	create: update,
	update,
	destroy
};

// Inits with common modules out of the box


var index = create([
    attributesModule,
    eventListenersModule,
    classModule,
    propsModule,
    styleModule,
    containerQueryModule
]);

export default index;
