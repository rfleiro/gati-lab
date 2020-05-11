/* one onload function to manipulate the display of imported sup html
 * plus a window 'message' event handler if using cifmol.js to load dynaimic cif images
 */
/*
TODO - this now adds powerpoint and author info stuff, as well as crossmark popup - needs tidying up a bit!
TODO - modulize - as this keeps growing to tweek any content!
*/

if (window.addEventListener) window.addEventListener('load', function() {sup_cif_init();}, false);  
else if (window.attachEvent) window.attachEvent('onload', function() {sup_cif_init();});


function sup_cif_init() {

    
    if (window.location.href.indexOf("cgi-bin/citedin")>-1) return;

    var siteurl="//publcif.iucr.org"; // might have to use my vps if journals convert to https before publcif.iucr.org
    //if (window.location.href.indexOf("http://cif.publcryst.co.uk")>-1) siteurl="//publcif.iucr.org"; //siteurl="//cif.publcryst.co.uk";
    if (window.location.href.indexOf("//publcryst/")>-1) siteurl="//publcryst/";
 
    var jlcol="#990000";
    var jnl="";
    if (document.getElementById("jpage_e")) {
        jlcol="#401434";
        jnl="e";
    }
    else if (document.getElementById("jpage_c")) {
        jlcol="#c30f00";
        jnl="c";
    }
    else if (document.getElementById("jpage_b")) {
        jlcol="#263a15";
        jnl="b";
    }
    else if (document.getElementById("jpage_a")) {
        jlcol="#003366";
        jnl="a";
    }
    else if (document.getElementById("jpage_j")) {
        jlcol="#43260a";
        jnl="j";
    }
    else if (document.getElementById("jpage_s")) {
        jlcol="#162d41";
        jnl="s";
    }
    else if (document.getElementById("jpage_d")) {
        jlcol="#660000";
        jnl="d";
    }
    else if (document.getElementById("jpage_f")) {
        jlcol="#1f481d";
        jnl="f";
    }
    else if (document.getElementById("jpage_x")) {
        jnl="x";
    }
    else if (document.getElementById("jpage_m")) {
        jnl="m";
    }
    //jnl="b";
    document.jlcol=jlcol;
   
  // June 2016 - get coedid from meta info first and add PPT link
    var coedid=""; 
    var sect="";
    var doi="";
    var pdate="";
    var metai=document.getElementsByTagName("meta");
    for (var m=0;m<metai.length;m++) {
        if (metai[m].name=="DC.link") {
            var cid=metai[m].content+"";
            if (cid.search(/\?[a-z][a-z]\d\d\d\d$/ig)>-1) {
                coedid=cid.substr(cid.length-6);
            }
            else if (cid.search(/\?[a-z]\d\d\d\d\d$/ig)>-1) {
                coedid=cid.substr(cid.length-6);
            }
            else if (cid.search(/cnor=[a-z][a-z]\d\d\d\d$/ig)>-1) {
                coedid=cid.substr(cid.length-6);
            }
            else if (cid.search(/cnor=[a-z]\d\d\d\d\d$/ig)>-1) {
                coedid=cid.substr(cid.length-6);
            }
        }
        else if (metai[m].name=="prism.section") {
            sect=metai[m].content;
        }
        else if (metai[m].name=="DC.identifier") {
            doi=metai[m].content.replace(/^doi:/i, "");
        }
        else if (metai[m].name=="DC.date") {
            pdate=metai[m].content;
        }
        if (coedid!=""&&sect!=""&&doi!=""&&pdate!="") break;
    }

    if (coedid=="") {
        var wh=window.location.href;
        if (wh.search(/\?[a-z][a-z]\d\d\d\d$/ig)>-1) {
            coedid=wh.substr(wh.length-6);
        } 
        else if (wh.search(/cnor=[a-z][a-z]\d\d\d\d$/ig)>-1) {
            coedid=wh.substr(wh.length-6);
        }
        else if (wh.search(/cnor=[a-z]\d\d\d\d\d$/ig)>-1) {
            coedid=wh.substr(wh.length-6);
        }
    }
    // following handles cross-domain requests:
    if (window.addEventListener) window.addEventListener('message', function(e) {sup_cifmol_init(e);}, false);  
    else if (window.attachEvent) window.attachEvent('onmessage', function(e) {sup_cifmol_init(e);});
    document.coedid=coedid;
    
    // nov 2017 - popups for access links
    try {
        var accdivs=document.getElementsByClassName("oalogotext");
        if (accdivs&&accdivs.length) {
            for (var ad=0;ad<accdivs.length;ad++) {
                var t=accdivs[ad].getAttribute("title");
                if (t&&t!="") {
                    if (t.indexOf("To purchase a pay per view")>-1) {
                        accdivs[ad].setAttribute("title", "");
                        var accancs=accdivs[ad].getElementsByTagName("a");
                        for (var adc=0;adc<accancs.length;adc++) {
                            var at=accancs[adc].getAttribute("title");
                            if (!at||at=="") at="Purchase pay per view version";
                            else if (at.indexOf("Associates")>-1) at="IUCr Associates download";
                            accancs[adc].poptitle="<a style=\"color:"+jlcol+";\"href=\""+accancs[adc].href+"\"><b>"+at+"</b></a>";
                            accancs[adc].setAttribute("title", "");
                            accancs[adc].onmouseover=function(e) {
                                _initHoverPopup();
                                if (_hoverPup.el==this&&_hoverPup.style.display=="block") {
                                    return false;
                                }
                                _hoverPup.show(e, this, this.poptitle);
                                return false;
                            };
                            accancs[adc].onmouseout=function(e) {
                            if (!_isMouseOver(e, this)&&!_isMouseOver(e, _hoverPup)) {
                                _hoverPup.style.display="none"; 
                            }
                            return false;
                            };
                        }
                    }
                }
            }
            
        }
    
    }
    catch (err) {}
    
    // nov 2016 - citedby
    if (coedid=="") return;
    var citedbyIfr=document.createElement("iframe");
    citedbyIfr.style.display="none";
    citedbyIfr.src=siteurl+"/orcid/citations.php?artid="+coedid+"&callback="+encodeURIComponent("#citedby");
    //citedbyIfr.src="//publbio.iucr.org/orcid/citations.php?artid="+coedid+"&callback="+encodeURIComponent("#citedby");
    document.body.appendChild(citedbyIfr);
    
    var _hoverPup;
    // aug 2016 - author details popup including orcids
    var _auLinkPup;
    //var _srchLinkPup;
   
    var orcifr=document.createElement("iframe");
    orcifr.style.display="none";
    var cb="#orcidList";
    //orcifr.src="http://publcif.iucr.org/orcid/getorcidlist.php?artid="+coedid+"&callback="+encodeURIComponent(cb); //+"&type=cifmol";
    //orcifr.src="http://cif.publcryst.co.uk/orcid/getorcidlist.php?artid="+coedid+"&callback="+encodeURIComponent(cb);
    orcifr.src=siteurl+"/orcid/getorcidlist.php?artid="+coedid+"&callback="+encodeURIComponent(cb); //+"&type=cifmol";
    document.body.appendChild(orcifr);
  
    var aug_div=document.getElementById("aug");
    if (aug_div) { // full article page
        var aug_divs=aug_div.getElementsByTagName("div");
        var au_div;
        var aff_div;
        for (var d=0;d<aug_divs.length;d++) {
            if (aug_divs[d].className&&aug_divs[d].className=="au") {
                au_div=aug_divs[d];
            }
            else if (aug_divs[d].id&&aug_divs[d].id=="aff") { // odd that affs have an id but au div doesnt?
                aff_div=aug_divs[d];
            }
            if (au_div&&aff_div) break;
        }
        // get affiliation list:
        var affs=[];
        var coremails=[];
        if (aff_div) {
            var affids=aff_div.getElementsByTagName("a");
            for (var a=0;a<affids.length;a++) {
                if (affids[a].id&&affids[a].id.search(/^oid[A-Za-z0-9]+$/ig)>-1) {
                    var x=affids[a].nextSibling;
                    var txt="<div style=\"margin:0;margin-bottom:7px;\"><span style=\"color:"+jlcol+"\">"+affids[a].innerHTML+"</span>";
                    while (x)
                    {
                        if (x.nodeType==3) // txt
                        {
                            txt+=x.nodeValue;
                        }
                        else if (x.nodeType==1) {
                            if (x.nodeName=="a"||x.nodeName=="A") {
                                x=null;
                                break;
                            }
                            else {
                                txt+=x.innerHTML;
                            }
                        }
                        x=x.nextSibling;
                    }
                    affs[affids[a].id]=txt.replace(/,\s+and\s*$/, "").replace(/,\s*$/, "")+"</div>";
                    
                }
                else if (affids[a].href&&affids[a].href.search(/^mailto:.+$/ig)>-1) {
                    coremails.push("<a style=\"color:"+jlcol+"\" href=\""+affids[a].href+"\">"+affids[a].innerHTML+"</a>");
                }
                else if (affids[a].href&&affids[a].href.search(/^(http:)?\/\/[^\/]+\/mailto:.+$/ig)>-1) { // fix bug in iucr proxied html
                    var nhref=affids[a].href.replace(/^(http:)?\/\/[^\/]+\//i, "");
                    affids[a].href=nhref;
                    coremails.push("<a style=\"color:"+jlcol+"\" href=\""+nhref+"\">"+affids[a].innerHTML+"</a>");
                }
            }    
        }
    
        if (au_div) {
            // get all the ancchors:
            var auends=[];
            var auels=[];
            var aidx=-1; 
            var corc=0;
            var aels=au_div.getElementsByTagName("a");
            for (var a=0;a<aels.length;a++) {
                if (!aels[a].href) continue;
                if (aels[a].href.search(/scripts\.iucr\.org\/cgi\-bin\/citedin\?search_on=name/ig)>-1) {
                    aidx++;
                    
                    aels[a].pupname=aels[a].innerHTML; 
                    aels[a].pupaffs="";
                    aels[a].pupnotes="";
                    aels[a].auidx=aidx;
                    aels[a].onclick=function(e) {
                    _initAuLinkPopup();
                    
                    if (!this.orcid) { // orcid may not have arrived yet so remake htm until this.orcid has been set
                        //var htm="<b><a style=\"color:"+jlcol+"\" href=\""+this.href+"\">"+this.pupname+"</a></b><br/>";
                        var htm="<b><a style=\"color:"+jlcol+"\" href=\""+this.href+"\">"+this.pupname+"</a></b><br />";
                        var olist=document.body.orcidList;
                        if (olist) {
                            this.orcid="";
                            if (olist[this.auidx]&&olist[this.auidx].length==19) {
                                this.orcid=olist[this.auidx];
                                htm+="<div style=\"margin-top:.7em;\"><a style=\"color:"+jlcol+"\" href=\"https://orcid.org/" +olist[this.auidx]+ "\" target=\"_blank\"><img style=\"vertical-align:middle;\" alt=\"ORCID logo\" src=\"https://orcid.org/sites/default/files/images/orcid_16x16.png\" width=\"16\" height=\"16\"/> <span id=\"orcid_url_label\">https://orcid.org/</span>" +olist[this.auidx]+"</a></div>";
                                
                            }
                        }
                        var ilist=document.body.iucridList;
                        if (ilist) {
                            if (ilist[this.auidx]&&ilist[this.auidx].search(/^\d+$/)>-1) {
                                htm="<a href=\"//scripts.iucr.org/cgi-bin/detailed_display?id="+ilist[this.auidx]+"\" target=\"_blank\"><img style=\"vertical-align:middle;max-width:30px;max-height:30px;border-radius:3px;margin-right:5px;margin-top:1px;\" src=\""+siteurl+"/orcid/getiucrphoto.php?iucrid="+ilist[this.auidx]+"\" /></a>"+htm;
                                
                                htm+="<div style=\"margin-top:.7em;\"><a style=\"color:"+jlcol+"\" href=\"//scripts.iucr.org/cgi-bin/detailed_display?id="+ilist[this.auidx]+"\" target=\"_blank\"><img src=\"//publcif.iucr.org/widgets/images/people_24.png\" style=\"vertical-align:middle;width:18px;height:18px;\"> IUCr ID "+ilist[this.auidx]+"</a></div>";
                                
                            }
                        }
                            
                        htm+="<div style=\"margin-top:1em;margin-bottom:1em;\"><a style=\"display:inline-block;text-align:center;background:transparent;padding:.5em;border:1px solid #aaa;border-bottom:2px solid #aaa;border-color:#aaa;border-bottom-style:outset;font-weight:bold;border-radius:5px;color:"+jlcol+"\" href=\""+this.href+"\">Other articles by this author</a></div>";
                        if (this.pupaffs!="") htm+="<div style=\"margin-top:1em;\">"+this.pupaffs+"</div>";
                        if (this.pupemail&&this.pupemail!="") htm+="<div style=\"margin-top:1em;\">E-mail: "+this.pupemail+"</div>";
                        if (this.pupnotes!="") htm+="<div style=\"margin-top:1em;\">"+this.pupnotes+"</div>";
                        this.puphtml=htm;
                    }
                    _auLinkPup.show(e, this, this.puphtml);
                    return false;
                };
                auels.push(aels[a]);
                auends.push(aels[a]);
            }
            else if (aels[a].href.search(/#oid[A-Za-z0-9]+$/ig)>-1) {
                var oid=aels[a].href.replace(/^.*#(oid[A-Za-z0-9]+)$/ig, "$1");
                if (affs[oid]) auels[aidx].pupaffs+=affs[oid];
                aels[a].plink=auels[aidx];
                aels[a].onclick=function(e){return this.plink.onclick(e);};
                auels[aidx].pupname+=aels[a].innerHTML;
                auends[aidx]=aels[a];
            }
            else if (aels[a].href.search(/^.*#cor$/ig)>-1) {
                if (coremails[corc]) auels[aidx].pupemail=coremails[corc];
                aels[a].plink=auels[aidx];
                aels[a].onclick=function(e){return this.plink.onclick(e);};
                auels[aidx].pupname+=aels[a].innerHTML;
                corc++;
                auends[aidx]=aels[a];
            }
            else if (aels[a].href.search(/^.*#aunoteanch[A-Za-z0-9]+$/ig)>-1) {
                var nid=aels[a].href.replace(/^.*#(aunoteanch[A-Za-z0-9]+)$/ig, "$1");
                aels[a].plink=auels[aidx];
                aels[a].onclick=function(e){return this.plink.onclick(e);};
                var nel=document.getElementById(nid);
                if (nel&&nel.parentNode) {
                    var n=nel.parentNode.innerHTML;
                    auels[aidx].pupnotes+="<div style=\"margin:0;margin-bottom:7px;\">"+n.replace(/<a\s[^>]*><\/a>/ig, "").replace(/<a\s[^>]*>/ig, "<a style=\"color:"+jlcol+"\" >")+"</div>";
                    auels[aidx].pupname+=aels[a].innerHTML;
                }
                auends[aidx]=aels[a];
            }
          }
       // console.log(auends);
        document.body.auels=auends;
        }
        
    } // end have aug_div
    else {
        maus=[];
        var aidx=-1;
        
        for (var m=0;m<metai.length;m++) {
            if (metai[m].name=="citation_author") {
                aidx++;
                maus.push({"mname": metai[m].content+"", "maffs":"", "memail":""});
            }
            else if (aidx>-1&&metai[m].name=="citation_author_institution") {
                
                maus[aidx].maffs+="<div style=\"margin:0;margin-bottom:7px;\">"+metai[m].content+"</div>";
            }
            else if (aidx>-1&&metai[m].name=="citation_author_email") {
                
                maus[aidx].memail+="<a style=\"color:"+jlcol+"\" href=\"mailto:"+encodeURIComponent(metai[m].content)+"\">"+metai[m].content+"</a> "
            }
        }
        var au_div;
        var divs=document.getElementsByTagName("div");
        for (var d=0;d<divs.length;d++) {
            if (divs[d].className&&divs[d].className=="ica_authors") {
                au_div=divs[d];
                break;
            }
        }
        if (au_div&&maus&&maus.length>0) {
            var auels=[];
            var aidx=-1; 
            var aels=au_div.getElementsByTagName("a");
            for (var a=0;a<aels.length;a++) {
                if (!aels[a].href) continue;
                if (aels[a].href.search(/scripts\.iucr\.org\/cgi\-bin\/citedin\?search_on=name/ig)>-1) {
                    aidx++;
                    aels[a].pupname=aels[a].innerHTML; 
                    aels[a].pupaffs=maus[aidx].maffs;
                    aels[a].pupemail=maus[aidx].memail;
                    aels[a].pupnotes="";
                    aels[a].auidx=aidx;
                    aels[a].onclick=function(e) {
                        _initAuLinkPopup();
                        if (!this.orcid) { // orcid may not have arrived yet so remake htm until this.orcid has been set
                            var htm="<b><a style=\"color:"+jlcol+"\" href=\""+this.href+"\">"+this.pupname+"</a></b><br/>";
                            
                            var olist=document.body.orcidList;
                            if (olist) {
                                this.orcid="";
                                if (olist[this.auidx]&&olist[this.auidx].length==19) {
                                    this.orcid=olist[this.auidx];
                                    htm+="<div style=\"margin-top:.7em;\"><a style=\"color:"+jlcol+"\" href=\"https://orcid.org/" +olist[this.auidx]+ "\" target=\"_blank\"><img style=\"vertical-align:middle;\" alt=\"ORCID logo\" src=\"https://orcid.org/sites/default/files/images/orcid_16x16.png\" width=\"16\" height=\"16\"/> <span id=\"orcid_url_label\">https://orcid.org/</span>" +olist[this.auidx]+"</a></div>";
                                }
                            }
                            var ilist=document.body.iucridList;
                            if (ilist) {
                                if (ilist[this.auidx]&&ilist[this.auidx].search(/^\d+$/)>-1) {
                                   htm="<a href=\"//scripts.iucr.org/cgi-bin/detailed_display?id="+ilist[this.auidx]+"\" target=\"_blank\"><img style=\"vertical-align:middle;max-width:30px;max-height:30px;border-radius:3px;margin-right:5px;margin-top:1px;\" src=\""+siteurl+"/orcid/getiucrphoto.php?iucrid="+ilist[this.auidx]+"\" /></a>"+htm;
                                   
                                   htm+="<div style=\"margin-top:.7em;\"><img src=\"//publcif.iucr.org/widgets/images/people_24.png\" style=\"vertical-align:middle;width:18px;height:18px;\"> <a style=\"color:"+jlcol+"\" href=\"//scripts.iucr.org/cgi-bin/detailed_display?id="+ilist[this.auidx]+"\" target=\"_blank\">IUCr ID "+ilist[this.auidx]+"</a></div>";
                                   
                                }
                            }
                            htm+="<div style=\"margin-top:1em;margin-bottom:1em;\"><a style=\"display:inline-block;text-align:center;background:transparent;padding:.5em;border:1px solid #aaa;border-bottom:2px solid #aaa;border-color:#aaa;border-bottom-style:outset;font-weight:bold;border-radius:5px;color:"+jlcol+"\" href=\""+this.href+"\">Other articles by this author</a></div>";
                            if (this.pupaffs!="") htm+="<div style=\"margin-top:1em;\">"+this.pupaffs+"</div>";
                            if (this.pupemail!="") htm+="<div style=\"margin-top:1em;\">E-mail: "+this.pupemail+"</div>";
                            this.puphtml=htm;
                        }
                        _auLinkPup.show(e, this, this.puphtml);
                        return false;
                    };
                    auels.push(aels[a]);
                }
            } 
            //console.log(auels);
            document.body.auels=auels;
        }
    } // end author popup for non-article pages

    
    // sep 2016 crossmark:
    var cmdiv=document.getElementById("right_hand_title_box");
    if (!cmdiv) {
        cmdiv=document.getElementById("main"); // for scripts pages
    }
    if (cmdiv) {
        var cmimgs=cmdiv.getElementsByTagName("img");
        for (var i=0;i<cmimgs.length;i++) {
            if (cmimgs[i].src=="https://crossmark-cdn.crossref.org/widget/v2.0/logos/CROSSMARK_Color_square_no_text.svg") {
                cmimgs[i].onmouseover=function(event) {
                    if (!this.popup) {
                        var wrap=document.createElement("div");
                        wrap.style.position="absolute";
                        wrap.style.display="none";
                        wrap.style.width="195px";
                        wrap.style.minWidth="195px";
                        wrap.style.height="70px";
                        wrap.style.textAlign="left";
                        //wrap.style.marginLeft="-30px";
                        wrap.style.right="15px";
                        wrap.style.zIndex=1000;
                        wrap.style.marginTop="-60px";
                        this.parentNode.insertBefore(wrap, this);
                        var p=document.createElement("div");
                        p.style.position="relative";
                        p.style.padding="5px";;
                        p.style.width="195px";
                        p.style.minWidth="195px";
                        p.className="popup";
                        p.style.display="block";
                        wrap.appendChild(p);
                        var closebut=document.createElement("img");
                        closebut.style.cssFloat="right";
                        closebut.style.marginLeft="5px";
                        closebut.style.marginBottom="5px";
                        closebut.style.padding="3px";
                        closebut.style.cursor="pointer";
                        closebut.src="//journals.iucr.org/logos/buttonlogos/cross.png";
                        closebut.onclick=function(e){
                            var ev=e||window.event;
                            if (ev && ev.stopPropagation) {ev.stopPropagation();} else {ev.cancelBubble=true;};
                            ev.preventDefault();
                            wrap.style.display="none";
                            return false;
                        };
                        p.appendChild(closebut);
                        var contents=document.createElement("div");
                        contents.style.position="relative";
                        contents.style.width="185px";
                        contents.onclick=function(){wrap.style.display="none";};
                        p.appendChild(contents);
                        contents.innerHTML="<b style=\"color:#000000;\">Crossmark</b><br/>View article information and check for updates";
                        this.popup=wrap;  
                        this.parentNode.popup=wrap;
                        this.parentNode.onmouseout=this.onmouseout=function(e) {
                            if (!_isMouseOver(e, this)&&!_isMouseOver(e, this.popup)) {
                                this.popup.style.display="none"; 
                            }
                        };
                    }
                    this.popup.style.display="block"; 
                };

            break;
            }
        }
    }
    
    
    // POWERPOINT
    var addPpt=true;
    if (sect.search(/(book|editorial|addenda|errata|meeting|issue|events|crystallographers|international\s+union|software\s+reviews|letters\s+to)/ig)>-1) addPpt=false;
    // assume only add button to article pages?
    if (!document.getElementById("article")) addPpt=false;
    // if (!document.getElementById("jpage_m")) addPpt=false; // ONLY FOR IUCrJ at the moment
    if (addPpt) {
        if (coedid!="") {
            var xbuts;
            var artcls;
            var topdiv=document.getElementById("right_hand_title_box");
            if (topdiv) {
                var fmds=topdiv.getElementsByTagName("div");
                for (var fd=0;fd<fmds.length;fd++) {
                    if (fmds[fd].className&&fmds[fd].className=="ica_readmore") {
                        xbuts=fmds[fd];
                        break;
                    }
                    else if (!artcls&&fmds[fd].className&&fmds[fd].className=="art_codelinks") {
                        artcls=fmds[fd];
                    }
                }
                if (typeof xbuts=="undefined") {
                    xbuts=document.createElement("div");
                    xbuts.className="ica_readmore";
                    if (typeof artcls!="undefined") topdiv.insertBefore(xbuts, artcls.nextSibling);
                    else topdiv.appendChild(xbuts);
                }
                var pptl=document.createElement("a");
                pptl.href=siteurl+"/services/tools/figs/art2ppt.php?coedid="+coedid;
                //pptl.href="//localhost/publcryst/services/tools/figs/art2ppt.php?coedid="+coedid;
                pptl.innerHTML="PowerPoint&#160;slides";
                xbuts.appendChild(pptl);
            }
        }
    }
    
    // Video
        // find supmat div
        var supmdiv;
        var supmata;
        if (coedid!="be5250") { // add any exclusions here e.g. when vid is known to be corrupt, pointless, etc.!
            supmata=document.getElementById("suppinfoanchor");
            if (!supmata) { // scripts page?
                var ancs=document.getElementsByTagName("a");
                for (var b=0;b<ancs.length;b++) {
                if (ancs[b].name&&ancs[b].name=="suppinfoanchor") {
                    supmata=ancs[b];
                    break;
                }
                }
            }
        }
        if (supmata) {  
        supmdiv=supmata.parentNode;
        var linksdiv;
        var sds=supmdiv.getElementsByTagName("div");
        for (var b=0;b<sds.length;b++) {
            if (sds[b].className&&sds[b].className=="file_links_other") {
                if (sds[b].innerHTML.search(/sup\d+\.(mov|avi|mp4|ogg|mpg|ogv|wmv)"/ig)>-1) linksdiv=sds[b];
                break;
            }
        }
        if (!linksdiv) // might be script page
        {
            if (supmdiv.innerHTML.search(/sup\d+\.(mov|avi|mp4|ogg|mpg|ogv|wmv)"/ig)>-1) {
                linksdiv=supmdiv;
            // on scripts pages linksdiv may contain div id=sup_imported - if so need to stick vids before this div
                var cifdiv=document.getElementById("sup_imported");
                if (cifdiv&&cifdiv.parentNode==linksdiv) {
                    linksdiv=document.createElement("div");
                    linksdiv.style.marginBottom="1em";
                    supmdiv.insertBefore(linksdiv, cifdiv);
                    
                }
            }
            
            
        }
        if (linksdiv) {
            var ifrV=document.createElement("iframe");
            ifrV.style.display="none";
            var cbV="#supVIDthumbs";
            
            ifrV.src=siteurl+"/widgets/randthumbs/videos.php?artid="+coedid+"&callback="+encodeURIComponent(cbV)+"&nocache=true"; //+"&type=cifmol";
            //ifrV.src="//publvid.co.uk/videos/getthumbs.php?artid="+coedid+"&callback="+encodeURIComponent(cbV); //+"&type=cifmol";
            //ifrV.src="//publcif.iucr.org/widgets/randthumbs/videos.php?artid="+coedid+"&callback="+encodeURIComponent(cbV);
            linksdiv.appendChild(ifrV);
            var vidl=document.createElement("div");
            vidl.id="videothumbs";
            vidl.coedid=coedid;
            vidl.style.display="none";
            vidl.style.marginBottom="1em";
            linksdiv.appendChild(vidl);
	    var container=document.createElement("div");
	    container.id="IUCrVideoPlayerWrap";
	    linksdiv.appendChild(container);
            var player=document.createElement("iframe");
            player.style.display="none";
            player.src="";
            player.style.minWidth="250px";
            player.style.minHeight="300px";
            player.style.maxWidth="750px";
            player.style.border="0";
            player.style.width="99%";
            player.style.marginTop=".5em";
	    player.style.marginBottom=".5em";
	    //player.style.background="#000000";
        // player.allowfullscreen=true;
            player.setAttribute("allowfullscreen", true);
            player.setAttribute("frameborder","0");
            
            player.id="IUCrVideoPlayer";
            container.appendChild(player);
            
            var vidc=document.createElement("div");
            vidc.id="IUCrVideoPlayerCaption";
            vidc.style.width="90%";
            vidc.style.marginBottom=".5em";
            linksdiv.appendChild(vidc);
        }
        
        // nov 2017: pdb 3d links (add if not already there)
        var els=supmdiv.getElementsByTagName("a");
        var have3dlink=false;
        var havertvs=false;
        var pdbids=[];
        var rx=/[a-z][a-z]\d\d\d\d[^\.]*sup[^\.]+\.rtv/g;
        var hx=/cgi\-bin\/cr\.cgi\?rm=pdb&(?:amp;)?pdbId=([A-Za-z0-9][A-Za-z0-9][A-Za-z0-9][A-Za-z0-9])/gi;
        if (els&&els.length){
            var pdbLinkEls=[];
            for (var e=0;e<els.length;e++)
            {
                if (!els[e].href) continue;
                if (els[e].href.search(rx)>-1) {
                    havertvs=true;
                }
                if (els[e].href.indexOf("cifjmol.php")>-1) have3dlink=true;
                else if (els[e].url) {
                    var pdbm=hx.exec(els[e].url);
                    if (pdbm) {
                        var d=pdbm[1];
                        if (pdbids.indexOf(d)==-1) pdbids.push(d);
                    }
                }
                else {
                    var pdbm=hx.exec(els[e].href);
                    if (pdbm) {
                        var d=pdbm[1];
                        if (pdbids.indexOf(d)==-1) pdbids.push(d);
                    }
                }
            }
            if (pdbids.length>0&&!have3dlink) {
                var lnk="<a href=\"//publcif.iucr.org/cifmoldb/gui/cifjmol.php?pdbid="+pdbids.join(",")+"&coedid="+coedid+"\" target=\"_blank\" >3D view</a>";
                var ld=document.createElement("div");
                ld.innerHTML=lnk;
                supmdiv.appendChild(ld);
            }
        }
        }
        // may 2018 - cookie links - add if not there
        if (parseInt(pdate.substr(0,4))<2019) {
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
        
        // proteopedia
        var incprot=1;//window.location.href.indexOf("&test=true");
        if (incprot>-1&&(jnl=="d"||jnl=="f"||jnl=="m"||jnl=="s")) {
            // if linked in abstract:
           
            var proteolnk="";//<div class="ica_abstract"><div id="abs">
            /* Mar2020 - cant trust links in abstract - see tj5026
            if (parseInt(pdate.substr(0,4))>2017) {
            var abs=document.getElementById("abs");
            if (!abs) {
                var absd=document.getElementsByClassName("ica_abstract");
                if (absd) abs=absd[0];
            }
            if (abs) {
                
                
                var ancs=abs.getElementsByTagName("a");
                for (var a=0;a<ancs.length;a++) {
                    if (!ancs[a].href) continue;
                    if (ancs[a].href.search(/\/\/proteopedia\.org\/w\/Journal:(Acta_Cryst|IUCrJ|J_Sync)/i)>-1) { 
                        proteolnk=ancs[a].href.replace(/^.*\/\/proteopedia\.org\/w\/Journal:(.+)$/i, "//proteopedia.org/emb/ed/$1");
                        if (proteolnk=="//proteopedia.org/emb/ed/Acta_Cryst_D:2") proteolnk="//proteopedia.org/emb/ed/Acta_Cryst_D:S2059798318000050"; // changed naming convention
                        
                        _addProteoWidget(proteolnk, supmdiv);    
                            
                        
                        ancs[a].tour=proteolnk;
                        ancs[a].onclick=function(){
                            var obj=document.getElementById("protoiframe");
                            var objp=obj.parentNode;
                            objp.removeChild(obj); // prevents change of src being added to history
                            obj.src=this.tour;
                            obj.style.display="block";
                            objp.appendChild(obj);
                            var curleft = curtop = 0;
                            if (obj.offsetParent) {
                                do {
                                curleft += obj.offsetLeft;
                                curtop += obj.offsetTop;
                                } while (obj = obj.offsetParent);
                            }
                            var pos=[curleft,curtop];
                            window.scroll(0,pos[1]-70);
                            return false;
                        }
                        break;
                    }
                    //proteopedia.org/w/Journal:Acta
                }

            }}// no link in abstract - check online:
            */ 
                if (proteolnk=="") {
                    
                // dont want to look before 2018, but do have 3 in 2012/2013
                    if (doi=="10.1107/S1744309112050270") { //gx5211
                        proteolnk="//proteopedia.org/emb/ed/Acta_Cryst_F:S1744309112050270";
                        _addProteoWidget(proteolnk, supmdiv);
                    }
                    else if (doi=="10.1107/S1744309112003326") { //gx5200
                        proteolnk="//proteopedia.org/emb/ed/Acta_Cryst_F:S1744309112003326";
                        _addProteoWidget(proteolnk, supmdiv);
                    }
                    else if (doi=="10.1107/S0907444911047251") { //wd5167
                        proteolnk="//proteopedia.org/emb/ed/Acta_Cryst_D:S0907444911047251";
                        _addProteoWidget(proteolnk, supmdiv);
                    }
                    else if (parseInt(pdate.substr(0,4))>2017) {
                    
                            var reqp = false;
                            if (window.XMLHttpRequest && !(window.ActiveXObject)) {
                            try {
                            reqp = new XMLHttpRequest();
                            } catch(e) {
                            reqp = false;
                            }
                            } else if (window.ActiveXObject) {
                            try {
                            reqp = new ActiveXObject("Msxml2.XMLHTTP");
                            } catch(e) {
                            try {
                            reqp = new ActiveXObject("Microsoft.XMLHTTP");
                            } catch(e) {
                            reqp = false;
                            }
                            }
                            }
                            if (reqp) {
                            try {
                            reqp.onreadystatechange = function() {  
                            if (reqp.readyState == 4) {
                            if (reqp.status == 200) {

                                var prot=reqp.responseText.replace(/^\s*|\s*$/g, "");
                                
                                if (prot.indexOf(doi.replace(/^[^\/]+\//, ""))>-1) {
                                    proteolnk="//proteopedia.org/emb/ed/"+prot;
                                    _addProteoWidget(proteolnk, supmdiv);
                                    
                                }
                            }
                            }};
                            
                            reqp.open("GET", "//publcif.iucr.org/widgets/proteopedia/proteopedia.php?doi="+encodeURIComponent(doi.replace(/^[^\/]+\//i, ""))+"&pdate="+encodeURIComponent(pdate), true);
                            reqp.send("");

                            }
                            catch(e) {
                                
                            }
                            }
                    }
                }
                
            
            
        }
        
        // kudos fix if page is not https:
        if (window.location.href.search(/^https/i)==-1) { 
            var scrs=document.getElementsByTagName("script");
            if (scrs&&scrs.length) {
                for (var s=0;s<scrs.length;s++) {
                if (scrs[s].src) {
                    if (scrs[s].src.search(/api\.growkudos\.com\/widgets\//i)>-1) {
                        if (scrs[s].src.search(/^https/i)>-1) continue;
                        var nsrc=scrs[s].src.replace(/^.*api\.growkudos\.com\/widgets\//i, "https://api.growkudos.com/widgets/");
                        //alert(nsrc);
                        scrs[s].src=nsrc;
                        var nsel=document.createElement("script");
                        nsel.src=nsrc;
                        scrs[s].parentNode.insertBefore(nsel,scrs[s]);
                        
                        
                    }
                }
                }
            }
        }
        
        setTimeout(function(){
            var tmd=document.getElementById("trendmd-suggestions");
            if (tmd) {
                
                var ancs=tmd.getElementsByTagName("a");
                if (ancs) {
                    for (var tdc=0;tdc<ancs.length;tdc++) {
                        if (ancs[tdc].className&&ancs[tdc].className=="trendmd-widget-settings__link") {
                        var ih=ancs[tdc].innerHTML;
                        if (ih=="Privacy policy") ih="TrendMD privacy policy";
                        else ih="TrendMD "+ih;
                        ancs[tdc].innerHTML=ih;
                        }
                    }
                }
            
            }
        }, 3000);
        
        // annotations:alert(jnl);
        if (jnl=="f"&&document.getElementById("article")) {
            var req = false;
            if (window.XMLHttpRequest && !(window.ActiveXObject)) {
            try {
            req = new XMLHttpRequest();
            } catch(e) {
            req = false;
            }
            } else if (window.ActiveXObject) {
            try {
            req = new ActiveXObject("Msxml2.XMLHTTP");
            } catch(e) {
            try {
            req = new ActiveXObject("Microsoft.XMLHTTP");
            } catch(e) {
            req = false;
            }
            }
            }
            
            if (req) {
                try {
                req.onreadystatechange = function() {  
                if (req.readyState == 4) {
                if (req.status == 200) {
                    var data;
                    try {
                     data=JSON.parse(req.responseText.replace(/^\s*|\s*$/g, ""));
                    }
                    catch(e) {
                     data = false;
                    }
                    //console.log(data);
                    if (data&&data.anns&&data.anns.length>0) {
                        // add a link:
                        var hels=document.getElementsByClassName("ref_lookup_button_orange");
                        if (hels&&hels.length) {
                            for (var h=0;h<hels.length;h++) {
                            var nd=document.createElement("div");
                            nd.annodata=data;
                            nd.onclick=function() {
                                var imgs=this.getElementsByTagName("img");
                                if (imgs&&imgs.length) {
                                    if (imgs[0].src.search(/unchecked\.png/i)>-1) {
                                        imgs[0].src="//journals.iucr.org/logos/buttonlogos/checkmark_24.png";
                                        publannots.showAnnotationLinks(this);
                                        _setCookie("iucr_residue_annotation", "1", 365);
                                    }
                                    else {
                                        imgs[0].src="//journals.iucr.org/logos/buttonlogos/unchecked.png";
                                        publannots.hideAnnotationLinks(this);
                                        _setCookie("iucr_residue_annotation", "0", 365);
                                    }
                                }
                            };
                            
                            var checkon="checkmark_24.png"; 
                            if (_getCookie("iucr_residue_annotation")=="0") checkon="unchecked.png"; 
                            
                            nd.innerHTML="Residue annotations <a class=\"ref_lookup_button_residue\" title=\"Annotations\"> <img style=\"width: 17px; border: 1px solid #ccc;border-radius: 5px;-webkit-border-radius: 5px;-moz-border-radius: 5px;background: #eee;background: -webkit-gradient(linear, left top, left bottom, from(#eee), to(#ccc));background: -moz-linear-gradient(-90deg, #eee, #ccc);\" onmouseover=\"this.style.border='1px solid #aaa';\" onmouseout=\"this.style.border='1px solid #ccc';\" src=\"//journals.iucr.org/logos/buttonlogos/"+checkon+"\" border=\"0\" alt=\"reference\" /></a>";
                            hels[h].parentNode.appendChild(nd);
                            }
                            
                        }
                        // for now append the library dynamically - break through 12h cache...
                        var nscript = document.createElement('script');
                        nscript.type = 'text/javascript';
                        nscript.src = siteurl+"/widgets/annotation/annotate.js?nocache=true";
                        document.body.appendChild(nscript);
                        
                        var annotnow= _getCookie("iucr_residue_annotation");
                        
                        if (annotnow==""||annotnow=="1") {
                        
                            nscript.onload = nscript.onreadystatechange = function(){
                                var datael={};
                                datael.annodata=data;
                                publannots.annotate(datael);
                            };
                            _setCookie("iucr_residue_annotation", "1", 365);
                        }
                        
                        
                    }
                }
                }};
                req.open("GET", siteurl+"/widgets/annotation/annot.php?coedid="+encodeURIComponent(coedid)+"&pdate="+encodeURIComponent(pdate), true);
                req.send();
                }
                catch(e) {
                }
            }
            
        }
//ORIGINAL CIF SUP STUFF
  var addcap=false;
  var figdiv;
  var supciffiles=[];
  var dblks=[];
  var xtbls=[];
  var mscript;
  

  var havecontent=false;
  var actax=false;
  var si=document.getElementById('sup_imported');
  
    if (!si) return;
    if (/*coedid=="bm5088"||*/coedid=="wf5128") {si.style.display=none; return;}
  mscript=document.createElement("div");
  mscript.id="sup_text_sections";
  mscript.style.display="none";
  mscript.style.marginTop="1em";
  si.insertBefore(mscript, si.firstChild);
  if (si.className&&si.className.indexOf("sup_datareport")>-1&&si.className.indexOf("sup_e")>-1)
  {
    var siels=si.getElementsByTagName('div');
    for (var i=0;i<siels.length;i++) {
      if (siels[i].className&&siels[i].className.search(/^(comment|experimental|refinement|bodysection)/ig)>-1) {
      mscript.appendChild(siels[i]);
      addcap=true;
      }
      else if (siels[i].className&&siels[i].className=="figures") {
      figdiv=siels[i];
      }
      else if (siels[i].className&&siels[i].className.search(/^datablock\d\d?\d?$/ig)>-1) {
          if (siels[i].className!="datablock999") dblks.push(siels[i]);
       
      }
      else if (siels[i].className&&siels[i].className=="tablewrapxtable") {
      xtbls.push(siels[i]);
      }
    }
  }
  else // all others
  {
    if (si.className.indexOf("sup_x")>-1) actax=true;
    var siels=si.getElementsByTagName('div');
    for (var i=0;i<siels.length;i++) {
      if (siels[i].className&&siels[i].className.search(/^datablock\d\d?\d?$/ig)>-1) {
          if (siels[i].className!="datablock999") dblks.push(siels[i]);
      }
      else if (siels[i].className&&siels[i].className=="tablewrapxtable") {
      xtbls.push(siels[i]);
      }
      else if (siels[i].className&&siels[i].className=="supciffile") {
      supciffiles.push(siels[i]);
      }
    }
  }

  //return;
  if (addcap) {
    havecontent=true;
    var l=document.createElement("div");
    l.sections=mscript;
    l.onclick=function(){
      if (this.sections.style.display&&this.sections.style.display=="block") 
      {
	this.sections.style.display="none";
	this.getElementsByTagName("img")[0].src='//journals.iucr.org/logos/arrows/smarrr.png';
      }
      else {
	this.sections.style.display="block";
	this.getElementsByTagName("img")[0].src='//journals.iucr.org/logos/arrows/smarrd.png';
      }
    };
    l.innerHTML="<div class='heading2'><img src='//journals.iucr.org/logos/arrows/smarrr.png' /> Supporting text</div>";
    si.insertBefore(l, si.firstChild);
    var spans=document.getElementsByTagName("span");
    if (spans&&spans.length>0) {
      for (var s=0;s<spans.length;s++) {
	if (spans[s].className&&spans[s].className=="section_number") {
	  var h=spans[s].innerHTML; 
	  if (h.search(/^\s*S/)==-1) spans[s].innerHTML="S"+h;
	}
      }
    }
  }
  if (figdiv) {
    havecontent=true;
    figdiv.style.display="none";
    var f=document.createElement("div");
    f.figures=figdiv;
    f.onclick=function(){ 
      if (this.figures.style.display&&this.figures.style.display=="block") 
      {
	this.figures.style.display="none";
	this.getElementsByTagName("img")[0].src='//journals.iucr.org/logos/arrows/smarrr.png';
      }
      else {
	this.figures.style.display="block";
	this.getElementsByTagName("img")[0].src='//journals.iucr.org/logos/arrows/smarrd.png';
      }
    };
    f.innerHTML="<div class='heading2'><img src='//journals.iucr.org/logos/arrows/smarrr.png' /> Supporting figures</div>";
    figdiv.parentNode.insertBefore(f, figdiv);
  }
  if (dblks&&dblks.length>0) {
    havecontent=true;
    if (dblks.length==1) { // most cases
      _hideEmptyTables(dblks[0]);

      dblks[0].style.display="none";
      
      if (xtbls&&xtbls.length>0) {
	for (var x=0;x<xtbls.length;x++) {
	xtbls[x].style.display="none";
	}
      }
      var b=document.createElement("div");
      b.datablock=dblks[0];
      b.onclick=function(){ 
      if (this.datablock.style.display&&this.datablock.style.display=="block") 
      {
	this.datablock.style.display="none";
	if (xtbls&&xtbls.length>0) {
	  for (var x=0;x<xtbls.length;x++) {
	  xtbls[x].style.display="none";
	  }
	}
	this.getElementsByTagName("img")[0].src='//journals.iucr.org/logos/arrows/smarrr.png';
      }
      else {
	this.datablock.style.display="block";
	if (xtbls&&xtbls.length>0) {
	  for (var x=0;x<xtbls.length;x++) {
	  xtbls[x].style.display="block";
	  }
	}
	this.getElementsByTagName("img")[0].src='//journals.iucr.org/logos/arrows/smarrd.png';
      }
      };
      if (actax) b.innerHTML="<div class='heading2'><img src='//journals.iucr.org/logos/arrows/smarrr.png' /> Full crystallographic data</div>";
      else b.innerHTML="<div class='heading2'><img src='//journals.iucr.org/logos/arrows/smarrr.png' /> Supporting crystallographic data</div>";
      b.style.position="relative";
      b.style.zIndex="1"; // to avoid being hidden by iucr's anchor els
      b.style.cursor="pointer";
      dblks[0].parentNode.insertBefore(b, dblks[0]);
      _getEquations(dblks[0]);
    }
    else { // more than one block - move block heading outside block and turn it into a display toogle
      for (var db=0;db<dblks.length;db++) {
	_hideEmptyTables(dblks[db]); //new 4dec14
	var divs=dblks[db].getElementsByTagName("div");
	var hd;
	if (divs&&divs.length>0) {
	  for (var cb=0;cb<divs.length;cb++) {

	    if (divs[cb].className&&divs[cb].className=="heading2") {
	      hd=divs[cb];
	      break;
	    }
	  }
	  }
	  if (!hd) {
	    hd=document.createElement("div");
	    hd.innerHTML="<img src='//journals.iucr.org/logos/arrows/smarrr.png' /> Data block "+(db+1);
	    hd.className="heading2";
	  }
	  else {
	    var im=document.createElement("img");
	    im.src="//journals.iucr.org/logos/arrows/smarrr.png";
	    hd.insertBefore(im, hd.firstChild);
	  }
	  hd.datablock=dblks[db];
	  hd.onclick=function(){ 
	    if (this.datablock.style.display&&this.datablock.style.display=="block") 
	    {
	      this.datablock.style.display="none";
	      this.getElementsByTagName("img")[0].src='//journals.iucr.org/logos/arrows/smarrr.png';
	    }
	    else {
	      this.datablock.style.display="block";
	      this.getElementsByTagName("img")[0].src='//journals.iucr.org/logos/arrows/smarrd.png';
	    }
	  };
	  dblks[db].style.display="none";
	  hd.style.position="relative";
	  hd.style.zIndex="1"; // to avoid being hidden by iucr's anchor els
	  hd.style.cursor="pointer";
	  dblks[db].parentNode.insertBefore(hd, dblks[db]);
	  _getEquations(dblks[db]);
	}
	// xtbls
	if (xtbls&&xtbls.length>0) {
      	  for (var x=0;x<xtbls.length;x++) {
	  xtbls[x].style.display="none";
	  }
	  var xh=document.createElement("div");
	  xh.onclick=function(){ 
	  if (xtbls[0].style.display&&xtbls[0].style.display=="block") 
	  {
	    for (var x=0;x<xtbls.length;x++) {
	    xtbls[x].style.display="none";
	    }
	    this.getElementsByTagName("img")[0].src='//journals.iucr.org/logos/arrows/smarrr.png';
	  } 
	  else 
	  {
	    for (var x=0;x<xtbls.length;x++) {
	      xtbls[x].style.display="block";
	    }
	    this.getElementsByTagName("img")[0].src='//journals.iucr.org/logos/arrows/smarrd.png';
	  }
	  };
	  xh.innerHTML="<div class='heading2'><img src='//journals.iucr.org/logos/arrows/smarrr.png' /> Miscellaneous</div>";
	  xh.style.position="relative";
	  xh.style.zIndex="1"; // to avoid being hidden by iucr's anchor els
	  xh.style.cursor="pointer";
	  xtbls[0].parentNode.insertBefore(xh, xtbls[0]);
	  
      }
    }
     
    var bi=-1;
    for (var xb=0;xb<dblks.length;xb++) {
	
	var divs=dblks[xb].getElementsByTagName("div");
	for (var d=0;d<divs.length;d++) {

	    if (divs[d].className&&(divs[d].className=="tablewrapcoords"||divs[d].className=="tablewrapadps")) {
	      var tbls=divs[d].getElementsByTagName("table");
	      if (tbls&&tbls.length>0) {
		tbls[0].style.cursor="pointer";
		tbls[0].style.color=jlcol;
		var trows=tbls[0].getElementsByTagName("tr");
		if (trows&&trows.length>0) trows[0].style.color="#000";
		tbls[0].blockidx=xb;
		tbls[0].onmouseup=function(e) {
		  var ev=e||window.event;
		  if (!ev) return;
		  var tel = ev.target||ev.srcElement;
		  if (tel==this) return;
		  do {
		    if (tel.tagName=="TD") break;
		  } while (tel = tel.parentNode);
		  if (!tel) return;
		  var cells=tel.parentNode.getElementsByTagName("td");
		  if (!cells||cells.length==0) return;
		  var l=cells[0].innerHTML;
		  l.replace(/<[^>]+>/g, "");
		  var ls=[];
		  var scs=[];
		  ls.push(l);
		  scs.push("");
		  _showCifmol(this.blockidx, ls, scs);
		 };
		}
	    }
	    else if (divs[d].className&&divs[d].className.indexOf("tablewrapgeom")==0) {
	      var tbls=divs[d].getElementsByTagName("table");
	      if (tbls&&tbls.length>0) {
		tbls[0].style.cursor="pointer";
		tbls[0].style.color=jlcol;
		tbls[0].blockidx=xb;
		if (tbls.length>1) tbls[0].xtbl=tbls[1];
		tbls[0].onmouseup=function(e) {
		  var ev=e||window.event;
		  if (!ev) return;
		  var tel = ev.target||ev.srcElement;
		  if (tel==this) return;
		  do {
		    if (tel.tagName=="TD") break;
		  } while (tel = tel.parentNode);
		  if (!tel) return;
		  var cells=tel.parentNode.getElementsByTagName("td");
		  var cellidx=-1;
		  if (!cells||cells.length==0) return;
		  for (var c=0;c<cells.length;c++) {
		    if (cells[c]==tel) {
		      cellidx=c;
		      break;
		    }  
		  }
		  if (cellidx==-1) return;
		  if (cellidx==1) cellidx=0;
		  else if (cellidx==3) cellidx=2;
		  var l=cells[cellidx].innerHTML;
		  l=l.replace(/\u2032/ig, "'");
		  l=l.replace(/&#8242;/ig, "'");
		  l=l.replace(/<span[^>]+>/ig, "");
		  l=l.replace(/<\/span>/ig, "");
		  l=l.replace(/\u2014/ig, "&#8212;");
		  l=l.replace(/\u00B7/ig, "&#183;");
		  l=l.replace(/\.\.\./ig, "&#183;&#183;&#183;");
		  l=l.replace(/\u2010/g,"&#8212;");
		  l=l.replace(/\u2013/g,"&#8212;");
		  l=l.replace(/\u2014/g,"&#8212;");
		  l=l.replace(/\uFF1D/g,"&#8212;");
		  l=l.replace(/\u2261/g,"&#8212;");
		  l=l.replace(/&#8801;/g,"&#8212;");
		  l=l.replace(/&#9552;/g,"&#8212;");
		  l=l.replace(/&#8211;/g,"&#8212;");
		  l=l.replace(/\-\-\-/g,"&#8212;");
		  l=l.replace(/\-\-/g,"&#8212;");
		  l=l.replace(/\-/g,"&#8212;");
		  l=l.replace(/&#183;&#183;&#183;/ig, "&#8212;");
		  var ls=l.split("&#8212;");
		  var scs=[];
		  for (var i=0;i<ls.length;i++)
		  {
		  var scsup=/<sup>([ivx]+)<\/sup>/ig.exec(ls[i]);
		  if (scsup)
		  { 
		  if (!this.symcodes) {
		    if (this.xtbl) {
		      var sct=this.xtbl;
		      var symcodes=[];
		      var scodes="";
		      var sctcells=sct.getElementsByTagName("td");
		      if (sctcells.length>0) scodes=sctcells[0].innerHTML;
		      if (scodes!="") {
			scodes=scodes.replace(/<[^>]*>/g, "").replace(/&#8722;/g, "-").replace(/&#x2212;/g, "-").replace(/\u2212/g, "-").replace(/\s+/g, "");
			var stxt=scodes.match(/(\([ivx]+\)[^;\.$]+)/ig);
			if (stxt) {
			  for (var m=0;m<stxt.length;m++) { 
			    var rx=/\(([ivx]+)\)([^;\.$]+)/ig;
			    var mm=rx.exec(stxt[m]);
			    if (mm) {
			      symcodes[mm[1]]=mm[2];
			    }
			  }
			  this.symcodes=symcodes;
			}
		      }
		    } 
		  }
		  if (this.symcodes[scsup[1]]) {
		    scs.push(this.symcodes[scsup[1]]);
		  }
		  else scs.push("");
		  ls[i]=ls[i].replace(/<sup>([ivx]+)<\/sup>/g, "");
		  ls[i]=ls[i].replace(/<[^>]+>/g, "")+"";
		  }
		  else {
		  ls[i]=ls[i].replace(/<[^>]+>/g, "")+"";
		  scs.push("");
		  }
		  }
		  _showCifmol(this.blockidx, ls, scs);
		};
	      }
	    }
	    else if (divs[d].className&&divs[d].className.indexOf("tablewraphbonds")==0) {
	      var tbls=divs[d].getElementsByTagName("table");
	      var tidx=0;
	      if (tbls&&tbls.length>1) {
		// headnotes are in tables!
		for (var t=0;t<tbls.length;t++) {
		  var rows=tbls[t].getElementsByTagName("tr");
		  if (rows&&rows.length>0) {
		    var cs=rows[0].getElementsByTagName("td");
		    if (cs&&cs.length>1) {
		      tidx=t;
		      break;
		    }
		  }
		}
	      }
	      if (tbls&&tbls.length>0) {
		
		tbls[tidx].style.cursor="pointer";
		tbls[tidx].style.color=jlcol;
		var trows=tbls[tidx].getElementsByTagName("tr");
		if (trows&&trows.length>0) trows[0].style.color="#000";
		tbls[tidx].blockidx=xb;
		if (tbls.length>1&&(tidx+1)<tbls.length) tbls[tidx].xtbl=tbls[tidx+1];
		tbls[tidx].onmouseup=function(e) {
		  var ev=e||window.event;
		  if (!ev) return;
		  var tel = ev.target||ev.srcElement;
		  if (tel==this) return;
		  do {
		    if (tel.tagName=="TD") break;
		  } while (tel = tel.parentNode);
		  if (!tel) return;
		  var cells=tel.parentNode.getElementsByTagName("td");
		  var cellidx=-1;
		  if (!cells||cells.length==0) return;
		  var l=cells[0].innerHTML;
		  l=l.replace(/\u2032/ig, "'");
		  l=l.replace(/&#8242;/ig, "'");
		  l=l.replace(/<span[^>]+>/ig, "");
		  l=l.replace(/<\/span>/ig, "");
		  l=l.replace(/\u2014/ig, "&#8212;");
		  l=l.replace(/\u00B7/ig, "&#183;");
		  l=l.replace(/\.\.\./ig, "&#183;&#183;&#183;");
		  l=l.replace(/\u2010/g,"&#8212;");
		  l=l.replace(/\u2013/g,"&#8212;");
		  l=l.replace(/\u2014/g,"&#8212;");
		  l=l.replace(/\uFF1D/g,"&#8212;");
		  l=l.replace(/\u2261/g,"&#8212;");
		  l=l.replace(/&#8801;/g,"&#8212;");
		  l=l.replace(/&#9552;/g,"&#8212;");
		  l=l.replace(/&#8211;/g,"&#8212;");
		  l=l.replace(/\-\-\-/g,"&#8212;");
		  l=l.replace(/\-\-/g,"&#8212;");
		  l=l.replace(/\-/g,"&#8212;");
		  l=l.replace(/&#183;&#183;&#183;/ig, "&#8212;");
		  var ls=l.split("&#8212;");
		  var scs=[];
		  for (var i=0;i<ls.length;i++)
		  {
		    var scsup=/<sup>([ivx]+)<\/sup>/ig.exec(ls[i]);
		    if (scsup)
		    { 
		      if (!this.symcodes) {
			if (this.xtbl) {
			  var sct=this.xtbl;
			  var symcodes=[];
			  var scodes="";
			  var sctcells=sct.getElementsByTagName("td");
			  if (sctcells.length>0) scodes=sctcells[0].innerHTML;
			  if (scodes!="") {
			    scodes=scodes.replace(/<[^>]*>/g, "").replace(/&#8722;/g, "-").replace(/&#x2212;/g, "-").replace(/\u2212/g, "-").replace(/\s+/g, "");
			    var stxt=scodes.match(/(\([ivx]+\)[^;\.$]+)/ig);
			    if (stxt) {
			      for (var m=0;m<stxt.length;m++) {
				var rx=/\(([ivx]+)\)([^;\.$]+)/ig;
				var mm=rx.exec(stxt[m]);
				if (mm) {
				  symcodes[mm[1]]=mm[2];
				}
			      }
			      this.symcodes=symcodes;
			    }
			  }
			} 
		      }
		      if (this.symcodes[scsup[1]]) {
			scs.push(this.symcodes[scsup[1]]);
		      }
		      else scs.push("");
		      ls[i]=ls[i].replace(/<sup>([ivx]+)<\/sup>/g, "");
		      ls[i]=ls[i].replace(/<[^>]+>/g, "")+"";
		    }
		    else {
		      ls[i]=ls[i].replace(/<[^>]+>/g, "")+"";
		      scs.push("");
		    }
		  }
		  _showCifmol(this.blockidx, ls, scs, "hinteractions");
		 };
	      }
	    }
	}
    }
    //  possible multiple cifs:
    
    if (supciffiles&&supciffiles.length>1) {
        for (var f=0;f<supciffiles.length;f++) {
          
        var cifid=supciffiles[f].id;
        var hd=document.createElement("div");
	    hd.innerHTML="<img src='//journals.iucr.org/logos/arrows/smarrr.png' /> "+cifid;
	    hd.className="heading2";
	  
	  hd.supciffile=supciffiles[f];
	  hd.onclick=function(){ 
	    if (this.supciffile.style.display&&this.supciffile.style.display=="block") 
	    {
	      this.supciffile.style.display="none";
	      this.getElementsByTagName("img")[0].src='//journals.iucr.org/logos/arrows/smarrr.png';
	    }
	    else {
	      this.supciffile.style.display="block";
	      this.getElementsByTagName("img")[0].src='//journals.iucr.org/logos/arrows/smarrd.png';
	    }
	  };
          
          supciffiles[f].parentNode.insertBefore(hd, supciffiles[f]);
          supciffiles[f].style.display="none";
            
        }
        
    }
    
    
  } // end have dblks
  
  if (!havecontent) {

    // nov 2017: might still have a cif - just too old to be processed (e.g. ab1234)
    if (coedid!="")
    {
        var cifmoldiv=document.createElement("div");
        cifmoldiv.style.position="relative";
        cifmoldiv.style.minHeight="36px";
        cifmoldiv.style.marginBottom="12px";
        cifmoldiv.style.marginTop="12px";
        si.parentNode.insertBefore(cifmoldiv, si);
        var cifjmol="//scripts.iucr.org/cgi-bin/sendcif?"+coedid+"&Qmime=cif";  
        var cifmolbut=document.createElement("div");
        cifmolbut.className="file_links_sup0";
        cifmolbut.style.display="block";
        cifmoldiv.appendChild(cifmolbut);
        cifmolbut.innerHTML="<p><a href=\""+cifjmol+"\" target=\"_blank\" >3D view</a></p>";
         
        if (typeof Smol != 'undefined') //coedid!="eb5054")
        {
            var cifmolcontainer=document.createElement("div"); // provides width reference el for bouncyscrollydiv
            cifmolcontainer.style.position="relative";
            cifmoldiv.appendChild(cifmolcontainer);
            var cifmol=document.createElement("div");
            cifmol.id="cifmol";
            cifmolcontainer.appendChild(cifmol);
            BouncyScrollyDiv.init(cifmol, {"scrollStep":"canvas","stepBounce":false,"scrollMode":"horizontal","buttonsPosition":"leftright", /*"buttonsClassName": "scrollyButtons",*/ "forwardbutton": "<div style='width:100%;'><img style='margin-top:70px;' src='//publcif.iucr.org/widgets/images/triang_r_24.png' border=0 /></div>", "backbutton": "<div style='width:100%;text-align:right'><img style='margin-top:70px;' src='//publcif.iucr.org/widgets/images/triang_l_24.png' border=0 /></div>"});  
            var ifr=document.createElement("iframe");
            ifr.style.display="none";
            var cb="#supCIF";
            if (sect.indexOf("inorganic")>-1) cb+="I";
            else if (sect.indexOf("metal")>-1) cb+="M";
            else if (sect.indexOf("organic")>-1) cb+="O";
            else cb+="O"; // 
            cb+="S";
        
            // temp fix for known issues:
            if (coedid=="bp5091"||coedid=="bp5092") {
                ifr.src=siteurl+"/widgets/cifmol/getcif.php?artid="+coedid+"&callback="+encodeURIComponent(cb) +"&type=cifmol";
            }
            else {
            ifr.src=siteurl+"/widgets/cifmol/getcif.php?artid="+coedid+"&callback="+encodeURIComponent(cb);//+"&type=cifmol";
            //ifr.src="//cif.publcryst.co.uk/widgets/cifmol/getcif.php?artid="+coedid+"&callback="+encodeURIComponent(cb);
            //ifr.src="//publcif.iucr.org/widgets/cifmol/getcif.php?artid="+coedid+"&callback="+encodeURIComponent(cb) +"&type=cifmol";
            }
            si.appendChild(ifr);
        }
    }

    
      return;
      
  }

  si.blockrefs=dblks;
  var popup=false;


    var cifmoldiv=document.createElement("div");
    cifmoldiv.style.position="relative";
    cifmoldiv.style.minHeight="36px";
    cifmoldiv.style.marginBottom="12px";
    cifmoldiv.style.marginTop="12px";
    si.insertBefore(cifmoldiv, si.firstChild);

    if (coedid!="de5035")
    {
        //var cifjmol="//publcif.iucr.org/cifmoldb/gui/cifjmol.php?cifid="+coedid;
        var cifjmol="//scripts.iucr.org/cgi-bin/sendcif?"+coedid+"&Qmime=cif";  
        var cifmolbut=document.createElement("div");
        if (popup) {
            cifmolbut.className="popup";
            cifmolbut.style.zIndex=1;
            cifmolbut.style.width="auto";
            cifmolbut.style.minWidth="40px";
            cifmolbut.style.opacity="0";
            cifmolbut.style.position="absolute";
        } else {
            cifmolbut.className="file_links_sup0";
        }
        
        cifmolbut.style.display="block";
        cifmoldiv.appendChild(cifmolbut);
        if (popup) {
            cifmoldiv.button=cifmolbut;
            cifmolbut.innerHTML="<a style=\"font-weight:bold;\" href=\""+cifjmol+"\" target=\"_blank\" >3D view...</a>";
        }
        else {
            cifmolbut.innerHTML="<p><a href=\""+cifjmol+"\" target=\"_blank\" >3D view</a></p>";
        }
    }
    //alert(jnl);
    if (typeof Smol != 'undefined'&&jnl!="")
    {
        var cifmolcontainer=document.createElement("div"); // provides width reference el for bouncyscrollydiv
        cifmolcontainer.style.position="relative";
        if (popup) {
            cifmolcontainer.style.marginLeft="40px";
            cifmoldiv.appendChild(cifmolcontainer);
        } else {
            //cifmoldiv.insertBefore(cifmolcontainer, cifmoldiv.firstChild);
            cifmoldiv.appendChild(cifmolcontainer);
        }
        var cifmol=document.createElement("div");
        cifmol.id="cifmol";
        cifmolcontainer.appendChild(cifmol);
        // if (dblks.length>2) {
            BouncyScrollyDiv.init(cifmol, {"scrollStep":"canvas","stepBounce":false,"scrollMode":"horizontal","buttonsPosition":"leftright", /*"buttonsClassName": "scrollyButtons",*/ "forwardbutton": "<div style='width:100%;'><img style='margin-top:70px;' src='//publcif.iucr.org/widgets/images/triang_r_24.png' border=0 /></div>", "backbutton": "<div style='width:100%;text-align:right'><img style='margin-top:70px;' src='//publcif.iucr.org/widgets/images/triang_l_24.png' border=0 /></div>"});  
        // }
        if (popup) cifmol.button=cifmoldiv.button;
        var ifr=document.createElement("iframe");
        ifr.style.display="none";
        var cb="#supCIF";
        if (sect.indexOf("inorganic")>-1) cb+="I";
        else if (sect.indexOf("metal")>-1) cb+="M";
        else if (sect.indexOf("organic")>-1) cb+="O";
        else cb+="O"; // 
        if (dblks.length>2) cb+="M";
        else cb+="S";
        
        // temp fix for known issues:
        if (coedid=="bp5091"||coedid=="bp5092"||coedid=="dk5001") {
            ifr.src=siteurl+"/widgets/cifmol/getcif.php?artid="+coedid+"&callback="+encodeURIComponent(cb) +"&type=cifmol";
        }
        else {
        ifr.src=siteurl+"/widgets/cifmol/getcif.php?artid="+coedid+"&callback="+encodeURIComponent(cb);//+"&type=cifmol";
        //ifr.src="//cif.publcryst.co.uk/widgets/cifmol/getcif.php?artid="+coedid+"&callback="+encodeURIComponent(cb);
        //ifr.src="//publcif.iucr.org/widgets/cifmol/getcif.php?artid="+coedid+"&callback="+encodeURIComponent(cb) +"&type=cifmol";
        }
        si.appendChild(ifr);
        
        
        
        
        
        // RTVs
        if (havertvs) {
        var ifrR=document.createElement("iframe");
        ifrR.style.display="none";
        var cbR="#supRTVthumbs";
        
        ifrR.src=siteurl+"/services/tools/pdcifplot/getrtvthumbs.php?artid="+coedid+"&callback="+encodeURIComponent(cbR); //+"&type=cifmol";
        //ifrR.src="//cif.publcryst.co.uk/services/tools/pdcifplot/getrtvthumbs.php?artid="+coedid+"&callback="+encodeURIComponent(cbR);
        //ifrR.src="//localhost/publcryst/services/tools/pdcifplot/getrtvthumbs.php?artid="+coedid+"&callback="+encodeURIComponent(cbR); //+"&type=cifmol";
        si.appendChild(ifrR);
        var rtvl=document.createElement("div");
        rtvl.id="rtvthumbs";
        rtvl.coedid=coedid;
        rtvl.style.display="none";
        cifmolcontainer.appendChild(rtvl);
        }
        
        
        if (popup) {
        cifmoldiv.onmouseover=function() {
            if (typeof jQuery!='undefined') {
            $(this.button).animate({opacity: 1}, 250, 'swing', function() {});
            }
            else {
            this.button.style.opacity="1";
            }  
        };
        cifmoldiv.onmouseout=function(e) {
            if (!_isMouseOver(e, this)) {
            if (typeof jQuery!='undefined') {
                $(this.button).animate({opacity: 0}, 250, 'swing', function() {});
            }
            else {
                this.button.style.opacity="0";
            }
            }
        };
        }
    }

    var mt=document.createElement("div");
    if (actax) mt.innerHTML="&#160;";
    else mt.innerHTML="Supplementary crystallographic information";
    mt.className="heading1";
    si.insertBefore(mt, si.firstChild);
    si.style.display="block";
    
    
    // PRIVATE FUNCTIONS:
    function _addProteoWidget(protlnk, supdiv) {
        
       console.log(protlnk);
        

        
        var pdiv=document.createElement("div");
                        pdiv.style.marginTop="1em";
                        var divloc=supdiv;
                        var altlocs=supdiv.getElementsByClassName("file_links_other");
                        if (altlocs&&altlocs.length==1) {
                            divloc=altlocs[0];
                            pdiv.style.marginTop="0";
                        }
                        
                        divloc.appendChild(pdiv);
                        
                        //pdiv.style.marginBottom="1em";
                        var lbl=document.createElement("a");
                        lbl.innerHTML="Proteopedia molecular tour";
                        
                        pdiv.appendChild(lbl);
                        pdiv.lbl=lbl;
                        pdiv.tour=proteolnk;
                        pdiv.onclick=function(e) {
                            var ppifr=document.getElementById("protoiframe");
                            this.removeChild(ppifr); // prevents change of src being added to history
                            ppifr.src=this.tour;
                            ppifr.style.display="block";
                            this.appendChild(ppifr);
                            _initHoverPopup();
                            _hoverPup.show(e, this.lbl, "<span style=\"color:green;font-weight:bold;\">Green links</span> change the <br />interactive 3D model");
                        }
                        lbl.onmouseover=function(e) {
                            _initHoverPopup();
                           if (document.getElementById("protoiframe").style.display=="block") {
                               
                                if (_hoverPup.el==this&&_hoverPup.style.display=="block") {
                                    return false;
                                }
                                _hoverPup.show(e, this, "<span style=\"color:green;font-weight:bold;\">Green links</span> change the <br />interactive 3D model");
                                return false;
                            
                            
                               
                               
                           }
                        };
                        lbl.onmouseout=function(e) {
                            if (!_isMouseOver(e, this)&&!_isMouseOver(e, _hoverPup)) {
                                _hoverPup.style.display="none"; 
                            }
                            return false;
                            };
                        var pifr=document.createElement("iframe");
                        pifr.style.border="none";
                        pifr.style.width="100%";
                        pifr.style.height="530px";
                        pifr.id="protoiframe";
                        pifr.style.display="none";
                        pifr.style.marginTop="1em";
                        pdiv.appendChild(pifr);
                        
                        
                         // july2018 extra link - Oct changed appearance
        var xpl=document.createElement("div");
        xpl.className="ica_readmore";
        xpl.innerHTML="<a>Proteopedia&#160;molecular&#160;tour</a>";
        
        //var xpl=document.createElement("a");
        //xpl.innerHTML="Proteopedia&#160;molecular&#160;tour";
        
        xpl.onclick=function() {
            var obj=document.getElementById("protoiframe");
            var objp=obj.parentNode;
            objp.removeChild(obj); // prevents change of src being added to history
            obj.src=protlnk;
            obj.style.display="block";
            objp.appendChild(obj);
            var curleft = curtop = 0;
            if (obj.offsetParent) {
                do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
                } while (obj = obj.offsetParent);
            }
            var pos=[curleft,curtop];
            window.scroll(0,pos[1]-100);
            return false;
        }
        var acls=document.getElementsByClassName("art_codelinks");
        //var acls=document.getElementsByClassName("ica_readmore");
        if (acls&&acls.length>0) {
            acls[0].appendChild(xpl);
        }
                        
        
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
  
    function _hideEmptyTables(dblk) {
        var divs=dblk.getElementsByTagName("div");
        if (!divs||divs.length==0) {
            dblk.style.display="none";
            return true;
        }
        var hideref=false;
        for (var d=0;d<divs.length;d++) {
            if (divs[d].className&&(divs[d].className=="tablewraprefinementdatashort"||divs[d].className=="tablewrapdatacollectionshort")) // short versions will be empty if simulated
            {
            var tr=divs[d].getElementsByTagName("tr");
            if (!tr||tr.length==0) {
                hideref=true;
                break;
                
            }
            }
        }
        if (hideref) {
            for (var dd=0;dd<divs.length;dd++) {
            if (divs[dd].className&&(divs[dd].className=="tablewraprefinementdatalong"||divs[dd].className=="tablewrapdatacollectionlong"))
            {
                divs[dd].style.display="none";
            }
            }
            return true;
        }
        return false;
    }
 
    function _showCifmol(blockidx, labels, scs, type) {
        for (var w=0;w<sup_cifblock_widgets.length;w++) {
            if (w!=blockidx&&sup_cifblock_widgets[w].widget) sup_cifblock_widgets[w].widget._widgets[0].pup.showtoolbox("hide");
        }
        if (!sup_cifblock_widgets[blockidx]) return;
        if (!sup_cifblock_widgets[blockidx].widget) {
            var t=sup_cifblock_widgets[blockidx].id;
            if (t.length<5) t="Structure "+t;
            sup_cifblock_widgets[blockidx].widget = new Smol(sup_cifblock_widgets[blockidx].src, {title: t, selectCallback: function(m, msg){m.pup.statusBar.innerHTML=msg;}, readyCallback: function(m){m._widgets[0].pup.show();m._widgets[0]._selectSitesByAtomAndSymop(labels, scs, type);m._widgets[0]._show();}, popup:true, popupOptions:{dragmode:"fixed"}, view:sup_cifblock_widgets[blockidx].model, type:sup_cifblock_widgets[blockidx].type, size: 300, symRange: sup_cifblock_widgets[blockidx].sym,  "show": -1, spin:false });
        }
        else {
            sup_cifblock_widgets[blockidx].widget._widgets[0].pup.show();
            sup_cifblock_widgets[blockidx].widget._widgets[0]._selectSitesByAtomAndSymop(labels, scs, type);
            sup_cifblock_widgets[blockidx].widget._widgets[0]._show();
            
        }
    }
    
    function _getEquations(dblk)
    {

        var divs=dblk.getElementsByTagName("div");
        var ed;
        if (divs&&divs.length>0) {
            for (var cb=0;cb<divs.length;cb++) {
                if (divs[cb].className&&divs[cb].className=="tablewrapcrystaldatalong") {
                    ed=divs[cb];
                    break;
                }
            }
        }
        if (!ed) return;
        var imgs=ed.getElementsByTagName("img");
        if (!imgs||imgs.length==0) {
            return;
        }
        var eqs=[];
        for (var i=0;i<imgs.length;i++) {
            if (imgs[i].className&&imgs[i].className=="equationobject") {
                eqs.push(imgs[i]);
            }
        }
        dblk.eqimgs=eqs;

    }
    
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
  
    function _initAuLinkPopup()
    {

        if (_auLinkPup) return;  
        _auLinkPup=document.createElement("div");
        _auLinkPup.style.position="absolute";
        _auLinkPup.style.display="none";
        _auLinkPup.style.width="300px";
        _auLinkPup.style.backgroundColor="#ffffff";
        _auLinkPup.style.padding="5px";
        _auLinkPup.style.paddingBottom="10px";
        _auLinkPup.style.zIndex=1000;

        _auLinkPup.className="popup";
        document.body.appendChild(_auLinkPup);

        var closebut=document.createElement("img");
        closebut.style.cssFloat="right";
        closebut.style.marginLeft="5px";
        closebut.style.marginBottom="5px";
        closebut.style.padding="3px";
        closebut.style.cursor="pointer";
        closebut.src="//journals.iucr.org/logos/buttonlogos/cross.png";
        closebut.onclick=function(){_auLinkPup.style.display='none';return false;};
        _auLinkPup.appendChild(closebut);

        var contents=document.createElement("div");
        contents.style.position="relative";
        contents.style.width="280px";
        _auLinkPup.appendChild(contents);
        _auLinkPup.content=contents;


        _auLinkPup.show=function(ev, el, ihtml) {
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
            if (wd[0]<320) {
            this.style.width="220px";
            this.content.style.width="200px";
            var l=document.getElementById("orcid_url_label");
            if (l) l.style.display="none";
            }
            else {
            this.style.width="300px";
            this.content.style.width="280px";
            }
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

        if (window.addEventListener) {
            window.addEventListener('resize', function() {_auLinkPup.style.display="none";}, false); 
            window.addEventListener('scroll', function() {_auLinkPup.style.display="none";}, false);
        }
        else if (window.attachEvent) {
            window.attachEvent('onresize', function() {_auLinkPup.style.display="none";});
            window.attachEvent('onscroll', function() {_auLinkPup.style.display="none";});
        }
    }
    function _initHoverPopup()
    {

        if (_hoverPup) return; 
        
        _hoverPup=spwHoverPup.init();
        
    }
    
    
    function _setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function _getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
            c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    
    
    
    
} // end sup_cif_init

// HANDLER FOR IFRAME MESSAGES
//http://publcryst/widgets/pageels/test.php?fetch=http://journals.iucr.org/m/issues/2016/02/00/de5035/index.html
var sup_cifblocks=[];
var sup_cifblock_widgets=[];
function sup_cifmol_init(event) {
  var sd=document.getElementById('sup_imported');
  var e=event||window.event;
  var data=e.data.replace(/^\s*|\s*$/g, "");
  
  if (data.indexOf("#supCIF")==0) // the callback  will have been added as a tag+"\n"
       { 
	 var sp=true;
	 var view="mol";
	 var symr="";
	 var cif="";
	 var xtype="mol"; 
	 if (data.substr(7,1)=="I") {
	    view="cell5551";
	    symr="555-555";
	    xtype="cell5551";
	    sp=false;
	 }
	 if (data.substr(8,1)=="M") sp=false;
	 cif=data.substr(10); 
     
	 //new 4dec14 load blocks separately and look at cif to work out paper type
 
	  var cifsrc=new Scif(cif);
      
	  var bc=-1;
	  var pcat="";
	  for (var blk in cifsrc.blocks)
	  {
	    
	    if (pcat=="") {
	      var pc=cifsrc.blocks[blk].getItemValues(["_journal_paper_category"]);
	      if (pc&&pc.dvs&&pc.dvs.length>0)  {
		for (var p=0;p<pc.dvs.length;p++) {
		  if (pc.dvs[p].indexOf("I")>-1) {
		    pcat="I";
		    view="cell5551";
		    xtype="cell5551";
		    symr="555-555";
		    break;
		  }
		}
	      }
	    } else break;  
	  }
	  var skipcifmols=false; 
	  for (var blk in cifsrc.blocks)
	  {
	    if (cifsrc.blocks[blk].structure)
	    {
	      var hasBonds=false;
	      var bonds=cifsrc.blocks[blk].getItemValues(["_geom_bond_distance"]);
	      if (bonds&&bonds.dvs&&bonds.dvs.length>0) {
		hasBonds=true;  
	      }
	      var hasC=false;
          var symops=cifsrc.blocks[blk].getItemValues(["_space_group_symop_operation_xyz", "_symmetry_equiv_pos_as_xyz"]);
	      var sites=cifsrc.blocks[blk].getItemValues(["_atom_site_type_symbol", "_atom_site_label"]);
          var sitecount=1000;
          if (sites&&sites.dvs) {
            sitecount=sites.dvs.length;
            if (symops&&symops.dvs&&symops.dvs.length>0) sitecount*=symops.dvs.length;
          }
          if (sitecount>1000) skipcifmols=true;
        
          
	      if (sites&&sites.dvs&&sites.dvs.length>0) {
		for (var ss=0;ss<sites.dvs.length;ss++) {
		  if (sites.dvs[ss]=="C"||sites.dvs[ss].search(/^C\d/)>-1||sites.dvs[ss].search(/^C[\(\[\{]/)>-1||sites.dvs[ss].search(/^C[A-Z]/)>-1) {hasC=true;
		  break;
		  }
		}  
	      }
	      if (pcat==""&&!hasC) {
		view="cell5551";
		xtype="cell5551";
		symr="555-555";
	      }
	      if (!hasBonds) {
		view="cell5551";
		sp=false;
		xtype="cell5551";
		symr="555-555";
	      }
	      
	      var newcif=new Scif();
                newcif.blocks=[];
                newcif.blocks[blk]=cifsrc.blocks[blk];
                newcif.structureId=blk;
     
	      
	      
	      if (cifsrc.blocks[blk].mscif) {
		bc++;
		sup_cifblocks[bc]={id: cifsrc.blocks[blk].id, "src": newcif/*cifsrc.blocks[blk].rawdata*/, "model":"cell5551", "type": xtype, "sym":"555-555", "spin":false};
		if (sd&&sd.blockrefs&&sd.blockrefs[bc]&&sd.blockrefs[bc].eqimgs) {
		  var ms=cifsrc.blocks[blk].getWavevectorMatrices();
		  if (ms&&ms.tex) {
		    for (var t=0;t<sd.blockrefs[bc].eqimgs.length;t++) {
		      if (ms.tex[t]) {
			sd.blockrefs[bc].eqimgs[t].src="//publbio.iucr.org/publbio/opentex.php?tex="+encodeURIComponent(ms.tex[t])+"&type=.png";
		      }
		       
		    }
		  }
		}
	      }
	      else {
		if (sitecount>600) { /*sites&&sites.dvs&&sites.dvs.length>100) {*/
		  bc++;
		  sup_cifblocks[bc]={id: cifsrc.blocks[blk].id, "src": newcif/*cifsrc.blocks[blk].rawdata*/, "model":view, "type": xtype, "sym":"555-555", "spin":false};
		  
		}
		else {
		  bc++;
		  if (bc>0) sp=false;
		  sup_cifblocks[bc]={id: cifsrc.blocks[blk].id, "src": newcif/*cifsrc.blocks[blk].rawdata*/, "model":view, "type": xtype, "sym":symr, "spin":sp};
		  
		}
	      }
	      
	      
	    }
	  }
	  if (skipcifmols||bc>10) { // NEW - dont bother to show cifmol thumbs if huge cif
          sup_cifblock_widgets=sup_cifblocks; // widgets will stil be created upon demand
      }
	  else if (bc>-1) setTimeout(function(){sup_loadblock();}, 500);
              
      
      
       }
       else if (data.indexOf("#supRTVthumbs")==0) // the callback  will have been added as a tag+"\n"
       {
	 var htm=data.substr(14); 
         var d=document.getElementById("rtvthumbs");
         if (d) {
             d.style.position="relative";
             
             var plots=(htm.match(/\<img/g) || []).length;
             if (plots>0) {
             var pd=document.createElement("p");
             if (plots>1) pd.innerHTML="<p><a href=\"//publcif.iucr.org/services/tools/pdcifplot.php?artid="+d.coedid+"\" >Powder plots</a></p>";
             else pd.innerHTML="<p><a href=\"//publcif.iucr.org/services/tools/pdcifplot.php?artid="+d.coedid+"\" >Powder plot</a></p>";
             d.parentNode.insertBefore(pd, d);//appendChild(pd);
             d.innerHTML=htm; 
             d.style.display="block"; // CHANGE WHEN LIVE
             if (plots>8) {
                 BouncyScrollyDiv.init(d, {"scrollStep":"a","stepBounce":false,"scrollMode":"horizontal","buttonsPosition":"leftright", /*"buttonsClassName": "scrollyButtons",*/ "forwardbutton": "<div style='width:100%;'><img style='margin-top:20px;' src='//publcif.iucr.org/widgets/images/triang_r_24.png' border=0 /></div>", "backbutton": "<div style='width:100%;text-align:right'><img style='margin-top:20px;' src='//publcif.iucr.org/widgets/images/triang_l_24.png' border=0 /></div>"}); 
                 
             }
             }
         }
         
       }
       else if (data.indexOf("#supVIDthumbs")==0) // the callback  will have been added as a tag+"\n"
       {
	 var htm=data.substr(14); 
         var d=document.getElementById("videothumbs");
         if (d) {
             d.style.position="relative";
             
             var plots=(htm.match(/\<img/g) || []).length;
             if (plots>0) {
             var pd=document.createElement("p");
             pd.innerHTML="<p><a >Video</a></p>";
             d.parentNode.insertBefore(pd, d);//appendChild(pd);
             d.innerHTML=htm; 
             d.style.display="block"; 
             //if (plots>8) {
                 //BouncyScrollyDiv.init(d, {"scrollStep":"a","stepBounce":false,"scrollMode":"horizontal","buttonsPosition":"leftright", /*"buttonsClassName": "scrollyButtons",*/ "forwardbutton": "<div style='width:100%;'><img style='margin-top:20px;' src='//publcif.iucr.org/widgets/images/triang_r_24.png' border=0 /></div>", "backbutton": "<div style='width:100%;text-align:right'><img style='margin-top:20px;' src='//publcif.iucr.org/widgets/images/triang_l_24.png' border=0 /></div>"}); 
                 
             //}
             d.onmouseup=function(e) {
		  var ev=e||window.event;
		  if (!ev) return;
                  
		  var tel = ev.target||ev.srcElement;
		  if (tel==this) return;
		  if (tel.tagName=="IMG") {
			  var player=document.getElementById("IUCrVideoPlayer");
			  var container=document.getElementById("IUCrVideoPlayerWrap");
			  container.removeChild(player); // prevents change of src being added to history
                      player.src=tel.parentNode.getAttribute("data-player-uri");
                      player.style.display="block";
		      container.appendChild(player);
                      document.getElementById("IUCrVideoPlayerCaption").innerHTML=tel.parentNode.getAttribute("title");
                  }
                   
                };
             }
         }
         
       }
       else if (data.indexOf("#orcidList")==0) { 
         var olist=data.substr(11); 
         if (olist.indexOf("ORCIDs:")>-1) { // new
             var lines=olist.split("\n");
             document.body.orcidList=lines[0].replace(/^ORCIDs:\s*/i, "").split(",");
             document.body.iucridList=lines[1].replace(/^IUCRIDs:\s*/i, "").split(",");
         }
         else document.body.orcidList=olist.split(",");
         
         //if (window.location.href.indexOf("&test=true")>-1) {     
         for (var o=0;o< document.body.orcidList.length;o++) {
             if (!document.body.auels[o]) break;
             if (document.body.orcidList[o]!="") {
                 var i=document.createElement("img");
                 i.src="//orcid.org/sites/default/files/images/orcid_16x16.png";
                 i.style.width="12px";
                 i.style.height="12px";
                 document.body.auels[o].appendChild(i);
             }
         }
         //}
              
       }
       else if (data.indexOf("#citedby")==0) { 
         var cnum=data.substr(9);
         //var ilnk="";
         var ilnks=[];
            var rx=/^(.+)(<div\s+class=\"special_issue_link\".*?<\/div>)/ig;
            var mm=rx.exec(cnum);
            if (mm) {
                cnum=mm[1];
                var ilnk=mm[2];
                
                var ma=ilnk.match(/(<a\s[^>]+>.*?<\/a>)/ig);
                if (ma) {
                    for (var a of ma) {
                        ilnks.push("<div class=\"special_issue_link\" style=\"margin-top:.5em;max-width:300px;display:inline-block;\">"+a+"</div>");
                    }
                }
            }
         
         
         
         cnum=cnum.replace(/<span>/i, "<span style=\"border: 1px solid "+document.jlcol+";position:relative;top:1px;display:inline-block;padding-left:1px; padding-right:1px;\">");
         
          
         if (document.getElementById("right_hand_title_box")) {
            
            var el=null;
            var els=document.getElementById("fm").getElementsByTagName("div");
            for (var d=0;d<els.length;d++) {
                if (els[d].className&&els[d].className.indexOf("jh_openaccesslogo")>-1) {//els[d].className.indexOf("jinfo_header")>-1) {
                    el=els[d];
                    break;
                }
                else if (els[d].className&&els[d].className.indexOf("jh_doi")>-1) {//els[d].className.indexOf("jinfo_header")>-1) {
                    el=els[d];
                }
            }
             
              if (el) {
              var nd=document.createElement("div");
              nd.style.clear="both";
              el.parentNode.insertBefore(nd, el.nextSibling);
              var ns=document.createElement("span"); 
                    //ns.style.fontSize="80%";
                    ns.style.fontWeight="800";
                    //ns.className="jh_issueinfo";
                    //ns.style.textAlign="right";
                    //ns.innerHTML="<a href=\"//scripts.iucr.org/cgi-bin/citedin?"+document.coedid+"\">"+cnum+"</a>";
                    
                    cnum=cnum.replace(/class="citedby_count"/i, "class=\"jh_issueinfo\"");
                    //cnum=cnum.replace(/class="special_issue_link"/i, "class=\"jh_issueinfo\"");
                    ns.innerHTML=cnum;
                    //els[d].appendChild(ns);
                    nd.parentNode.insertBefore(ns, nd.nextSibling); //appendChild(ns);
           
              for (var ilnk of ilnks) {
                   
              if (ilnk!="") {
                  var lnd=document.createElement("div");
                    lnd.style.clear="both";
                    ns.parentNode.insertBefore(lnd, ns.nextSibling);
                  var lns=document.createElement("span"); 
                  lns.style.fontWeight="800";
                  //ilnk=ilnk.replace(/class="special_issue_link"/i, "class=\"jh_issueinfo\"");
                  lns.className="jh_issueinfo";
                  lns.innerHTML=ilnk;
                  lnd.parentNode.insertBefore(lns, lnd.nextSibling); //appendChild(ns);
                  
                  lns.onmouseover=function(e) {
                                var _hoverPup=spwHoverPup.init();
                                if (!this.poptitle) {
                                    var anc=this.getElementsByTagName("a")[0];
                                    this.poptitle="<a style=\"color:"+document.jlcol+"\" href=\""+anc.getAttribute("href")+"\">"+anc.getAttribute("title")+"</a>";
                                    anc.setAttribute("title", "");
                                }
                                if (_hoverPup.el==this&&_hoverPup.style.display=="block") {
                                    return false;
                                }
                                _hoverPup.show(e, this, this.poptitle);
                                return false;
                            };
                            lns.onmouseout=function(e) {
                                var _hoverPup=spwHoverPup.init();
                            if (!_isMouseOver(e, this)&&!_isMouseOver(e, _hoverPup)) {
                                _hoverPup.style.display="none"; 
                            }
                            return false;
                            };
                  
              }
              }  
            } 
             
             
         }
         else {
            // scripts pages
            var els=document.getElementsByTagName("span");
            for (var d=0;d<els.length;d++) {
                if (els[d].className&&els[d].className=="ica_doi") {
                    var ns=document.createElement("span");
                    ns.style.display="block";
                    //ns.style.fontSize="80%";
                    ns.style.fontWeight="800";
                    
                    ns.style.marginTop="3px";
                    //ns.innerHTML="<a href=\"//scripts.iucr.org/cgi-bin/citedin?"+document.coedid+"\">"+cnum+"</a>";
                    ns.innerHTML=cnum;
                    els[d].parentNode.insertBefore(ns, els[d].nextSibling); //appendChild(ns);
                    
          for (var ilnk of ilnks) {
          if (ilnk!="") {
                  var lnd=document.createElement("div");
                    lnd.style.clear="both";
                    ns.parentNode.insertBefore(lnd, ns.nextSibling);
                  var lns=document.createElement("span"); 
                  lns.style.fontWeight="800";
                  //ilnk=ilnk.replace(/class="special_issue_link"/i, "class=\"jh_issueinfo\"");
                  lns.innerHTML=ilnk;
                  lnd.parentNode.insertBefore(lns, lnd.nextSibling); //appendChild(ns);
                  
                  lns.onmouseover=function(e) {
                                var _hoverPup=spwHoverPup.init();
                                if (!this.poptitle) {
                                    var anc=this.getElementsByTagName("a")[0];
                                    this.poptitle="<a style=\"color:"+document.jlcol+"\" href=\""+anc.getAttribute("href")+"\">"+anc.getAttribute("title")+"</a>";
                                    anc.setAttribute("title", "");
                                }
                                if (_hoverPup.el==this&&_hoverPup.style.display=="block") {
                                    return false;
                                }
                                _hoverPup.show(e, this, this.poptitle);
                                return false;
                            };
                            lns.onmouseout=function(e) {
                                var _hoverPup=spwHoverPup.init();
                            if (!_isMouseOver(e, this)&&!_isMouseOver(e, _hoverPup)) {
                                _hoverPup.style.display="none"; 
                            }
                            return false;
                            };
                  
              }
              }
                break;
                }
            }
         }
       }
       else if (data.indexOf("proteopedia")==0) {
           var ph=parseInt(data.substr(12));
           var pif=document.getElementById("protoiframe");
           if (pif.ifh&&pif.ifh<ph&&ph<=500) return;
           if (parseInt(pif.style.height) > 650 ) return; // prob on old ipad
           if (ph>500) {
               pif.style.height=(ph+10)+"px";
               pif.ifh=ph+10;
           }
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
       
} 
function sup_loadblock()
{
  if (!sup_cifblocks||sup_cifblocks.length==0) return;
  var b=sup_cifblocks.shift();
  sup_cifblock_widgets.push(b);
  var cifp = new Smol(b.src, { readyCallback: function(){setTimeout(function(){sup_loadblock();}, 500);}, clickCallback:function(){var b=document.getElementById('cifmol').button; if (b) {b.style.opacity="1";}}, view:b.model, type:b.type, size: 100, symRange: b.sym, id:"cifmol", "show": -1, spin:b.spin });
  document.getElementById("cifmol").resetScroll();
  document.getElementById("cifmol")._winResize();
}

var spwHoverPup = (function() {
    var _hoverPup;
    function _init() {
        
        _hoverPup=document.createElement("div");
        
        _hoverPup.style.position="absolute";
        _hoverPup.style.display="none";
        _hoverPup.style.width="220px";
        _hoverPup.style.backgroundColor="transparent";
        _hoverPup.style.paddingTop="10px";
        _hoverPup.style.zIndex=1000;
        
        document.body.appendChild(_hoverPup);
        
        var view=document.createElement("div");
        view.className="popup";
        view.style.position="relative";
        view.style.display="block";
        view.style.padding="5px";
        _hoverPup.appendChild(view);

        var closebut=document.createElement("img");
        closebut.style.cssFloat="right";
        closebut.style.marginLeft="5px";
        closebut.style.marginBottom="5px";
        //closebut.style.padding="3px";
        closebut.style.cursor="pointer";
        closebut.src="//journals.iucr.org/logos/buttonlogos/cross.png";
        closebut.onclick=function(){_hoverPup.style.display='none';return false;};
        view.appendChild(closebut);

        var contents=document.createElement("div");
        contents.style.position="relative";
        contents.style.width="200px";
        view.appendChild(contents);
        _hoverPup.content=contents;
        
        _hoverPup.onmouseout=function(ev) {
            if (this.el) {
                if (!_isMouseOver(ev,this.el)&&!_isMouseOver(ev,this)) this.style.display="none";
            }
            else if (!_isMouseOver(ev, this)) {
                this.style.display="none";
            }
            return false;
        }
        _hoverPup.show=function(ev, el, ihtml) {
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
            /*
            if (wd[0]<320) {
            this.style.width="220px";
            this.content.style.width="200px";
            }
            else {
            this.style.width="300px";
            this.content.style.width="280px";
            }
            */
            
            var obj=el;
            var curleft = curtop = 0;
            if (obj.offsetParent) {
                do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
                } while (obj = obj.offsetParent);
            }
            // var pos=[curleft,curtop];
                       
            var xadj=-20;
            var yadj=-12;
            var cx=ev.clientX;
            var cy=ev.clientY;
            if (cy+this.offsetHeight>wd[1]) yadj-=(this.offsetHeight+24);
            if (cx+this.offsetWidth>wd[0]) xadj-=this.offsetWidth-(wd[0]-cx);
            if (x==undefined) {
            x=ev.clientX;
            y=ev.clientY;
            this.style.position="fixed";
            }
            this.style.top=(curtop+el.offsetHeight-1)+"px"; //(y+yadj)+"px";
            var l=(x+xadj);
            if (l<0) l=0;
            this.style.left=l+"px";
            }
        };

        if (window.addEventListener) {
            window.addEventListener('resize', function() {_hoverPup.style.display="none";}, false); 
            window.addEventListener('scroll', function() {_hoverPup.style.display="none";}, false);
        }
        else if (window.attachEvent) {
            window.attachEvent('onresize', function() {_hoverPup.style.display="none";});
            window.attachEvent('onscroll', function() {_hoverPup.style.display="none";});
        }
        
        
        
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
    
return {
    init: function() {
        if (!_hoverPup) {
            _init();
        }    
        return _hoverPup; 
        
    }
  };
})();


