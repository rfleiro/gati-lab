$(document).ready(function(){
   $("button").click(function(){
     $(".mathmode").toggle();
   });
});


var myProcessPage = function() {

<!-- stats divs -->
/*    var cnors = new Array();
    $(".downloads").each(function() {
      var cnor = $(this).attr('id');
      cnor = cnor.replace('_stats','');
      cnor = cnor.replace('_stnar','');
      cnors.push(cnor);
    });
  var jqxhr = $.getJSON('/cgi-bin/get_stats.pl?cnors=cnor'+cnors.join(),
    function(data) {
      $.each(data, function(cnor,stats){
          var stot = stats.s.p+stats.s.h;
          var ttot = stats.t.p+stats.t.h;
          var etot = stats.e.p+stats.e.h;
          //normal
          var div = "#"+cnor+"_stats";
          $(div).html("<span class=\"popuphd\">Page views</span><br/><table><tr><th>Time</th><th>HTML</th><th>PDF</th><th>Total</th></tr><tr><td class=\"head\">Last seven days</td><td>"+stats.s.h+"</td><td>"+stats.s.p+"</td><td>"+stot+"</td></tr><tr><td class=\"head\">Last thirty days</td><td>"+stats.t.h+"</td><td>"+stats.t.p+"</td><td>"+ttot+"</td></tr><tr><td class=\"head\">Since going online</td><td>"+stats.e.h+"</td><td>"+stats.e.p+"</td><td>"+etot+"</td></tr><tr class=\"\"><td colspan=\"4\"><a class=\"\" href=\"//scripts.iucr.org/cgi-bin/citedin?"+cnor+"\" alt=\"more stats\">more article statistics ...</a></td></tr></table>");
          //narrow
          var divnar = "#"+cnor+"_stnar";
          $(divnar).html("<span class=\"popuphd\">Page views</span><br/><table><tr><th>Time</th><th>HTML</th><th>PDF</th><th>Total</th></tr><tr><td class=\"head\">Last seven days</td><td>"+stats.s.h+"</td><td>"+stats.s.p+"</td><td>"+stot+"</td></tr><tr><td class=\"head\">Last thirty days</td><td>"+stats.t.h+"</td><td>"+stats.t.p+"</td><td>"+ttot+"</td></tr><tr><td class=\"head\">Since going online</td><td>"+stats.e.h+"</td><td>"+stats.e.p+"</td><td>"+etot+"</td></tr><tr class=\"\"><td colspan=\"4\"><a class=\"\" href=\"//scripts.iucr.org/cgi-bin/citedin?"+cnor+"\"more stats\">more article statistics ...</a></td></tr></table>");
     });
   });
  jqxhr.done(function() { console.log("Done"); });
  jqxhr.fail(function() { console.log("Failed"); }); 
*/
$('.downloads').one('mouseover', 
 function() {
    var cnor = $(this).attr('id');
    cnor = cnor.replace('_divwide','');
    cnor = cnor.replace('_divnrw','');
    cnor = cnor.replace('_stats','');
    cnor = cnor.replace('_stnar','');
    var jqxhr = $.getJSON('/cgi-bin/get_stats.pl?cnors='+cnor,
	  function(data) {
	    $.each(data, function(cnor,stats){
	     var stot = stats.s.p+stats.s.h;
	     var ttot = stats.t.p+stats.t.h;
	     var etot = stats.e.p+stats.e.h;
	     //normal
	     var div = "#"+cnor+"_stats";
	     $(div).html("<span class=\"popuphd\">Page views</span><br/><table><tr><th>Time</th><th>HTML</th><th>PDF</th><th>Total</th></tr><tr><td class=\"head\">Last seven days</td><td>"+stats.s.h+"</td><td>"+stats.s.p+"</td><td>"+stot+"</td></tr><tr><td class=\"head\">Last thirty days</td><td>"+stats.t.h+"</td><td>"+stats.t.p+"</td><td>"+ttot+"</td></tr><tr><td class=\"head\">Since going online</td><td>"+stats.e.h+"</td><td>"+stats.e.p+"</td><td>"+etot+"</td></tr><tr class=\"\"><td colspan=\"4\"><a class=\"\" href=\"//scripts.iucr.org/cgi-bin/citedin?"+cnor+"\" alt=\"more stats\">more article statistics ...</a></td></tr></table>");
	     //narrow
	     var divnar = "#"+cnor+"_stnar";
	     $(divnar).html("<span class=\"popuphd\">Page views</span><br/><table><tr><th>Time</th><th>HTML</th><th>PDF</th><th>Total</th></tr><tr><td class=\"head\">Last seven days</td><td>"+stats.s.h+"</td><td>"+stats.s.p+"</td><td>"+stot+"</td></tr><tr><td class=\"head\">Last thirty days</td><td>"+stats.t.h+"</td><td>"+stats.t.p+"</td><td>"+ttot+"</td></tr><tr><td class=\"head\">Since going online</td><td>"+stats.e.h+"</td><td>"+stats.e.p+"</td><td>"+etot+"</td></tr><tr class=\"\"><td colspan=\"4\"><a class=\"\" href=\"//scripts.iucr.org/cgi-bin/citedin?"+cnor+"\"more stats\">more article statistics ...</a></td></tr></table>");
	  })
	 });
	 jqxhr.done(function() { console.log("Done"); });
	 jqxhr.fail(function() { console.log("Failed"); }); 
	});


<!-- repress title popup for popup menus -->
  var ttext;
  $('.art_icon').hover(function(){
    ttext = $(this).attr('title');
    $(this).removeAttr('title');
  },function(){
    $(this).attr('title', ttext);
  });
  //var ttext2;
  $('.sidebutton>a').each(function(){
    $(this).removeAttr('title');
  });
  $('.popup>a').each(function(){
    $(this).removeAttr('title');
  });
  $('.popuphd>a').each(function(){
   $(this).removeAttr('title');
  });


<!-- popup menu script -->
var zlevel = 50;
function popUpMenu() {
  butt_index=butt_index+1;
   var distance = 10;
   var leftStart = 31;
   var time =1;
   var hideDelay = 25;
   var hideDelayTimer = null;
   var beingShown = false;
   var shown = false;
   var trigger = $('.art_icon', this);    
   var showplace = trigger.attr('id');
   if (showplace === "nextart") { 
     distance = -10;
     leftStart = -240;
   } 
   var info = $('.popup', this).css('opacity', 0);
   var offtop = trigger.css('top');
   var offleft = trigger.css('left'); // added by dh2 for moving buttons at top so the can be used easier  20140915
<!-- Added by cm 28/9/2013 to deal with horizontal grey buttons and those on the right-hand side -->
   if (trigger.parents('.af_horizontal').length) {
     var topStart = parseInt(offtop);
     topStart = topStart + 20;
     topStart = topStart + "px";
     offtop = topStart;
     leftStart = offleft;
     var teststr = leftStart.replace("px","");
     var winstr = $('.popup').css('min-width').replace("px","");
     var menuSpaceNeeded = parseInt(teststr)+parseInt(winstr)+30;
     
     if (menuSpaceNeeded > $(window).width()) {
       leftStart = $(window).width() - winstr -30;
     //  alert(winstr + ' ' + ' ' + teststr + ' ' +  menuSpaceNeeded + ' '+ $(window).width() + ' '+leftStart);
     }
   }
   if (trigger.parents('#art_leftbox_narrow').length) {
     distance = -10;
   }
   if (trigger.parents('.art_issuecontentsfunctions').length) {
     distance = -10;
     leftStart = -200;
   }
<!-- End 28/9/2013 section -->
   $([trigger.get(0), info.get(0)]).mouseover(function () {
     zlevel++;
     if (zlevel > 1000) {
       zlevel = 50;
     }	
     info.css({"z-index": zlevel});
     // console.log(zlevel); 
     if (hideDelayTimer) clearTimeout(hideDelayTimer);
       if (beingShown || shown) {
         // don't trigger the animation again
         return;
       } else {
         // reset position of info box
         beingShown = true;
         info.css({
           top: offtop,
           left: leftStart,
           display: 'block'
         }).animate({
           <!--  left: '+=' + distance + 'px', no longer animate the position 20140910 dh2 -->
           opacity: 1
         }, time, 'swing', function() {
            beingShown = false;
            shown = true;
         });
       }
       return false;
     }).mouseout(function () {
       if (hideDelayTimer) clearTimeout(hideDelayTimer);
       hideDelayTimer = setTimeout(function () {
         hideDelayTimer = null;
         info.animate({
      <!--  left: '+=' + distance + 'px', no longer animate the position 20140910 dh2 -->
           opacity: 0
         }, time, 'swing', function () {
           shown = false;
           info.css('display', 'none');
         });
        }, hideDelay);
        return false;
     });
   };

var num_buts = $('.bubbleInfo').length;
var butt_index = 0;

function doCalculation()
{
  //alert("hi " + butt_index);
   //do your thing for a short time
  for (var i=0, len=100; i<len; i++)
    if ( popUpMenu.call($('.bubbleInfo')[butt_index], butt_index, $('.bubbleInfo')[butt_index]) === false ) break;
   //figure out how complete you are
  var percent_complete=(butt_index*100)/$('.bubbleInfo').length;
  //alert(percent_complete);

   return percent_complete;
}

function pump()
{
   var percent_complete=doCalculation();

   //maybe update a progress meter here!

   //carry on pumping?
   if (percent_complete<100)
   {
      setTimeout(pump, 50);
   }
}

//start the calculation
 setTimeout(pump, 50);
//pump();
/*$('.bubbleInfo').each(popUpMenu);
*/
/*for (var i=0, len=$('.bubbleInfo').length; i<len; i++)
  if ( popUpMenu.call($('.bubbleInfo')[i], i, $('.bubbleInfo')[i]) === false ) break;
*/
/*alert($(".bubbleInfo:nth-child(0)"));

$(".bubbleInfo:nth-child(0)").each(popUpMenu);
*/

};


