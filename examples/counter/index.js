var snabby = require('../../')([ 'eventlisteners' ])

function counter (count) {
  var view = snabby`
    <div class='main'>
      <button :click=${add}>Add</button>
      <span>${count}</span>
      <button :click=${sub}>Sub</button>
    </div>
  `

  function add () {
    snabby.update(view, counter(count + 1))
  }

  function sub () {
    snabby.update(view, counter(count - 1))
  }

  return view
}

window.onload = function () {
  snabby.update(document.body, counter(0))
}
