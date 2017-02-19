// @name Archive SNR and Path Logs
// @description Select and show the archived Signal Noise Ratio and Path logs
// @author Ton van Lankveld (ton.van.lankveld@philips.com)
// @version 0.0.1 (2017-02-11)
// @license MIT, path: MIT-LICENSE.txt
//
// Used library: jQuery 3.1.1 (http://jquery.com/)
//
// Documentation: JsDoc 3 Toolkit (http://usejsdoc.org/)


// @function
// @name attrGet
// @description Read the value of an attribute in a HTML tag
// @param {string} id - ID of the HTML tag
// @param {string} attr - Name of the attribute
// @return {string} outStr - Value if the attribute. False if ID or attribute is not found
function attrGet(id, attr) {
    "use strict";
    var outStr = "";

    var elemObj = document.getElementById(id);
    if (!elemObj) {
        return false;
    }
    var attrVal = elemObj.getAttribute(attr);
    if (!attrVal) {
        return false;
    }
    outStr = attrVal;
    return outStr;
}

// @function
// @name attrSet
// @description Set the value of an attribute in a HTML tag
// @param {string} id - ID of the HTML tag
// @param {string} attr - Name of the attribute
// @param {string} valAttr - Value of the attribute
// @return {boolean} True if ok. False if ID or attribute is not found
function attrSet(id, attr, valAttr) {
    "use strict";

    var elemObj = document.getElementById(id);
    if (!elemObj) {
        return false;
    }
    var resultObj = elemObj.setAttribute(attr, valAttr);
    if (!resultObj) {
        return false;
    }
    return true;
}

// @function
// @name dateStrToUnixTime
// @description Converts a string in yyyy-mm-dd format to Unix time (https://en.wikipedia.org/wiki/Unix_time)
// @param {string} dateStr - Date in yyyy-mm-dd format
// @return {integer} dateInt - Unix time in milliseconds
function dateStrToUnixTime(dateStr) {
    "use strict";
    var dateArr = [];
    var yearInt = 1970;
    var monthInt = 0;
    var dayInt = 1;
    var dateInt = 0;

    dateArr = dateStr.split("-");
    var year_ns = parseInt(dateArr[0]); // *_ns = not save
    if (Number.isInteger(year_ns)) {
        yearInt = year_ns;
    }
    var month_ns = parseInt(dateArr[1]); // *_ns = not save
    if (Number.isInteger(month_ns)) {
        monthInt = month_ns;
    }
    var day_ns = parseInt(dateArr[2]); // *_ns = not save
    if (Number.isInteger(day_ns)) {
        dayInt = day_ns;
    }
    var dateObj = new Date(Date.UTC(yearInt, monthInt, dayInt, 0, 0, 0, 0));
    dateInt = dateObj.getTime();
    return dateInt;
}

// @function
// @name unixTimeToDateStr
// @description Converts Unix time to a string in yyyy-mm-dd format
// @param {integer} dateInt - Unix time in milliseconds (https://en.wikipedia.org/wiki/Unix_time)
// @return {string} dateStr - Date in yyyy-mm-dd format
function unixTimeToDateStr(dateInt) {
    "use strict";
    var yearInt = 0;
    var monthInt = 0;
    var dayInt = 0;
    var yearStr = "";
    var monthStr = "";
    var dayStr = "";
    var dateStr = "";

    var dt = new Date(dateInt);
    yearInt = dt.getUTCFullYear();
    if (yearInt < 10) {
    	yearStr = "0" + yearInt.toString();
    } else {
    	yearStr = yearInt.toString();
    }
    monthInt = dt.getUTCMonth() + 1;  // January = 0, December = 11
    if (monthInt < 10) {
    	monthStr = "0" + monthInt.toString();
    } else {
    	monthStr = monthInt.toString();
    }
    dayInt = dt.getUTCDate();
    if (dayInt < 10) {
    	dayStr = "0" + dayInt.toString();
    } else {
    	dayStr = dayInt.toString();
    }
    dateStr = yearStr + '-' + monthStr + '-' + dayStr;
    return dateStr;
}

