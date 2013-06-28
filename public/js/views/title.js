App.TitleView = Ember.View.extend({
  tagName: "h1",
  attributeBindings: ["style"],
  style: function() {
    return "background-color: " + this.get("controller.model.color") + ";";
  }.property("controller.model.color"),
  mouseDown:function(e) {
    var parentView = this.get("parentView");

    e.stopPropagation();

    App.movingView = parentView;

    parentView.last.mouse = {
      x: e.clientX,
      y: e.clientY
    };
  }
});
