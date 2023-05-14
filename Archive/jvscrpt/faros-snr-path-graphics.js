// @name Faros SNR and Path Graphics
// @description Show every 15 minutes the latest Signal to Noise Ratio (SNR) and Path measurements as graphics.
// @author Ton van Lankveld (lankveal@xs4all.nl)
// @version 0.1.0
// @license MIT, path: MIT-LICENSE.txt
//
// Used library: jQuery 3.2.x (http://jquery.com/)
//
// Documentation: JsDoc 3 Toolkit (https://jsdoc.app/)

// @function
// @name farosSnrPath
// @description Main loop
// @requires jQuery
function farosSnrPath() {
    var DIRECTORYSTR = "farosmaps/";
    // Generate date of today
    var d = new Date();
    var m = d.getUTCMonth()+1;
    var day = d.getUTCDate();
    var yr = d.getUTCFullYear();
    // Generate date of yesterday
    var y = new Date();
    y.setDate(y.getDate()-1);
    var my = y.getUTCMonth()+1;
    var dy = y.getUTCDate();
    var yy = y.getUTCFullYear();
    // Construct paths to graphics
    var currentUTCstr = yr+"-"+(m < 10 ? "0"+m : m)+"-"+(day<10 ? "0"+day : day);
    var snrMapTodayStr = DIRECTORYSTR +"S-"+yr+"-"+(m < 10 ? "0" + m : m)+"-"+(day < 10 ? "0" + day : day)+".gif";
    var pathMapTodayStr = DIRECTORYSTR +"P-"+yr+"-"+(m < 10 ? "0" + m : m)+"-"+(day < 10 ? "0" + day : day)+".gif";
    var snrMapYesterdayStr = DIRECTORYSTR +"S-"+yy+"-"+(my < 10 ? "0" + my : my)+"-"+(dy < 10 ? "0" + dy : dy)+".gif";
    var pathMapYesterdayStr = DIRECTORYSTR +"P-"+yy+"-"+(my < 10 ? "0" + my : my)+"-"+(dy < 10 ? "0" + dy : dy)+".gif";
    
    // Set current UTC date
    $( "#currentUTCsnr" ).append( currentUTCstr );
    $( "#currentUTCpath" ).append( currentUTCstr );
    // Set path to SNR graphics
    $( "#snrMapYesterday" ).attr( "href", snrMapYesterdayStr );
    $( "#snrMapYesterday > img" ).attr( "src", snrMapYesterdayStr );
    $( "#snrMapToday" ).attr( "href", snrMapTodayStr );
    $( "#snrMapToday > img" ).attr( "src", snrMapTodayStr );
    // Set path to Path graphics
    $( "#pathMapYesterday" ).attr( "href", pathMapYesterdayStr );
    $( "#pathMapYesterday > img" ).attr( "src", pathMapYesterdayStr );
    $( "#pathMapToday" ).attr( "href", pathMapTodayStr );
    $( "#pathMapToday > img" ).attr( "src", pathMapTodayStr );
}

farosSnrPath();
