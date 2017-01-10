var fs = require('fs')
var dataFile = 'endingPhrase.json'
if(process.argv[2]=='init'){
	init()
}else if(process.argv[2]==undefined){
	addEntires()
}else{
	addEntires(process.argv.slice(2))
}
function init(){
	var result = {eP:[],section:[]}
	var data = JSON.stringify(result)
	fs.writeFile(dataFile,data,function(e){
		if(e)throw e
		console.log("initialized")
	})
}
function addEntires(newEntries){
	var eP = fs.readFile(dataFile,'utf-8',function(e,data){
		if(e)throw e
		var result = JSON.parse(data)
		if(newEntries == undefined){
			console.log(result)
		}else{
			result.eP = arrayMerge(result.eP,newEntries)
			fs.writeFile(dataFile,JSON.stringify(result),function(e){
				if(e) throw e
				console.log(result)
			})
		}
	})
}
function arrayMerge(oriArr,newArr){
	result = oriArr.concat(newArr)
	result = Array.from(new Set(result))
	return result
}
