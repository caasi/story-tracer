App.RangeView = Ember.View.extend({
  tagName: "canvas",
  classNames: ["range"],
  lineWidth: 3,
  drawLinks: function() {
    var that,
        parentView,
        $parent,
        $p,
        pos,
        canvas,
        ctx,
        rects;

    parentView = this.get("parentView");
    if (!parentView) return;

    $parent = this.get("parentView").$();
    if (!$parent) return;

    $p = $parent.find("> p");
    pos = $p.offset();
    rects = this.get("controller.model");
    if (rects.length) {
      this.$().offset({
        left: pos.left - this.lineWidth,
        top: pos.top - this.lineWidth
      });
    }

    canvas = this.get("element");
    canvas.width = $p.width() + 2 * this.lineWidth;
    canvas.height = $p.height() + 2 * this.lineWidth;
    ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#FF9900";
    ctx.lineJoin = "round";
    ctx.lineWidth = this.lineWidth;
    ctx.fillStyle = "#FF9900";
    
    that = this;

    Array.forEach(rects, function(rect) {
      ctx.beginPath();
      ctx.rect(
        rect.x + that.lineWidth,
        rect.y + that.lineWidth,
        rect.width,
        rect.height
      );
      ctx.fill();
      ctx.stroke();
    });
  }.observes("controller.model")
});
