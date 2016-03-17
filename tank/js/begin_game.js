//开始移动
function beginGame(e){
	document.getElementById('tankMap').style.display = "block";
	document.getElementById('drawMap').style.display = "none";
	var myTank;
	var ground = document.getElementById('ground');
	var tankU = document.getElementById('tankU');
	var tankD = document.getElementById('tankD');
	var tankL = document.getElementById('tankL');
	var tankR = document.getElementById('tankR');
	var tankX;//坦克坐标
	var tankY;
	var beforeX;
	var beforeY;
	var coordX;//接下来要前往的格子位置
	var coordY;
	var vectorX;
	var vectorY;//子弹向量
	
	if (tankMap.getContext){
		var contextGame = tankMap.getContext('2d');
		myTank = tankU;
		tankX =760;
		tankY =760;
		contextGame.drawImage(myTank,tankX,tankY,39,39);
		
		
		//坦克移动
		window.addEventListener("keydown",moveTank,false);
		function moveTank(e) {
			beforeX = tankX;
			beforeY = tankY;
			
			contextGame.clearRect(tankX,tankY,39,39);
			contextGame.clearRect(beforeX,beforeY,39,39);
			document.getElementById("result").innerHTML="";
			switch(e.keyCode) {
				case 37:
					if(myTank = tankL){
						tankX = tankX - GRID_WIDTH;
						toCoordinate(tankX,tankY);
						isObstacle = block[coordY][coordX] || block[coordY+1][coordX];
					}else{
						myTank = tankL;
						vectorX = -1;
						vectorY = 0;
					}
					break;
				case 38:
					if(myTank = tankU){
						tankY = tankY - GRID_WIDTH;
						toCoordinate(tankX,tankY);
						isObstacle = block[coordY][coordX] || block[coordY][coordX+1];
					}else{
						myTank = tankU;
						vectorX = 0;
						vectorY = -1;
					}
					break;
				case 39:
					if(myTank = tankR){
						tankX = tankX + GRID_WIDTH;
						toCoordinate(tankX,tankY);
						isObstacle = block[coordY+1][coordX+1] || block[coordY][coordX+1];
					}else{
						myTank = tankR;
						vectorX = 0;
						vectorY = 1;
					}
					break;
				case 40:
					if(myTank = tankD){
						tankY = tankY + GRID_WIDTH;
						toCoordinate(tankX,tankY);
						isObstacle = block[coordY+1][coordX] || block[coordY+1][coordX+1];
					}else{
						myTank = tankD;
						vectorX = 1;
						vectorY = 0;
					}
					break;  
				case 32:
					bullet(tankX,tankY,vectorX,vectorY);
					isObstacle =0;
					break;
					
			} 
			
			//是否有障碍物
			if(tankX > 760 || tankY > 760 || tankX < 0 || tankY < 0){
				hasObstacle();
			}else{
				if(isObstacle){
					hasObstacle();
				}else{
					contextGame.drawImage(myTank,tankX,tankY,39,39);
				}
			}
			
			
		}
		
		
		function hasObstacle(){
			document.getElementById("result").innerHTML="不能继续前进！";
			contextGame.drawImage(myTank,beforeX,beforeY,39,39);
			tankX = beforeX;
			tankY = beforeY;
		}
		
		//接下来要前往的位置
		function toCoordinate(tankX,tankY){
			coordX = Math.floor(tankX/GRID_WIDTH);
			coordY = Math.floor(tankY/GRID_WIDTH);
		}
		
		//发射子弹
		function bullet(tankX,tankY){
			toCoordinate(tankX,tankY);
			switch(myTank) {
				case tankL:
						vectorX = -1;
						vectorY = 0;
					break;
				case tankU:
						vectorX = 0;
						vectorY = -1;
					break;
				case tankR:
						vectorX = 1;
						vectorY = 0;
					break;
				case tankD:
						vectorX = 0;
						vectorY = 1;
					break; 
			} 
			shotingBlock(tankX,tankY,vectorX,vectorY);
		}
		
		function shotingBlock(tankX,tankY,vectorX,vectorY){
			if(block[coordY][coordX]){
				tankX = coordX * 20;
				tankY = coordY * 20;
				block[coordY][coordX] = 0;
				context.drawImage(ground,tankX,tankY,19,19);
			}else{
				coordX = coordX +vectorX;
				coordY = coordY +vectorY;
				shotingBlock(tankX,tankY,vectorX,vectorY);
			}
		}
	}
}