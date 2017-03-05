const html = require('../../')
const css = require('sheetify')

function app (state) {
  css`
    .app-title {
      font-size: 4em
    }

    .app-desc {
      font-size: 1.5em
    }

    .app-inputs {
      margin-top: 20px
    }
  `

  var view = html`
    <div class='app'>
      <div class='app-title'>${ state.title }</div>
      <div class='app-desc'>${ state.desc }</div>
      <div class='app-inputs'>
        <span>Title: </span><input :input=${title} /><br />
        <span>Description: </span><input :input=${desc} />
      </div>
    </div>
  `

  function title (e) {
    html.update(view, app({
      title: e.target.value,
      desc: state.desc
    }))
  }

  function desc (e) {
    html.update(view, app({
      title: state.title,
      desc: e.target.value
    }))
  }

  return view
}

html.update(document.body, app({
  title: 'Hello, World!',
  desc: 'People greet the world.'
}))
