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
    /*
    if (App.newLink) {
      App.newLink.id = App.storyRoot.contents[0].links.length;
      App.storyRoot.contents[0].links.pushObject(App.newLink);
      App.newLink = null;
    }
    */
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

App.StoryView = Ember.View.extend({
  tagName: "div",
  classNames: ["story"],
  attributeBindings: ["style"],
  style: function() {
    return "left: " + this.get("controller.model.position.x") + "px;" +
           "top: " + this.get("controller.model.position.y") + "px;";
  }.property("controller.model.position.x", "controller.model.position.y"),
  original: {
    mouse: null,
    window: null
  }
});

App.TitleView = Ember.View.extend({
  tagName: "h1",
  mouseDown:function(e) {
    var parentView = this.get("parentView");

    e.stopPropagation();

    App.movingView = parentView;

    parentView.original.mouse = {
      x: e.clientX,
      y: e.clientY
    };

    parentView.original.window = {
      x: parentView.get("controller.model.position.x"),
      y: parentView.get("controller.model.position.y")
    };
  }
});

/**
 * Note
 **
 * if I use {{#each p in contents}} to wrap this helper,
 * I will get "p" as the path, but I can not get the string by
 * using Ember.get(this, path);
 **
 * This helper is generated dynamically by ParagraphContentView.
 */ 
Ember.Handlebars.registerHelper("relation-source", function(id, str) {
  var ret;

  ret = "<span class=\"capital relation-" + id + "\">" +
          str.substring(0, 1) +
        "</span>" +
        str.substring(1);
  ret = "<span class=\"relation-source\">" + ret + "</span>";
  
  return new Handlebars.SafeString(ret);
});

App.ParagraphView = Ember.View.extend({});

App.ParagraphContentView = Ember.View.extend({
  tagName: "p",
  layout: function() {
    var content,
        links,
        linkStrings,
        template;

    content = this.get("controller.model").slice();
    links = this.get("parentView.controller.model.links");
    
    linkStrings = links.map(function(link) {
      return content.substring(link.range.from, link.range.to);
    });

    Array.forEach(linkStrings, function(str, index) {
      content = content.replace(str, "{{relation-source " + index + " \"" + str + "\" }}");
    });

    return Ember.Handlebars.compile(content);
  }.property("parentView.controller.model.links.@each"),
  linksChanged: function() {
    this.rerender();
  }.observes("parentView.controller.model.links.@each"),
  mouseUp: function(e) {
  }
});

App.RelationView = Ember.View.extend({
  tagName: "canvas",
  classNames: ["relation"],
  lineWidth: 5,
  $parent: null,
  $story: null,
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
    var id,
        pos,
        $relationSource;

    id = this.get("controller.model.id");
    $relationSource = this.$parent.find(".relation-" + id);
    pos = $relationSource.position();

    return {
      x: pos.left + 0.5 * $relationSource.width(),
      y: pos.top + 0.5 * $relationSource.height()
    };
  }.property("parentView.controller.model.links.@each"),
  update: function() {
    var canvas,
        ctx,
        x,
        y,
        $story,
        width,
        height,
        space;

    canvas = this.get("element");

    if (canvas) {
      ctx = canvas.getContext("2d");
      x = this.get("controller.model.dest.position.x");
      y = this.get("controller.model.dest.position.y");
      width = this.$story.width();
      height = this.$story.height();

      space = this.canvasSpaceFromPoints(
        this.get("sourcePosition"),
        {
          x: x + 0.5 * width,
          y: y + 0.5 * height
        }
      );

      canvas.width = space.size.width;
      canvas.height = space.size.height;

      this.set("x", space.origin.x);
      this.set("y", space.origin.y);

      ctx.strokeStyle = "rgba(255, 0, 0, 0.66)";
      ctx.lineWidth = this.lineWidth;
      ctx.beginPath();
      ctx.moveTo(space.start.x, space.start.y);
      ctx.lineTo(space.end.x, space.end.y);
      ctx.stroke();
    }
  }.observes(
    "controller.model.dest.position.x",
    "controller.model.dest.position.y",
    "relationSource"
  ),
  didInsertElement: function() {
    this.$parent = this.get("parentView").$();
    this.$story = this.$parent.find(".story");

    this.update();
  },
  attributeBindings: ["style"],
  style: function() {
    return "left: " + this.get("x") + "px;" +
           "top: " + this.get("y") + "px;";
  }.property("x", "y"),
  x: 0,
  y: 0
});

App.set(
  "storyRoot",
  {
    position: {
      x: 700,
      y: 150
    },
    title: "「沒5萬免存靠家裡」？戴勝益：期限3年",
    contents: [
      {
        text: "薪水低於五萬，到底要不要存？引發話題的王品董事長戴勝益，首度出面解釋，以自身創業為例子，戴勝益強調人脈帶給他的幫助，就連台積電董事長張忠謀，也相當認同，只是，戴勝益的快人快語，看在好友阿基師的眼中，倒是替他捏了把冷汗！阿基師 ：我相信他很後悔，年輕人不應該計較領多少K，要想說能給老闆多少K。",
        links: [
          {
            id: 0,
            range: { from: 7, to: 13 },
            dest: {
              position: {
                x: -600,
                y: 100
              },
              title: "「月薪五萬說」爭議 戴勝益澄清",
              contents: [
                {
                  text: "王品集團董事長戴勝益，之前到大學演講勉勵新鮮人，「月收入沒5萬，不要儲蓄」，「如果錢不夠，還可以向爸媽借2萬」，引發爭議，今天戴勝益出席活動澄清，並且舉自己為例，是要強調人脈重要性，而且不一定要跟爸媽借，就算28K也能充分利用。",
                  links: []
                },
                {
                  text: "從副總統吳敦義手中，接過服務業金牌獎，王品董事長戴勝益笑的好開心，不過，外界關心的，還是他之前語出驚人的說，畢業三年以內的新鮮人，如果月薪不到5萬，不要儲蓄，甚至可以伸手跟爸媽借。",
                  links: []
                }
              ]
            }
          },
        ]
      },
      {
        text: "阿基師言語中，對好友的論調，不是很認同，不過倒是不斷勉勵新鮮人，不要計較剛開始領多少K，應該想想可以給老闆多少K，來增加自我價值。",
        links: [
          {
            id: 0,
            range: { from: 14, to: 19 },
            dest: {
              position: {
                x: -500,
                y: -100
              },
              title: "有趣的看待戴勝益5萬說　徐旭東：最重要是增加國民所得",
              contents: [
                {
                  text: "王品集團董事長戴勝益日前在演講中表示，年輕人如果月薪不到5萬元，就不要存錢，一番話引來爭議後，他新增加條件是，3年內可以回家向父母拿，台積電董事長張忠謀支持不存錢但要投資自己，遠傳董事長徐旭東則是以「有趣的看待就好」來回應，但強調，「最重要的是要增加國民所得」。",
                  links: []
                }
              ],
            }
          }
        ]
      },
      {
        text: "教育部長出面對企業喊話，既然都要新鮮人,領五萬塊不要存，那是不是該提供相同薪資的工作，好讓他們，有充分的薪水，建立自己的社交生活！",
        links: []
      }
    ]
  }
);

App.set(
  "newLink",
  {
    range: { from: 14, to: 19 },
    dest: {
      position: {
        x: 20,
        y: 20
      },
      title: "New Story",
      contents: [
        {
          text: "This is a new story.",
          links: []
        }
      ],
    }
  }
);
