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

App.ContentView = Ember.View.extend({
  tagName: "p",
  didInsertElement: function() {
    var $this,
        pos,
        $spans,
        result;

    $this = this.$();
    pos = $this.position();

    this.set("controller.model.dimension", {
      x: pos.left,
      y: pos.top,
      width: $this.width(),
      height: $this.height()
    });

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
    var that,
        sel,
        range,
        $spans,
        result,
        story,
        link;
       
    sel = rangy.getSelection();
    range = sel.getAllRanges()[0];

    $spans = $(range.commonAncestorContainer).find("> span");

    result = {
      from: $spans.index($(range.startContainer).closest("span")),
      to: $spans.index($(range.endContainer).closest("span")) + 1
    };

    if (result.from !== -1 && result.to !== -1) {
      story = App.Story.create({
        position: App.getPosition(),
        url: "**"
      });

      link = App.Link.create({
        range: result,
        dest: story
      });

      this.get("controller.model.links").pushObject(link);
    }

    sel.removeAllRanges();
  }
});
