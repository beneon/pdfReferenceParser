var fs = require('fs')
var path = require('path')
var src = "目次utf8.txt"
var encoding = "utf-8"
var outputFilename = "目录.json"
var phraseData
// endingPhrase.json > parsing function

// sectionName: > title 数字-数字
// 视频讲座/手术录像 title
var data = fs.readFile(src,encoding,function(err,data){
  sectionCut(data)
})

function sectionCut(data){
  const src = "endingPhrase.json"
  var phrases = fs.readFile(src,'utf-8',function(err,phraseLog){
    phraseData = JSON.parse(phraseLog)
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
    sectionIndex.forEach(function(e,i,a){
      if(a[i+1]){
        content.push({ttl:e.ttl,content:data.substring(e.ind+e.ttl.length,a[i+1].ind).trim()})
      }else{
        content.push({ttl:e.ttl,content:data.substring(e.ind+e.ttl.length).trim()})
      }
    })
    content = content.map(entriesCut).map(jsonProcess).reduce(function(a,b){
      if(b[0].section=="视频讲座" || b[0].section=="手术录像"){
        return a
      }else{
        return a.concat(b)
      }
    })
    console.log(content)
  })
}
function jsonProcess(section){
  section.content.map(function(e){
    e.section = section.ttl
    e.type = "article"
    return e
  })
  return section.content
}
function entriesCut(section){
  function entryParse(data,lineDelim){
    var dataArr = data.split(lineDelim)
    dataArr = dataArr.filter(function(e){
      return e!=""
    })
    var parseDelim = phraseData.eP
    var matcher = new RegExp(parseDelim.join('|'),'g')
    dataArr = dataArr.map(function(e){
      var finding = e.match(matcher).pop()
      var delimmer = new RegExp(finding)
      var delimIndex = delimmer.exec(e).index+finding.length
      var title = e.substring(0,delimIndex).trim().replace(/\s/g,"")
      var author = e.substring(delimIndex).trim()
      return {"title":title,"author":author}
    })
    return dataArr
  }
  if(section.ttl=="手术录像" || section.ttl=="视频讲座"){
    section.content = entryParse(section.content,/\n/)
  }else{
    section.content = entryParse(section.content,/\d{1,3}\-\d{1,3}/)
  }
  return section
}
