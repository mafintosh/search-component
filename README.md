# search-component

A [HUI](https://github.com/hyperdivision/hui) component for structuring search

```
npm install @mafintosh/search-component
```

## Usage

``` js
const Search = require('@mafintosh/search-component')

const s = new Search({
  result (data, index) {
    // data is from the nanoiterator
    return someDomElementShowingTheResult
  },
  query (txt) {
    return someNanoIterator
  }
}, {
  // whatever attrs you want to set on the search element
})

document.body.appendChild(s)
```

Only provides the functionality and structure.
Bring your own styling.

## License

MIT
