var fs = require('fs')
var path = require('path')
var data = fs.readFile('ref.txt','utf8',function(err,data){
  var processed = doiPreProcess(data)
  processed = doiProcessSecondary(processed)
  processed = htmlGen(processed)
  fs.writeFile(path.join(__dirname,outputFilename),processed,(e)=>{
    if(e)throw e
    console.log('saved!')
  })
})
const outputFilename = "search.html"
const doiReg = /(doi:10\.\d{4}(\.\d+)?\/.*[\w\.\-\/].*[\d\w])\r?\n/g
const doiWild = /(doi:.*)\r?\n/g
const endingPatternStrict = /.*(\d:\d*.\d+)\r?\n|.*(doi:.*)\r?\n/g
const RESTFULPrefix = "http://xueshu.baidu.com/s?wd="
const keyword1 = /doi:(.*)/
const keyword2 = /\. ((?:\w* )*\d*:\d*–\d*)/
function htmlGen(data){
  var entries = data.split(/\r?\n/)
  var resultTemplate = '<!DOCTYPE html> <html> <head> <meta charset="utf-8"> <title></title> </head> <body>{content}</body> </html>'
  var hrefTemplate = '<a target="_blank" href="{link}">网上查询</a>'
  var result = ""
  console.log(entries.length)
  entries.forEach(function(e){
    var link = keywordExtract(e)
    var aTxt = hrefTemplate.replace("{link}",keywordExtract(e))
    console.log(link)
    result += '<p>'+e+link?('<br>'+aTxt):''+'</p>'
    // console.log(result)
  })
  resultTemplate =  resultTemplate.replace("{content}",result)
  return resultTemplate
}
function keywordExtract(str){
  var result = keyword1.exec(str)
  if(result){
    return result[1]
  }else{
    var result2 = keyword2.exec(str)
    if(result2){
      return result2[1]
    }else{
      return null
    }
  }
}
function getRidOfTheNewLine(txt,matcher){
  var replacer = matcher.replace(/\r?\n/,"")
  return txt.replace(matcher,replacer)
}

function doiPreProcess(data){
  var result = data
  var r2 = result
  result = result.replace(/(d)\s?\r?\n(oi:)/,'$1$2').replace(/(do)\s?\r?\n(i:)/,'$1$2').replace(/(doi)\s?\r?\n(:)/,'$1$2')
  result = result.replace(/(doi:[^\s]*)\s([A-Z])/g,'$1\n$2')
  result = result.replace(/(doi:[^\s]*) ([^\s])/g,'$1$2')
  result = LooseAndStrict(result,doiWild,doiReg)
  return result
}
function doiProcessSecondary(data){
  var result = data
  result = LooseAndStrict(result,/.*\r?\n/g,endingPatternStrict)
  return result
}

function LooseAndStrict(data,regLoose,regStrict){
  var result = data
  var loose = result.match(regLoose)
  var strict = result.match(regStrict)
  var filtered = loose.filter(function(e){
    var exist = strict.find(function(val){
      // console.log("%s,%s",e,val)
      return val == e
    })
    return exist == undefined
  })
  filtered.forEach(function(e){
    result = getRidOfTheNewLine(result,e)
  })
  return result
}
