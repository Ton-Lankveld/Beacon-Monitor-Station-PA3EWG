// @name Archive SNR and Path Logs
// @description Select and show the archived Signal Noise Ratio and Path images
// @author Ton van Lankveld (lankveal@xs4all.nl)
// @version 0.1.1
// @license MIT, path: MIT-LICENSE.txt
//
// Used library: jQuery 3.6.x (http://jquery.com/)
//
// Documentation: JsDoc 3 Toolkit (https://jsdoc.app/)


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
        monthInt = month_ns - 1;  // January = 0, December = 11
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
// @param {string} inputStr - String to be sanitized
// @param {string} whiteListStr - Allowed characters
// @return {string} cleanStr - Sanitized string. If fault then empty
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
    var e1 = attrSet("snrPlot", "src", snrFilePath);
    var e2 = attrSet("pathPlot", "src", pathFilePath);
    if ((e1 === false) || (e2 === false)) {
        return false;
    } else {
        return true;
    }
}

// @function
// @name checkPrevNextButtons
// @description Check if the -1 or +1 buttons are correctly greyed out or not
// @requires jQuery
function checkPrevNextButtons() {
    "use strict";
    var dt = $("#selectSNRmap").data(); // Fetch dtObj from <form>
    var greyedOutPrevButtonBool = $("#datePrev").hasClass("greyOut");
    var greyedOutNextButtonBool = $("#dateNext").hasClass("greyOut");

    // Check -1 button
    if (dt.dtReq <= dt.dtMin) {
        if (greyedOutPrevButtonBool === false) {
            $("#datePrev").addClass("greyOut");
            $("#datePrev").off();
        }
    } else if (greyedOutPrevButtonBool === true) {
        $("#datePrev").removeClass("greyOut");
        $("#datePrev").on("click keypress", prevDayEvent );
    }
    // Check +1 button
    if (dt.dtReq >= dt.dtMax) {
        if (greyedOutNextButtonBool === false) {
            $("#dateNext").addClass("greyOut");
            $("#dateNext").off();
        }
    } else if (greyedOutNextButtonBool === true) {
        $("#dateNext").removeClass("greyOut");
        $("#dateNext").on("click keypress", nextDayEvent );
    }
    return;
}

// @function
// @name changeRequestedDate
// @description Add or subtract 1 day to/of the requested date and write it in <input>
// @requires jQuery
// @requires unixTimeToDateStr()
// @requires attrSet()
// @param {string} inputStr - "+" = +1 day, "-" = -1 day
function changeRequestedDate(inputStr) {
    "use strict";
    var dtReqStr = "";
    var dt = $("#selectSNRmap").data(); // Fetch dtObj from <form>

    // Remember: Check if "Enter' or "Tab" key is pressed

    if (inputStr === "+") {
        dt.dtReqInt = dt.dtReqInt + 86400000; // Number is milliseconds in one day
    } else if (inputStr === "-") {
        dt.dtReqInt = dt.dtReqInt - 86400000; // Number is milliseconds in one day
    } else {
        return;
    }
    // Make sure dtMin <= dtReq <= dtMax
    if (dt.dtReqInt < dt.dtMinInt) {
        dt.dtReqInt = dt.dtMinInt;
    }
    if (dt.dtReqInt > dt.dtMaxInt) {
        dt.dtReqInt = dt.dtMaxInt;
    }
    checkPrevNextButtons();
    dtReqStr = unixTimeToDateStr(dt.dtReqInt);
    attrSet("datePlots", "value", dtReqStr);  // Write new requested date in <input>
    return;
}

