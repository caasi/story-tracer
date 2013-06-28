App.ApplicationView = Ember.View.extend({
  classNames: ["app"],
  mouseUp: function(e) {
    if (App.movingView) {
      App.movingView.last.mouse = null;
      App.movingView = null;
    }
  },
  mouseMove: function(e) {
    if (App.movingView) {
      App.movingView.addSelfOffset({
        x: e.clientX - App.movingView.last.mouse.x,
        y: e.clientY - App.movingView.last.mouse.y
      });
      App.movingView.last.mouse.x = e.clientX;
      App.movingView.last.mouse.y = e.clientY;
    }
  }
});