$(function () {
    
    myProcessPage();
    /* $('.af_vertical>.bubbleInfo>.sidebutton>.addthis_button_compact').hover(function(){ 
									    alert($(this).offset().top);
									     });								       
  */

  // form label handler   
  $(".inputWrap").inputmask();
  /* spw 20170401 - inputmask library replaced - following defunct 
  $(".inputWrap").each(function() {
    var label = $(this).find('label');
    var input = $(this).find('input, textarea');
    if(input.val() > '') {
      label.css({opacity: '0'});
    };  
  });
  */

// latest div handler
 $(".latest").find(".artlisthead").click(function () {
  $(this).find("img").toggleClass("hide");
  $(this).parent().find(".artlist").toggleClass("artlistbody");
  $(this).parent().find(".artlist").slideToggle(400);
  $(this).toggleClass("closed");
 });

 // script specific handlers
 $("div.checkCIF").click(function() {
  $(this).next("div.checkCIFfile").toggleClass("hide");
  $(this).find("img").toggleClass("hide");
 });
 $("h3.scrpt_subs_info").click(function() {
  $(this).find("img").toggleClass("hide");
  $("div.scrpt_subs_info").toggleClass("hide");
 });
// $("a.scrpt_buylogotext").click(function() {
//  $("div.scrpt_buyform").toggleClass("hide");
//  $("div.scrpt_firstpage").toggleClass("hide");
//  $("div.scrpt_supmat").toggleClass("hide");
//  return false;
// });
 $("#buyform").validate({
    rules: {
      email: {
        required: true,
        email: true
      },
      email2: {
        required: true,
        email: true,
        equalTo: "#email"
      },
      country: {
        required: true,
      }
    },
    messages: {
      email: "Please provide a valid e-mail address",
      email2: "Please enter the same e-mail address as above",
      country: "Country is a required field",
      },
 });



// This is for loading pages such as editor details into a templated page 
 function myData(div) {
   var myData =  window.location.search.toString().substring(1);
   if (div === "#categoryside") {
     myData = "catid="+$(div).attr('class')+"&limit=5";
     if ($(div).find(".jid").get(0)) {
       myData = myData + "&jid=" + $(div).find(".jid").text();
     };
     if ($(div).find(".dochead").get(0)) {
       myData = myData + "&dochead=" + $(div).find(".dochead").text();
     };
   };
   //alert( window.location.search.toString().substring(1) );
   $.ajax({
           type: "GET",
           url: '/cgi-bin/get_page',
	data: myData,
           /* load returned data into the iucrmess div and unfade the message and remove the loading message */
           success: function(data){
              $(div).html(data);
              //if (div === "#category") {
	      //myProcessPage();
	      //};
           },
           error: function(xhr, ajaxOptions, thrownError) {
             $(div).remove();
           }
        });
  
 };
// ^^^^^ 
// if this is an editor details template page 
 if ($("#editor").get(0)) {
   myData("#editor");
   hs.graphicsDir = '//scripts.iucr.org/javascript/highslide/graphics/';
   hs.wrapperClassName = 'wide-border';
   // close on mouse out
   hs.Expander.prototype.onMouseOut = function (sender) {
     sender.close();
   };
   // close if mouse is not over on expand (using the internal mouseIsOver property)
   hs.Expander.prototype.onAfterExpand = function (sender) {
    if (!sender.mouseIsOver) sender.close();
   };
 };

 if ($("#category").get(0)) {
   // alert ($("#category").get(0));
   myData("#category");
 }
 if ($("#home_hl").get(0)) {
   // alert ($("#category").get(0));
   myAjax("home_hl", "all", "#home_hl");
 }
 if ($("#categoryside").get(0)) {
   // alert ($("#category").get(0));
   myData("#categoryside");
 }

// ^^^^


// vvvv These lines are for pages where the "hd_navigatetitle" div is included 
 $("#hd_navigatesmall").find(".hd_navigatetitle").click(function () {
  $(this).find("img").toggleClass("hide");
  //$(this).parent().find(".sitelink").toggleClass("hd_navlink");
  $(this).parent().find(".sitelink").slideToggle(400);
  //$(this).toggleClass("closed");
 });
// ^^^^^

});
 // vvvv This function is be included on pages with dynamic content. At the moment that is iucrmessages, highlights and latest div
 function myAjax(dataset, jid, container) {
  $.ajax({
           type: "GET",
           url: '/cgi-bin/get_page',
           data: 'jid='+jid+'&dataset='+dataset,
           /* load returned data into the iucrmess div and unfade the message and remove the loading message */
           success: function(data){
            if (dataset == "mess") {
              $("#iucrmess").html(data);
            } else if (dataset == "meet") {
              $("#iucrmeet").html(data);
            } else if (dataset == "home_hl") {
              $("#home_hl").html(data);
	      $(".bhl_synopsis").dotdotdot({watch: "window", ellipsis: " ... "}); 
            } else if (dataset == "hl") {
              var  bhl;
              bhl = $(data).children().eq(0);
              var hl;
              hl = $(data).children().eq(1); 
              if (jid == "m") {
               $("#highlights").before("<h3>Articles from IUCrJ</h3>");
              }
              $("#highlights").before($(bhl).html());
              $("#highlights").html($(hl).html());
              //$("#highlights").html(data);
              $(".hl_synopsis").dotdotdot({watch: "window", ellipsis: " ... "}); 
              $(".hl_head").dotdotdot({watch: "window", ellipsis: " ... "}); 
              $(".bhl_synopsis").dotdotdot({watch: "window", ellipsis: " ... "}); 
              $(".bhl_head").dotdotdot({watch: "window", ellipsis: " ... "}); 
            } else { 
              $("#s"+dataset).html(data);
              $("#t"+dataset).html(data);
            }
            $(container).css("display", "block");
           },
           error: function(xhr, ajaxOptions, thrownError) {
             if (dataset == "mess") {
               $("#iucrmessages").remove();
             } else if (dataset == "meet") {
               $("#iucrmeetings").remove();
             } else if (dataset == "home_hl") {
               $("#home_hl").remove();
            } else if (dataset == "hl") {
               $("#highlights").remove();
	     } else {
               $("#s"+dataset).remove();
               $("#t"+dataset).remove();
             }        
           }
        });
 };
