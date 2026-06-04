// ═══════════════════════════════════════════════════════════════
// 行星时核心算法 v5.0 - 彻底重写时区处理
// 核心原则：所有时间以UTC时间戳存储，显示时按指定时区格式化
// ═══════════════════════════════════════════════════════════════

const PLANETS = [
  { id:0, name:"太阳", symbol:"☀", color:"#FFD700",
    keywords:"成功 · 领导 · 活力",
    meaning:"求职面试、争取认可、与权威人士会面、签重要合同、自我展示、公开演讲、申请贷款",
    magic:"点燃金色或橙色蜡烛，冥想太阳之光充满全身。诵读太阳祈祷文，观想金色光芒驱散阴暗。适合在日出时进行日轮仪式，手持黄水晶或虎眼石，祈求成功与荣耀。向太阳神（阿波罗、赫利俄斯、拉神）祈祷，感谢生命之光。",
    avoid:"低调隐忍、孤独冥想、秘密计划、夜间仪式" },
  { id:1, name:"月亮", symbol:"☽", color:"#C8D8E8",
    keywords:"情感 · 直觉 · 梦想",
    meaning:"家庭沟通、旅行出发、心理疗愈、占卜问事、处理情感关系、女性事务、种植花草",
    magic:"将水晶或清水置于月光下净化充能，制作月亮水。使用塔罗牌或镜面占卜，连接直觉与潜意识。点燃银色或白色蜡烛，向月亮女神（赫卡忒、阿尔忒弥斯、伊西斯）祈祷。书写梦境日记，进行阴影工作与情感疗愈仪式。",
    avoid:"重大决策、商业谈判、手术、法律文件签署" },
  { id:2, name:"火星", symbol:"♂", color:"#FF6B6B",
    keywords:"行动 · 勇气 · 激情",
    meaning:"运动健身、竞技比赛、手术开刀、勇敢开始新事业、保护自己、面对冲突、驱除恐惧",
    magic:"点燃红色蜡烛，手持红碧玉或血石，进行战士祈祷。在纸上写下要克服的障碍，安全焚烧并埋入土中。绘制保护符文（Tiwaz）为住所设置防护结界。向战神（阿瑞斯、玛尔斯）祈求勇气与保护，驱散恐惧与软弱。",
    avoid:"和平谈判、艺术创作、情感修复、重要签约、医疗诊断" },
  { id:3, name:"水星", symbol:"☿", color:"#98E8C8",
    keywords:"沟通 · 商业 · 写作",
    meaning:"签合同、商业谈判、学习考试、写作演讲、短途旅行、发布信息、网络事务、语言学习",
    magic:"书写咒语或愿望清单，用橙色或黄色墨水。点燃黄色蜡烛，手持蓝晶石或玛瑙，向墨丘利（赫尔墨斯）祈求智慧与口才。将学习材料放于枕下，祈请在梦中获得灵感。制作护身符以提升沟通能力与记忆力。",
    avoid:"休息静养、深度情感表达、重体力劳动、长途旅行" },
  { id:4, name:"木星", symbol:"♃", color:"#FFB347",
    keywords:"扩张 · 运气 · 成长",
    meaning:"法律事务、高等教育、金融投资、宗教活动、国际事务、祈求好运、慈善捐助、出版发行",
    magic:"点燃蓝色或紫色蜡烛，手持青金石或紫水晶，进行财富吸引仪式。写下扩张目标与愿景置于祭坛。向宙斯（朱庇特）祈祷，感恩已拥有的丰盛，邀请更多降临。进行许愿仪式、丰盛冥想与吸引力法则练习。",
    avoid:"节制消费、细节核查、节食减重、低调行事" },
  { id:5, name:"金星", symbol:"♀", color:"#FFB6C1",
    keywords:"爱情 · 美丽 · 和谐",
    meaning:"约会求爱、艺术创作、美容购物、社交聚会、化解矛盾、增进友谊、美化居住环境",
    magic:"点燃粉色或绿色蜡烛，手持玫瑰石英或祖母绿，进行爱情吸引仪式。用玫瑰花瓣与蜂蜜水制作爱之圣水，洒于四角。向阿佛洛狄忒（维纳斯）祈祷美丽与爱情。书写爱之咒语用粉色墨水，折成心形埋于花盆中。",
    avoid:"冲突对抗、艰苦劳动、重要财务决策、手术" },
  { id:6, name:"土星", symbol:"♄", color:"#B8C8D8",
    keywords:"结构 · 纪律 · 规划",
    meaning:"长期规划、组织架构、结束旧事、法律文件归档、边界设定、清除障碍、整理断舍离",
    magic:"点燃黑色或深蓝色蜡烛，手持黑碧玺或黑曜石，进行清除负能量仪式。写下需要结束或放下的事物，安全焚烧并埋入土中。在房间四角撒盐建立保护结界。向克洛诺斯（萨图恩）祈求智慧与界限，进行断除旧缘的封印仪式。",
    avoid:"新事开始、欢聚享乐、感情升温、冒险投机" },
];

