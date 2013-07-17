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
    return "<span>" + c === " " ? "&nbsp;" : c + "</span>";
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

    this.set("controller.dimension", {
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

    this.set("controller.rects", result);
  },
  mouseUp: function(e) {
    var that,
        sel,
        range,
        $spans,
        $endSpan,
        pos,
        result,
        story,
        link;
       
    sel = rangy.getSelection();
    range = sel.getAllRanges()[0];

    $spans = $(range.commonAncestorContainer).find("> span");
    $endSpan = $(range.endContainer).closest("span");
    pos = $endSpan.position();

    result = {
      from: $spans.index($(range.startContainer).closest("span")),
      to: $spans.index($endSpan) + 1
    };

    if (result.from !== -1 && result.to !== -1) {
      story = App.Story.create({
        position: {
          x: pos.left + 2 * $endSpan.width(),
          y: pos.top + $endSpan.height()
        }
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
