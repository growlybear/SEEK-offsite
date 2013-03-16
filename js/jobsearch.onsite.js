var mainSeekSiteAddress = MainSeekSiteAddress;
var controlPrefix = 'cat';
var aCatSelected = new Array(0);
var aDefaultOverrides = new Array(0);
var isAdvancedKw = false;

//if(document.location.href.indexOf('.dev/')>-1)
//mainSeekSiteAddress = mainSeekSiteAddress + '.dev';

if (mainSeekSiteAddress.indexOf('.nz') > -1)
    document.write("<script type='text/javascript' src='" + mainSeekSiteAddress + "/Scripts/Taxonomy/onsite.class.nz-main.js'></script>");
else
    document.write("<script type='text/javascript' src='" + mainSeekSiteAddress + "/Scripts/Taxonomy/onsite.class.main.js'></script>");
document.write("<script type='text/javascript' src='" + mainSeekSiteAddress + "/Scripts/Taxonomy/onsite.searchbox.js'></script>");


addEvHandler(window, 'load', initPage, false);

//To Draw and Show controls according to user selected configurable options
function drawSearchJobControl(oSearch) {
    var showKeywords = (Settings["Show"].indexOf('keywords') > -1);
    var showClassification = (Settings["Show"].indexOf('classification') > -1);
    var showSubClassification = (Settings["Show"].indexOf('subclass') > -1);
    var showLocation = (Settings["Show"].indexOf('location') > -1);
    var showArea = (Settings["Show"].indexOf('area') > -1);
    var showWorkType = (Settings["Show"].indexOf('worktype') > -1);
    var showSalary = (Settings["Show"].indexOf('salary') > -1);
    var showResultsFrom = (Settings["Show"].indexOf('resultsfrom') > -1);
    var buttonText = Settings["ButtonText"];

    var o = document.getElementById(oSearch);
    if (o) {
        drawControl(document.getElementById(oSearch), showKeywords, showLocation, showClassification, showSubClassification, showArea, showSalary, showWorkType, showResultsFrom, buttonText);

        //Populate values
        if (showKeywords) {
            initTextBox(document.getElementById('Keywords'));
        }
        if (showLocation) {
            populateClassiferList("catparentlocation", "parentlocation_advanced", LimitLocationsList);
            document.getElementById('catparentlocation').options[0].selected = "selected";
        }
        if (showArea) {
            setAnyCopy('childlocation', 'Any Area');
            document.getElementById('catchildlocation').options[0].selected = "selected";
        }
        if (showClassification) {
            setAnyCopy('industry', 'Any Classification');
            populateClassiferList("catindustry", "industry", LimitClassificationsList);
        }
        if (showSubClassification) {
            setAnyCopy('occupation', 'Any Sub-Classification');
            document.getElementById('catoccupation').options[0].selected = "selected";
        }
        if (showWorkType) {
            setAnyCopy('worktype', 'Any WorkType');
            populateClassiferList("catworktype", "worktype");
        }

        if (showSalary) {
            //add code later
        }
    } else {
        //alert("Incorrect Job Search control ID name");
    }
}


