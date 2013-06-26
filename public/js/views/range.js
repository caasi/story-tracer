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

    /* move canvas behind target paragraph */
    parentView = this.get("parentView");
    if (!parentView) return;

    $parent = this.get("parentView").$();
    if (!$parent) return;

    $p = $parent.find("> p");
    pos = $p.offset();
    rects = this.get("parentView.controller.model.rects");
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
    ctx.lineJoin = "round";
    ctx.lineWidth = this.lineWidth;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    that = this;
    links = this.get("controller.model");

    Array.forEach(links, function(link) {
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

  }.observes("controller.model.@each")
});
