const html = require('../../')


function randomInt () {
    return Math.ceil(Math.random() * 3)
}


function numberView (n) {
    console.log('ACTUAL UPDATE:', n)
    return html`<span>Number is ${n}</span>`
}


function counter (count) {
    console.log('outer call:', count)
    const view = html`
        <div class='main'>
          <button @on:click=${add}>+</button>
          <span>${html.thunk('num', numberView, [count])}</span>
          <button @on:click=${sub}>-</button>
          <button @on:click=${rand}>random</button>
        </div>
      `

    function add () {
        html.update(view, counter(count + 1))
    }

    function sub () {
        html.update(view, counter(count - 1))
    }

    function rand () {
        html.update(view, counter(randomInt()))
    }

    return view
}


html.update(document.body, counter(0))
