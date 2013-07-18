html2json = ($, $node) ->
  node = $node[0]
  switch
  | node.type is \tag and node.name is \span =>
    type: \text
    data: $node.text()
  | node.type is \tag =>
    concated = []
    children =
      $node.children()
        .filter (i, e) ->
          console.log e
          # I only want tag and text nodes
          e.type is \text or e.type is \tag
        .map (i, e) ->
          # cheerio fails if I don't use $.chilren()
          html2json $, $ e
        .filter (e) ->
          e.type isnt \tag or e.children.length
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
