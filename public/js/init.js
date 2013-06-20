var App;

App = Ember.Application.create({});

App.movingView = null;
App.uid = 0;
App.getUID = function() {
  return App.uid++;
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

App.set(
  "storyRoot",
  App.Story.create({
    position: {
      x: 700,
      y: 100
    },
    contents: [
      App.Paragraph.create({
        links: [
          App.Link.create({
            range: {
              from: 0,
              to: 4
            },
            dest: App.Story.create({
              position: {
                x: -200,
                y: -50
              },
              contents: [ App.Paragraph.create({}) ]
            })
          }),
          App.Link.create({
            id: 1,
            range: {
              from: 5,
              to: 10
            },
            dest: App.Story.create({
              position: {
                x: -400,
                y: 20
              },
              contents: [ App.Paragraph.create({}) ]
            })
          })
        ]
      })
    ]
  })
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
