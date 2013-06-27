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
  }.property("controller.model.position.x", "controller.model.position.y", "controller.model.color"),
  didInsertElement: function() {
    var id,
        $this;

    id = this.get("controller.model.id");
    $this = this.$();

    if ($this) {
      this.set("controller.model.size.width", $this.width());
      this.set("controller.model.size.height", $this.height());
    }

    // rects change after all contents had been rendered
  }.observes("controller.model.contents.@each.rects"),
  original: {
    mouse: null,
    window: null
  }
});
