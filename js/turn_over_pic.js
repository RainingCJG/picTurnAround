window.onload = function(){
	var prev = getClass("span","prev")[0],
	 	next = getClass("span","next")[0];
	 	
	var container = getClass("div","pic-turnover")[0],
	    parentNode = getClass("ul","pic-group")[0],
		pic_group = parentNode.getElementsByTagName("li");
	
	var btn_bg = getClass("div","btn-bg-group")[0];
	
	var timer = 300;
	var begin = null;
	document.onselectstart=new Function('event.returnValue=false;');
	cleanWhitespace(btn_bg);
	cleanWhitespace(parentNode);
	
	function getindex(node){
		return node.getAttribute("index");
	}
	
	function prevAnimation(picWidth,timeout,callback){
		if(!callback){
			refresh_botton(getindex(parentNode.firstChild),getindex(parentNode.lastChild));
		}
		parentNode.style.marginLeft = -picWidth + "px";
		insertbefore();
		animation(picWidth,timeout,function(){
			if(callback){
				callback();
			}
		});
	}
	
	function nextAnimation(picWidth,timeout,callback){
		if(!callback){
			refresh_botton(getindex(parentNode.childNodes[0]),getindex(parentNode.childNodes[1]));
		}
		animation(-picWidth,timeout,function(){
			if(!callback){
			refresh_botton(getindex(parentNode.childNodes[0]),getindex(parentNode.childNodes[1]));
		}
			parentNode.style.marginLeft = 0 + "px";
			insertafter();
			if(callback){
				callback();
			}
		});
	}
	
	//开始动画循环播放函数
	function BeginDisplay(picWidth,timeout){
		clearInterval(begin);
		begin = setInterval(function(){
			nextAnimation(picWidth,timeout);
		},3000);	
	}
	
	function refresh_botton(previndex,currentindex){
		btn_bg.childNodes[previndex-1].classList.remove("on");
		btn_bg.childNodes[currentindex-1].classList.add("on");
	}
	
	function animation(picWidth,timeout,callback){
	    var offset = picWidth/(timeout/10);

		function go(){		
			var offsetLeft = parentNode.offsetLeft + offset;
			if(offsetLeft > 0){
				offsetLeft = 0;
			}
		
			parentNode.style.marginLeft = offsetLeft + "px";
			if(!offsetLeft || (Math.abs(offsetLeft) > Math.abs(picWidth))){
				if(!callback){
					return;
				}else{
					callback();
				}
				return;
			}
			setTimeout(go,10);
		}
		go();	
	}
	
	function insertbefore(){
		parentNode.insertBefore(parentNode.lastChild,parentNode.firstChild);
	}
	
	function insertafter(){
		parentNode.appendChild(parentNode.firstChild);
	}
	
	container.onclick = function(e){
		var picWidth = parentNode.firstChild.offsetWidth;
		e = getTarget(e);
		
		var classlist = e.className.split(" ");
		var className = classlist[classlist.length - 1];
	
		switch(className){
			case "prev":
				prevAnimation(picWidth,timer);		
				clearInterval(begin);
				BeginDisplay(picWidth,timer);
			break;
			case "next":
			    nextAnimation(picWidth,timer);
			    clearInterval(begin);
			    BeginDisplay(picWidth,timer);
			break;
			case "on":
				clearInterval(begin);
			    BeginDisplay(picWidth,timer);
			break;
			case "btn-bg" :
				var currentindex = getindex(e),
				    previndex = getindex(parentNode.firstChild);
				    arround = Math.abs(previndex - currentindex);
			   
				if(currentindex > previndex){
					var timeout = timer/arround;
					var callback = function(){
						if(arround--){
							nextAnimation(picWidth,timeout,callback);
						}
					}
					callback();
					refresh_botton(previndex,currentindex);
				}else{
					var timeout = timer/arround;
					var callback = function(){
						if(arround--){
							prevAnimation(picWidth,timeout,callback);
						}
					}
					refresh_botton(previndex,currentindex);
					callback();
				}
				clearInterval(begin);
			    BeginDisplay(picWidth,timer);
			break;
			default: break;
		}	
	}	
	
	container.onmouseover = function(){
		prev.classList.remove("none");
		next.classList.remove("none");
	}
	
	container.onmouseout = function(){
		prev.classList.add("none");
		next.classList.add("none");
	}
	
	//开始动画循环播放
	BeginDisplay(600,300);
}

//通过类名获取对象
function getClass(tagName,ClassName){
	if(document.getElementsByClassName) //支持这个函数
    {        
    	return document.getElementsByClassName(ClassName);
    }else{
    	var obj = document.getElementsByTagName(tagName);
    	var arr =[];
    	var aRes=[];
		for(var i=0; i < obj.length;i++){
			arr = obj[i].className.split(" ");
			for(var j=0; j < arr.length;j++){
				if(arr[j] === ClassName){
					aRes.push(obj[i]);
				}
			}
		}
		return aRes;
    }
};

//事件委托
function getTarget(e){
	e = e || window.event;
	return (e.target || e.srcElement);
}

//获取当前图片
function getCurrentPic(current){
	for(var i in current){
		current[i].onclick = function(){
			return this;
		}
	}
}

//去除空白节点
function cleanWhitespace(oEelement)
{
 for(var i=0;i<oEelement.childNodes.length;i++){
  var node=oEelement.childNodes[i];
  if(node.nodeType==3 && !/\S/.test(node.nodeValue)){
  		node.parentNode.removeChild(node)
  	}
  }
}
