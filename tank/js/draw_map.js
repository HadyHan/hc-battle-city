var GRID_WIDTH = 20; //Han: 定义常量，避免代码中出现0之外的数字（魔数），易于维护
var GRID_NUM = 40;
var CANVAS_WIDTH = GRID_WIDTH * GRID_NUM; //计算常量

var DRAW_LINEWIDTH = 0.5 ;
var DRAW_STROKESTYLE = "#aaa"

var block=[];
var array;

var x;
var y;


var drawing = document.getElementById('drawing');
var radio = document.getElementsByName("backgroundImg");

//创建二维数组
for(var r=0;r<GRID_NUM;r++){
	block[r]=[];
	for(var j=0;j<GRID_NUM;j++){
		block[r].push(0);
	}
	block.push(block[r]);
}

if (drawing.getContext){
	var context = drawing.getContext('2d');
	
	
	//鼠标移动，显示坐标
	function getCoordinates(e){
		// Han: 简化了冗余代码
		document.getElementById("coordinates").innerHTML="坐标是: (" + e.pageX + "," + e.pageY + ")";
		x = Math.floor(e.pageX/GRID_WIDTH);
		y = Math.floor(e.pageY/GRID_WIDTH);
		document.getElementById("block-coordinates").innerHTML="格子是: (" + x + "," + y + ")";
		//点击格子可以操作数组
	}
	
	
	//配置画笔
	context.strokeStyle = DRAW_STROKESTYLE;
	context.lineWidth = DRAW_LINEWIDTH;
		
	for (var i=0;i<=GRID_NUM+1;i++){
		context.moveTo(0, i*GRID_WIDTH); //横线
		context.lineTo(CANVAS_WIDTH, i*GRID_WIDTH);
		
		context.moveTo(i*GRID_WIDTH, 0); //竖线
		context.lineTo(i*GRID_WIDTH, CANVAS_WIDTH);
		
		context.stroke();
	}
	
	//默认画布背景
	for(var b =0;b<GRID_NUM;b++){
		for(var c=0;c<GRID_NUM;c++){
			var e = block[b][c];
			var fillX = c * GRID_WIDTH;
			var fillY = b * GRID_WIDTH;
			if(!e){
				var fillImg = document.getElementById("ground");
				context.drawImage(fillImg,fillX,fillY,19,19);
			}
		}
	}
	
	//转换
	function trasnformBlock (tokenToTransform){
		shortToLongTransformMatrix = {
			0:'ground',
			'W': 'water',
			'B':"wall",
			'S':"steel",
			'F':"grass",
			'E':"symbol"
		};
		longToShortTransformMatrix = {
			'ground': 0,
			'water': 'W',
			"wall":'B',
			"steel":'S',
			"grass":'F',
			"symbol":'E'
		};
		return shortToLongTransformMatrix[tokenToTransform] || longToShortTransformMatrix[tokenToTransform];
	}
	
	//绘制地图
	function changeGrid(e){
		for(var a=0;a<radio.length;a++){
			if(radio[a].checked){
				var tokenToTransform = radio[a].value;
			}
		};
		
		var rectX = x * GRID_WIDTH;
		var rectY = y * GRID_WIDTH;
		var img = document.getElementById(tokenToTransform);
		
		if(tokenToTransform == "symbol"){
			context.drawImage(img,rectX,rectY,39,39);
			block[y][(x+1)] =1;
			block[(y+1)][(x+1)] =1;
			block[(y+1)][x] =1;
		}
		else{
			context.drawImage(img,rectX,rectY,19,19)
		};
		
		block[y][x]=trasnformBlock (tokenToTransform);
	}
	
	
	
	//下载文件
	function downloadFile(filename, text) {
	  var element = document.createElement('a');
	  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	  element.setAttribute('download', filename);

	  element.style.display = 'none';
	  document.body.appendChild(element);

	  element.click();
	  
	  document.body.removeChild(element);
	}
	
	document.querySelector('#downloadBtn').addEventListener('click', function(){
		var toJson = {};
		for(var i=0;i<block.length;i++)
		{
			toJson[i]=block[i];
		}
		var text = JSON.stringify(toJson);
		var filename = "map.json";
		
		downloadFile(filename, text);
	})
	
	//读取文件
	var btn=document.getElementById('file');  
	btn.addEventListener('change', selectFile, false);       
  
	function selectFile(e) {  
		var files = e.target.files; // FileList object  
		if(files[0])  
		{  
			var reader = new FileReader();  
			reader.readAsText(files[0]);  
			reader.onload = loaded;      
		}  
	}  
	  
	function loaded(e) {  
		var fileString = e.target.result;  
		array = JSON.parse(fileString); 
		drawGrid(array);
		block = array;
	}  
	
	//读取地图
	function drawGrid(array){
		for(var m=0;m<GRID_NUM;m++){
			for(var n=0;n<GRID_NUM;n++){
				tokenToTransform = array[m][n];
				var drawX = n * GRID_WIDTH;
				var drawY = m * GRID_WIDTH;
				
				var getImg = trasnformBlock (tokenToTransform);
				var drawImg = document.getElementById(getImg);
				
				if(getImg =="symbol"){
					context.drawImage(drawImg,drawX,drawY,39,39)
				}
				else{
					context.drawImage(drawImg,drawX,drawY,19,19)
				};
			}
		}
	}
}