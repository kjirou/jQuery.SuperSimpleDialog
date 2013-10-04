jQuery.SuperSimpleDialog [![Build Status](https://travis-ci.org/kjirou/jQuery.SuperSimpleDialog.png?branch=master)](https://travis-ci.org/kjirou/jQuery.SuperSimpleDialog)
========================

A super simple dialog library for those who were fed up with the complex source code.


## Download

- [Stable production version](https://raw.github.com/kjirou/jQuery.SuperSimpleDialog/master/js/jquery.ssdialog.min.js)
- [Stable development version](https://raw.github.com/kjirou/jQuery.SuperSimpleDialog/master/js/jquery.ssdialog.js)
- [Core CSS](https://raw.github.com/kjirou/jQuery.SuperSimpleDialog/master/css/jquery.ssdialog.css)
- [Theme CSS example](https://raw.github.com/kjirou/jQuery.SuperSimpleDialog/master/css/themes/jquery.ssdialog.example.css)
- [Old releases](https://github.com/kjirou/jQuery.SuperSimpleDialog/releases)

Or, if you can use `bower`:
```
$ bower install jQuery.SuperSimpleDialog
```


## Installation

```
<link rel="stylesheet" href="jquery.ssdialog.css"></link>
<link rel="stylesheet" href="jquery.ssdialog.example.css"></link>
<script src="jquery.ssdialog.js"></script>
```


## Supported browsers

- `IE10`, `IE9`, `IE8`, `IE7`
- `Chrome`
- `Firefox`
- `Safari`
- `Mobile Safari`
- `PhantomJS`


## Supported jQuery versions

- `1.10.2`
- `1.9.1`
- `1.8.3`
- `2.0.3`


## Example

Simply use:
```
// Show alert
$.ssdialog.alert("Hi!");

// Show confirm
$.ssdialog.confirm("OK or Cansel");

// Change labels, default labels are "OK" and "Cancel"
$.ssdialog.confirm("OK or Cansel", {
  okLabel: "Yes",
  cancelLabel: "No"
});

// No callback function, use a deferred.promise() instead
$.ssdialog.confirm("Are you OK?").then(function(buttonId){
  if (buttonId === "ok") {
    console.log("OK");
  } else if (buttonId === "cancel") {
    console.log("Cancel");
  }
});

// The message can be passed in two forms "string" and jQuery object
$.ssdialog.alert($("<div>Hi!</div>"));
```

Can attach animation:
```
$.ssdialog.alert("Hi!", {

  // Can be shown in any way you like you
  showing: function(){
    this.$cover.show();
    this.$dialog.fadeIn();
  },

  // It is necessary to return deferred.promise()
  hiding: function(){
    var self = this,
      dfd = $.Deferred();
    this.$dialog.fadeOut(function(){
      self.$cover.hide();
      dfd.resolve();
    });
    return dfd.promise();
  }

});
```

Customize dialog:
```
function openMyAlert(){

  // Get low-level object
  var dialog = $.ssdialog.createAlert("Message");

  // It has references to some elements
  dialog.$dialog.addClass("myalert");
  dialog.$cover.addClas("myalert-cover");

  // Show dialog with return promise object
  return dialog.open();
}
```

More customizing:
```
function openMySuperAlert(){

  // Get more low-level object
  var dialog = $.ssdialog.create("Message");

  // Button settings
  //   addButton("buttonId", "label", [callback(default is close action)])
  // For example, you set 4 buttons, you have not closed one of them
  dialog.addButton("ok", "OK");
  dialog.addButton("yes", "YES");
  dialog.addButton("sure", "Sure!!");
  dialog.addButton("no", "No", function(buttonId){

    console.log("Said something?");

    // Write like the following if you want to close manually in this callback
    //this.close(buttonId);
  });

  // Render HTML
  dialog.preRender();

  return dialog.open();
}
```

Supplements:

- As for appearance, it can be adjusted by using CSS almost.
- There are now no design themes and animations presets, sorry.


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
- Or, execute `npm run testem` and open [http://localhost:7357/](http://localhost:7357/)
- `grunt test` is CI test by PhantomJS only.
- `grunt testem:xb` is CI test by PhantomJS, Chrome, Firefox and Safari.
- `grunt testall` executes XB test for each all supported jQuery versions.


## Related Links

- [The jQuery Plugin Registry - jQuery.SuperSimpleDialog](http://plugins.jquery.com/ssdialog/)
