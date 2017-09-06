window.onload = function(){
	
	//ie9以下支持classList
	if (!("classList" in document.documentElement)) {  
        Object.defineProperty(HTMLElement.prototype, 'classList', {  
            get: function() {  
                var self = this;  
                function update(fn) {  
                    return function(value) {  
                        var classes = self.className.split(/\s+/g),  
                            index = classes.indexOf(value);  
                          
                        fn(classes, index, value);  
                        self.className = classes.join(" ");  
                    }  
                }  
                  
                return {                      
                    add: update(function(classes, index, value) {  
                        if (!~index) classes.push(value);  
                    }),  
                      
                    remove: update(function(classes, index) {  
                        if (~index) classes.splice(index, 1);  
                    }),  
                      
                    toggle: update(function(classes, index, value) {  
                        if (~index)  
                            classes.splice(index, 1);  
                        else  
                            classes.push(value);  
                    }),  
                      
                    contains: function(value) {  
                        return !!~self.className.split(/\s+/g).indexOf(value);  
                    },  
                      
                    item: function(i) {  
                        return self.className.split(/\s+/g)[i] || null;  
                    }  
                };  
            }  
        });  
    }  
	
	//左右按钮
	var prev = getClass("span","prev")[0],
	 	next = getClass("span","next")[0];
	 	
	var container = getClass("div","pic-turnover")[0], //父容器
	    parentNode = getClass("ul","pic-group")[0],   //图片列表父节点
		pic_group = parentNode.getElementsByTagName("li"); //图片dom集合
	
	var btn_bg = getClass("div","btn-bg-group")[0];  //按钮背景
	
	var timer = 300;  //默认图片切换300ms
	var begin = null; //图片轮播定时器
	//清除默认选中行为
	document.onselectstart=new Function('event.returnValue=false;');
	
	//去除按钮间空白节点
	cleanWhitespace(btn_bg);
	//去除图片间空白节点
	cleanWhitespace(parentNode);
	
	//通过index属性获取下标
	function getindex(node){
		return node.getAttribute("index");
	}
	
	//图片向右移动动画
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
	
	//图片向左移动动画
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
	
	//刷新按钮背景样式
	function refresh_botton(previndex,currentindex){
		btn_bg.childNodes[previndex-1].classList.remove("on");
		btn_bg.childNodes[currentindex-1].classList.add("on");
	}
	
	//动画函数，执行图片向左还是向右移动
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
	
	//在指定子节点之前插入新的子节点
	function insertbefore(){
		parentNode.insertBefore(parentNode.lastChild,parentNode.firstChild);
	}
	
	//在指定子节点之后插入新的子节点
	function insertafter(){
		parentNode.appendChild(parentNode.firstChild);
	}
	
	//利用事件冒泡机制实现按钮点击事件
	container.onclick = function(e){
		var picWidth = parentNode.firstChild.offsetWidth;
		e = getTarget(e);
		
		var classlist = e.className.split(" ");
		var className = classlist[classlist.length - 1];
	
		switch(className){
			case "prev":  //点击左按钮
			console.log("dd")
				prevAnimation(picWidth,timer);		
				clearInterval(begin);
				BeginDisplay(picWidth,timer);
			break;
			case "next":  //点击右按钮
			    nextAnimation(picWidth,timer);
			    clearInterval(begin);
			    BeginDisplay(picWidth,timer);
			break;
			case "on":   //点击小圆圈背景
				clearInterval(begin);
			    BeginDisplay(picWidth,timer);
			break;
			case "btn-bg" :  //点击小圆圈按钮
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
