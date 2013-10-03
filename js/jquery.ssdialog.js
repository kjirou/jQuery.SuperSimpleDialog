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
  dialog.render();
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
  dialog.render();
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
};


SSDialog.CSS_CLASS_NAME_PREFIX = "ssdialog";

// e.g. ({x:1, y:2}) -> ["x", "y"]
SSDialog._keys = function(obj){
  var k, keys = [];
  for (k in obj) {
    if (obj.hasOwnProperty(k)) keys.push = k;
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

  // Default button action
  if (callback === undefined) {
    callback = function(data){
      var self = data.self;
      var buttonData = data.buttonData;
      self.$el.hide(function(){
        self.$el.remove();
        self._deferred.resolve(buttonData.buttonId);
      });
    }
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

SSDialog.prototype.render = function(){

  this.$el = this._createElement().hide();

  var self = this;
  var $buttons = this.$el.find("buttons:first");
  $.each(this._buttons, function(buttonId, buttonData){
    $buttons.append(
      $('<li>')
        .addClass(SSDialog._createClassName("button"))
        .addClass(SSDialog._createClassName("button", buttonId))
        .text(buttonData.label)
        .data("buttonId", buttonId)
        .on("mousedown", function(){
          buttonData.callback({ self:self });
        })
    );
  });

  $(document.body).append(this.$el);
};

SSDialog.prototype.getPromise = function(){
  return this._deferred.promise();
};

SSDialog.prototype.open = function(){
  this.$el.show();  // @TODO Add animation
  return this.getPromise();
};

SSDialog.prototype.close = function(buttonId){
  buttonId = buttonId || null;
  var self = this;
  this.$el.hide(function(){  // @TODO Add animation
    this.remove();
    self._deferred.resolve(buttonId);
  });
  return this.getPromise();
};

})(jQuery);
