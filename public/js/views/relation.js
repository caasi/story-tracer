App.RelationView = Ember.View.extend({
  tagName: "canvas",
  classNames: ["relation"],
  lineWidth: 5,
  init: function() {
    this.set("x", 0);
    this.set("y", 0);

    this._super();
  },
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
  sourcePosition: function() {
    var index,
        rects,
        rect;

    index = this.get("controller.model.range.to") - 1;
    rects = this.get("parentView.controller.model.rects");
    rect = rects[index];

    if (!rect) return undefined;

    return {
      x: rect.x + 0.5 * rect.width,
      y: rect.y + 0.5 * rect.height
    };
  }.property("controller.model.range.to", "parentView.controller.model.rects"),
  update: function() {
    var canvas,
        ctx,
        pos,
        size,
        src,
        space;

    canvas = this.get("element");

    if (canvas) {
      ctx = canvas.getContext("2d");
      pos = this.get("controller.model.dest.position");
      size = this.get("controller.model.dest.size");

      src = this.get("sourcePosition");
      if (!src) return;

      space = this.canvasSpaceFromPoints(
        src,
        {
          x: pos.x + 0.5 * size.width,
          y: pos.y + 0.5 * size.height
        }
      );

      canvas.width = space.size.width;
      canvas.height = space.size.height;

      this.set("x", space.origin.x);
      this.set("y", space.origin.y);

      ctx.strokeStyle = this.get("controller.model.dest.color");
      ctx.lineCap = "round";
      ctx.lineWidth = this.lineWidth;
      ctx.beginPath();
      ctx.moveTo(space.start.x, space.start.y);
      ctx.lineTo(space.end.x, space.end.y);
      ctx.stroke();
    }
  }.observes(
    "controller.model.dest.position",
    "controller.model.dest.size",
    "controller.model.dest.contents.@each",
    "sourcePosition"
  ),
  didInsertElement: function() {
    this.update();
  },
  attributeBindings: ["style"],
  style: function() {
    return "left: " + this.get("x") + "px;" +
           "top: " + this.get("y") + "px;";
  }.property("x", "y"),
});
