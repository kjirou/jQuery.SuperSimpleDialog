;(function($){


if ($.ssdialog !== undefined) return;


$.ssdialog = function(){};

$.ssdialog.VERSION = "0.0.1";

$.ssdialog.createAlert = function(message, options){

  var opts = $.extend({
    okLabel: "OK"
  }, options || {});

  var dialog = new SSDialog(message);
  dialog.addButton("ok", opts.cancelLabel);
  return dialog;
};

$.ssdialog.alert = function(/* arguments */){
  var dialog = $.ssdialog.createAlert.apply(arguments);
  dialog.preRender();
  return dialog.open();
};

$.ssdialog.createConfirm = function(message, options){

  var opts = $.extend({
    okLabel: "OK",
    cancelLabel: "CANCEL"
  }, options || {});

  var dialog = new SSDialog(message);
  dialog.addButton("cancel", opts.cancelLabel);
  dialog.addButton("ok", opts.okLabel);
  return dialog;
};

$.ssdialog.confirm = function(/* arguments */){
  var dialog = $.ssdialog.createConfirm.apply(arguments);
  dialog.preRender();
  return dialog.open();
};

$.ssdialog.getClass = function(){ return SSDialog; };


function SSDialog (message) {

  // string or jQuery object
  this._message = message;

  this._buttons = {};

  // Resolve at close dialog
  this._deferred = $.Deferred();

  this.$el = null;
  this.$cover = null;
};


SSDialog.CSS_CLASS_NAME_PREFIX = "ssdialog";


SSDialog._isJQuery = function(obj){
  return obj instanceof $ && obj.jquery !== undefined;
};

// e.g. ({x:1, y:2}) -> ["x", "y"]
SSDialog._keys = function(obj){
  var k, keys = [];
  for (k in obj) {
    if (obj.hasOwnProperty(k)) keys.push(k);
  }
  return keys;
};

// e.g. ("foo", "bar") -> "ssdialog-foo-bar"
SSDialog._createClassName = function(/* arguments */){
  var classNames = Array.prototype.slice.apply(arguments);
  classNames.unshift(this.CSS_CLASS_NAME_PREFIX);
  return classNames.join("-");
};


SSDialog.prototype.addButton = function(buttonId, label, callback){

  if (callback === undefined) {
    callback = this._createDefaultCallback();
  }

  this._buttons[buttonId] = {
    buttonId: buttonId,
    label: label,
    callback: callback,
    sortOrder: SSDialog._keys(this._buttons).length
  };
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
SSDialog.prototype._createElement = function(){
  var $el = $('<div>').addClass(SSDialog._createClassName());
  $el.append(
    $('<div>').addClass(SSDialog._createClassName("message"))
  );
  $el.append(
    $('<ul>').addClass(SSDialog._createClassName("buttons"))
  );
  return $el;
};

SSDialog.prototype._createCoverElement = function(){
  return $('<div>').addClass(SSDialog._createClassName("cover"));
};

SSDialog.prototype._getButtonDataList = function(){
  var list = [];
  $.each(this._buttons, function(notuse, v){ list.push(v); });
  return list.sort(function(a, b){ return a.sortOrder - b.sortOrder });
};

SSDialog.prototype.preRender = function(){

  this.$el = this._createElement().hide();
  this.$cover = this._createCoverElement().hide();

  var self = this;

  // Add message
  var $messageContainer = this.$el.find(
    '.' + SSDialog._createClassName("message"));
  if (SSDialog._isJQuery(this._message)) {
    $messageContainer.append(this._message);
  } else {
    $messageContainer.text(this._message);
  }

  // Add buttons
  var $buttons = this.$el.find(
    '.' + SSDialog._createClassName("buttons"));
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

  $(document.body).append(this.$cover);
  $(document.body).append(this.$el);
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
