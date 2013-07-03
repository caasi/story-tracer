App.StoryView = Ember.View.extend({
  tagName: "div",
  classNames: ["story"],
  classNameBindings: ["storyID", "storyState"],
  storyID: function() {
    var ret,
        id;
    
    id = this.get("controller.model.id");

    if (id !== undefined) {
      ret = "story-" + id;
      return ret;
    }
  }.property("parentView.controller.model.id"),
  storyState: function() {
    return this.get("storyStates.currentState.name");
  }.property("storyStates.currentState"),
  backgroundColor: function() {
    return this.get("storyState") === "article" ?
            "#FFF" :
            this.get("controller.model.color");
  }.property("storyState"),
  attributeBindings: ["style"],
  style: function() {
    return "left: " + this.get("controller.model.position.x") + "px;" +
           "top: " + this.get("controller.model.position.y") + "px;" +
           "border-color: " + this.get("controller.model.color") + ";" +
           "background-color: " + this.get("backgroundColor");
  }.property("controller.model.position", "controller.model.color", "backgroundColor"),
  init: function() {
    var that = this;

    this.childStoryViews = [];
    this.storyStates = Ember.StateManager.create({
      initialState: "creator",
      states: {
        creator: Ember.State.create({
          enter: function() {
            console.log("enter creator mode"); 
          },
          exit: function() {
            console.log("leave creator mode");
          }
        }),
        input: Ember.State.create({
          enter: function() {
            console.log("enter input mode");
          },
          exit: function() {
            console.log("leave input mode");
          }
        }),
        busy: Ember.State.extend({
          enter: function() {
            console.log("enter busy mode");
          },
          exit: function() {
            console.log("leave busy mode");
          }
        }),
        article: Ember.State.create({
          enter: function() {
            console.log("enter story mode");
          },
          exit: function() {
            console.log("leave story mode");
          }
        })
      }
    });

    this._super();
  },
  willUpdateURL: function() {
    this.storyStates.transitionTo("busy");
    this.oldURL = this.get("controller.model.url");
  }.observesBefore("controller.model.url"),
  didUpdateURL: function() {
    var url,
        that;

    url = this.get("controller.model.url");
    console.log(this.oldURL + " -> " + url);

    if (url !== this.oldURL) {
      this.set("controller.model.title", "");
      this.set("controller.model.contents", []);

      that = this;

      $.post("/story/", function(data) {
        var contents = that.get("controller.model.contents");

        that.storyStates.transitionTo("article");

        that.set("controller.model.title", data.title);

        data.contents.forEach(function(p) {
          contents.pushObject(
            App.Paragraph.create({
              text: p
            })
          );
        });
      });
    }
  }.observes("controller.model.url"),
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
      this.set("controller.model.size", {
        width: $this.width(),
        height: $this.height()
      });
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
  storyStates: undefined,
  last: {
    mouse: null,
  }
});
