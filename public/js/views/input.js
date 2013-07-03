App.InputView = Ember.View.extend({
  classNames: ["input"],
  mouseUp: function() {
    this.get("parentView.storyStates").transitionTo("busy");
  }
});
