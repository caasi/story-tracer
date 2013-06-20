App.TitleView = Ember.View.extend({
  tagName: "h1",
  mouseDown:function(e) {
    var parentView = this.get("parentView");

    e.stopPropagation();

    App.movingView = parentView;

    parentView.original.mouse = {
      x: e.clientX,
      y: e.clientY
    };

    parentView.original.window = {
      x: parentView.get("controller.model.position.x"),
      y: parentView.get("controller.model.position.y")
    };
  }
});
