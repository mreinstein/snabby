var html = require('../../')

function counter (count) {
  var view = html`
    <div class='main'>
      <button :click=${add}>+</button>
      <span>${count}</span>
      <button :click=${sub}>-</button>
    </div>
  `

  function add () {
    html.update(view, counter(count + 1))
  }

  function sub () {
    html.update(view, counter(count - 1))
  }

  return view
}

html.update(document.body, counter(0))