function disableOptGroupIE6(selected) {
    if (selected.value == 'optgroup')
        selected.value = 0;

}
//toggles text for keywords field
function setKeywordTextbox(textBox) {
    if (textBox != null) {
        if (textBox.value == "Enter keyword(s)") {
            textBox.value = "";
            textBox.className = "";
        }
        else if (textBox.value == "") {
            textBox.value = "Enter keyword(s)";
            textBox.className = "disabled";
        }
    }
}
function clearTextBox(textBox) {
    if (textBox != null) {
        if (textBox.value == "Enter keyword(s)") {
            textBox.value = "";
            textBox.className = "";
        }
    }
}
function initTextBox(textBox) {
    if (textBox != null) {
        if (textBox.value == "Enter keyword(s)") {
            textBox.className = "disabled";
        }
        else
            textBox.className = "";
    }
}
//To do the search on the Seek main site
function doSearch() {

    //This full path is used for redirect users to seek search pages
    var NavToPath = "DateRange=";
    if (selectedValue("DateRange"))
        NavToPath = NavToPath + selectedValue("DateRange");
    else
        NavToPath = NavToPath + '31';

    if (selectedValue("catparentlocation")) {
        var location = selectedValue("catparentlocation").split('|');
        for (var i = 0; i < location.length; i++) {
            switch (location[i + 1]) {
                case '1': NavToPath = NavToPath + "&catlocation=" + location[i];
                    break;
                case '13': NavToPath = NavToPath + "&catstate=" + location[i];
                    break;
                case '12': NavToPath = NavToPath + "&catnation=" + location[i];
                    break;
            }
        }
    }
    if (selectedValue("catchildlocation") && selectedValue("catchildlocation") != 0 && selectedValue("catchildlocation") != 'Any Area') {
        if (selectedValue("catchildlocation").indexOf("|") > -1) {
            var areaSplit = selectedValue("catchildlocation").split('|');
            for (var k = 0; k < areaSplit.length; k++) {
                switch (areaSplit[k + 1]) {
                    case '1': NavToPath = NavToPath + "&catlocation=" + areaSplit[k];
                        break;
                    case '11': NavToPath = NavToPath + "&catarea=" + areaSplit[k];
                        break;
                }
            }
        }
        else
            NavToPath = NavToPath + "&catarea=" + selectedValue("catchildlocation");
    }
    if (selectedValue("catindustry") && selectedValue("catindustry") != 0)
        NavToPath = NavToPath + "&catindustry=" + selectedValue("catindustry");
    if (selectedValue("catoccupation") && selectedValue("catoccupation") != 0 && selectedValue("catoccupation") != 'Any Sub-Classification')
        NavToPath = NavToPath + "&catoccupation=" + selectedValue("catoccupation");
    if (selectedValue("Keywords"))
        NavToPath = NavToPath + "&Keywords=" + selectedValue("Keywords");
    if (selectedValue("catworktype") && selectedValue("catworktype") != 0)
        NavToPath = NavToPath + "&catworktype=" + selectedValue("catworktype");
    var navToLocation = mainSeekSiteAddress + "/jobsearch/index.ascx?" + NavToPath;

    //Adds advertiser id if it's selected from a drop down
    if (selectedValue("AdvertiserID") && selectedValue("AdvertiserID") != 0)
        navToLocation = navToLocation + "&AdvertiserID=" + selectedValue("AdvertiserID");
    else
        navToLocation = navToLocation + '&' + Settings["Advertiser"];

    if (typeof target == 'object') {
        if (document.getElementById("JSresults")) {
            document.getElementById("JSresults").src = navToLocation;
        }
        else {
            target.location.href = navToLocation;
        }
    }
    else {
        if (target == 'blank')
            window.open(navToLocation, 'Job_Search_Results');
        else if (target == '/alliances/gough-recruitment/index.htm')
            window.open(mainSeekSiteAddress + target + '?' + NavToPath, 'Job_Search_Results');
        else if (target == 'http://www.scotfordfennessy.com.au/search_jobs.php')
            window.location.href = target + '?' + NavToPath;
    }
}

//To add windows onload event to resolve caching problem
function addEvHandler(obj, evt, handler, captures) {
    if (obj.addEventListener)
        obj.addEventListener(evt, handler, captures);
    else if (obj.attachEvent)
        obj.attachEvent('on' + evt, handler);
    else {
        var oldHandler = obj['on' + evt];
        if (null == oldHandler)
            obj['on' + evt] = handler;
        else obj['on' + evt] = function () {
            oldHandler();
            handler();
        }
    }
}

//To get the seleceted values from controls
function selectedValue(obj) {
    var objCtrl = document.getElementById(obj);
    var retValue = "";
    if (objCtrl) {
        //retValue = objCtrl.value;
        if (obj == "Keywords") {
            retValue = objCtrl.value;
            if (retValue == 'Enter keyword(s)')
                retValue = "";
        }
        else {
            for (var i = 0; i < objCtrl.options.length; i++) {
                if (objCtrl.options[i].selected) {
                    if (retValue && objCtrl.options[i].value.indexOf('|') > 0)
                        retValue += '|' + objCtrl.options[i].value;
                    else if (retValue)
                        retValue += ',' + objCtrl.options[i].value;
                    else
                        retValue = objCtrl.value;

                }

            }
        }

    }
    return retValue;
}

