// This version of subwindow.js comments out the procedure to check subwindow
// size and resize it, because this was throwing security errors in the
// "highlighting of terms" service since links to external domains are
// established in the subwindow
// (BM: 2008-05-30)

// Global variable for subwindow reference
var subwindow='';
// Version flag for old browsers (Nav2/IE3)
var oldStuff = parseInt(navigator.appversion) < 3;

function makeSubWindow(newLink,winName, h, w)
{
 var h = (h == undefined) ? "480" : h;
 var w = (w == undefined) ? "720" : w;
 //alert("height = "+h+" width "+w);
 // check if subwindows is closed and the location is not blank (i.e. popup is being used)
 if (!subwindow.closed && subwindow.location)
  {
   // check the size and resize if too small
   // var ow = f_clientWidth();
   // var oh = f_clientHeight();
   // if ( oh < h || ow < w ) {
     // subwindow.resizeTo(w,h);
   // }
   // alert("height = "+oh+" width "+ow);
   // load new location into existing popup
   subwindow.location.href = newLink;
   
  }
 else
  {
   // create new window
   subwindow=window.open(newLink, winName,"dependent,resizable,scrollbars=yes,height="+h+",width="+w);
   if (!subwindow.opener) subwindow.opener = self;
  }
 // set focus on popup
 if (window.focus) {subwindow.focus()}
 // return false to stop browser opening link
 return false;
}

function f_clientWidth() {
	return f_filterResults (
		subwindow.innerWidth ? subwindow.innerWidth : 0,
		subwindow.document.documentElement ? subwindow.document.documentElement.clientWidth : 0,
		subwindow.document.body ? subwindow.document.body.clientWidth : 0
	);
}
function f_clientHeight() {
	return f_filterResults (
		subwindow.innerHeight ? subwindow.innerHeight : 0,
		subwindow.document.documentElement ? subwindow.document.documentElement.clientHeight : 0,
		subwindow.document.body ? subwindow.document.body.clientHeight : 0
	);
}
function f_filterResults(n_win, n_docel, n_body) {
	var n_result = n_win ? n_win : 0;
	if (n_docel && (!n_result || (n_result > n_docel)))
		n_result = n_docel;
	return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
}


