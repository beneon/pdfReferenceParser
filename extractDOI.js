var fs = require('fs')
var data = fs.readFile('ref.txt','utf8',function(err,data){
  var processed = doiPreProcess(data)
  processed = doiProcessSecondary(processed)
  console.log(processed.split(/\r?\n/).length)
  console.log(processed)
})
const doiReg = /(doi:10\.\d{4}(\.\d+)?\/.*[\w\.\-\/].*[\d\w])\r?\n/g
const doiWild = /(doi:.*)\r?\n/g
const endingPatternStrict = /.*(\d:\d*.\d+)\r?\n|.*(doi:.*)\r?\n/g

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
