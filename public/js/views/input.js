App.InputView = Ember.View.extend({
  classNames: ["input"],
  keyUp: function(event) {
    if (event.keyCode === 13) { // enter
      this.get("parentView").getContent();
    }
  }
});
