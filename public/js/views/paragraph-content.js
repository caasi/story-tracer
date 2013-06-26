/**
 * Note
 **
 * if I use {{#each p in contents}} to wrap this helper,
 * I will get "p" as the path, but I can not get the string by
 * using Ember.get(this, path);
 */ 
Ember.Handlebars.registerBoundHelper("bound", function(text) {
  var result;

  result = Array.prototype.map.call(text, function(c, index) {
    return "<span>" + c + "</span>";
  });
  
  return new Handlebars.SafeString(result.join(""));
});

App.ParagraphContentView = Ember.View.extend({
  tagName: "p",
  didInsertElement: function() {
    var $spans,
        result;

    $spans = this.$("> span");
    result = [];
    
    $spans.each(function(index) {
      var $this,
          pos;

      $this = $(this);
      pos = $this.position();

      result.push({
        x: pos.left,
        y: pos.top,
        width: $this.width(),
        height: $this.height()
      });
    });

    this.set("controller.model.rects", result);
  },
  mouseUp: function(e) {
    var sel,
        range;
       
    sel = rangy.getSelection();
    range = sel.getAllRanges()[0];

    if (range.startOffset !== range.endOffset) {
      console.log({
        from: range.startOffset,
        to: range.endOffset
      });
      if (range.startContainer !== range.endContainer) {
        console.log("not in the same paragraph");
      }
      console.log(range.startContainer);
      console.log(range.endContainer);
    }
  }
});
