var fs = require('fs')
var path = require('path')
var src = "目次utf8.txt"
var encoding = "utf-8"
var outputFilename = "目录.json"
// endingPhrase.json > parsing function

// sectionName: > title 数字-数字
// 视频讲座/手术录像 title
var data = fs.readFile(src,encoding,function(err,data){
  sectionCut(data)
})

function sectionCut(data){
  const src = "endingPhrase.json"
  var phrases = fs.readFile(src,'utf-8',function(err,phraseLog){
    var phraseData = JSON.parse(phraseLog)
    var section = phraseData.section
    var content = []
    var sectionIndex = section.map(function(e){
      if(data.match(e)){
        return {ind:data.match(e).index,ttl:e}
      }else{
        return null
      }
    })
    .filter(function(e){return e})
    .sort(function(a,b){
      if(a.ind<b.ind){
        return -1
      }else if(a.ind>b.ind){
        return 1
      }else{
        return 0
      }
    })
    console.log(sectionIndex)
    sectionIndex.forEach(function(e,i,a){
      if(a[i+1]){
        content.push({ttl:e.ttl,content:data.substring(e.ind+e.ttl.length,a[i+1].ind).trim()})
      }else{
        content.push({ttl:e.ttl,content:data.substring(e.ind+e.ttl.length).trim()})
      }
    })
    console.log(content)
  })
}
