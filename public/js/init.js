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
    x: Math.floor(Math.random() * 300),
    y: Math.floor(Math.random() * 150)
  }
};

App.Story = Ember.Object.extend({
  id: 0,
  position: {
    x: 0,
    y: 0
  },
  title: "This is a Title",
  contents: [],
  init: function() {
    this.id = App.getUID();
  }
});

App.Paragraph = Ember.Object.extend({
  text: "This is some text.",
  links: []
});

App.Link = Ember.Object.extend({
  range: {
    from: 0,
    to: 0
  },
  dest: null
});

$.post("/story/", function(data) {
  var story, stories, num, i, para, range, tail, len, link;

  story = App.Story.create({
    position: App.getPosition(),
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

  /*
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

    (function(range) {
      $.post("/story/", function(data) {
        var story, i;

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

        console.log(link);

        App.storyRoot.contents[para].links.pushObject(link);
      });
    }(range));
  }
  */

  App.advanceReadiness();
});
