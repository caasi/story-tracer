/**
 * Note
 **
 * if I use {{#each p in contents}} to wrap this helper,
 * I will get "p" as the path, but I can not get the string by
 * using Ember.get(this, path);
 **
 * This helper is generated dynamically by ParagraphContentView.
 */ 
Ember.Handlebars.registerHelper("relation-source", function(id, str) {
  var ret;

  ret = "<span class=\"capital relation-" + id + "\">" +
          str.substring(0, 1) +
        "</span>" +
        str.substring(1);
  ret = "<span class=\"relation-source\">" + ret + "</span>";
  
  return new Handlebars.SafeString(ret);
});

App.ParagraphContentView = Ember.View.extend({
  tagName: "p",
  layout: function() {
    var content,
        links,
        linkData,
        template;

    content = this.get("controller.model").slice();
    links = this.get("parentView.controller.model.links");
    
    linkData = links.map(function(link) {
      return {
        id: link.dest.id,
        str: content.substring(link.range.from, link.range.to)
      };
    });

    Array.forEach(linkData, function(data) {
      content = content.replace(data.str, "{{relation-source " + data.id + " \"" + data.str + "\" }}");
    });

    return Ember.Handlebars.compile(content);
  }.property("parentView.controller.model.links.@each"),
  linksChanged: function() {
    this.rerender();
  }.observes("parentView.controller.model.links.@each"),
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
