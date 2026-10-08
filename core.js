(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.EnergyCalc=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const FIELDS=['id','name','currency','baselineWatts','baselineHours','alternativeWatts','alternativeHours','days','rate'];
  function object(value,keys,label){if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length!==keys.length||keys.some(k=>!Object.hasOwn(value,k)))throw new Error(label+' has unexpected or missing fields.');}
  function text(value,max,label){if(typeof value!=='string'||!value.trim()||value.length>max||/[\u0000-\u001f\u007f]/.test(value))throw new Error(label+' must contain 1–'+max+' characters without control characters.');return value.trim();}
  function number(value,min,max,label){if(typeof value!=='number'||!Number.isFinite(value)||value<min||value>max)throw new Error(label+' must be a finite number from '+min+' to '+max+'.');if(min===0&&value>0&&value<1e-9)throw new Error(label+' must be zero or at least 0.000000001.');return value;}
  function setup(value){
    object(value,FIELDS,'Setup');
    if(typeof value.id!=='string'||!/^[a-zA-Z0-9_-]{1,80}$/.test(value.id))throw new Error('Invalid setup ID.');
    const result={id:value.id,name:text(value.name,100,'Setup name'),currency:text(value.currency,12,'Currency label'),baselineWatts:number(value.baselineWatts,0,1000000,'Baseline wattage'),baselineHours:number(value.baselineHours,0,24,'Baseline hours per day'),alternativeWatts:number(value.alternativeWatts,0,1000000,'Alternative wattage'),alternativeHours:number(value.alternativeHours,0,24,'Alternative hours per day'),days:number(value.days,1,3660,'Period days'),rate:number(value.rate,0,1000,'Rate per kWh')};
    if(!Number.isInteger(result.days))throw new Error('Period days must be a whole number.');
    return result;
  }
  function calculate(value){const s=setup(value);const baselineDaily=s.baselineWatts*s.baselineHours/1000,alternativeDaily=s.alternativeWatts*s.alternativeHours/1000;const baselineKwh=baselineDaily*s.days,alternativeKwh=alternativeDaily*s.days;return {baselineDaily,alternativeDaily,baselineKwh,alternativeKwh,baselineCost:baselineKwh*s.rate,alternativeCost:alternativeKwh*s.rate,differenceKwh:baselineKwh-alternativeKwh,differenceCost:(baselineKwh-alternativeKwh)*s.rate,percent:baselineKwh===0?null:(baselineKwh-alternativeKwh)/baselineKwh*100};}
  function empty(){return {app:'appliance-energy-calculator',version:1,setups:[]};}
  function validate(value){object(value,['app','version','setups'],'Backup');if(value.app!=='appliance-energy-calculator'||value.version!==1)throw new Error('Use an Appliance Energy Calculator v1 backup.');if(!Array.isArray(value.setups)||value.setups.length>100)throw new Error('At most 100 saved setups are supported.');const setups=value.setups.map(setup);if(new Set(setups.map(s=>s.id)).size!==setups.length)throw new Error('Duplicate setup IDs.');return {app:'appliance-energy-calculator',version:1,setups};}
  function parse(source){if(typeof source!=='string'||source.length>1000000)throw new Error('Backup must be JSON text under 1 MB.');try{return validate(JSON.parse(source));}catch(error){if(error instanceof SyntaxError)throw new Error('File is not valid JSON.');throw error;}}
  function demo(){return {id:'fictional-example',name:'Fictional desk lighting example',currency:'USD',baselineWatts:60,baselineHours:5,alternativeWatts:9,alternativeHours:4,days:30,rate:0.25};}
  return {setup,calculate,empty,validate,parse,demo};
});
