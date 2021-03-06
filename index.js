const Component = require('hui')
const Infinilist = require('infinilist')

module.exports = class Search extends Component {
  constructor (opts, attrs) {
    super()

    const self = this

    this.query = opts.query
    this.result = opts.result
    this.error = opts.error || console.error.bind(console)
    this.iterator = null
    this.results = null
    this.list = new Infinilist(render, { total: 0 })
    this.loading = false
    this.input = opts.input || null
    this.attrs = attrs || {}

    function render (index) {
      const data = self.results[index]
      if (index === self.results.length - 1) self._loadMore()
      return self.result(data, index)
    }
  }

  _loadMore () {
    if (this.loading) return
    this.loading = true

    const ite = this.iterator

    ite.next((err, data) => {
      if (ite !== this.iterator) {
        this.loading = false
        this._loadMore()
        return
      }
      if (!data) {
        this.loading = false
        return
      }
      if (err) {
        this.loading = false
        this.onerror(err)
        return
      }

      this.results.push(data)
      this.loading = false

      if (this.results.length > this.list._totalCount) {
        this.list.resize(this.results.length)
      }
    })
  }

  createElement () {
    const self = this
    let timeout
    let prev

    const root = document.createElement('div')

    for (const key of Object.keys(this.attrs)) {
      if (key === 'class') root.className = this.attrs[key]
      else root[key] = this.attrs[key]
    }

    const inp = this.input || document.createElement('input')
    const res = document.createElement('div')

    inp.type = 'search'
    inp.onkeydown = onkeydown
    inp.oninput = oninput
    res.className = 'results'

    res.appendChild(this.list.element)
    if (!this.input) root.appendChild(inp)
    root.appendChild(res)

    onchange(inp)
    return root

    function onkeydown (e) {
      if (e.keyCode === 13) {
        clearTimeout(timeout)
        onchange(this)
      }
    }

    function oninput () {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(onchange, 250, this)
    }

    function onchange (inp) {
      const v = inp.value.trim()
      if (v === prev) return
      prev = v
      const old = self.iterator
      self.iterator = self.query(v)
      if (old) old.destroy()
      self.results = []
      self.list.resize(0)
      self.list.reset()
      self.loading = false
      if (self.iterator) self._loadMore()
    }
  }
}
