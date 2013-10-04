;(function(){


describe("$.ssdialog Properties", function(){
  it("Plugin definition", function(){
    expect($.ssdialog).to.be.a("object");
  });

  it("VERSION", function(){
    expect($.ssdialog.VERSION).to.match(/^\d+\.\d+.\d+(?:\.\d+)?$/);
  });

  it("getClass / create", function(){
    var SSDialog = $.ssdialog.getClass();
    expect(SSDialog).to.be.a("function");
    expect($.ssdialog.create("Message")).to.be.a(SSDialog);
  });
});


describe("SSDialog Class", function(){

  var SSDialog = $.ssdialog.getClass();

  it("_isJQuery", function(){
    expect(SSDialog._isJQuery($("div"))).to.ok();
    expect(SSDialog._isJQuery({})).not.to.ok();
  });

  it("_keys", function(){
    expect(SSDialog._keys({ x:1,y:2 })).to.eql(["x", "y"]);
  });

  it("_createClassName", function(){
    expect(SSDialog._createClassName("foo", "bar")).to.be("ssdialog-foo-bar");
  });

  it("_escapeHTML", function(){
    expect(SSDialog._escapeHTML("<>\"&'")).to.be("&lt;&gt;&quot;&amp;&apos;");
  });

  it("_nl2br", function(){
    expect(SSDialog._nl2br("Hello\nWorld")).to.be('Hello<br style="letter-spacing:0;" />World');
  });

});


describe("SSDialog Instance", function(){

  var SSDialog = $.ssdialog.getClass();

  afterEach(function(){
    $(document.body).find('.' + SSDialog._createClassName()).remove();
    $(document.body).find('.' + SSDialog._createClassName("cover")).remove();
  });


  it("Create a instance", function(){
    var obj = new SSDialog("Message");
    expect(obj).to.be.a(SSDialog);
    expect(obj._message).to.be("Message");
  });

  it("addButton", function(){
    var obj = new SSDialog("Message");
    obj.addButton("a", "AAA");
    obj.addButton("b", "BBB");
    expect(obj._buttons.a.buttonId).to.be("a");
    expect(obj._buttons.a.label).to.be("AAA");
    expect(obj._buttons.a.sortOrder).to.be(0);
    expect(obj._buttons.b.buttonId).to.be("b");
    expect(obj._buttons.b.label).to.be("BBB");
    expect(obj._buttons.b.sortOrder).to.be(1);
  });

  it("_getButtonDataList", function(){
    var obj = new SSDialog("Message");
    obj.addButton("c", "1");
    obj.addButton("b", "2");
    obj.addButton("a", "3");
    var dataList = obj._getButtonDataList();
    // Ordered that it is resisterd
    expect(dataList[0].buttonId).to.be("c");
    expect(dataList[1].buttonId).to.be("b");
    expect(dataList[2].buttonId).to.be("a");
  });

  it("_createElements", function(){
    var obj = new SSDialog("Message");
    var elements = obj._createElements();
    $.each(elements, function(notuse, $dialog){
      expect($dialog).to.be.a($);
    });
    expect(elements[0].find('*').length).to.greaterThan(1);
  });

  it("preRender", function(){
    var obj = new SSDialog("Message");
    obj.addButton("ok", "OK_DESU");
    obj.addButton("cancel", "CANCEL_DESU");
    obj.preRender();

    var dialogClassName = SSDialog._createClassName();
    var coverClassName = SSDialog._createClassName("cover");
    expect($(document.body).find('.' + dialogClassName)).to.have.length(1);
    expect($(document.body).find('.' + coverClassName)).to.have.length(1);

    var html = obj.$dialog.html();
    expect(html).to.match(/OK_DESU/);
    expect(html).to.match(/CANCEL_DESU/);
  });
});


describe("Show alert", function(){

  it("Open alert, after that close it", function(){

    // Create and append
    var obj = $.ssdialog.createAlert("Kurumi Erika");
    expect($(document.body).find(".ssdialog").is(":visible")).to.be(false);
    expect($(document.body).find(".ssdialog-cover").is(":visible")).to.be(false);

    // Open
    obj.open();
    expect($(document.body).find(".ssdialog").is(":visible")).to.be(true);
    expect($(document.body).find(".ssdialog-cover").is(":visible")).to.be(true);

    // Search message
    expect($(document.body).html()).to.match(/Erika/);

    // Close
    var promise = obj.getPromise();
    promise.then(function(buttonId){
      expect(buttonId).to.be("ok");
    });
    obj.triggerButtonEvent("ok");
    expect($(document.body).find(".ssdialog")).to.have.length(0);
  });

  it("Add message by jQuery object", function(){
    var $m = $('<div id="chiflet">シフレ</div>');
    var obj = $.ssdialog.createAlert($m, { okLabel:"ですぅ" });
    obj.open();
    expect($(document.body).find(".ssdialog").is(":visible")).to.be(true);
    expect($(document.body).html()).to.match(/シフレ/);
    expect($(document.body).html()).to.match(/ですぅ/);
    obj.triggerButtonEvent("ok");
    expect($(document.body).find(".ssdialog").is(":visible")).to.be(false);
  });

  it("Close by jQuery event", function(){
    var promise = $.ssdialog.alert("コフレ");
    expect($(document.body).find(".ssdialog").is(":visible")).to.be(true);
    $(document.body).find(".ssdialog-button-ok").trigger("mousedown");
    expect($(document.body).find(".ssdialog").is(":visible")).to.be(false);
  });
});


describe("Show confirm", function(){

  it("Open confirm, after that close it", function(){

    // Create and append
    var obj = $.ssdialog.createConfirm("Hanasaki Tsubomi");
    expect($(document.body).find(".ssdialog").is(":visible")).to.be(false);

    // Open
    obj.open();
    expect($(document.body).find(".ssdialog").is(":visible")).to.be(true);

    // Search message
    expect($(document.body).html()).to.match(/Tsubomi/);

    // Close
    var promise = obj.getPromise();
    promise.then(function(buttonId){
      expect(buttonId).to.be("cancel");
    });
    obj.triggerButtonEvent("cancel");
    expect($(document.body).find(".ssdialog")).to.have.length(0);
  });
});


describe("Animations", function(){

  it("Apply jQuery.fadeIn/fadeOut to alert", function(done){
    var obj = $.ssdialog.createAlert("Hi", {
      showing: function(){
        this.$cover.show();
        this.$dialog.fadeIn(1);
      },
      hiding: function(){
        var self = this,
          dfd = $.Deferred();
        this.$dialog.fadeOut(1, function(){
          self.$cover.hide();
          dfd.resolve();
        });
        return dfd.promise();
      }
    });
    obj.open().then(function(buttonId){
      expect(buttonId).to.be("ok");
      done();
    });
    obj.close("ok");
  });

  it("Apply jQuery.fadeIn/fadeOut to confirm", function(done){
    var obj = $.ssdialog.createConfirm("Hi", {
      showing: function(){
        this.$cover.show();
        this.$dialog.fadeIn(1);
      },
      hiding: function(){
        var self = this,
          dfd = $.Deferred();
        this.$dialog.fadeOut(1, function(){
          self.$cover.hide();
          dfd.resolve();
        });
        return dfd.promise();
      }
    });
    obj.open().then(function(buttonId){
      expect(buttonId).to.be("cancel");
      done();
    });
    obj.close("cancel");
  });
});


}());
