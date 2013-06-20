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
        linkStrings,
        template;

    content = this.get("controller.model").slice();
    links = this.get("parentView.controller.model.links");
    
    linkStrings = links.map(function(link) {
      return content.substring(link.range.from, link.range.to);
    });

    Array.forEach(linkStrings, function(str, index) {
      content = content.replace(str, "{{relation-source " + index + " \"" + str + "\" }}");
    });

    return Ember.Handlebars.compile(content);
  }.property("parentView.controller.model.links.@each"),
  linksChanged: function() {
    this.rerender();
  }.observes("parentView.controller.model.links.@each"),
  mouseUp: function(e) {
  }
});
