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
  }.property("controller.model.position", "controller.model.color"),
  init: function() {
    this.childStoryViews = [];
    this._super();
  },
  didInsertElement: function() {
    var model,
        id,
        $this;

    if (this.parentStoryView === undefined) {
      this.parentStoryView = this.nearestOfType(App.StoryView);
      if (this.parentStoryView) {
        this.parentStoryView.addChildStory(this);
      }
    }

    id = this.get("controller.model.id");
    $this = this.$();

    if ($this) {
      this.set("controller.model.size.width", $this.width());
      this.set("controller.model.size.height", $this.height());
    }

    // rects change after all contents had been rendered
  }.observes("controller.model.contents.@each.rects"),
  addOffset: function(offset) {
    var pos;

    offset = offset || { x: 0, y: 0 };
    pos = this.get("controller.model.position");

    this.set(
      "controller.model.position",
      {
        x: pos.x + offset.x,
        y: pos.y + offset.y
      }
    );
  },
  addSelfOffset: function(offset) {
    this.addOffset(offset);

    if (this.childStoryViews) {
      this.childStoryViews.forEach(function(storyView) {
        storyView.addOffset({
          x: -offset.x,
          y: -offset.y
        });
      });
    }
  },
  addChildStory: function(story) {
    this.childStoryViews.push(story);
  },
  parentStoryView: undefined,
  childStoryViews: undefined,
  last: {
    mouse: null,
  }
});
