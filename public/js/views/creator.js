App.CreatorView = Ember.View.extend({
  classNames: ["creator"],
  mouseUp: function() {
    this.get("parentView.storyStates").transitionTo("input");
  }
});