//To draw the Searchbox dynamacally in client site
function drawControl(oSearch, showKeywords, showLocation, showClassification, showSubClassification, showArea, showSalary, showWorkType, showResultsFrom, buttonText) {

    if (oSearch) {
        var s = new stringBuilder();   //To improve the perf for following cocatenation
        var sWidth = Settings["Width"];

        if ((sWidth <= 200) || (sWidth == "")) { sWidth = "246"; }
        var sJSFieldWidth = sWidth - 20;

        s.append('<div id="header">' + Settings["SearchBoxTitle"] + '</div>');
        s.append('<div id="searchfields">');

        if (showKeywords) {
            s.append('<!-- Keywords -->');
            s.append('<label id="keywords-label">Keywords</label>');
            s.append('<input type="text" id="Keywords" name="Keywords" value="Enter keyword(s)" onblur="setKeywordTextbox(this);" maxlength="200" onclick="clearTextBox(this);"/>');

        }
        if (showClassification) {
            s.append('<!-- Classification -->');
            s.append('<label id="class-label">Classification</label>');
            s.append('<select ' + Settings["Multiple"] + ' size="' + Settings["Heights"][0] + '" name="catindustry" id="catindustry"');
            if (showSubClassification)
                s.append('onChange="ValidateCategoryList(&quot;industry&quot;,0,&quot;occupation&quot;,true)');
            s.append('"></select>');
        }
        if (showSubClassification) {

            s.append('<!-- Sub-classification -->');
            s.append('<label id="sub-class-label">Sub-classification</label>');
            s.append('<select ' + Settings["Multiple"] + ' size="' + Settings["Heights"][2] + '" name="catoccupation" id="catoccupation"><option>Any Sub-Classification</option></select>');

        }
        if (showLocation) {
            s.append('<!-- Location -->');
            s.append('<label id="location-label">Location</label>');
            s.append('<select ' + Settings["Multiple"] + ' size="' + Settings["Heights"][4] + '" name="catparentlocation" id="catparentlocation" onchange="disableOptGroupIE6(this);');
            if (showArea)
                s.append('ValidateCategoryList(&quot;parentlocation&quot;,0,&quot;childlocation&quot;,true);');
            s.append('"></select>');
        }
        if (showArea) {
            s.append('<!-- Area -->');
            s.append('<label id="area-label">Area</label>');
            s.append('<select ' + Settings["Multiple"] + ' size="' + Settings["Heights"][6] + '" name="catchildlocation" id="catchildlocation" onchange="disableOptGroupIE6(this)"><option>Any Area</option></select>');
        }
        if (showWorkType) {
            s.append('<!-- WorkType -->');
            s.append('<label id="work-type-label">Work Type</label>');
            s.append('<select ' + Settings["Multiple"] + ' size="' + Settings["Heights"][8] + '" name="catworktype" id="catworktype"></select>');
        }
        if (showResultsFrom) {
            s.append('<!-- Results From -->');
            s.append('<label id="results-from-label">Show Me Jobs From</label>');
            s.append('<select size="' + Settings["Heights"][10] + '" name="DateRange" id="DateRange"><option value="999">Any</option><option value="1">Today</option><option value="3">Last 3 Days</option><option value="7">Last 7 Days</option><option value="14">Last 14 Days</option><option selected="true" value="31">Last 30 Days</option></select>');
        }
        if (showSalary) {
            //add code later
        }
        s.append('<div id="searchbutton">');

        s.append('<a href="javascript:doSearch()"><strong>' + buttonText + '</strong></a>');
        s.append('</div>');
        s.append('</div>');

        oSearch.innerHTML = s.toString();
    }
}

//* string builder javascript function *
function stringBuilder(strvalue) {
    this.strings = new Array("");
    this.append(strvalue);
}

// Appends the given value to the end of this instance.
stringBuilder.prototype.append = function (strvalue) {
    if (strvalue) {
        this.strings.push(strvalue);
    }
}

// Clears the string buffer
stringBuilder.prototype.clear = function () {
    this.strings.length = 1;
}

// Converts this instance to a String.
stringBuilder.prototype.toString = function () {
    return this.strings.join("");
}

function GetObjectByPartName(name, matchIndex) {
    var obj; // string which is return referencing object by element id
    var elementnumber;
    var elementname;
    var numberOfMatches = 0;

    //Go through the forms collection
    for (var i = 0; i < document.layout.length; i++) {
        elementname = document.layout.elements[i].name.toString();

        // if the object name passed equals the object name in the form collection - return it's number
        if (elementname.indexOf(name) != -1) {
            numberOfMatches++;

            if (matchIndex == undefined || numberOfMatches == matchIndex) {
                elementnumber = i;
                obj = document.layout.elements[i]
                break;
            }

        }
    }

    // create the string which can be used to reference this object and return it could be used for Net 4.7
    //obj = "document.layout.elements[" + elementnumber + "]";

    return obj;
}