const WEEK_RULERS = [
  {name:"太阳日",symbol:"☀",color:"#FFD700"},
  {name:"月亮日",symbol:"☽",color:"#C8D8E8"},
  {name:"火星日",symbol:"♂",color:"#FF6B6B"},
  {name:"水星日",symbol:"☿",color:"#98E8C8"},
  {name:"木星日",symbol:"♃",color:"#FFB347"},
  {name:"金星日",symbol:"♀",color:"#FFB6C1"},
  {name:"土星日",symbol:"♄",color:"#B8C8D8"},
];

const CHALDEAN  = [6,4,2,0,5,3,1];
const DAY_START = [3,6,2,5,1,4,0];

// ══════════════════════════════════════════════════════════════
// 核心：NOAA算法，输入年月日+坐标，输出UTC毫秒时间戳
// ══════════════════════════════════════════════════════════════
function sunUTC(year, month0, day, lat, lon) {
  // month0 是0-indexed（JS的getMonth()）
  const rad = Math.PI/180;
  const jd = Date.UTC(year, month0, day, 12)/86400000 + 2440587.5;
  const T  = (jd-2451545.0)/36525.0;
  const L0 = (280.46646+36000.76983*T+0.0003032*T*T)%360;
  const M  = (357.52911+35999.05029*T-0.0001537*T*T)%360;
  const Mr = M*rad;
  const C  = (1.914602-0.004817*T-0.000014*T*T)*Math.sin(Mr)
           + (0.019993-0.000101*T)*Math.sin(2*Mr)
           + 0.000289*Math.sin(3*Mr);
  const om = (125.04-1934.136*T)*rad;
  const lam= (L0+C-0.00569-0.00478*Math.sin(om))*rad;
  const e0 = 23+(26+(21.448-T*(46.815+T*(0.00059-T*0.001813)))/60)/60;
  const eps= (e0+0.00256*Math.cos(om))*rad;
  const dec= Math.asin(Math.sin(eps)*Math.sin(lam));
  const yy = Math.tan(eps/2)**2;
  const L0r= L0*rad;
  const EqT= 4*(180/Math.PI)*(yy*Math.sin(2*L0r)
    -2*0.016708634*Math.sin(Mr)
    +4*0.016708634*yy*Math.sin(Mr)*Math.cos(Mr)
    -0.5*yy*yy*Math.sin(4*L0r)
    -1.25*0.016708634**2*Math.sin(2*Mr));
  const cosH=(Math.sin(-0.8333*rad)-Math.sin(lat*rad)*Math.sin(dec))
            /(Math.cos(lat*rad)*Math.cos(dec));
  if(Math.abs(cosH)>1) return null;
  const HA  = Math.acos(cosH)*(180/Math.PI);
  const sn  = 720-4*lon-EqT; // 分钟，UTC午夜起
  const mid = Date.UTC(year,month0,day,0,0,0);
  return { riseUTC: mid+(sn-HA*4)*60000, setUTC: mid+(sn+HA*4)*60000 };
}

// ══════════════════════════════════════════════════════════════
// 时区工具：用Intl API获取指定时区的日期信息
// ══════════════════════════════════════════════════════════════

// 获取UTC时间戳在指定时区的年月日时分
function inTZ(utcMs, tz) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year:'numeric', month:'numeric', day:'numeric',
    hour:'numeric', minute:'numeric', second:'numeric', hour12:false
  });
  const p = {};
  fmt.formatToParts(new Date(utcMs)).forEach(x => { p[x.type]=parseInt(x.value)||0; });
  if(p.hour===24) p.hour=0;
  return p; // {year,month,day,hour,minute,second}
}

// 获取指定时区某天00:00:00的UTC时间戳
function tzMidnight(year, month1, day, tz) {
  // month1是1-indexed
  // 二分法精确找到该时区当天00:00对应的UTC
  let lo = Date.UTC(year, month1-1, day, -14, 0, 0);
  let hi = Date.UTC(year, month1-1, day,  14, 0, 0);
  for(let i=0; i<50; i++) {
    const mid = Math.floor((lo+hi)/2);
    const p = inTZ(mid, tz);
    const isBeforeMidnight = p.year<year || p.month<month1 || p.day<day ||
                             (p.year===year&&p.month===month1&&p.day===day&&
                              (p.hour>0||p.minute>0||p.second>0)?false:
                              p.year<year||p.month<month1||p.day<day);
    // 简化：直接比较
    const localDate = p.year*10000+p.month*100+p.day;
    const targetDate = year*10000+month1*100+day;
    if(localDate < targetDate) lo = mid+1;
    else if(localDate > targetDate) hi = mid-1;
    else {
      // 同一天，找最小的时间（即00:00）
      if(p.hour===0&&p.minute===0) return mid - p.second*1000;
      if(p.hour===0&&p.minute===0&&p.second===0) return mid;
      hi = mid-1;
    }
  }
  // fallback
  const offset = (Date.UTC(year,month1-1,day,12)-new Date(Date.UTC(year,month1-1,day,12)).getTime())||0;
  return Date.UTC(year,month1-1,day,0,0,0) - getUTCOffsetMs(tz, Date.UTC(year,month1-1,day,12));
}

