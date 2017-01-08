var fs = require('fs')
var data = fs.readFile('ref.txt','utf8',function(err,data){
  var processed = doiIden(data)
  console.log(processed)
})

function lineMerger(lines){
  const type1Reg = /^[A-Z][\w\s]/
  const type2Reg =
  lines.forEach(function(e){

  })
}
function getRidOfTheNewLine(txt,matcher){
  var replacer = matcher.replace(/\r?\n/,"")
  return txt.replace(matcher,replacer)
}
function doiIden(txt){
  var result = txt
  result.replace(/(d)\s?\r?\n(oi:)/,'$1$2')
  result.replace(/(do)\s?\r?\n(i:)/,'$1$2')
  result.replace(/(doi)\s?\r?\n(:)/,'$1$2')

  const doiReg = /(doi:10\.\d{4}(\.\d+)?\/.*[\.\-\/\d].*)\r?\n/g
  const doiWild = /(doi:.*)\r?\n/g
  var doiStrict = result.match(doiReg)
  var doiLoose = result.match(doiWild)
  var filtered = doiLoose.filter(function(e){
    var exist = doiStrict.find(function(val){
      return val == e
    })
    return exist == undefined
  })
  filtered.forEach(function(e){
    result = getRidOfTheNewLine(result,e)
  })
  return result
}
