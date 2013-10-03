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

  it("_keys", function(){
    expect(SSDialog._keys({ x:1,y:2 })).to.eql ["x", "y"]
  });

  it("_createClassName", function(){
    expect(SSDialog._createClassName("foo", "bar")).to.be("ssdialog-foo-bar");
  });

});


}());
