App.BusyView = Ember.View.extend({
  classNames: ["busy"],
  mouseUp: function() {
    this.get("parentView.storyStates").transitionTo("article");
  }
});
