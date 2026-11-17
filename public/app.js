const $ = (id) => document.getElementById(id);
const palette = [[0,0,0],[205,49,49],[13,188,121],[229,229,16],[36,114,200],[188,63,188],[17,168,205],[229,229,229],[102,102,102],[241,76,76],[35,209,139],[245,245,67],[59,142,234],[214,112,214],[41,184,219],[255,255,255]];
const rgb = (hex) => hex.match(/[\da-f]{2}/gi).map(v => parseInt(v,16));
const nearest16 = (c) => palette.reduce((best,p,i) => { const d=p.reduce((s,v,j)=>s+(v-c[j])**2,0); return d<best.d?{i,d}:best; },{i:0,d:Infinity}).i;
function colorCode(hex, kind, mode) {
  const c=rgb(hex);
  if(mode==="truecolor") return kind==="fg" ? "38;2;"+c.join(";") : "48;2;"+c.join(";");
  if(mode==="256") {
    const gray=(c[0]+c[1]+c[2])/3;
    const index=(Math.max(...c)-Math.min(...c)<8) ? Math.max(232,Math.min(255,232+Math.round((gray-8)/10))) : 16+36*Math.round(c[0]/51)+6*Math.round(c[1]/51)+Math.round(c[2]/51);
    return (kind==="fg"?38:48)+";5;"+index;
  }
  const index=nearest16(c);
  return kind==="fg" ? (index<8?30+index:90+index-8) : (index<8?40+index:100+index-8);
}
function render() {
  const mode=$("mode").value, fg=$("foreground").value, bg=$("background").value, sample=$("sample").value || "Sample text";
  const codes=[colorCode(fg,"fg",mode),colorCode(bg,"bg",mode)];
  $("preview").textContent=sample; $("preview").style.color=fg; $("preview").style.backgroundColor=bg;
  $("snippet").textContent=String.raw`\x1b[${codes.join(";")}m${sample}\x1b[0m`;
  $("mode-label").textContent=mode==="truecolor"?"TRUECOLOR":mode==="256"?"256 COLORS":"16 COLORS";
}
["mode","foreground","background","sample"].forEach(id=>$(id).addEventListener("input",render));
$("copy").addEventListener("click",async()=>{try{await navigator.clipboard.writeText($("snippet").textContent);$("copy").textContent="Copied";setTimeout(()=>$("copy").textContent="Copy snippet",1200)}catch{$("copy").textContent="Clipboard unavailable"}});
render();
