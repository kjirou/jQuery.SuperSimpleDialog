jQuery.SuperSimpleDialog
========================

I hate complex dialog libraries.


## Development

### Dependencies

- `node.js` >= `0.11.0`, e.g. `brew install node`
- `PhantomJS`, e.g. `brew install phantomjs`

```
$ npm install -g grunt-cli
```

### Deploy

```
$ git clone git@github.com:kjirou/jQuery.SuperSimpleDialog.git
$ cd jQuery.SuperSimpleDialog
$ npm install
```

### Util commands

- `grunt jshint` validates codes by JSHint.
- `grunt release` generates JavaScript files for release.

### Testing

- Open [development/index.html](development/index.html)
- Or, execute `npm run testem`, after that, open [http://localhost:7357/](http://localhost:7357/)
- `grunt test` is CI test by PhantomJS only.
- `grunt testem:xb` is CI test by PhantomJS, Chrome, Firefox and Safari.
- `grunt testall` executes XB test for each all supported jQuery versions.


## Related Links
