App.StoryView = Ember.View.extend({
  tagName: "div",
  classNames: ["story"],
  classNameBindings: ["storyID"],
  storyID: function() {
    var ret,
        id;
    
    id = this.get("controller.model.id");

    if (id !== undefined) {
      ret = "story-" + id;
      return ret;
    }
  }.property("parentView.controller.model.id"),
  attributeBindings: ["style"],
  style: function() {
    return "left: " + this.get("controller.model.position.x") + "px;" +
           "top: " + this.get("controller.model.position.y") + "px;" +
           "border-color: " + this.get("controller.model.color") + ";";
  }.property("controller.model.position.x", "controller.model.position.y", "controller.mode.color"),
  original: {
    mouse: null,
    window: null
  }
});
