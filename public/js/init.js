var App;

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

App.Story = Ember.Object.extend({
  id: 0,
  position: {
    x: 0,
    y: 0
  },
  title: "This is a Title",
  contents: null,
  init: function() {
    this.id = App.getUID();
    this.contents = [];
  }
});

App.Paragraph = Ember.Object.extend({
  text: "This is some text.",
  links: null,
  init: function() {
    this.links = [];
  }
});

App.Link = Ember.Object.extend({
  range: {
    from: 0,
    to: 0
  },
  dest: null
});

$.post(
  "/story/",
  //{ url: "http://blogger.godfat.org/2013/06/blog-post.html" },
  { url: "http://murmur.caasigd.org/post/52519795740/hackath3n" },
  function(data) {
    var story, stories, num, i, para, range, tail, len;

    story = App.Story.create({
      title: data.title
    });

    Array.forEach(data.contents, function(p) {
      story.contents.pushObject(
        App.Paragraph.create({
          text: p
        })
      );
    });

    App.set("storyRoot", story);

    num = 3;
    tail = 0;

    for (i = 0; i < num; ++i) {
      para = Math.floor(Math.random() * story.contents.length);
      len = story.contents[para].text.length;
      range = {
        from: tail + Math.floor(Math.random() * (len - tail)),
        to: (tail + 1) + Math.floor(Math.random() * (len - tail - 1))
      };
      if (range.from > range.to) {
        range = {
          from: range.to,
          to: range.from
        }
      }
      tail = range.to;

      (function(para, range) {
        $.post("/story/", function(data) {
          var story, link, i;

          story = App.Story.create({
            position: App.getPosition(),
            title: data.title
          });

          Array.forEach(data.contents, function(p) {
            story.contents.push(
              App.Paragraph.create({
                text: p
              })
            );
          });

          link = App.Link.create({
            range: range,
            dest: story
          });

          App.storyRoot.contents.get(para).links.pushObject(link);
        });
      }(para, range));
    }

    App.advanceReadiness();
  }
);
