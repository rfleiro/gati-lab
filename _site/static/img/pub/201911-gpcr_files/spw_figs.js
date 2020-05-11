// page-specific maglight init:
if (window.addEventListener) window.addEventListener('load', function() {maglight_init();}, false);  
else if (window.attachEvent) window.attachEvent('onload', function() {maglight_init();});
function maglight_init() {
  var mag={};
  var oimg=document.getElementById("magic").getElementsByTagName("img")[0];
  oimg.onload=function() {
    // modify image to centre it and make it shrinkable:
    var iw=this.width||this.naturalWidth;
    var ih=this.height||this.naturalHeight;
    this.style.width="100%";
    this.style.maxWidth=iw+"px";
    var mdiv=document.getElementById("magic");
    mdiv.style.marginLeft="auto";
    mdiv.style.marginRight="auto";
    mdiv.style.maxWidth=iw+"px";
    // add the maglight:
    var el=mdiv.getElementsByTagName("a")[0]; // NB going to wrap the anchor as well as the image in a maglight container div
    var url="//journals.iucr.org"+el.getAttribute("rel").replace(/^.*linkURL:([^;]+);.*$/ig, "$1");

    var coedid=url;
    coedid=coedid.replace(/^.+\/([a-z][a-z]\d\d\d\d)\/.*$/i, "$1");
    
   // mag=new maglight({element: el, magsrc: url, centre: true, enable: true/*, shape: "square"*/ });
    mag=new maglight({element: el, magsrc: url, centre: true, enable: true, imgviewer: "onclick"/*, shape: "square"*/ });
    mag.container.style.boxShadow="3px 3px 10px rgb(170, 170, 170)";
    // init the toggle button
    var magbut=document.getElementById("toggledynamic");
    if (magbut)
    {
      if (mag.isEnabled()) magbut.innerHTML="disable&#160;zoom";
      else magbut.innerHTML="enable&#160;zoom";
      magbut.style.display="inline";
      magbut.onclick=function() {
	if (mag.isEnabled()) {
	  magbut.innerHTML="enable&#160;zoom";
	  mag.enable(false);
	}
	else {
	  magbut.innerHTML="disable&#160;zoom";
	  mag.enable(true);
	}
      };
      var pptDiv=document.createElement("div");

      var c='<form style="display:none" id="fig_export_form" target="fig_export_iframe" method="post" enctype="multipart/form-data" action="" >';
      c+='<input type="hidden" id="fig_export_coedid" name="coedid" value="'+coedid+'"/>';
      c+='<input type="hidden" id="fig_export_fetch" name="fetch" value="http:'+url+'"/>';
      c+='<input type="hidden" id="fig_export_fullcaption" name="fullcaption" />';
      c+='<input type="hidden" id="fig_export_shortcaption" name="shortcaption" />';
      c+='</form>';
      c+='<iframe name="fig_export_iframe" src="" style="display:none;" ></iframe>';

      pptDiv.innerHTML=c;
      document.body.appendChild(pptDiv);

      //var nbut=document.createElement("div");
      //nbut.style.cssFloat="right";
      //nbut.innerHTML="PPT";
      //magbut.parentNode.insertBefore(nbut, magbut);
      var nbut=document.createElement("span");
      nbut.className="button";
      nbut.innerHTML="download&#160;ppt";
      nbut.style.display="inline-block";
      nbut.style.marginTop="0em";
      nbut.style.marginLeft="0em";
      nbut.style.marginRight="0em";
      nbut.style.marginBottom=".5em";
      var buts=magbut.parentNode.getElementsByTagName("span");
      var lastbut;
      if (buts&&buts.length>0) {
	for (var s=0;s<buts.length;s++) {
	  if (buts[s].className&&buts[s].className.search(/button/ig)>-1) {
	  buts[s].style.display="inline-block";
	  buts[s].style.marginTop="0em";
	  buts[s].style.marginLeft="0em";
	  buts[s].style.marginRight="0em";
	  buts[s].style.marginBottom=".5em";
	  lastbut=buts[s];
	  }
	}
	if (lastbut) {
	  magbut.parentNode.insertBefore(nbut, lastbut.nextSibling);
	  var space=document.createTextNode("\n\n\n\n\u00A0\n\u00A0\n"); // required to duplicate spacing of original buttons! 
	  magbut.parentNode.insertBefore(space, nbut);
	}
	else magbut.parentNode.appendChild(nbut);
	
      }
      else {
	magbut.parentNode.appendChild(nbut);
      }
      nbut.onclick=function() {
	if (!this.caption) {
	  var tbl=document.getElementById("main").getElementsByTagName("table")[0];
	  if (tbl) {
	    var ctd=tbl.getElementsByTagName("tr")[1].getElementsByTagName("td")[0];
	    if (ctd) {
	      var cap=ctd.innerHTML;
	      cap=cap.replace(/^[\s\S]*(<span[^>]+class="[^"]+caption[\s\S]*$)/gi, "$1");
	      cap=cap.replace(/[\u0000-\u0008]/g, "");
	      cap=cap.replace(/[\u000B-\u000C]/g, "");
	      cap=cap.replace(/[\u000E-\u001F]/g, "");
	      cap=cap.replace(/[\uFFFE-\uFFFF]/g, "");
	      cap=cap.replace(/[\u007E-\uFFFF]/g, function(a) {
		return '&#' + a.charCodeAt(0) + ';';
	      });
	      this.caption=cap;
	    }
	  }
	}
	var fm=document.getElementById("fig_export_form");
	//fm.action="../../services/tools/figs/figtoppt.php";
	fm.action="//publcif.iucr.org/services/tools/figs/figtoppt.php";
	fm.fullcaption.value=this.caption;
	fm.shortcaption.value=this.caption;
	fm.submit();
	fm.action="";
      };
    }
  };
var s=oimg.src+"?rand="+new Date().getTime();
oimg.src=s; // fires the above img onload event, afterwhich the maglight is created and the toggle button shown
}