// @function
// @name getPlotsEvent
// @description Handles the event after the 'Get Plots' button is pressed
// @requires jQuery
// @requires validateIso8601Date()
// @requires dateStrToUnixTime()
// @requires checkPrevNextButtons()
// @requires unixTimeToDateStr()
// @requires attrSet()
// @requires namePlotFiles()
function getPlotsEvent() {
    "use strict";
    var inputStr = "";
    var dtReqStr = "";
    var dt = $("#selectSNRmap").data(); // Fetch dtObj from <form>

    inputStr = document.getElementById("datePlots").value;
    dtReqStr = validateIso8601Date(inputStr);
    if (!dtReqStr) {
       attrSet("datePlots", "value", "Correct format: yyyy-mm-dd");  // Write error message in <input>
       return;
    }
    dt.dtReqInt = dateStrToUnixTime(dtReqStr);
    // Make sure dtMin <= dtReq <= dtMax
    if (dt.dtReqInt < dt.dtMinInt) {
        dt.dtReqInt = dt.dtMinInt;
    }
    if (dt.dtReqInt > dt.dtMaxInt) {
        dt.dtReqInt = dt.dtMaxInt;
    }
    // checkPrevNextButtons();
    dtReqStr = unixTimeToDateStr(dt.dtReqInt);
    attrSet("datePlots", "value", dtReqStr);  // Write requested date in <input>
    namePlotFiles(dtReqStr);
    return;
}

// @function
// @name prevDayEvent
// @description Handles the event after the '-1' button is pressed
function prevDayEvent() {
    "use strict";
    changeRequestedDate("-");
    return;
}

// @function
// @name nextDayEvent
// @description Handles the event after the '+1' button is pressed
function nextDayEvent() {
    "use strict";
    changeRequestedDate("+");
    return;
}

// @function
// @name archiveSNRpathLogs
// @description Main loop
// @requires jQuery
// @requires attrGet()
// @requires validateIso8601Date()
// @requires dateStrToUnixTime()
// @requires unixTimeToDateStr()
// @requires attrSet()
// @requires namePlotFiles()
// @requires getPlotsEvent()
// @requires prevDayEvent()
// @requires nextDayEvent()
function archiveSNRpathLogs() {
    "use strict";
    var inpAttrStr = "";
    var dtMinStr = "";
    var dtReqStr = "";
    var dtMaxStr = "";
    var dtNowObj = new Date();
    var dtNowInt = dtNowObj.getTime();  // Unix time in milliseconds
    var dtObj = { dtMinInt: 0,
                  dtReqInt: 0,
                  dtMaxInt: 0
                };
    var DATEOFFSETINT = 28*86400000; // Default days in the past. Days x milliseconds-in-a-day

    $("div.error").hide();  // Hide 'JavaScript is required' message (check for JavaScript and jQuery)

    // Initialization and show default plots
    inpAttrStr = attrGet("datePlots", "min");
    dtMinStr = validateIso8601Date(inpAttrStr);
    if (!dtMinStr) {
       dtMinStr = "1996-09-01";
    }
    dtObj.dtMinInt = dateStrToUnixTime(dtMinStr);
    inpAttrStr = attrGet("datePlots", "max");
    dtMaxStr = validateIso8601Date(inpAttrStr);
    if (!dtMaxStr) {
        dtObj.dtMaxInt = dtNowInt;
        dtMaxStr = unixTimeToDateStr(dtObj.dtMaxInt);
        attrSet("datePlots", "max", dtMaxStr);  // Set value of 'max' attribute in <input>
        dtObj.dtReqInt = dtNowInt - DATEOFFSETINT;
    } else {
        dtObj.dtMaxInt = dateStrToUnixTime(dtMaxStr);
        dtObj.dtReqInt = dtObj.dtMaxInt;
    }
    dtObj.dtMaxInt = dateStrToUnixTime(dtMaxStr);
    dtReqStr = unixTimeToDateStr(dtObj.dtReqInt);
    $("#selectSNRmap").data(dtObj);  // Attach dtObj to <form>
    attrSet("datePlots", "value", dtReqStr);  // Write requested date in <input>
    namePlotFiles(dtReqStr);

    // Activate buttons
    $("#subButton").on("click keypress", getPlotsEvent );
    $("#datePrev").on("click keypress", prevDayEvent );
    $("#dateNext").on("click keypress", nextDayEvent );
    return;
}

archiveSNRpathLogs();
