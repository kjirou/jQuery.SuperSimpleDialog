;(function(){


describe("$.ssdialog Properties", function(){
  it("Plugin definition", function(){
    expect($.ssdialog).to.be.a("function");
  });

  it("VERSION", function(){
    expect($.ssdialog.VERSION).to.match(/^\d+\.\d+.\d+(?:\.\d+)?$/);
  });

  it("getClass", function(){
    expect($.ssdialog.getClass()).to.be.a("function");
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

});


describe("SSDialog Instance", function(){

  var SSDialog = $.ssdialog.getClass();

  afterEach(function(){
    $(document.body).find('.' + SSDialog._createClassName());
    $(document.body).find('.' + SSDialog._createClassName("cover"));
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

  it("_createElement", function(){
    var obj = new SSDialog("Message");
    expect(obj._createElement().find('*').length).to.greaterThan(1);
  });

  it("_createCoverElement", function(){
    var obj = new SSDialog("Message");
    expect(obj._createCoverElement()).to.be.a($);
  });

  it("preRender", function(){
    var obj = new SSDialog("Message");
  });
});


}());