// ^^^^^ 


// added for control of buttons on mobile devices
$(".but_close").click(function () {
  $(this).parent().css("display","none");
  return false;
});

// Latest update 2017-01-27 (bm)
// var vat_rate={SE:"0.250", LT:"0.210", ES:"0.210", RO:"0.190", LU:"0.170", GR:"0.240", GB:"0.200", LV:"0.210", EE:"0.200", SI:"0.220", PT:"0.230", CY:"0.190", IT:"0.040", CZ:"0.210", SK:"0.200", IE:"0.230", BE:"0.210", FR:"0.200", MT:"0.180", BG:"0.200", DE:"0.190", NL:"0.210", HR:"0.250", PL:"0.230", HU:"0.270", AT:"0.200", DK:"0.250", FI:"0.240"};

// Latest update 2020-05-06 (bm) reflecting zero-rating in GB of online
// publications
var vat_rate={SE:"0.250", LT:"0.210", ES:"0.210", RO:"0.190", LU:"0.170", GR:"0.240", GB:"0.000", LV:"0.210", EE:"0.200", SI:"0.220", PT:"0.230", CY:"0.190", IT:"0.040", CZ:"0.210", SK:"0.200", IE:"0.230", BE:"0.210", FR:"0.200", MT:"0.180", BG:"0.200", DE:"0.190", NL:"0.210", HR:"0.250", PL:"0.230", HU:"0.270", AT:"0.200", DK:"0.250", FI:"0.240"};

