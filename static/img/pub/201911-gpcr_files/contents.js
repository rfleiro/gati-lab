// toggles between detailed and concise 
var imgselect = ".toggleview_img";

var myToggleViewHide = function() {
  //alert($( document ).width());
  //  $('.ica_bodyleft').toggleClass('hide');
  $('.online_date').toggleClass('hide');
  $('.ica_bodyleft').css('display','none');
  $('.ica_readmore').css('display','none');
  $('.jci_medium').css('display','none');
  $('.ica_synopsis').css('display','none');
  $('.ica_abstract').css('display','none');
  $('.ica_codelinks').css('display','none');
  $('.ica_header > br').toggleClass('hidebr');;
  //$('.doicomma').css('display','inline');
  $('.doicomma').toggleClass('hide');
  $('.separator').css('display','none');
  $('.ica_bodyright').css('margin-bottom','1em');
  

  $('h3.alt').css('display','inline');

  //$('h2').css('margin-top','0em');
  //$('ica_title>h3>a').css('display','inline');
  //$('ica_title>h3>a').css('font-size','100%');
  $('div.ica_title').css('display','inline');
  $('div.ica_title>h3.atl').css('display','inline');
  $('#jpage_m #pagebody .ica_title h3 a').css('font-size','110%');
  //  $('div.ica_authors').css('display','inline');
  // narrow view need to remove some elements in concise format
  $('.hl_title').toggleClass('hidenarrow');
  $('div.jinfo_topiclogo').toggleClass('hidenarrow');
  $('div.issuecontentsarticle > div.ica_header > div.ica_headerleft > div').toggleClass('hidenarrow');
  $('div.issuecontentsarticle > div.ica_header ').toggleClass('narrowshift');
  $('h2.issue_papertype').toggleClass('narrowshift');
  

}
var myToggleViewShow = function() {
  //alert($( document ).width());
  //  $('.ica_bodyleft').toggleClass('hide');
  $('.online_date').toggleClass('hide');
  $('.ica_bodyleft').css('display','block');
  $('.ica_readmore').css('display','block');
  $('.ica_synopsis').css('display','block');
  $('.ica_abstract').css('display','block');
  $('.jci_medium').css('display','inline');
  $('.ica_codelinks').css('display','block');
   $('.separator').css('display','block');
  $('.ica_bodyright').css('margin-bottom','0em');
  $('.ica_header > br').toggleClass('hidebr');;
  //$('.doicomma').css('display','none');
  $('.doicomma').toggleClass('hide');
  // narrow view need to remove some elements in concise format
  $('div.ica_headerleft > div.jinfo_topiclogo > span.hl_title').toggleClass('hidenarrow');
  $('div.jinfo_topiclogo').toggleClass('hidenarrow');
  $('div.issuecontentsarticle > div.ica_header > div.ica_headerleft > div').toggleClass('hidenarrow');
  $('div.issuecontentsarticle > div.ica_header ').toggleClass('narrowshift');
  $('h2.issue_papertype').toggleClass('narrowshift');



  //$('h2').css('margin-top','2.5em');
  $('h3.alt').css('display','block');
  // $('ica_title>h3>a').css('font-size','150%');
  //  $('div.ica_title').css('display','block');
  $('div.ica_title>h3.atl').css('display','block');
  $('#jpage_m #pagebody .ica_title h3 a').css('font-size','150%');
  $('div.ica_authors').css('display','block');


}
var Cookie = 0;
if  (typeof myDefaultDisplay !== "undefined") {
  Cookie =  myDefaultDisplay;
  //alert(Cookie);
};
var myToggleView = function() {
  //$('.ref_lookup_'+color).toggleClass("ref_lookup");
  // var Cookie = $.cookie('iucr_content_view');
  if (Cookie == 0) {
    $(imgselect).attr("src",'//journals.iucr.org/logos/buttonlogos/plus.png');
    $('span.toggleview>a').html("Detailed format");
   myToggleViewHide();
    Cookie = 1;
  } else {
    Cookie = 0;
    $(imgselect).attr("src",'//journals.iucr.org/logos/buttonlogos/minus.png');
    $('span.toggleview>a').html("Concise format");
    myToggleViewShow();
  }
  // store cookie
  // $.cookie('iucr_content_view',Cookie,{expires: 365, path: '/'}); 
}
  

// checks for reference highlighting switched on 
function checkView () {
  // var Cookie = $.cookie('iucr_content_view');
  //alert("hi2 Cookie " + Cookie+ ' ' + imgselect);
  if (Cookie) {
    if (Cookie == 1) {
      $(imgselect).attr("src",'//journals.iucr.org/logos/buttonlogos/plus.png');
      $('span.toggleview>a').html("Detailed format");
      myToggleViewHide();
      //$('.ref_lookup_'+color).toggleClass("ref_lookup");
    }
  } else {
    Cookie = 0;
  }
  // store as cookie
  // $.cookie('iucr_content_view',Cookie,{expires: 365, path: '/'});
}

$(document).ready(function(){
		    
		    //		    $('.toggleview').css('display','inline');
		    $('.toggleview').click(function(){
					     //alert("hi");
					     myToggleView();
					     return false;
					   });
		    //$('<span class="doicomma hide">, </span>').insertAfter(".ica_pages");
		    $('<span class="doicomma hide">, </span>').insertBefore(".ica_doi");
		    checkView();  
		  });
