/* إمساكية رمضان 1448 — النادي البحري للنيابة الإدارية */
(function(){
"use strict";
var CFG={
  ramadanDays:29,           // يُعدَّل إلى 30 إذا أكمل الشهر ثلاثين يومًا وفق إعلان دار الإفتاء المصرية
  hijriYear:"1448", gregYear:"2027",
  assets:{ logo:"./logo.png", logoSmall:"./assets/logo-256.png", callig:"./assets/kol-am-gold.png", clubCallig:"./assets/club-callig-gold.png", clubCalligWhite:"./assets/club-callig-white.png", ramadan:"./assets/ramadan-mubarak-gold.png" } // ملفات الهوية الرسمية للنادي
};
if(window.ASSETS) Object.assign(CFG.assets,window.ASSETS);
var GREETING="يتقدم النادي البحري للنيابة الإدارية بخالص التهاني وأطيب الأمنيات بمناسبة حلول شهر رمضان المبارك";
var T=window.TIMES, C=window.CONTENT, $=function(s,r){return (r||document).querySelector(s)};
var LS={get:function(k,d){try{var v=localStorage.getItem("ims:"+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set:function(k,v){try{localStorage.setItem("ims:"+k,JSON.stringify(v))}catch(e){}}};
var city=LS.get("city","alex"); if(!T.cities[city]) city="alex";
var AR="٠١٢٣٤٥٦٧٨٩"; function ar(x){return String(x).replace(/\d/g,function(d){return AR[d]})}
var qsNow=(location.search.match(/[?&]now=([^&]+)/)||[])[1];
var offset=qsNow? (new Date(decodeURIComponent(qsNow)).getTime()-Date.now()):0;
function now(){return new Date(Date.now()+offset)}
function rows(){return T.cities[city].rows}            // [0]=ليلة الرؤية، [1..30]=أيام رمضان، [31]=بعده
var P=["imsak","fajr","sunrise","dhuhr","asr","maghrib","isha"];
var PN={imsak:"الإمساك",fajr:"الفجر",sunrise:"الشروق",dhuhr:"الظهر",asr:"العصر",maghrib:"المغرب",isha:"العشاء"};
function day(i){var r=rows()[i];if(!r)return null;var o={i:i,date:r[0]};P.forEach(function(p,k){o[p]=r[k+1]});return o}
function at(date,hm){return new Date(date+"T"+hm+":00+02:00")} // مصر: التوقيت الشتوي +02:00 طوال فبراير ومارس 2027
function cairoDate(d){return new Intl.DateTimeFormat("en-CA",{timeZone:"Africa/Cairo",year:"numeric",month:"2-digit",day:"2-digit"}).format(d)}
function t12(hm){var h=+hm.slice(0,2),m=hm.slice(3);var s=h<12?"ص":"م";h=h%12||12;return ar(h+":"+m)+" "+s}
function gdate(date,opt){return new Intl.DateTimeFormat("ar-EG",Object.assign({timeZone:"UTC",weekday:"long",day:"numeric",month:"long",year:"numeric"},opt||{})).format(new Date(date+"T12:00:00Z"))}
function weekday(date){return new Date(date+"T12:00:00Z").getUTCDay()}
function dur(a,b){var m=Math.round((b-a)/60000);return ar(Math.floor(m/60))+" ساعة و"+ar(m%60)+" دقيقة"}
var ORD=["","الأول","الثاني","الثالث","الرابع","الخامس","السادس","السابع","الثامن","التاسع","العاشر","الحادي عشر","الثاني عشر","الثالث عشر","الرابع عشر","الخامس عشر","السادس عشر","السابع عشر","الثامن عشر","التاسع عشر","العشرون","الحادي والعشرون","الثاني والعشرون","الثالث والعشرون","الرابع والعشرون","الخامس والعشرون","السادس والعشرون","السابع والعشرون","الثامن والعشرون","التاسع والعشرون","الثلاثون"];
var JUZ=["","الم","سيقول","تلك الرسل","لن تنالوا","والمحصنات","لا يحب الله","وإذا سمعوا","ولو أننا","قال الملأ","واعلموا","يعتذرون","وما من دابة","وما أبرئ","ربما","سبحان الذي","قال ألم","اقترب","قد أفلح","وقال الذين","أمن خلق","اتل ما أوحي","ومن يقنت","وما لي","فمن أظلم","إليه يرد","حم","قال فما خطبكم","قد سمع الله","تبارك","عمّ"];

/* ---------- الحالة الزمنية ---------- */
function state(){
  var n=now(), today=cairoDate(n), R=rows(), N=CFG.ramadanDays, d0=day(0), last=day(N);
  if(n<at(d0.date,d0.maghrib)) return {phase:"before",target:at(d0.date,d0.maghrib),label:"متبقٍ على استقبال ليالي شهر رمضان المبارك"};
  if(n>=at(last.date,last.maghrib)){
    var eid=day(N+1)||{date:last.date}; var diff=(new Date(today)-new Date(eid.date))/864e5;
    return {phase:diff<=2?"eid":"after"};
  }
  var idx=0; for(var i=1;i<=N;i++) if(R[i][0]===today) idx=i;
  if(!idx) idx=1; // ليلة الأول من رمضان بعد المغرب
  var d=day(idx);
  if(today===d0.date) return {phase:"ramadan",idx:1,eve:true,target:at(day(1).date,day(1).imsak),label:"متبقٍ على الإمساك — سحور أول أيام رمضان",kind:"sahur"};
  if(n<at(d.date,d.imsak)) return {phase:"ramadan",idx:idx,target:at(d.date,d.imsak),label:"متبقٍ على الإمساك",kind:"sahur"};
  if(n<at(d.date,d.fajr)) return {phase:"ramadan",idx:idx,target:at(d.date,d.fajr),label:"متبقٍ على أذان الفجر",kind:"sahur"};
  if(n<at(d.date,d.maghrib)) return {phase:"ramadan",idx:idx,target:at(d.date,d.maghrib),label:"متبقٍ على أذان المغرب (الإفطار)",kind:"iftar"};
  var nx=day(idx+1); return {phase:"ramadan",idx:idx,after:true,target:at(nx.date,nx.imsak),label:"متبقٍ على إمساك يوم "+ar(idx+1)+" رمضان",kind:"sahur"};
}
function themeByTime(){
  var n=now(), d=day(Math.max(1,Math.min(CFG.ramadanDays,(state().idx||1)))), td=cairoDate(n);
  var base=day(1); rows().forEach(function(r,i){if(r[0]===td)base=day(i)});
  var c="t-night";
  if(n>=at(base.date,base.fajr)&&n<at(base.date,base.sunrise)) c="t-dawn";
  else if(n>=at(base.date,base.sunrise)&&n<at(base.date,base.asr)) c="t-day";
  else if(n>=at(base.date,base.asr)&&n<at(base.date,base.isha)) c="t-sunset";
  var s=state(); document.body.className=c+(s.phase==="ramadan"&&s.idx>20?" p-last10":"");
}

/* ---------- عناصر مشتركة ---------- */
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function clock(id,label,extra){return '<section class="card countdown" aria-live="off"><h3>'+label+'</h3><div class="clock" id="'+id+'"><div><b>--</b><small>ساعة</small></div><div><b>--</b><small>دقيقة</small></div><div><b>--</b><small>ثانية</small></div></div>'+(extra||"")+'</section>'}
var tick=null;
function runClock(id,target,onEnd){
  clearInterval(tick);
  function f(){var el=document.getElementById(id);if(!el){clearInterval(tick);return}
    var s=Math.max(0,Math.floor((target-now())/1000)); var dd=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60),x=s%60;
    var b=el.querySelectorAll("b"),sm=el.querySelectorAll("small");
    if(dd>0){b[0].textContent=ar(dd);sm[0].textContent="يوم";b[1].textContent=ar(h);sm[1].textContent="ساعة";b[2].textContent=ar(m);sm[2].textContent="دقيقة"}
    else{b[0].textContent=ar(String(h).padStart(2,"0"));sm[0].textContent="ساعة";b[1].textContent=ar(String(m).padStart(2,"0"));sm[1].textContent="دقيقة";b[2].textContent=ar(String(x).padStart(2,"0"));sm[2].textContent="ثانية"}
    if(s===0){clearInterval(tick);setTimeout(onEnd||route,1500)}}
  f(); tick=setInterval(f,1000);
}
function nextPrayer(d){var n=now();for(var k=1;k<P.length;k++){if(P[k]==="sunrise")continue;if(at(d.date,d[P[k]])>n)return P[k]}return null}
function timesBlock(d,isToday){
  var np=isToday?nextPrayer(d):null;
  var pr=["fajr","sunrise","dhuhr","asr","maghrib","isha"].map(function(p){return '<div class="'+(p===np?"next":"")+'"><div class="n">'+PN[p]+'</div><div class="t">'+t12(d[p])+'</div></div>'}).join("");
  return '<div class="big2"><div class="sahur"><div class="lbl">الإمساك</div><div class="val">'+t12(d.imsak)+'</div><div class="muted">السحور حتى أذان الفجر '+t12(d.fajr)+'</div></div><div class="iftar"><div class="lbl">الإفطار (المغرب)</div><div class="val">'+t12(d.maghrib)+'</div><div class="muted">مدة الصيام '+dur(at(d.date,d.fajr),at(d.date,d.maghrib))+'</div></div></div><div class="prayers">'+pr+'</div>';
}
function cityPicker(){return '<label class="muted" for="city">المدينة</label><select id="city">'+Object.keys(T.cities).map(function(k){return '<option value="'+k+'"'+(k===city?" selected":"")+'>'+T.cities[k].name+'</option>'}).join("")+'</select>'}
function bindCity(){var s=$("#city");if(s)s.onchange=function(){city=s.value;LS.set("city",city);route()}}
function toast(m){var t=$("#toast");t.textContent=m;t.classList.add("on");setTimeout(function(){t.classList.remove("on")},2200)}
function shareText(text,url){
  if(navigator.share){navigator.share({title:"رمضان كريم",text:text,url:url}).catch(function(){});}
  else{copy(text+"\n"+url)}
}
function wa(text,url){return "https://wa.me/?text="+encodeURIComponent(text+"\n"+url)}
function copy(s){if(navigator.clipboard)navigator.clipboard.writeText(s).then(function(){toast("تم النسخ")});}
function idxForContent(i){return (i-1)%30}

/* ---------- الصفحة الرئيسية ---------- */
function home(){
  var s=state(), visited=LS.get("visited",false), url=location.origin+"/";
  var compact=visited&&s.phase==="ramadan";
  var hero='<section class="hero'+(compact?" compact":"")+'"><div class="emblem"><img src="'+CFG.assets.logoSmall+'" width="256" height="256" alt="شعار النادي البحري للنيابة الإدارية"></div>'+
   (CFG.assets.clubCallig?'<img class="callig callig-club" src="'+CFG.assets.clubCallig+'" width="800" height="174" alt="النادي البحري للنيابة الإدارية">':'<p class="club">النادي البحري للنيابة الإدارية</p>');
  if(s.phase==="eid"||s.phase==="after"){
    hero+='<h1 class="ramadan">'+(s.phase==="eid"?"عيد فطر مبارك":"تقبّل الله منا ومنكم")+'</h1><div class="years">١٤٤٨ هـ <span class="lantern"></span> ٢٠٢٧ م</div>'+
      '<p class="greet">'+(s.phase==="eid"?"يتقدم النادي البحري للنيابة الإدارية إلى <span class=\"to\">السادة أعضاء النيابة الإدارية</span> وأسرهم الكريمة بأطيب التهاني بمناسبة عيد الفطر المبارك، أعاده الله علينا وعليكم بالخير واليمن والبركات.":"ودّعنا شهر رمضان المبارك، سائلين الله أن يتقبّل الصيام والقيام، وأن يعيده على <span class=\"to\">السادة أعضاء النيابة الإدارية</span> وأسرهم بالخير واليمن والبركات.")+'</p></section>';
    return hero+'<div class="btns"><a class="btn gold block" href="#/card">بطاقة تهنئة باسمك</a><a class="btn ghost block" style="color:#fff;border-color:#fff" href="#/month">عرض إمساكية الشهر</a></div>'+shareBlock("كل عام وأنتم بخير — تهنئة النادي البحري للنيابة الإدارية بعيد الفطر المبارك",url)+foot();
  }
  hero+='<h1 class="ramadan-img"><img src="'+CFG.assets.ramadan+'" width="1000" height="257" alt="شهر رمضان المبارك"></h1><div class="ribbon" aria-hidden="true"></div><div class="years">١٤٤٨ هـ <span class="lantern"></span> ٢٠٢٧ م</div>'+
   '<p class="greet">'+GREETING+'<br>إلى <span class="to">السادة أعضاء النيابة الإدارية</span> وأسرهم الكريمة</p><img class="callig kolam" src="'+CFG.assets.callig+'" width="900" height="229" alt="كل عام وأنتم بخير"></section>';
  var h=hero;
  if(s.phase==="before"){
    h+=clock("cd",s.label,'<p class="muted" style="color:#c9d6e6">أول أيام الصيام المتوقع: '+gdate(day(1).date)+' (فلكيًّا، ويُعتمد ما تعلنه دار الإفتاء المصرية)</p>');
    var d1=day(1);
    h+='<section class="card"><h2>إمساكية أول أيام رمضان</h2><p class="muted">'+T.cities[city].name+' • '+gdate(d1.date)+'</p>'+timesBlock(d1,false)+'</section>';
  } else {
    var d=day(s.idx);
    h+=clock("cd",s.label,s.kind==="iftar"?'<p style="margin:0;color:#f3d58a">الإفطار '+t12(d.maghrib)+'</p>':'');
    var shown=s.after?day(s.idx+1):d;
    h+='<section class="card"><div class="row"><h2>'+(s.after?"إمساكية الغد":"إمساكية اليوم")+' — '+ar(shown.i)+' رمضان</h2><span class="badge">'+T.cities[city].name+'</span></div><p class="muted">'+gdate(shown.date)+'</p>'+timesBlock(shown,!s.after)+
       '<div class="btns two" style="margin-bottom:0"><a class="btn navy" href="#/day/'+shown.i+'">تفاصيل اليوم</a><button class="btn ghost" id="chgCity">تغيير المدينة</button></div></section>';
  }
  h+='<div class="btns"><a class="btn gold block" href="#/month">▦ عرض جميع أيام الشهر</a>'+
     (isStandalone()?'':'<button class="btn navy block" id="install">⤓ تثبيت التطبيق على الهاتف</button>')+'</div>';
  h+=shareBlock("رمضان كريم 🌙\n"+GREETING+" إلى السادة أعضاء النيابة الإدارية.\nإمساكية رمضان ١٤٤٨هـ:",url);
  h+='<section class="card"><details><summary>كلمة مجلس الإدارة</summary><p class="quote" style="text-align:right">بسم الله الرحمن الرحيم<br>يسعد مجلس إدارة النادي البحري للنيابة الإدارية أن يهدي السادة الأعضاء وأسرهم هذه الإمساكية الرقمية، رفيقًا يوميًّا طوال الشهر الكريم، تجمع مواقيت الصلاة والإمساك والإفطار، وزادًا من الآيات والأحاديث والأدعية. سائلين الله أن يتقبل منا ومنكم صالح الأعمال، وأن يعيد هذه الأيام المباركة على مصرنا الغالية بالخير والأمن والرخاء.</p><p class="src">مجلس إدارة النادي البحري للنيابة الإدارية</p></details></section>';
  h+=foot();
  LS.set("visited",true);
  return h;
}
function shareBlock(text,url){return '<section class="card"><h3>شارك التهنئة</h3><div class="btns two" style="margin:0"><a class="btn wa" target="_blank" rel="noopener" href="'+wa(text,url)+'">واتساب</a><button class="btn ghost" data-share="'+esc(text)+'" data-url="'+esc(url)+'">مشاركة…</button></div></section>'}
function foot(){return '<footer class="club-foot"><b>النادي البحري للنيابة الإدارية</b><br>الإسكندرية • مع أطيب التمنيات بشهر مبارك<br><span>المواقيت محسوبة وفق طريقة الهيئة المصرية العامة للمساحة • الإمساك قبل الفجر بعشر دقائق</span></footer>'}
function afterHome(){
  var s=state(); if(s.target) runClock("cd",s.target);
  var b=$("#chgCity"); if(b)b.onclick=function(){sheet('<h2>اختيار المدينة</h2>'+cityPicker()+'<p class="muted">الإسكندرية هي المدينة الافتراضية، ويمكن اختيار مدينة أخرى.</p><button class="btn navy block" data-close>تم</button>');bindCity()};
  var i=$("#install"); if(i)i.onclick=installSheet;
}

/* ---------- صفحة اليوم ---------- */
function dayView(i){
  var N=CFG.ramadanDays; i=Math.max(1,Math.min(N,i|0)); var d=day(i), s=state(), isToday=s.phase==="ramadan"&&s.idx===i&&!s.eve, k=idxForContent(i);
  var ay=C.ayat[k], hd=C.hadith[k], du=(i>20)?C.qadrDua:C.dua[(i-1)%C.dua.length], url=location.origin+"/#/day/"+i;
  var sp="";
  if(i===1) sp='<div class="notice">اليوم الأول من الشهر الكريم — بداية الختمة: الجزء الأول</div>';
  if(i>20&&i%2===1) sp+='<div class="notice">✦ الليلة السابقة لهذا اليوم من ليالي الوتر في العشر الأواخر — تحرَّوا ليلة القدر</div>';
  if(i===21) sp+='<div class="notice">بدأت العشر الأواخر من رمضان — أعاننا الله وإياكم على إحيائها</div>';
  if(i===N) sp+='<div class="notice">آخر أيام رمضان المتوقعة — وداعًا شهر الخير، ويُعتمد موعد عيد الفطر وفق ما تعلنه دار الإفتاء المصرية</div>';
  var done=LS.get("khatma",{})[i];
  var h='<div class="dayhead"><p class="badge gold">'+(i>20?"العشر الأواخر":i>10?"العشر الوسطى":"العشر الأولى")+'</p><h1>'+ar(i)+' رمضان '+ar(CFG.hijriYear)+' هـ</h1><p>اليوم '+ORD[i]+' • '+gdate(d.date)+'</p></div>'+sp;
  if(isToday&&s.target) h+=clock("cd",s.label);
  h+='<section class="card"><div class="row"><h2>مواقيت اليوم</h2><span class="badge">'+T.cities[city].name+'</span></div>'+timesBlock(d,isToday)+'</section>';
  h+='<section class="card"><h3>آية اليوم</h3><p class="ayah">﴿ '+ay[0]+' ﴾</p><p class="src">سورة '+ay[1]+'</p></section>';
  h+='<section class="card"><h3>دعاء اليوم</h3><p class="quote">'+du[0]+'</p><p class="src">'+du[1]+'</p><div class="btns two" style="margin-bottom:0"><a class="btn wa" target="_blank" rel="noopener" href="'+wa("🤲 "+du[0],url)+'">مشاركة واتساب</a><button class="btn ghost" data-share="'+esc("🤲 "+du[0])+'" data-url="'+esc(url)+'">مشاركة…</button></div></section>';
  h+='<section class="card"><h3>حديث اليوم</h3><p class="quote">قال رسول الله ﷺ: «'+hd[0]+'»</p><p class="src">'+hd[1]+'</p></section>';
  h+='<section class="card"><div class="row"><h3>ورد القرآن</h3><span class="badge">الجزء '+ar(i)+'</span></div><p style="margin:0">الجزء '+ORD[i]+' — «'+JUZ[i]+'»</p><label class="checks"><label><input type="checkbox" id="wird" '+(done?"checked":"")+'> أتممت ورد اليوم</label></label>'+
     '<details><summary>نصيحة صحية</summary><p>'+C.tips[(i-1)%C.tips.length]+'</p></details><details><summary>عمل خير مقترح</summary><p>'+C.deeds[k]+'</p></details></section>';
  h+='<div class="nav2 noprint">'+(i>1?'<a class="btn ghost" style="color:#fff;border-color:#fff" href="#/day/'+(i-1)+'">→ اليوم السابق</a>':'<span></span>')+(i<N?'<a class="btn ghost" style="color:#fff;border-color:#fff" href="#/day/'+(i+1)+'">اليوم التالي ←</a>':'<span></span>')+'</div>';
  h+='<div class="btns two"><a class="btn wa" target="_blank" rel="noopener" href="'+wa("إمساكية "+ar(i)+" رمضان — الإمساك "+t12(d.imsak)+" والإفطار "+t12(d.maghrib)+" ("+T.cities[city].name+")",url)+'">مشاركة اليوم</a><a class="btn gold" href="#/month">جميع الأيام</a></div>';
  return h+foot();
}
function afterDay(i){var s=state();if(s.phase==="ramadan"&&s.idx===i&&!s.eve&&s.target)runClock("cd",s.target);
  var w=$("#wird");if(w)w.onchange=function(){var k=LS.get("khatma",{});k[i]=w.checked;LS.set("khatma",k);toast(w.checked?"تقبّل الله":"تم التحديث")}}

/* ---------- الشهر ---------- */
function month(){
  var N=CFG.ramadanDays, s=state(), mode=LS.get("mview","cal"), today=s.phase==="ramadan"?s.idx:0;
  var h='<div class="dayhead"><h1>إمساكية رمضان '+ar(CFG.hijriYear)+' هـ</h1><p>'+gdate(day(1).date,{weekday:undefined,year:undefined})+' – '+gdate(day(N).date,{weekday:undefined})+'</p></div>';
  h+='<section class="card"><div class="printhead"><h2>النادي البحري للنيابة الإدارية — إمساكية رمضان ١٤٤٨هـ / ٢٠٢٧م — '+T.cities[city].name+'</h2></div><div class="noprint">'+cityPicker()+'<div style="height:10px"></div><div class="seg"><button data-m="cal" class="'+(mode==="cal"?"on":"")+'">تقويم</button><button data-m="tbl" class="'+(mode==="tbl"?"on":"")+'">جدول</button></div></div>';
  if(mode==="cal"){
    var wds=["سبت","أحد","اثنين","ثلاثاء","أربعاء","خميس","جمعة"];
    h+='<div class="cal">'+wds.map(function(w){return '<div class="wd">'+w+'</div>'}).join("");
    var first=(weekday(day(1).date)+1)%7; for(var e=0;e<first;e++)h+='<span></span>';
    for(var i=1;i<=N;i++){var d=day(i),c=[];if(weekday(d.date)===5)c.push("fri");if(i>20)c.push("last10");if(i>20&&i%2===1)c.push("odd");if(today&&i<today)c.push("past");if(i===today)c.push("today");
      h+='<a href="#/day/'+i+'" class="'+c.join(" ")+'" aria-label="'+ar(i)+' رمضان"><b>'+ar(i)+'</b><small>'+ar(d.date.slice(8,10).replace(/^0/,""))+' '+(d.date.slice(5,7)==="02"?"فبراير":"مارس")+'</small><small>'+t12(d.maghrib).replace(/ م$/,"")+'</small></a>'}
    h+='</div><div class="legend"><span><i style="background:#fff;outline:2px solid var(--gold)"></i>اليوم</span><span><i style="background:#eef6fc"></i>الجمعة</span><span><i style="background:#f3ecff"></i>العشر الأواخر</span><span>✦ ليالي الوتر</span><span>الرقم الأسفل: موعد الإفطار</span></div>';
  } else {
    h+='<div style="overflow-x:auto"><table><thead><tr><th>رمضان</th><th>اليوم</th><th>الإمساك</th><th>الفجر</th><th>الشروق</th><th>الظهر</th><th>العصر</th><th>المغرب</th><th>العشاء</th></tr></thead><tbody>';
    var dn=["أحد","اثنين","ثلاثاء","أربعاء","خميس","جمعة","سبت"];
    for(var j=1;j<=N;j++){var x=day(j);h+='<tr class="'+(j===today?"today":weekday(x.date)===5?"fri":"")+'"><td><a href="#/day/'+j+'">'+ar(j)+'</a></td><td>'+dn[weekday(x.date)]+'<br><span class="muted">'+ar(+x.date.slice(8))+'/'+ar(+x.date.slice(5,7))+'</span></td>'+P.map(function(p){return '<td>'+ar(x[p].replace(/^0/,""))+'</td>'}).join("")+'</tr>'}
    h+='</tbody></table></div><p class="muted">التوقيتات بنظام ٢٤ ساعة وبالتوقيت المحلي لجمهورية مصر العربية.</p>';
  }
  h+='<p class="muted">يُعتمد عدد أيام الشهر وموعد عيد الفطر وفق ما تعلنه دار الإفتاء المصرية.</p><button class="btn navy block noprint" id="print">⎙ تحميل / طباعة الإمساكية PDF</button></section>';
  return h+foot();
}
function afterMonth(){bindCity();document.querySelectorAll("[data-m]").forEach(function(b){b.onclick=function(){LS.set("mview",b.dataset.m);route()}});
  $("#print").onclick=function(){LS.set("mview","tbl");route();setTimeout(function(){window.print()},300)}}

/* ---------- زاد رمضان ---------- */
var ADHKAR={
 "بعد الصلاة":[["سبحان الله",33],["الحمد لله",33],["الله أكبر",33],["لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير",1],["أستغفر الله",3]],
 "الصباح والمساء":[["رضيت بالله ربًّا، وبالإسلام دينًا، وبمحمد ﷺ نبيًّا",3],["بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم",3],["سبحان الله وبحمده",100],["اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك عليّ، وأبوء بذنبي فاغفر لي، فإنه لا يغفر الذنوب إلا أنت",1]],
 "النوم":[["باسمك اللهم أموت وأحيا",1],["سبحان الله",33],["الحمد لله",33],["الله أكبر",34]],
 "عام":[["أستغفر الله وأتوب إليه",100],["اللهم صلِّ وسلم على نبينا محمد",10],["لا حول ولا قوة إلا بالله",10],["اللهم إنك عفوّ كريم تحب العفو فاعفُ عني",10]]};
var IBADAT=["صلاة الفجر","صلاة الظهر","صلاة العصر","صلاة المغرب","صلاة العشاء","صلاة التراويح","ورد القرآن","أذكار الصباح والمساء","صدقة اليوم","صلة رحم أو عمل خير"];
function zad(){
  var k=LS.get("khatma",{}), n=0; for(var i=1;i<=30;i++) if(k[i]) n++;
  var tab=LS.get("ztab","بعد الصلاة"), td=cairoDate(now()), cnt=LS.get("dh:"+td,{}), chk=LS.get("ib:"+td,{});
  var h='<div class="dayhead"><h1>زاد رمضان</h1><p>أدوات تعبدية خفيفة — تُحفظ على جهازك فقط دون تسجيل حساب</p></div>';
  h+='<section class="card"><div class="row"><h2>ختمة القرآن</h2><span class="badge">'+ar(n)+' / ٣٠</span></div><div class="bar"><i style="width:'+(n/30*100)+'%"></i></div><div class="juz">';
  for(var j=1;j<=30;j++) h+='<button data-j="'+j+'" class="'+(k[j]?"done":"")+'" aria-pressed="'+(!!k[j])+'" title="الجزء '+ar(j)+'">'+ar(j)+'</button>';
  h+='</div><p class="muted">اضغط على رقم الجزء عند إتمامه. جزء واحد يوميًّا يُتم الختمة في الشهر.</p></section>';
  h+='<section class="card"><h2>الأذكار</h2><div class="seg" style="flex-wrap:wrap">'+Object.keys(ADHKAR).map(function(t){return '<button data-t="'+t+'" class="'+(t===tab?"on":"")+'">'+t+'</button>'}).join("")+'</div>';
  h+=ADHKAR[tab].map(function(a,x){var id=tab+x,c=cnt[id]||0;return '<div class="dhikr"><p>'+a[0]+'</p><button data-d="'+esc(id)+'" data-max="'+a[1]+'" class="'+(c>=a[1]?"full":"")+'">'+ar(c)+' / '+ar(a[1])+'</button></div>'}).join("");
  h+='<button class="btn ghost block" id="rst">تصفير العدّادات</button></section>';
  h+='<section class="card"><h2>متابعة العبادات اليومية</h2><p class="muted">'+gdate(td)+'</p><div class="checks">'+IBADAT.map(function(t,x){return '<label><input type="checkbox" data-c="'+x+'" '+(chk[x]?"checked":"")+'> '+t+'</label>'}).join("")+'</div></section>';
  h+='<section class="card"><h2>تذكير السحور والإفطار</h2><p class="muted">تنبيه قبل الإمساك بـ٣٠ دقيقة وقبل المغرب بـ١٠ دقائق أثناء فتح التطبيق (حسب دعم المتصفح).</p><button class="btn navy block" id="notif">'+(LS.get("notif",false)?"✓ التذكير مفعّل — إيقاف":"تفعيل التذكير")+'</button></section>';
  return h+foot();
}
function afterZad(){
  var td=cairoDate(now());
  document.querySelectorAll("[data-j]").forEach(function(b){b.onclick=function(){var k=LS.get("khatma",{});k[b.dataset.j]=!k[b.dataset.j];LS.set("khatma",k);route()}});
  document.querySelectorAll("[data-t]").forEach(function(b){b.onclick=function(){LS.set("ztab",b.dataset.t);route()}});
  document.querySelectorAll("[data-d]").forEach(function(b){b.onclick=function(){var c=LS.get("dh:"+td,{}),id=b.dataset.d,m=+b.dataset.max;c[id]=((c[id]||0)+1);if(c[id]>m)c[id]=0;LS.set("dh:"+td,c);b.textContent=ar(c[id])+" / "+ar(m);b.classList.toggle("full",c[id]>=m);if(c[id]===m&&navigator.vibrate)navigator.vibrate(60)}});
  $("#rst").onclick=function(){LS.set("dh:"+td,{});route()};
  document.querySelectorAll("[data-c]").forEach(function(b){b.onchange=function(){var c=LS.get("ib:"+td,{});c[b.dataset.c]=b.checked;LS.set("ib:"+td,c)}});
  $("#notif").onclick=function(){
    if(LS.get("notif",false)){LS.set("notif",false);route();return}
    if(!("Notification" in window)){toast("المتصفح لا يدعم التنبيهات");return}
    Notification.requestPermission().then(function(p){if(p==="granted"){LS.set("notif",true);scheduleNotifs();toast("تم تفعيل التذكير")}else toast("لم يتم السماح بالتنبيهات");route()})};
}
var nt=[];
function scheduleNotifs(){nt.forEach(clearTimeout);nt=[];if(!LS.get("notif",false)||!("Notification" in window)||Notification.permission!=="granted")return;
  var n=now();rows().forEach(function(r,i){if(i<1||i>CFG.ramadanDays)return;var d=day(i);
    [[at(d.date,d.imsak)-30*60000,"تذكير السحور","متبقٍ ٣٠ دقيقة على الإمساك ("+t12(d.imsak)+")"],[at(d.date,d.maghrib)-10*60000,"اقترب موعد الإفطار","أذان المغرب "+t12(d.maghrib)+" — اللهم لك صمت وعلى رزقك أفطرت"]].forEach(function(x){var ms=x[0]-n;if(ms>0&&ms<864e5)nt.push(setTimeout(function(){notify(x[1],x[2])},ms))})})}
function notify(t,b){if(navigator.serviceWorker&&navigator.serviceWorker.ready){navigator.serviceWorker.ready.then(function(r){r.showNotification(t,{body:b,icon:"./icons/icon-192.png",lang:"ar",dir:"rtl"})})}else new Notification(t,{body:b})}

/* ---------- بطاقة التهنئة ---------- */
function cardView(){
  return '<div class="dayhead"><h1>بطاقة تهنئة باسمك</h1><p>اكتب الاسم لتخصيص التهنئة، ثم شاركها صورةً عبر واتساب</p></div><section class="card"><label for="nm" class="muted">الاسم (اختياري)</label><input type="text" id="nm" maxlength="40" placeholder="مثال: المستشار/ أحمد محمد" value="'+esc(LS.get("name",""))+'"><div style="height:12px"></div><canvas id="cv" width="1080" height="1350" aria-label="معاينة بطاقة التهنئة"></canvas><div class="btns two"><button class="btn wa" id="shareImg">مشاركة الصورة</button><button class="btn gold" id="dl">تنزيل الصورة</button></div></section>'+foot();
}
var imgCache={};
function loadImg(src){if(!src)return Promise.resolve(null);if(imgCache[src])return imgCache[src];imgCache[src]=new Promise(function(res){var im=new Image();im.onload=function(){res(im)};im.onerror=function(){res(null)};im.src=src});return imgCache[src]}
function drawCard(){
  var cv=$("#cv");if(!cv)return Promise.resolve();var x=cv.getContext("2d"),W=1080,H=1350,name=($("#nm").value||"").trim(),eid=["eid","after"].indexOf(state().phase)>=0;
  return Promise.all([document.fonts?document.fonts.load("700 60px Messiri"):0,document.fonts?document.fonts.load("400 40px Naskh"):0,document.fonts?document.fonts.load("700 40px Cairo"):0,loadImg(CFG.assets.logo),loadImg(CFG.assets.callig),loadImg(CFG.assets.clubCalligWhite),loadImg(CFG.assets.ramadan)]).then(function(r){
    var logo=r[3],cal=r[4],club=r[5],ram=r[6];
    var g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,"#071a33");g.addColorStop(.6,"#0b2545");g.addColorStop(1,"#1d4e7e");x.fillStyle=g;x.fillRect(0,0,W,H);
    for(var i=0;i<90;i++){x.fillStyle="rgba(255,255,255,"+(0.3+Math.random()*0.6)+")";x.beginPath();x.arc(Math.random()*W,Math.random()*H*0.6,Math.random()*2.2,0,7);x.fill()}
    x.strokeStyle="#d4a537";x.lineWidth=6;x.strokeRect(36,36,W-72,H-72);x.lineWidth=2;x.strokeRect(54,54,W-108,H-108);
    x.fillStyle="#f3d58a";x.beginPath();x.arc(860,190,60,0,7);x.fill();x.fillStyle="#071a33";x.beginPath();x.arc(838,175,56,0,7);x.fill();
    x.fillStyle="rgba(143,195,232,.18)";x.beginPath();x.moveTo(0,H-150);for(var w=0;w<=W;w+=90)x.quadraticCurveTo(w+45,H-190,w+90,H-150);x.lineTo(W,H);x.lineTo(0,H);x.fill();
    x.fillStyle="rgba(11,37,69,.6)";x.beginPath();x.moveTo(0,H-110);for(var v=0;v<=W;v+=120)x.quadraticCurveTo(v+60,H-140,v+120,H-110);x.lineTo(W,H);x.lineTo(0,H);x.fill();
    if(logo){x.save();x.beginPath();x.arc(W/2,230,120,0,7);x.fillStyle="#fff";x.fill();x.clip();var sc=Math.min(220/logo.width,220/logo.height);x.drawImage(logo,W/2-logo.width*sc/2,230-logo.height*sc/2,logo.width*sc,logo.height*sc);x.restore();x.strokeStyle="#d4a537";x.lineWidth=6;x.beginPath();x.arc(W/2,230,124,0,7);x.stroke()}
    x.direction="rtl";x.textAlign="center";
    if(club){var kw=640,kh=club.height*kw/club.width;x.drawImage(club,W/2-kw/2,368,kw,kh)}else{x.fillStyle="#f3d58a";x.font="700 50px Messiri, Cairo";x.fillText("النادي البحري للنيابة الإدارية",W/2,420)}
    x.fillStyle="#fff";x.font="400 36px Naskh, serif";x.fillText(eid?"يتقدم بأطيب التهاني بمناسبة عيد الفطر المبارك":"يتقدم بخالص التهاني وأطيب الأمنيات",W/2,560);if(!eid)x.fillText("بمناسبة حلول شهر رمضان المبارك",W/2,612);
    x.font="400 34px Cairo";x.fillStyle="#c9d6e6";x.fillText("إلى",W/2,672);
    x.fillStyle="#f3d58a";x.font="700 "+(name.length>22?50:62)+"px Messiri, Cairo";x.fillText(name||"السادة أعضاء النيابة الإدارية",W/2,748);
    if(ram&&!eid){var rw=860,rh=ram.height*rw/ram.width;x.drawImage(ram,W/2-rw/2,785,rw,rh)}
    else{var gg=x.createLinearGradient(0,760,0,900);gg.addColorStop(0,"#ffffff");gg.addColorStop(1,"#f3d58a");x.fillStyle=gg;x.font="700 120px Messiri, Cairo";x.fillText(eid?"عيد مبارك":"رمضان كريم",W/2,880)}
    if(cal){var cw=620,ch=cal.height*cw/cal.width;x.drawImage(cal,W/2-cw/2,1012,cw,ch)}
    else{x.fillStyle="#fff";x.font="400 38px Naskh, serif";x.fillText("كل عام وأنتم بخير",W/2,1040)}
    x.font="400 30px Naskh, serif";x.fillStyle="#e7eef7";x.fillText("أعاده الله عليكم وعلى أسركم بالخير واليمن والبركات",W/2,1212);
    x.fillStyle="#d4a537";x.font="700 34px Cairo";x.fillText("١٤٤٨ هـ  •  ٢٠٢٧ م  •  الإسكندرية",W/2,1262);
  });
}
function afterCard(){var nm=$("#nm");var deb;nm.oninput=function(){LS.set("name",nm.value);clearTimeout(deb);deb=setTimeout(drawCard,150)};drawCard();
  function blob(){return new Promise(function(r){$("#cv").toBlob(r,"image/png")})}
  $("#dl").onclick=function(){blob().then(function(b){var a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="tahniat-ramadan.png";a.click()})};
  $("#shareImg").onclick=function(){blob().then(function(b){var f=new File([b],"tahniat-ramadan.png",{type:"image/png"});
    if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],title:"رمضان كريم",text:"تهنئة النادي البحري للنيابة الإدارية"}).catch(function(){});
    else{var a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="tahniat-ramadan.png";a.click();toast("تم تنزيل الصورة — أرسلها عبر واتساب")}})};
}

