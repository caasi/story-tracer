require! entities
require! cheerio

html2json = (node) ->
  switch
  | node.type is \tag and node.name is \span =>
    type: \text
    data: cheerio.text([node]) # text() needs an array
  | node.type is \tag =>
    concated = []
    children =
      node.children
        .filter (e) ->
          # I only want tag and text nodes now
          e.type is \text or (e.type is \tag and e.children.length isnt 0)
        .map html2json
    # concat text nodes
    i = 0
    while i < children.length
      concated.push children[i]
      if children[i].type is \text
        j = i + 1
        while j < children.length
          break if children[j].type isnt \text
          children[i].data += children[j].data
          j = j + 1
        i = j
      else
        i = i + 1
    type: node.type
    name: node.name
    children: concated
  | node.type is \text =>
    type: node.type
    # FB55's node-entities, 0 = XML, 1 = HTML4, 2 = HTML5
    data: entities.decode node.data, 2
  | otherwise =>
    console.log "oops:"
    console.log node
    type: \unknown
module.exports = html2json
