;(function($){


if ($.ssdialog !== undefined) return;


//
// User's API
//
$.ssdialog = {

  "VERSION": "0.0.1",

  "getClass": function(){ return SSDialog; },

  "create": function(message){
    return new SSDialog(message);
  },

  "alert": function(/* arguments */){
    return this.createAlert.apply(this, arguments).open();
  },

  "createAlert": function(message, options){
    var opts = $.extend({
      okLabel: "OK"
    }, options || {});

    var dialog = new SSDialog(message);
    dialog.addButton("ok", opts.okLabel);
    dialog.preRender();
    return dialog;
  },

  "confirm": function(/* arguments */){
    return this.createConfirm.apply(this, arguments).open();
  },

  "createConfirm": function(message, options){
    var opts = $.extend({
      okLabel: "OK",
      cancelLabel: "Cancel"
    }, options || {});

    var dialog = new SSDialog(message);
    dialog.addButton("cancel", opts.cancelLabel);
    dialog.addButton("ok", opts.okLabel);
    dialog.preRender();
    return dialog;
  }

};


//
// SSDialog Class
//
function SSDialog (message) {

  // string or jQuery object
  this._message = message;

  this._buttons = {};

  // Resolve at close dialog
  this._deferred = $.Deferred();

  this.$el = null;
  this.$cover = null;
};


// Class Properties
$.extend(SSDialog, {

  CSS_CLASS_NAME_PREFIX: "ssdialog",

  _isJQuery: function(obj){
    return obj instanceof $ && obj.jquery !== undefined;
  },

  // e.g. ({x:1, y:2}) -> ["x", "y"]
  _keys: function(obj){
    var k, keys = [];
    for (k in obj) {
      if (obj.hasOwnProperty(k)) keys.push(k);
    }
    return keys;
  },

  // e.g. ("foo", "bar") -> "ssdialog-foo-bar"
  _createClassName: function(/* arguments */){
    var classNames = Array.prototype.slice.apply(arguments);
    classNames.unshift(this.CSS_CLASS_NAME_PREFIX);
    return classNames.join("-");
  },

  // Author: https://github.com/epeli/underscore.string
  _escapeHTML: function(str) {
    if (str == null) return '';
    var escapeChars = {
      "<": "lt",
      ">": "gt",
      "\"": "quot",
      "&": "amp",
      "'": "apos"
    };
    return String(str).replace(/[&<>"']/g, function(m){ return '&' + escapeChars[m] + ';'; });
  },

  _nl2br: function(str){
    return str.replace(/(?:\r\n|\n|\r)/g, '<br style="letter-spacing:0;" />');
  }

});


// Instance Properties
SSDialog.prototype.addButton = function(buttonId, label, callback){

  if (callback === undefined) {
    callback = this._createDefaultCallback();
  }

  this._buttons[buttonId] = {
    buttonId: buttonId,
    label: label,
    callback: callback,
    sortOrder: this._getButtonCount()
  };
};

SSDialog.prototype._getButtonCount = function(){
  return SSDialog._keys(this._buttons).length;
};

//
// For example, dialog is an HTML like this:
//
//   <div class="ssdialog">
//     <div class="ssdialog-message">
//       Are you OK?
//     </div>
//     <ul class="ssdialog-buttons">
//      <li class="ssdialog-button ssdialog-button-cancel">CANCEL</li>
//      <li class="ssdialog-button ssdialog-button-ok">OK</li>
//     </ul>
//   </div>
//
SSDialog.prototype._createElements = function(){

  var $el = $('<div>').addClass(SSDialog._createClassName());
  var $message = $('<div>').addClass(SSDialog._createClassName("message"))
  var $buttons = $('<ul>')
      .addClass(SSDialog._createClassName("buttons"))
      .addClass(SSDialog._createClassName("buttons", this._getButtonCount()))
      .addClass(SSDialog._createClassName("buttons", "clearfix"))
  $el.append($message).append($buttons);

  var $cover = $('<div>').addClass(SSDialog._createClassName("cover"));

  return [
    $el,
    $message,
    $buttons,
    $cover
  ];
};

SSDialog.prototype._getButtonDataList = function(){
  var list = [];
  $.each(this._buttons, function(notuse, v){ list.push(v); });
  return list.sort(function(a, b){ return a.sortOrder - b.sortOrder });
};

SSDialog.prototype.preRender = function(){

  var elements = this._createElements();
  var $el = elements[0].hide();
  var $message = elements[1];
  var $buttons = elements[2];
  var $cover = elements[3].hide();

  var self = this;

  // Add message
  if (SSDialog._isJQuery(this._message)) {
    $message.append(this._message);
  } else {
    // e.g. "a<br>b\nc" -> "a&lt;br&gt;b<br>c"
    $message.html(
      SSDialog._nl2br(
        SSDialog._escapeHTML(this._message)
      )
    );
  }

  // Add buttons
  $.each(this._buttons, function(buttonId, buttonData){
    $buttons.append(
      $('<li>')
        .addClass(SSDialog._createClassName("button"))
        .addClass(SSDialog._createClassName("button", buttonId))
        .text(buttonData.label)
        .on("mousedown", function(){
          self.triggerButtonEvent(buttonId);
        })
    );
  });

  $(document.body).append($cover);
  $(document.body).append($el);

  this.$el = $el;
  this.$cover = $cover;
};

SSDialog.prototype.getPromise = function(){
  return this._deferred.promise();
};

SSDialog.prototype.open = function(){
  // @TODO Add animation / Use CSS animation
  this.$cover.show();
  this.$el.show();
  return this.getPromise();
};

SSDialog.prototype.triggerButtonEvent = function(buttonId){
  var buttonData = this._buttons[buttonId];
  buttonData.callback({
    self: this,
    buttonData: buttonData
  });
};

// @TODO
// 閉じるアニメーションを類型化して選択可能にする
// その際、デフォルトはJSによるアニメーションにするが
// CSSアニメが使えるならそちらを使うことも出来るようにする
SSDialog.prototype._createDefaultCallback = function(){
  return function(data){
    var self = data.self;
    var buttonData = data.buttonData;
    self.$cover.remove();
    self.$el.remove();
    self._deferred.resolve(buttonData.buttonId);
  };
};


})(jQuery);
