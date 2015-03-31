//from stackoverflow
function createHiDPICanvas(w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    can = document.createElement("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

items = document.getElementsByTagName("*");
strBucket = "";
for (i = items.length; i >= 0; i--) {
    if( items[i] && items[i].offsetParent !== null){
        strBucket += items[i].innerText || items[i].textContent;
    }
}
strBucket = strBucket.replace(/[^\w\s]/g, '');
strs = strBucket.split(/\s/);
strs.sort();
map = {};
while(strs.length > 0){
    word = strs.pop();
    wordCount = 1;
    for(i = strs.length; i > 0; i--){
        toMatch = strs.pop();
        if(toMatch == word){
            wordCount++;
        } else {
            strs.push(toMatch);
            break;
        }
    }
    if(word.length > 3)
        map[word] = wordCount;
}
console.log(Object.keys(map).length);

canvas = createHiDPICanvas(500, 200, 4);
canvas.id = 'wordCloud';
element = document.getElementById("wordCloud");
if(element){element.parentNode.removeChild(element);}

document.body.insertBefore(canvas, document.body.firstChild);

words = Object.keys(map);
total = 0;
function sortObject(obj) {
    arr = [];
    for (prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            arr.push({
                'key': prop,
                'value': obj[prop]
            });
        }
    }
    arr.sort(function(a, b) { return b.value - a.value; });
    //arr.sort(function(a, b) { a.value.toLowerCase().localeCompare(b.value.toLowerCase()); }); //use this to sort as strings
    return arr; // returns array
}

arr = sortObject(map);

PIXEL_RATIO = (function () {
    ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();

//Create canvas with a custom resolution.
// myCustomCanvas = createHiDPICanvas(500, 200, 4);
ctx = canvas.getContext('2d');

tmp = arr[i];
ctx.font="10px Georgia";
// ctx.fillText(tmp.key, 10, 50);
final = [];

most = arr[0].value;
arr = arr.slice(0, 20);

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
    for( j = x = i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

shuffle(arr);
takenUp = 0;
widest = 0;
yPos = 10;
xPos = 10;
for(i = 0; i < arr.length; i++){
    tmp = arr[i];
    final.push(tmp);
    yPos = takenUp;
    fontSize = (tmp.value / most) * (50-5) + 5;
    console.log(fontSize);
    ctx.font= fontSize + "px Georgia";
    ctx.textBaseline = 'top';
    height = fontSize;
    width = ctx.measureText(tmp.key).width;

    if(width > widest)
        widest = width;
    if((height + takenUp) > canvas.clientHeight){
        takenUp = 0;
        xPos += widest;
        widest = width;
        yPos = 0;
    }
    if(xPos + width > canvas.clientWidth )
        break;
    ctx.fillText(tmp.key, xPos, yPos);
    takenUp += height;
}
link = document.createElement('a');
link.setAttribute('download', 'wordCloud.png');
link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
link.click();
