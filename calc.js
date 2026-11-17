const a=require('adhan');
const cities={alex:['الإسكندرية',31.2001,29.9187],cairo:['القاهرة',30.0444,31.2357],giza:['الجيزة',30.0131,31.2089],tanta:['طنطا',30.7865,31.0004],mansoura:['المنصورة',31.0409,31.3785],ismailia:['الإسماعيلية',30.5965,32.2715],matrouh:['مرسى مطروح',31.3543,27.2373],assiut:['أسيوط',27.1783,31.1859],luxor:['الأقصر',25.6872,32.6396],aswan:['أسوان',24.0889,32.8998]};
const fl=d=>new Date(Math.floor(d.getTime()/60000)*60000),ce=d=>new Date(Math.ceil(d.getTime()/60000)*60000);
const fmt=d=>new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Cairo',hour:'2-digit',minute:'2-digit',hour12:false}).format(d);
const out={start:'2027-02-08',days:30,cities:{}};
for(const [k,[n,lat,lng]] of Object.entries(cities)){
 const p=a.CalculationMethod.Egyptian();p.rounding='none'; const c=new a.Coordinates(lat,lng); const rows=[];
 for(let i=-1;i<31;i++){ // include day before (for Sahur countdown) and eid day
  const d=new Date(Date.UTC(2027,1,8+i,12)); const dc=new Date(2027,1,8+i);
  const t=new a.PrayerTimes(c,dc,p);
  const fj=fl(t.fajr);const imsak=new Date(fj.getTime()-10*60000);
  rows.push([d.toISOString().slice(0,10),fmt(imsak),fmt(fj),fmt(fl(t.sunrise)),fmt(ce(t.dhuhr)),fmt(ce(t.asr)),fmt(ce(t.maghrib)),fmt(ce(t.isha))]);
 }
 out.cities[k]={name:n,rows};
}
require('fs').writeFileSync('times.json',JSON.stringify(out));
const r=out.cities.alex.rows; console.log(r[1],r[15],r[30]); console.log(out.cities.cairo.rows[1]);
