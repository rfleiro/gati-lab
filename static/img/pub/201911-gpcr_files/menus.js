//$("#art_leftbox").css('position', 'static');

//if ($("#art_leftbox").outerHeight() === 0) {
//  $( "#art_leftbox" ).css('height','374px');
//};



//var iconheight = $( ".art_icon").first().outerHeight();
var iconheight = 34;
//alert('iconheight '+iconheight);
var bubnum = $( ".af_vertical>.bubbleInfo").length;
//alert('bubnum '+bubnum);
// seems to need to take one off?
// var bubheight = (bubnum - 1)* iconheight;
var bubheight = bubnum * iconheight;
//var bubheight = (bubnum - 1)* iconheight;
bubheight = bubheight +"px";
//alert ('bub height'+bubheight);

$( "#art_leftbox" ).css('height',bubheight);
//alert($( "#art_leftbox" ).css('height'));




var menu =  $( "#art_leftbox" );
//var topIcon =  $( "#contentssz" );
var results = jQuery("#results");
var menuHeight = $( menu ).outerHeight();
var winHeight =  $( window ).height();
var docHeight = $( document ).height();
var menuOffset = $( menu ).offset.top;
var headerHeight = $( '#header' ).outerHeight();
var footerHeight = $( '#journalsocialmedia' ).outerHeight() + $( '#footersearch' ).outerHeight() + $( '#footer' ).outerHeight();
//var spaceNeeded = headerHeight + menuHeight + 50;
var spaceNeeded = headerHeight + menuHeight + 30;
var menuTop = $( menu ).css('top');
var pora;

var winScroll = $(window).scrollTop();
var spaceAvail = docHeight-winScroll;
var menuTopTest = spaceAvail - footerHeight - headerHeight;

var bottomDelta = 150;
if ($(".article").get(0)) {
  //  alert(bottomDelta);
  bottomDelta = 130;
 };
//alert( menuTopTest +  " " + bubheight  + " 132 " + spaceNeeded+ " " + menuTopTest+ " "+ footerHeight+ " "+headerHeight);

var menuSet = function() {
  winHeight =  $( window ).height();
  docHeight = $( document ).height();
  menuOffset = $( menu ).offset.top;
  menuTop = $( menu ).css('top');
  winScroll = $(window).scrollTop();
  spaceAvail = docHeight-winScroll;
  menuTopTest = spaceAvail - footerHeight - headerHeight;
  footerHeight = $( '#journalsocialmedia' ).outerHeight() + $( '#footersearch' ).outerHeight() + $( '#footer' ).outerHeight();
  // cope with height of side bar when it moves to underneath the issue list
  if ( $( document ).width() < 768) {
    footerHeight = footerHeight + $('#side').outerHeight();
  }
  if (winHeight > spaceNeeded) {
    // alert('resetting');
    $(menu).css('position', 'fixed');
    $(menu).css('top', '12em');
    $(menu).css('left', '2em');
    pora = 'f';
  } else {
    $(menu).css('position', 'absolute');
    $(menu).css('top', '1em');
    $(menu).css('left', '1.0em');
    pora = 'a';
  }
  if (pora === "f") {
    if (menuTopTest < spaceNeeded) {
      
      $(menu).css('top', bottomDelta - spaceNeeded+menuTopTest) 
      //      $(menu).css('top',132 - spaceNeeded+menuTopTest) 
    }
  }
  //results.html('<p> position '+$(menu).css('position') + '<br/> document height ' + docHeight + '<br/> windowheight ' + winHeight + '<br/> menuheight '+ menuHeight + '<br/> menu top test ' +menuTopTest + '<br/> scrolltop'  + $(window).scrollTop() + '<br/> header height '  + headerHeight  + '<br/> space needed '+ spaceNeeded+ '<br/> menu top'+ menuTop + '<br/> footer height ' + footerHeight + '</p>'); //100                   



};

menuSet();
$( window ).scroll(function() {
                     menuSet();
		   });

$( window ).resize(function() {
		     menuSet();
		     
		   });	  		  
//alert('window height = ' + $( window ).height() +' <br/>document height = '+ $( document ).height()+' <br/>menu height1 = '+ $(menu).innerHeight() +' <br/>menu height2 = '+ $( menu ).outerHeight());	  
			  
//$(menu).css('position', 'fixed');			  
//$(menu).css('position', 'absolute');			  
//alert('window height = ' + $( window ).height() +' <br/>document height = '+ $( document ).height()+' <br/>menu height1 = '+ $(menu).innerHeight() +' <br/>menu height2 = '+ $( menu ).outerHeight());	  