// @function
// @name whiteFilterStr
// @description Filter a string and allow only characters in the white list string
// @param {string} inputStr - String to be sanatized
// @param {string} whiteListStr - Allowed characters
// @return {string} cleanStr - Sanatized string. If fault then empty
function whiteFilterStr(inputStr, whiteListStr) {
    "use strict";
    var cleanStr = "";
    var inputStrLength = 0;
    var character = "";

    if ((typeof inputStr !== "string") || (typeof whiteListStr !== "string")) {
        return cleanStr;
    }
    inputStrLength = inputStr.length;
    // Filter the input string with the white list
    var i = 0;
    while (i < inputStrLength) {
        character = inputStr.charAt(i);
        if (whiteListStr.indexOf(character) !== -1) {
            cleanStr += character;
        }
        i += 1;
    }
    return cleanStr;
}

// @function
// @name validateIso8601Date
// @description Filter and validate a string with date data in ISO8601 format
// @requires whiteFilterStr()
// @param {string} inputStr - ISO8601 data data
// @return {string} iso8601Str - Correct ISO8601 string. If fault then empty
function validateIso8601Date(inputStr) {
    "use strict";
    var iso8601Str = "";
    var WHITELIST = "-0123456789";
    var ISO8601PATTERN = /(\d{4})-[01][0-9]-[0-3][0-9]/;  // Format: yyyy-mm-dd
    if (typeof inputStr !== "string") {
        return iso8601Str;
    }
    iso8601Str = whiteFilterStr(inputStr, WHITELIST);
    var result = iso8601Str.match(ISO8601PATTERN);
    if (result === null) {
        iso8601Str = "";
    }
    return iso8601Str;
}

// @function
// @name namePlotFiles
// @description Generate file names of requested plots and inject them in image tags
// @requires attrSet()
// @param {string} inputStr - Requested date
// @return {boolean} True if ok. False if ID's not found
function namePlotFiles(inputStr) {
    "use strict";
    var FPATH = "farosmaps/";

    var snrFilePath = FPATH + "S-" + inputStr + ".gif";
    var pathFilePath = FPATH + "P-" + inputStr + ".gif";
    attrSet("snrPlot", "scr", snrFilePath);
    attrSet("pathPlot", "scr", pathFilePath);
    return true;
}


// @name Main loop
// @requires jQuery
var inpAttrStr = "";
var dtMinStr = "";
var dtMinInt = 0;
var dtMaxStr = "";
var dtMaxInt = 0;
var dtNowObj = new Date();
var dtNowInt = dtNowObj.getTime();  // Unix time in milliseconds
var dtNowStr = "";
var dtReqStr = "";
var dtReqInt = 0;
var dateOffsetInt = 28*88640000; // Default days in the past. Days x milliseconds-in-a-day

$("div.error").hide();  // Hide 'JavaScript is required' message (check for JavaScript and jQuery)

// Initalisation and show default plots
inpAttrStr = attrGet("datePlots", "min");
dtMinStr = validateIso8601Date(inpAttrStr);
if (dtMinStr === "") {
    dtMinStr = "1996-09-01";
}
inpAttrStr = attrGet("datePlots", "max");
dtMaxStr = validateIso8601Date(inpAttrStr);
if (dtMaxStr === "") {
    dtNowStr = unixTimeToDateStr(dtNowInt);
    attrSet("datePlots", "max", dtNowStr);  // Set value of 'max' attribute in 'input' tag
    dtReqInt = dtNowInt - dateOffsetInt;
} else {
    dtReqInt = dateStrToUnixTime(dtMaxStr);
}
dtReqStr = unixTimeToDateStr(dtReqInt);
attrSet("datePlots", "value", dtReqStr);  // Write requested date in 'input' tag
namePlotFiles(dtReqStr);
