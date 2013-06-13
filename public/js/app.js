var App;

App = Ember.Application.create({});

App.ApplicationView = Ember.View.extend({
  classNames: ["app"],
  mouseUp: function(e) {
    App.movingView.original.mouse = null;
    App.movingView.original.window = null;
    App.movingView = null;
  },
  mouseMove: function(e) {
    if (App.movingView) {
      App.movingView.set(
        "controller.model.position.x",
        App.movingView.original.window.x + e.clientX - App.movingView.original.mouse.x
      );
      App.movingView.set(
        "controller.model.position.y",
        App.movingView.original.window.y + e.clientY - App.movingView.original.mouse.y
      );
    }
  }
});

App.movingView = null;

App.StoryController = Ember.ObjectController.extend({});
App.register("controller:story", App.StoryController, { singleton: false });

App.StoryView = Ember.View.extend({
  tagName: "div",
  classNames: ["story"],
  attributeBindings: ["style"],
  style: function() {
    return "left: " + this.get("controller.model.position.x") + "px;" +
           "top: " + this.get("controller.model.position.y") + "px;";
  }.property("controller.model.position.x", "controller.model.position.y"),
  mouseDown: function(e) {
    e.stopPropagation();
    App.movingView = this;
    this.original.mouse = {
      x: e.clientX,
      y: e.clientY
    };
    this.original.window = {
      x: this.get("controller.model.position.x"),
      y: this.get("controller.model.position.y")
    };
  },
  original: {
    mouse: null,
    window: null
  }
});

App.set(
  "storyRoot",
  {
    position: {
      x: 0,
      y: 0
    },
    title: "the First",
    contents: [
      "p0",
      "p1",
      "p2"
    ],
    links: [
      {
        src: 0,
        range: { from: 0, to: 2 },
        dest: {
          position: {
            x: 100,
            y: 200
          },
          title: "the Second",
          contents: [
            "p0",
            "p1"
          ],
          links: []
        }
      },
      {
        src: 1,
        range: { from: 0, to: 2 },
        dest: {
          position: {
            x: 200,
            y: 300
          },
          title: "the Third",
          contents: [
            "p0"
          ],
          links: []
        }
      }
    ]
  }
);