function getUTCOffsetMs(tz, utcMs) {
  try {
    const p = inTZ(utcMs, tz);
    const localAsUTC = Date.UTC(p.year, p.month-1, p.day, p.hour, p.minute, p.second);
    return localAsUTC - utcMs;
  } catch(e) { return 0; }
}

// 格式化UTC时间戳为指定时区的HH:MM
function fmtTime(utcMs, tz) {
  if(utcMs instanceof Date) utcMs = utcMs.getTime();
  const useTZ = tz || Intl.DateTimeFormat().resolvedOptions().timeZone;
  return new Intl.DateTimeFormat('zh-CN',{
    timeZone:useTZ, hour:'2-digit', minute:'2-digit', hour12:false
  }).format(new Date(utcMs));
}

// 格式化日期
function fmtDate(utcMs, tz) {
  if(utcMs instanceof Date) utcMs = utcMs.getTime();
  const useTZ = tz || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const days = ['周日','周一','周二','周三','周四','周五','周六'];
  const p = inTZ(utcMs, useTZ);
  const wdFmt = new Intl.DateTimeFormat('en-US',{timeZone:useTZ,weekday:'short'});
  const wdMap = {Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
  const wd = wdMap[wdFmt.format(new Date(utcMs))]??0;
  return `${p.year}年${p.month}月${p.day}日 ${days[wd]}`;
}

// 获取星期几（0=周日）
function getWeekday(utcMs, tz) {
  const useTZ = tz || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const wdFmt = new Intl.DateTimeFormat('en-US',{timeZone:useTZ,weekday:'short'});
  const wdMap = {Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
  return wdMap[wdFmt.format(new Date(utcMs))]??0;
}

// ══════════════════════════════════════════════════════════════
// 行星时计算
// ══════════════════════════════════════════════════════════════

// 计算某一天的24个行星时
// dateInfo: {year, month1, day} 公历日期（1-indexed month）
// tz: IANA时区字符串
function calcDayHours(dateInfo, lat, lon, tz) {
  const {year,month1,day} = dateInfo;
  // 该时区当天正午的UTC（用于确定星期几和JD）
  const noonUTC = Date.UTC(year, month1-1, day, 12) - getUTCOffsetMs(tz, Date.UTC(year,month1-1,day,12));

  // 计算今天、昨天、明天的日出日落（UTC时间戳）
  const today     = sunUTC(year, month1-1, day,   lat, lon);
  const yesterday = sunUTC(year, month1-1, day-1, lat, lon);
  const tomorrow  = sunUTC(year, month1-1, day+1, lat, lon);

  if(!today || !yesterday || !tomorrow) return [];

  // 用该时区正午确定星期几
  const weekday = getWeekday(noonUTC, tz);

  const hours = [];

  // 白天12小时（今日日出→日落）
  const dLen = (today.setUTC - today.riseUTC)/12;
  for(let i=0; i<12; i++){
    const s = today.riseUTC + i*dLen;
    const e = s + dLen;
    const ch = (DAY_START[weekday]+i)%7;
    hours.push({
      planet: PLANETS[CHALDEAN[ch]],
      startMs:s, endMs:e,
      startStr: fmtTime(s,tz), endStr: fmtTime(e,tz),
      hourNum:i+1, isDay:true, seq:i+1
    });
  }

  // 夜晚12小时（今日日落→明日日出）
  const nLen = (tomorrow.riseUTC - today.setUTC)/12;
  for(let i=0; i<12; i++){
    const s = today.setUTC + i*nLen;
    const e = s + nLen;
    const ch = (DAY_START[weekday]+12+i)%7;
    hours.push({
      planet: PLANETS[CHALDEAN[ch]],
      startMs:s, endMs:e,
      startStr: fmtTime(s,tz), endStr: fmtTime(e,tz),
      hourNum:i+1, isDay:false, seq:i+13
    });
  }

  return hours.sort((a,b)=>a.startMs-b.startMs);
}

// 当前行星时（用设备本地时区）
function getCurrentHour(lat, lon) {
  const now = Date.now();
  const tz  = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const p   = inTZ(now, tz);

  // 今天和昨天
  const todayH = calcDayHours({year:p.year,month1:p.month,day:p.day}, lat, lon, tz);
  const yP = inTZ(now-86400000, tz);
  const yestH = calcDayHours({year:yP.year,month1:yP.month,day:yP.day}, lat, lon, tz);

  return [...yestH,...todayH].find(h=>h.startMs<=now&&h.endMs>now)||null;
}

// 按公历日期展示全天行星时（00:00-23:59）
// date: JS Date对象（代表查询日期）
// tz: 查询地点的时区
function getDisplayHours(date, lat, lon, tz) {
  const useTZ = tz || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const p = inTZ(date.getTime(), useTZ);
  const {year,month,day} = p; // month是1-indexed（来自inTZ）

  // 该时区当天的开始和结束（UTC时间戳）
  const offsetMs = getUTCOffsetMs(useTZ, Date.UTC(year,month-1,day,12));
  const dayStartUTC = Date.UTC(year,month-1,day,0,0,0) - offsetMs;
  const dayEndUTC   = dayStartUTC + 86400000;

  // 计算今天和昨天的行星时
  const todayH = calcDayHours({year,month1:month,day}, lat, lon, useTZ);
  const yp = inTZ(date.getTime()-86400000, useTZ);
  const yestH = calcDayHours({year:yp.year,month1:yp.month,day:yp.day}, lat, lon, useTZ);

  return [...yestH,...todayH]
    .filter(h => h.endMs>dayStartUTC && h.startMs<dayEndUTC)
    .sort((a,b)=>a.startMs-b.startMs);
}

// 日出日落（用于UI显示）
function getSunTimes(date, lat, lon, tz) {
  const useTZ = tz || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const p = inTZ(date.getTime(), useTZ);
  const result = sunUTC(p.year, p.month-1, p.day, lat, lon);
  if(!result) return {sunrise:null,sunset:null,sunriseStr:'--:--',sunsetStr:'--:--'};
  return {
    sunrise: result.riseUTC,
    sunset:  result.setUTC,
    sunriseStr: fmtTime(result.riseUTC, useTZ),
    sunsetStr:  fmtTime(result.setUTC,  useTZ),
  };
}

function getWeekRuler(date, tz) {
  const useTZ = tz || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const wd = getWeekday(date.getTime(), useTZ);
  return WEEK_RULERS[wd];
}

// 坐标估算时区（离线fallback）
function guessTimezoneByLonLat(lat, lon) {
  const regions = [
    {tz:'Asia/Shanghai',     latR:[18,54],  lonR:[73,135]},
    {tz:'Europe/Rome',       latR:[36,48],  lonR:[6,19]},
    {tz:'Europe/London',     latR:[49,61],  lonR:[-8,2]},
    {tz:'Europe/Paris',      latR:[42,51],  lonR:[-5,8]},
    {tz:'Europe/Berlin',     latR:[47,55],  lonR:[6,15]},
    {tz:'Europe/Madrid',     latR:[36,44],  lonR:[-9,4]},
    {tz:'Europe/Athens',     latR:[35,42],  lonR:[20,27]},
    {tz:'Europe/Moscow',     latR:[50,70],  lonR:[30,45]},
    {tz:'America/New_York',  latR:[25,47],  lonR:[-82,-67]},
    {tz:'America/Chicago',   latR:[25,49],  lonR:[-100,-83]},
    {tz:'America/Denver',    latR:[31,49],  lonR:[-115,-99]},
    {tz:'America/Los_Angeles',latR:[32,49], lonR:[-125,-114]},
    {tz:'America/Sao_Paulo', latR:[-34,-8], lonR:[-54,-43]},
    {tz:'Asia/Tokyo',        latR:[24,46],  lonR:[130,146]},
    {tz:'Asia/Seoul',        latR:[33,38],  lonR:[124,132]},
    {tz:'Asia/Kolkata',      latR:[8,37],   lonR:[68,98]},
    {tz:'Asia/Dubai',        latR:[22,27],  lonR:[51,57]},
    {tz:'Australia/Sydney',  latR:[-38,-28],lonR:[147,154]},
    {tz:'Africa/Cairo',      latR:[22,32],  lonR:[25,37]},
    {tz:'Africa/Johannesburg',latR:[-35,-22],lonR:[16,33]},
    {tz:'Pacific/Auckland',  latR:[-47,-34],lonR:[166,179]},
  ];
  for(const r of regions){
    if(lat>=r.latR[0]&&lat<=r.latR[1]&&lon>=r.lonR[0]&&lon<=r.lonR[1]) return r.tz;
  }
  const offset = Math.round(lon/15);
  return `Etc/GMT${offset>=0?'-':'+'}${Math.abs(offset)}`;
}