var prices={pdf:"40.0", html:"40.0",both:"50.0"};

  var priceFunc = function(format, vat_per) {
    var ele = "#"+format+"vat";
    var newprice = ((100+vat_per)*prices[format])/100;
    $(ele).html(" plus VAT at " + vat_per + "%, total US $" + newprice);
  };

  var setPrices = function(country) {
    if (vat_rate[country] === undefined) {
     $("#pdfvat").html("");
     $("#htmlvat").html("");
     $("#bothvat").html("");
    } else {
     var vat_per = vat_rate[country]*100;
     priceFunc("pdf", vat_per);
     priceFunc("html", vat_per);
     priceFunc("both", vat_per);
   }
  };

  var setInitialPrice = function(obj) {
   var optionSelected = $(obj).find("[selected='selected']");
   var valueSelected  = optionSelected.attr("value");
   setPrices(valueSelected);
  };  

  var setPrice = function(obj) {
   var optionSelected = $("option:selected", obj);
   var valueSelected  = optionSelected.attr("value");
   setPrices(valueSelected);
  }; 


// for initial loading of page set correct vat 
$(document).ready(function(){
  if (window.location.href.indexOf("journals.iucr.org")>-1) return; //because price stuff was not in the original journals.iucr.org version of this file  
  $(".jsenabled").css("display", "none");

  setInitialPrice($("#buyform select[name='country']"));});
  // when changing country set vat
 $("#buyform select[name='country']").on("change", function(e) {setPrice(this)});
 // this bit is for starting to select a country then clicking outside the selection box
 $(document).mouseup(function (e) {
    var container = $("#buyform select[name='country']");
    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        setPrice(container);
    }
});


