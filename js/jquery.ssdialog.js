;(function($){


if ($.ssdialog !== undefined) return;


//
// User's API
//
$.ssdialog = {

  "VERSION": "0.1.0",

  "getClass": function(){ return SSDialog; },

  "create": function(message){
    return new SSDialog(message);
  },

  "alert": function(/* arguments */){
    return this.createAlert.apply(this, arguments).open();
  },

  "createAlert": function(message, options){
    var opts = $.extend({
      okLabel: "OK",
      showing: null,
      hiding: null
    }, options || {});

    var dialog = new SSDialog(message);
    if (opts.showing) dialog.setShowing(opts.showing);
    if (opts.hiding) dialog.setHiding(opts.hiding);
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
      cancelLabel: "Cancel",
      showing: null,
      hiding: null
    }, options || {});

    var dialog = new SSDialog(message);
    if (opts.showing) dialog.setShowing(opts.showing);
    if (opts.hiding) dialog.setHiding(opts.hiding);
    dialog.addButton("cancel", opts.cancelLabel);
    dialog.addButton("ok", opts.okLabel);
    dialog.preRender();
    return dialog;
  }

};


//
// SSDialog Class
//
function SSDialog (/* arguments */) {
  this._initialize.apply(this, arguments);
}


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
    if (str === null) return '';
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
$.extend(SSDialog.prototype, {

  _initialize: function(message){

    // string or jQuery object
    this._message = message;

    this._buttons = {};

    // Resolve at close dialog
    this._deferred = $.Deferred();

    this.$dialog = null;
    this.$cover = null;

    // Animation of showing dialog, default is no-animation
    this._showing = function(){
      this.$cover.show();
      this.$dialog.show();
    };

    // Animation of hiding dialog, default is no-animation:
    // `buttonId` is clicked button ID.
    // It is necessary to return deferred object.
    this._hiding = function(buttonId){
      this.$dialog.remove();
      this.$cover.remove();
      return $.Deferred().resolve();
    };
  },

  // buttonId is string
  // label is string
  // callback is function or default=undefined
  addButton: function(buttonId, label, callback){
    callback = callback || null;

    this._buttons[buttonId] = {
      buttonId: buttonId,
      label: label,
      callback: callback,
      sortOrder: this._getButtonCount()
    };
  },

  setShowing: function(v){ this._showing = v; },

  setHiding: function(v){ this._hiding = v; },

  _getButtonCount: function(){
    return SSDialog._keys(this._buttons).length;
  },

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
  _createElements: function(){

    var $dialog = $('<div>').addClass(SSDialog._createClassName());
    var $message = $('<div>').addClass(SSDialog._createClassName("message"));
    var $buttons = $('<ul>')
        .addClass(SSDialog._createClassName("buttons"))
        .addClass(SSDialog._createClassName("buttons", this._getButtonCount()))
        .addClass(SSDialog._createClassName("buttons", "clearfix"));
    $dialog.append($message).append($buttons);

    var $cover = $('<div>').addClass(SSDialog._createClassName("cover"));

    return [
      $dialog,
      $message,
      $buttons,
      $cover
    ];
  },

  _getButtonDataList: function(){
    var list = [];
    $.each(this._buttons, function(notuse, v){ list.push(v); });
    return list.sort(function(a, b){ return a.sortOrder - b.sortOrder; });
  },

  preRender: function(){

    var elements = this._createElements();
    var $dialog = elements[0].hide();
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
    $(document.body).append($dialog);

    this.$dialog = $dialog;
    this.$cover = $cover;
  },

  getPromise: function(){
    return this._deferred.promise();
  },

  open: function(){
    this._showing();
    return this.getPromise();
  },

  triggerButtonEvent: function(buttonId){
    var self = this;
    var buttonData = this._buttons[buttonId];
    var callback = buttonData.callback || this.close;
    callback.apply(this, [buttonId]);
  },

  close: function(buttonId){
    var self = this;
    this._hiding(buttonId).then(function(){
      self._deferred.resolve(buttonId);
    });
  }
});


})(jQuery);
