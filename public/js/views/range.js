App.RangeView = Ember.View.extend({
  tagName: "canvas",
  classNames: ["range"],
  lineWidth: 3,
  init: function() {
    this.set("x", 0);
    this.set("y", 0);

    this._super();
  },
  drawLinks: function() {
    var that,
        dimension,
        canvas,
        ctx,
        rects;

    canvas = this.get("element");
    if (!canvas) return;

    /**
     * what happened!?
     **
     * How can I get dimension and rects in story's controller?
     */
    dimension = this.get("controller.dimension");
    rects = this.get("controller.rects");

    this.set("x", dimension.x - this.lineWidth);
    this.set("y", dimension.y - this.lineWidth);
    
    canvas.width = dimension.width + 2 * this.lineWidth;
    canvas.height = dimension.height + 2 * this.lineWidth;

    ctx = canvas.getContext("2d");
    ctx.lineJoin = "round";
    ctx.lineWidth = this.lineWidth;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    that = this;
    links = this.get("controller.model.links");

    links.forEach(function(link) {
      var i, rect;

      ctx.beginPath();
      ctx.fillStyle = link.dest.color;
      ctx.strokeStyle = link.dest.color;

      for (i = link.range.from; i < link.range.to; ++i) {
        rect = rects[i];

        ctx.rect(
          rect.x + that.lineWidth,
          rect.y + that.lineWidth,
          rect.width,
          rect.height
        );
      }

      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    });
  }.observes(
    "controller.rects",
    "controller.model.links.@each"
  ),
  attributeBindings: ["style"],
  style: function() {
    return "left: " + this.get("x") + "px; " +
           "top: " + this.get("y") + "px;";
  }.property("x", "y")
});