// added by cm 20151120 from email from ps 20151113
// updated by spw 20170401
/* extra onload page funcs to manipulate static html */
var spwPageFuncs = (function() {
  function _getWinDims()
  {
    var x = 0, y = 0;
    if (self.innerHeight) {
      x = self.innerWidth;
      y = self.innerHeight;
    }
    else if (document.documentElement && document.documentElement.clientHeight) {
      x = document.documentElement.clientWidth;
      y = document.documentElement.clientHeight;
    }
    else if (document.body) {
      x = document.body.clientWidth;
      y = document.body.clientHeight;
    }
    return [x,y];
  }
  function _isMouseOver(e, el) 
  {
    var ev = e||window.event;  
    var x = ev.pageX, y = ev.pageY;
    if (ev.targetTouches && ev.targetTouches[0]) {
        x = ev.targetTouches[0].pageX;
        y = ev.targetTouches[0].pageY;
    }
    if (x == undefined) {
        x=ev.clientX;
        y=ev.clientY;
    }
    if (x == undefined) return false;
    var obj=el;
    var curleft = curtop = 0;
    if (obj.offsetParent) {
        do {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    }
    var pos=[curleft,curtop];
    if (x<=(pos[0])) return false;
    else if (x>=(pos[0]+el.offsetWidth))  return false;
    else if (y<=(pos[1]))  return false;
    else if (y>=(pos[1])+el.offsetHeight)  return false;
    return true;
  }
  function _initAnchorEls()
  {
    var els=document.getElementsByTagName("a");
    if (!els||!els.length) return;
    var pdbLinkEls=[];
    var oldDOIlinkEls=[];
    var oldOpenAccessLinkEls=[];
    for (var e=0;e<els.length;e++)
    {
      if (!els[e].href) continue;
      if (els[e].href.search(/cgi\-bin\/cr\.cgi\?rm=pdb&/gi)>-1) {
          //pdbLinkEls.push(els[e]);
          
          // just change &amp;pdbId=6u95 to new universal doi link: e.g. "//dx.doi.org/10.2210/pdb"+pdbid+"/pdb"
          //var pdbid=els[e].href.replace(/^.+pdbId=([A-Za-z0-9][A-Za-z0-9][A-Za-z0-9][A-Za-z0-9]).*$/i, "$1");
          //els[e].href="//doi.org/10.2210/pdb"+pdbid+"/pdb";
      }
      else if (els[e].href.search(/\/\/dx\.doi\.org\/10\.1107/g)>-1&&els[e].innerHTML.search(/^doi:\s*10\.1107\//g)>-1) oldDOIlinkEls.push(els[e]);  
      else if (els[e].href.search(/\/openaccess_hybrid\.html/g)>-1) {
            oldOpenAccessLinkEls.push(els[e]);
      }
                    
    }
    //if (pdbLinkEls.length>0) _initPDBlinkEls(pdbLinkEls);
    if (oldDOIlinkEls.length>0) _fixDOIlinkEls(oldDOIlinkEls);
    if (oldOpenAccessLinkEls.length>0) _fixOAlinkEls(oldOpenAccessLinkEls);                 
  }
  function _fixDOIlinkEls(els)
  {
    if (!els||!els.length) return;
    for (var e=0;e<els.length;e++)
    { 
        var href=els[e].href;
        var ih=els[e].innerHTML;
        els[e].href=href.replace(/^(https?:)?\/\/dx\./, "https://");
        els[e].innerHTML=ih.replace(/^doi:\s*/, "https://doi.org/");
        
    }
                    
  }
  function _fixOAlinkEls(els)
  {
    if (!els||!els.length) return;
    var _jnl="";
    if (document.getElementById("jpage_c")) {
        _jnl="c";
    }
    else if (document.getElementById("jpage_b")) {
        _jnl="b";
    }
    else if (document.getElementById("jpage_a")) {
        _jnl="a";
    }
    else if (document.getElementById("jpage_j")) {
        _jnl="j";
    }
    else if (document.getElementById("jpage_s")) {
        _jnl="s";
    }
    else if (document.getElementById("jpage_d")) {
        _jnl="d";
    }
    else if (document.getElementById("jpage_f")) {
        _jnl="f";
    }
    else if (document.getElementById("jpage_x")) {
        _jnl="x";
    }
    else if (document.getElementById("jpage_m")) {
        _jnl="m";
    }
    else if (document.getElementById("jpage_e")) {
        _jnl="e";
    }
    
    if (_jnl=="e"||_jnl=="m"||_jnl=="x") return;
    
    if (_jnl=="") { // look at href
        var loc=window.location.href;
        var rex = /journals\.iucr\.org\/([abcdfjs])\//g;
        var m = rex.exec(loc);
        if (!m) return;
        _jnl=m[1];
        
    }
    
    for (var e=0;e<els.length;e++)
    { 
        els[e].href="//journals.iucr.org/"+_jnl+"/services/openaccess.html";
    }
                    
  }
  function _initPDBlinkEls(els)
  {
    if (!els||!els.length) return;
    var pdbw=document.createElement("div");
    pdbw.style.position="absolute";
    pdbw.style.display="none";
    pdbw.style.backgroundColor="#ffffff";
    pdbw.style.padding="4px";
    pdbw.style.zIndex=10000;
    pdbw.style.whiteSpace="nowrap";
    pdbw.className="small_popup_border";
    var ih="<img onclick=\"this.parentNode.style.display='none';return false;\" style=\"float:right;margin-left:5px;margin-bottom:5px;padding:3px;cursor:pointer;\" src=\"//journals.iucr.org/logos/buttonlogos/cross.png\" />";
    ih+="<a target=\"_blank\" href=\"\" ><img style=\"height:32px;vertical-align:middle;\" src=\"//journals.iucr.org/logos/organizations/PDBe-logo.png\" />&#160;&#160;PDBe</a><br />";
    ih+="<a style=\"height:32px;over-flow:hidden;\" target=\"_blank\" href=\"\" ><img style=\"margin-left:-3px;height:36px;vertical-align:middle;\" src=\"//journals.iucr.org/logos/organizations/PDBj-logo.png\" />&#160;&#160;PDBj</a><br />";
    ih+="<a target=\"_blank\" href=\"\" ><img style=\"height:32px;vertical-align:middle;\" src=\"//journals.iucr.org/logos/organizations/RCSB-PDB-logo.png\" />&#160;&#160;RCSB</a><br />";
    ih+="<a style=\"line-height:32px;\" target=\"_blank\" href=\"\" ><img style=\"width:40px;vertical-align:middle;\" src=\"//publcif.iucr.org/widgets/images/uniprot.png\" />&#160;&#160;UniProt</a>";
    pdbw.innerHTML=ih;	
    document.body.appendChild(pdbw);
    pdbw.url="";
    pdbw.show=function(ev, el) {
      var showme=true;
      if (!el||!el.url) return;
      if (!this.el) this.el=el;
      if (this.el==el&&this.url==this.el.url) {
	if (this.style.display=="block") showme=false;
      }
      else {
	this.el=el;
	this.url=el.url;
      }
      if (!showme) {
	this.style.display="none";
      }
      else {
	if (!this.ancs) this.ancs=this.getElementsByTagName("a");
	this.ancs[0].href=this.url+"&pdbSite=PDBe";
	this.ancs[1].href=this.url+"&pdbSite=PDBj";
	this.ancs[2].href=this.url+"&pdbSite=RCSB";
    
    var pdbid=this.url.replace(/^.+pdbId=([A-Za-z0-9][A-Za-z0-9][A-Za-z0-9][A-Za-z0-9]).*$/i, "$1");
    this.ancs[3].href="//publcif.iucr.org/widgets/annotation/uniprot.php?pdbid="+pdbid;
    
	this.style.display="block";
	ev=ev||window.event;
	var x = ev.pageX, y = ev.pageY;
	if (ev.targetTouches && ev.targetTouches[0]) {
	  x = ev.targetTouches[0].pageX;
	  y = ev.targetTouches[0].pageY;
	}
	var wd=_getWinDims();
	var xadj=-12;
	var yadj=12;
	var cx=ev.clientX;
	var cy=ev.clientY;
	if (cy+this.offsetHeight>wd[1]) yadj-=(this.offsetHeight+24);
	if (cx+this.offsetWidth>wd[0]) xadj-=(wd[0]-cx);
	if (x==undefined) {
	  x=ev.clientX;
	  y=ev.clientY;
	  this.style.position="fixed";
	}
	this.style.top=(y+yadj)+"px";
	this.style.left=(x+xadj)+"px";
      }
    };
    for (var e=0;e<els.length;e++)
    {
      var href=els[e].href;
      els[e].href="javascript::void(0)";
      els[e].url=href; 
      els[e].pdbselect=pdbw;
      els[e].ontouchstart=els[e].onmousedown=function(ev) {
	this.pdbselect.show(ev, this);	    
	return false;
      };
    }
    if (window.addEventListener) {
      window.addEventListener('resize', function() {pdbw.style.display="none";}, false); 
      window.addEventListener('scroll', function() {pdbw.style.display="none";}, false);
    }
    else if (window.attachEvent) {
      window.attachEvent('onresize', function() {pdbw.style.display="none";});
      window.attachEvent('onscroll', function() {pdbw.style.display="none";});
    }
  }
  var _srchLinkPup;
  function _createHeaderSrchLink()
  {
      var hdsrch=document.getElementById("hd_search");
        if (hdsrch) {
            var i=document.createElement("div");
            i.className="searchToolsLink";
            i.setAttribute("title", "Advanced search");
            i.puphtml="<br/><a href=\"//scripts.iucr.org/cgi-bin/full_search\">Advanced search</a><br /><a href=\"//journals.iucr.org/services/full_search_help.html\">Help</a>";
            i.onclick=function(e) {
                
                _initSrchLinkPopup();
                if (document.getElementById('hd_words').value!="") {
                    _srchLinkPup.show(e, this, "<b style=\"color:#000000;\">Search</b><br /><a href=\"javascript:void(0)\" onmouseup=\"document.getElementById('hd_words').value='';\">Clear</a>"+this.puphtml); 
                }
                else {
                    _srchLinkPup.show(e, this, "<b style=\"color:#000000;\">Search</b>"+this.puphtml);
                }
            }
            hdsrch.appendChild(i);
        }
  }
  function _createFooterSrchLink()
  {
      // TODO: not worth it?
  }
  function _initSrchLinkPopup()
  {

    if (_srchLinkPup) return;
    
    _srchLinkPup=document.createElement("div");
    _srchLinkPup.style.position="absolute";
    _srchLinkPup.style.display="none";
    _srchLinkPup.style.width="200px";
    _srchLinkPup.style.backgroundColor="#ffffff";
    _srchLinkPup.style.padding="5px";
    _srchLinkPup.style.paddingBottom="10px";
    _srchLinkPup.style.zIndex=1000;

    _srchLinkPup.className="popup";
    document.body.appendChild(_srchLinkPup);

    var closebut=document.createElement("img");
    closebut.style.cssFloat="right";
    closebut.style.marginLeft="5px";
    closebut.style.marginBottom="5px";
    closebut.style.padding="3px";
    closebut.style.cursor="pointer";
    closebut.src="//journals.iucr.org/logos/buttonlogos/cross.png";
    closebut.onclick=function(){_srchLinkPup.style.display='none';return false;};
    _srchLinkPup.appendChild(closebut);

    var contents=document.createElement("div");
    contents.style.position="relative";
    contents.style.width="180px";
    _srchLinkPup.appendChild(contents);
    _srchLinkPup.content=contents;


    _srchLinkPup.show=function(ev, el, ihtml) {
        var showme=true;
        if (!el) return;
        if (!this.el) this.el=el;
        if (this.el==el) {
        if (this.style.display=="block") showme=false;
        }
        else {
        this.el=el;
        }
        if (!showme) {
        this.style.display="none";
        }
        else {
        this.content.innerHTML=ihtml;
        this.style.display="block";
        ev=ev||window.event;
        var x = ev.pageX, y = ev.pageY;
        if (ev.targetTouches && ev.targetTouches[0]) {
        x = ev.targetTouches[0].pageX;
        y = ev.targetTouches[0].pageY;
        }
        var wd=_getWinDims();
        
        var xadj=-20;
        var yadj=12;
        var cx=ev.clientX;
        var cy=ev.clientY;
        if (cy+this.offsetHeight>wd[1]) yadj-=(this.offsetHeight+24);
        if (cx+this.offsetWidth>wd[0]) xadj-=this.offsetWidth-(wd[0]-cx);
        if (x==undefined) {
        x=ev.clientX;
        y=ev.clientY;
        this.style.position="fixed";
        }
        this.style.top=(y+yadj)+"px";
        var l=(x+xadj);
        if (l<0) l=0;
        this.style.left=l+"px";
        }
    };
    
    _srchLinkPup.onmouseout=function(e){
        if (!_isMouseOver(e, this)&&!_isMouseOver(e, this)) {
                            this.style.display="none"; 
        }
    };

    if (window.addEventListener) {
        window.addEventListener('resize', function() {_srchLinkPup.style.display="none";}, false); 
        window.addEventListener('scroll', function() {_srchLinkPup.style.display="none";}, false);
    }
    else if (window.attachEvent) {
        window.attachEvent('onresize', function() {_srchLinkPup.style.display="none";});
        window.attachEvent('onscroll', function() {_srchLinkPup.style.display="none";});
    }
  }
  function _addPrivacyLink() {
    // may 2018 - cookie links - add if not there
    var fdiv=document.getElementById("ft_linkbar");
    if (fdiv) {
        var haveplnk=false;
        var ancs=fdiv.getElementsByTagName("a");
        for (var a=0;a<ancs.length;a++) {
            if (ancs[a].href.search(/privacy\.html/i)>-1) {
                haveplnk=true;
                break;
            }
        }
        if (!haveplnk) {
            var plnk=document.createElement("a");
            plnk.setAttribute("href","//journals.iucr.org/services/privacy.html");
            plnk.setAttribute("title","Privacy and cookies");
            fdiv.appendChild(plnk);
            plnk.innerHTML="Privacy and cookies";
        }
        
    }
  }
  return {
    initLinkEls: function() {
      _createHeaderSrchLink();
      //_createFooterSrchLink();
      _initAnchorEls();
      _addPrivacyLink();
    }
  };
})();  

// Added by cm May 2017
function addTrendMD() {
 // var element = document.querySelector('meta[name="citation_journal_title"]');
 // var content = element && element.getAttribute("content");
  // if (content == "IUCrJ") {
  // Only applies to articles
  var iucrart = document.getElementById('iucr-art');
  if (iucrart) {
    var trenddiv = document.createElement('div');
    trenddiv.id = 'trendmd-suggestions';

    var trenddivstyle = document.createElement('style');
    trenddivstyle.innerHTML = '.trendmd-widget-container{padding:1em !important;border: 1px solid #ddd !important;border-radius:5px !important;margin: 2.5em 0em 1.5em 0em !important;font-family: Verdana, Arial, Helvetica, sans-serif !important;}\n.trendmd-widget-footer-inner-bottom {display:none !important;}';

    var trendmdscript = document.createElement('script');
    trendmdscript.setAttribute('defer','defer');
    trendmdscript.setAttribute('src','//js.trendmd.com/trendmd.min.js');
    trendmdscript.setAttribute('data-trendmdconfig','{"element":"#trendmd-suggestions"}');

    var jih = document.getElementsByClassName('jinfo_header')[1];
    if (jih) {
      jih.parentNode.appendChild(trenddivstyle);
      jih.parentNode.appendChild(trenddiv);
    }

    var footer = document.getElementById('footer');
    if (footer) { footer.parentNode.appendChild(trendmdscript); }
  }
 // }
}

/* init extra onload page funcs once dom content loaded */
if (window.addEventListener) window.addEventListener('load', function() {spwPageFuncs.initLinkEls();}, false);  
else if (window.attachEvent) window.attachEvent('onload', function() {spwPageFuncs.initLinkEls();});

if (window.addEventListener) window.addEventListener('load', function() {addTrendMD();}, false);  
else if (window.attachEvent) window.attachEvent('onload', function() {addTrend(MD);});

