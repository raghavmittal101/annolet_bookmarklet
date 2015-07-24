
var $j = jQuery.noConflict();

annolet_main();

var annolet_btn;
// function to create annolet controls container
function annolet_createContainer() {
    // appending a CSS stylesheet to head of webpage
    var link = document.createElement('link');
    link.href = "//ba8fbd5823dec19f2a925b874342f02f325c5581.googledrive.com/host/0B0c01D4InsAOflQ0TUhidTJPUTNycmpyR0IwQ2R1RzBnSVE0SVNzLUxPeHcxOEZVM2RISzg/final/control-menu.css?v=" + parseInt(Math.random() * 999); //a random mock version number is added everytime file is called to prevent loading of cached css file by browser.
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName('head')[0].appendChild(link);

    // appending a div to body of webpage
    var body = document.getElementsByTagName('body')[0];
    var annolet_container = document.createElement('div');
    annolet_container.id = 'annolet-container';
    body.appendChild(annolet_container);
    //injecting html code
    document.getElementById('annolet-container').innerHTML = "<ul class=annolet-tools-menu><span style='border-radius:10px;  color:orange;font-weight:bold;font-family:monospace; font-size:1.3em'>AnnoLet!</span><span style='color:grey;'>|</span><li class=annolet-tools-menu-item id=login-btn>login</li><li class=annolet-tools-menu-item id=addnote_btn onclick='annolet_btn=2;' >annotate</li><li class=annolet-tools-menu-item id=highlight-btn onclick='annolet_btn=1;'>highlight</li><li class=annolet-tools-menu-item id=save-btn>save</li><li class=annolet-tools-menu-item id=exit-btn onclick='annolet_btn=0;'>exit</li></ul>"; //HTML to create a list of options
}

// function to get Xpath to passed element
function anno_getXpathTo(element) {
    if (element.id !== '') {
        return "//*[@id='" + element.id + "']";
    }
    if (element === document.body) {
        return "html/" + element.tagName.toLowerCase();
    } //added 'html/' to generate a valid Xpath even if parent has no ID.
    var ix = 0;
    var siblings = element.parentNode.childNodes;
    for (var i = 0; i < siblings.length; i++) {
        var sibling = siblings[i];
        if (sibling === element) {
            return anno_getXpathTo(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
        }
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
            ix++;
        }
    }
}

// function to evaluate element from Xpath
function anno_getElementByXpath(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

//main function which will execute other functions
function annolet_main() {
    annolet_createContainer();
    document.onclick = function(event) {
        if (event === undefined) {
            event = window.event;
        } // for IE
        var target = 'target' in event ? event.target : event.srcElement; // for IE
        var root = document.compatMode === 'CSS1Compat' ? document.documentElement : document.body;
        var xpath = anno_getXpathTo(target);        
        if (annolet_btn === 1) {
            anno_highlight(xpath);
        } else if (annolet_btn === 2) {
            anno_annotate(xpath);  //for now this function not available
        }
    };
}

//function to push objects to a stack.
var i = 1; //counter for id
var annolet_stack = []; //object will be pushed to this
function annolet_pushToStack(xpath, anno_content) {
    if (!anno_content) {
        anno_content = null;
    } //initializing anno_content to null if highlighting done.
    var annolet_obj = {
        authorname: 'raghav',
        id: i++,
        type: annolet_btn, //1 for highlight, 2 for annotation.
        content: anno_content, //would be null if highlighting is done only.
        xpath: xpath
    };
    // pushing data to stack
    annolet_stack.push(annolet_obj);
}

//function for highlighting element
function anno_highlight(xpath) {
    //if element is already highlighted
    if (anno_getElementByXpath(xpath).id != "mark" || !(anno_getElementByXpath(xpath).id)) {
        // hightlight selected element, calling function
        $j(anno_getElementByXpath(xpath)).wrapInner("<span id='mark' style='background:yellow;'></span>");
        annolet_pushToStack(xpath);
    } else {
        console.log('highlighted already');
    }
}

function anno_annotate(xpath){
if (anno_getElementByXpath(xpath).id != "mark" || !(anno_getElementByXpath(xpath).id)) {
        //adding orange coloured border around selected part.
        $j(anno_getElementByXpath(xpath)).wrapInner("<span id='mark' style='border:solid 1px orange;'></span>");
        annolet_pushToStack(xpath);
    } else {
        console.log('highlighted already');
    }
}