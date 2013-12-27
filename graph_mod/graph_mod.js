// ==UserScript==
// @name           Kraland - Graph Mod
// @namespace      none
// @require        http://danproposkanovovski.free.fr/kraland/graph_mod/Chart.min.js
// @include        http://www.kraland.org/main.php?p=6_1*
// ==/UserScript==

var mod_tbl       = document.getElementsByClassName("forum")[2];
var mod_tbl_lines = [].slice.call(mod_tbl.getElementsByTagName("tr"), 0);
var mod_lines     = mod_tbl_lines.filter(
  function (el) {
    return (el.className === 'forum-c1'
        || el.className === "forum-c2") }
  ).reverse();

var mods   = [];
var bound  = mod_lines.length;
var partial_total    = 0;
var partial_sanction = 0;
var date             = '';
var offset = 0;
var i      = 0;

for (i = 0; i < bound; i++)
{
  var tds     = mod_lines[i].getElementsByTagName("td");
  var mod_typ = tds[1].innerHTML;
  var mod     = 0;
  var san     = 0;
       if (mod_typ.indexOf("conseil")   > - 1) { mod = 2 }
  else if (mod_typ.indexOf("sanction")  > - 1) { mod = 3 ; san = 3 };
  if (mod > 0)
  {
    dat     = tds[2].innerHTML.replace(/ (.*)/g,'');
    partial_total    += mod;
    partial_sanction += san;
    if (dat === date) {
      offset++;
      mods[i - offset].sum = partial_total;
      mods[i - offset].san = partial_sanction;
    } else
    { mods.push({ "sum" : partial_total
                , "san" : partial_sanction
                , "dat" : dat}); }
    date = dat;
  } else { offset++ }
};

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

var canvas  = document.createElement("center");
var url     = document.createElement("a");
var graph   = document.createElement("canvas");
graph.id    = "myChart"; graph.width = 600; graph.height = 300;
url.onclick =
 function () {
   var dataUrl = graph.toDataURL("image/png");
   window.open(dataUrl, "toDataURL() image"); }
url.appendChild(graph);
canvas.appendChild(url);

var target = document.getElementById('central-text')
                     .getElementsByTagName("h4")[5];
if (mods.length > 1) { insertAfter(target, canvas); }

var ctx = document.getElementById("myChart").getContext("2d");
var data = {
	labels : mods.map(function (el) { return el.dat }),
	datasets : [
		{
			fillColor : "rgba(120,122,122,0.5)",
			strokeColor : "rgba(120,122,122,1)",
			pointColor : "rgba(120,122,122,1)",
			pointStrokeColor : "#fff",
			data : mods.map(function (el) { return el.sum })
		},
		{
			fillColor : "rgba(255,0,0,0.5)",
			strokeColor : "rgba(255,0,0,1)",
			pointColor : "rgba(255,0,0,1)",
			pointStrokeColor : "#fff",
			data : mods.map(function (el) { return el.san })
		}
	]
}

var step = 2;
var myNewChart = new Chart(ctx).Line(data,{
    scaleOverride: true,
    scaleSteps: Math.ceil(mods[mods.length - 1].sum / step),
    scaleStepWidth: step,
    scaleStartValue: 0,
    bezierCurve : false,
});

