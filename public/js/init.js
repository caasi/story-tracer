var App,
    story,
    link;

App = Ember.Application.create({});
App.deferReadiness();

App.movingView = null;
App.uid = 0;
App.getUID = function() {
  return App.uid++;
};
App.getPosition = function() {
  return {
    x: 100 + Math.floor(Math.random() * 300),
    y: 100 + Math.floor(Math.random() * 150)
  }
};

App.StoryColors = [
  /* colors from http://flatuicolors.com/ */
  "#1abc9c", //Turquoise
  "#2ecc71", //Emerrald
  "#3498db", //Peter River
  "#9b59b6", //Amethyst
  "#f1c40f", //Sun Flower
  "#e67e22", //Carrot
  "#e74c3c"  //Alizarin
];

App.Story = Ember.Object.extend({
  id: 0,
  color: null,
  position: null,
  size: null,
  title: "Loading...",
  contents: null,
  init: function() {
    this.id = App.getUID();
    this.color = App.StoryColors[Math.floor(Math.random() * App.StoryColors.length)];
    this.position = this.position || {
      x: 0,
      y: 0
    };
    this.size = this.size || {
      width: 0,
      height: 0
    };
    this.contents = this.contents || [];
  }
});

App.Paragraph = Ember.Object.extend({
  text: "loading...",
  links: null,
  rects: null,
  init: function() {
    this.links = this.links || [];
    // it's not possible to have characters rects when initializing happening
    this.rects = [];
  }
});

App.Link = Ember.Object.extend({
  range: {
    from: 0,
    to: 0
  },
  dest: null
});

story = App.Story.create({});
App.set("storyRoot", story);
App.advanceReadiness();

$.post(
  "/story/",
  //{ url: "http://blogger.godfat.org/2013/06/blog-post.html" },
  //{ url: "http://murmur.caasigd.org/post/52519795740/hackath3n" },
  function(data) {
    var num, i, para, range, from;

    story.set("title", data.title);

    data.contents.forEach(function(p) {
      story.contents.pushObject(
        App.Paragraph.create({
          text: p
        })
      );
    });

    num = 2;
    tail = 0;

    for (i = 0; i < num; ++i) {
      para = Math.floor(Math.random() * story.contents.length);
      len = story.contents[para].text.length;
      from = Math.floor(Math.random() * (len - 1));
      range = {
        from: from,
        to: from + 1 + Math.floor(Math.random() * (len - from - 1))
      };

      (function(para, range) {
        var story, link;

        story = App.Story.create({
          position: App.getPosition()
        });

        link = App.Link.create({
          range: range,
          dest: story
        });

        $.post("/story/", function(data) {
          story.set("title", data.title);

          data.contents.forEach(function(p) {
            story.contents.pushObject(
              App.Paragraph.create({
                text: p
              })
            );
          });
        });

        App.storyRoot.contents.get(para).links.pushObject(link);
      }(para, range));
    }
  }
);
