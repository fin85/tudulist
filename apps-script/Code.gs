const SPREADSHEET_ID = '1mBbIzmC4Cd9716uSDK3J_FiVOsDvvIW5iKO9aKw_zFw';
const SHEET_NAME = 'Лист1';
const TZ = 'Asia/Yerevan';

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'list';
    if (action === 'list') return json_({tasks: listTasks_()});
    return json_({ok:false,error:'Unknown action'});
  } catch (err) { return json_({ok:false,error:String(err)}); }
}
function doPost(e) {
  try {
    const body = JSON.parse((e.postData && e.postData.contents) || '{}');
    if (body.action === 'complete') { setCompleted_(body.id, !!body.completed); return json_({ok:true}); }
    return json_({ok:false,error:'Unknown action'});
  } catch (err) { return json_({ok:false,error:String(err)}); }
}
function listTasks_(){
  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const values = sh.getDataRange().getDisplayValues();
  if(values.length < 2) return [];
  return values.slice(1).filter(r=>r[0]).map(r=>({id:r[0],title:r[1],description:r[2],deadline:parseYerevanDate_(r[3]),status:r[4],createdAt:parseYerevanDate_(r[5]),completedAt:parseYerevanDate_(r[6])}));
}
function setCompleted_(id, completed){
  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const values = sh.getRange(2,1,Math.max(sh.getLastRow()-1,1),7).getDisplayValues();
  for(let i=0;i<values.length;i++) if(values[i][0]===id){const row=i+2;sh.getRange(row,5).setValue(completed?'Выполнена':'Не выполнена');sh.getRange(row,7).setValue(completed?Utilities.formatDate(new Date(),TZ,'dd.MM.yyyy HH:mm'):'');return;}
  throw new Error('Task not found: '+id);
}
function parseYerevanDate_(s){
  if(!s) return null;
  const m=String(s).match(/^(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})$/);
  if(!m) return s;
  return `${m[3]}-${m[2]}-${m[1]}T${m[4]}:${m[5]}:00+04:00`;
}
function json_(obj){return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);}