/* ---------- التثبيت ---------- */
var deferred=null; window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();deferred=e});
function isStandalone(){return matchMedia("(display-mode: standalone)").matches||navigator.standalone===true}
function installSheet(){
  var h='<h2>تثبيت الإمساكية على هاتفك</h2>'+(deferred?'<button class="btn gold block" id="doInstall">تثبيت الآن</button>':'')+
   '<h3>هواتف أندرويد (Chrome)</h3><ol><li>اضغط زر القائمة ⋮ أعلى المتصفح.</li><li>اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».</li><li>اضغط «تثبيت».</li></ol>'+
   '<h3>هواتف آيفون (Safari)</h3><ol><li>افتح الرابط من متصفح Safari.</li><li>اضغط زر المشاركة <b>⬆︎</b> أسفل الشاشة.</li><li>اختر «إضافة إلى الشاشة الرئيسية» ثم «إضافة».</li></ol>'+
   '<p class="muted">بعد التثبيت تعمل الإمساكية دون اتصال بالإنترنت.</p><button class="btn navy block" data-close>إغلاق</button>';
  sheet(h);
  var b=$("#doInstall");if(b)b.onclick=function(){deferred.prompt();deferred.userChoice.then(function(){deferred=null;closeSheet()})};
}
function sheet(h){var s=$("#sheet");s.innerHTML='<div class="in" role="dialog" aria-modal="true">'+h+'</div>';s.hidden=false}
function closeSheet(){$("#sheet").hidden=true}
document.addEventListener("click",function(e){var t=e.target;
  if(t.id==="sheet"||t.hasAttribute("data-close"))closeSheet();
  var sh=t.closest&&t.closest("[data-share]");if(sh)shareText(sh.dataset.share,sh.dataset.url)});

