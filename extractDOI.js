var fs = require('fs')
var data = fs.readFile('ref.txt','utf8',function(err,data){
  var lines = data.split('\r?\n')
  var matcher = /^([A-Z].*\(\d{4}\))/
  var result = "<p>"
  lines.forEach(function(e,i,a){
    if(e.match(matcher) != null){
      result += '</p><p>'+e
    }else{
      result += e
    }
  })
console.log(result)
  var doiExt = /doi:(.*)/g

  var htmlResult = result.replace(doiExt,'<a href="https://www.ncbi.nlm.nih.gov/pubmed/?term=$1" target="_blank">$1</a></p>>')
  fs.writeFile('search.html',htmlResult)
})
