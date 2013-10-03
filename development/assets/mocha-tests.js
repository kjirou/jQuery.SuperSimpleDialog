;(function(){


describe("$.ssdialog Properties", function(){
  it("Plugin definition", function(){
    expect($.ssdialog).to.be.a("function");
  });

  it("VERSION", function(){
    expect($.ssdialog.VERSION).to.match(/^\d+\.\d+.\d+(?:\.\d+)?$/);
  });
});


}());