/* ---------- التوجيه ---------- */
function route(){
  var hsh=location.hash.replace(/^#\/?/,""), parts=hsh.split("/"), app=$("#app"), tab="home", s=state();
  clearInterval(tick); themeByTime();
  if(parts[0]==="today"){var i=s.phase==="ramadan"?s.idx:(s.phase==="before"?1:CFG.ramadanDays);location.replace("#/day/"+i);return}
  if(parts[0]==="day"){tab="day";app.innerHTML=dayView(+parts[1]);afterDay(Math.max(1,Math.min(CFG.ramadanDays,+parts[1]|0)))}
  else if(parts[0]==="month"){tab="month";app.innerHTML=month();afterMonth()}
  else if(parts[0]==="zad"){tab="zad";app.innerHTML=zad();afterZad()}
  else if(parts[0]==="card"){tab="card";app.innerHTML=cardView();afterCard()}
  else{app.innerHTML=home();afterHome()}
  document.querySelectorAll(".tabbar a").forEach(function(a){a.classList.toggle("on",a.dataset.tab===tab)});
  window.scrollTo(0,0);
}
var fs=LS.get("fs",1);function applyFs(){document.documentElement.style.setProperty("--fs",fs)}applyFs();
$("#fontUp").onclick=function(){fs=Math.min(1.4,+(fs+0.1).toFixed(2));LS.set("fs",fs);applyFs()};
$("#fontDown").onclick=function(){fs=Math.max(0.85,+(fs-0.1).toFixed(2));LS.set("fs",fs);applyFs()};
window.addEventListener("hashchange",route);
document.addEventListener("visibilitychange",function(){if(!document.hidden)route()});
setInterval(themeByTime,60000);
route(); scheduleNotifs();
if("serviceWorker" in navigator&&location.protocol==="https:")navigator.serviceWorker.register("./sw.js");
})();
