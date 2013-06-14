var App;

App = Ember.Application.create({});

App.ApplicationView = Ember.View.extend({
  classNames: ["app"],
  mouseUp: function(e) {
    if (App.movingView) {
      App.movingView.original.mouse = null;
      App.movingView.original.window = null;
      App.movingView = null;
    }
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

App.Relationcontroller = Ember.ObjectController.extend({});
App.register("controller:relation", App.Relationcontroller, { singleton: false });

App.RelationView = Ember.View.extend({
  tagName: "canvas",
  classNames: ["relation"],
  lineWidth: 5,
  canvasSpaceFromPoints: function(src, dest, margin) {
    var vector,
        abs,
        size,
        origin,
        start,
        end;
    
    margin = margin || { x: this.lineWidth, y: this.lineWidth };
    vector = {
      x: dest.x - src.x,
      y: dest.y - src.y
    };
    abs = {
      x: Math.abs(vector.x),
      y: Math.abs(vector.y)
    };
    size = {
      width: abs.x + 2 * margin.x,
      height: abs.y + 2 * margin.y
    };
    origin = {
      x: vector.x >= 0 ? src.x - margin.x : dest.x - margin.x,
      y: vector.y >= 0 ? src.y - margin.y : dest.y - margin.y
    };
    start = {
      x: margin.x,
      y: margin.y
    };
    end = {
      x: abs.x + margin.x,
      y: abs.y + margin.y
    };

    return {
      origin: origin,
      size: size,
      start: {
        x: vector.y >= 0 ? start.x : end.x,
        y: vector.x >= 0 ? start.y: end.y
      },
      end: {
        x: vector.y >= 0 ? end.x : start.x,
        y: vector.x >= 0 ? end.y : start.y
      }
    };
  },
  update: function() {
    var canvas = this.get("element"),
        ctx = canvas.getContext("2d"),
        x = this.get("controller.model.dest.position.x"),
        y = this.get("controller.model.dest.position.y"),
        width = this.get("controller.model.dest.size.width"),
        height = this.get("controller.model.dest.size.height"),
        space;

    space = this.canvasSpaceFromPoints(
      { x: 0, y: 0},
      {
        x: x + 0.5 * width,
        y: y + 0.5 * height
      }
    );

    canvas.width = space.size.width;
    canvas.height = space.size.height;

    this.$()
      .css("left", space.origin.x + "px")
      .css("top", space.origin.y + "px");

    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = this.lineWidth;
    ctx.beginPath();
    ctx.moveTo(space.start.x, space.start.y);
    ctx.lineTo(space.end.x, space.end.y);
    ctx.stroke();
  },
  didInsertElement: function() {
    this.update();
    this.addObserver("controller.model.dest.position", this.update);
    this.addObserver("controller.model.dest.position.y", this.update);
  }
});

App.set(
  "storyRoot",
  {
    position: {
      x: 700,
      y: 300
    },
    size: {
      width: 300,
      height: 450
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
            x: -600,
            y: 100
          },
          size: {
            width: 300,
            height: 450
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
            x: -500,
            y: -300
          },
          size: {
            width: 300,
            height: 450
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
