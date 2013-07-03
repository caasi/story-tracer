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
  title: "",
  url: null,
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
  text: "",
  links: null,
  rects: null,
  dimension: null,
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

story.set("url", "*");
