// ═══════════════════════════════════════════════
// 行星时核心算法 - 完整NOAA算法，与Planetaro一致
// ═══════════════════════════════════════════════

const PLANETS = [
  { id:0, name:"太阳", symbol:"☀", color:"#FFD700",
    keywords:"成功 · 领导 · 活力",
    meaning:"求职面试、争取认可、与权威人士会面、签重要合同、自我展示、公开演讲",
    magic:"金色蜡烛仪式、吸引成功与荣耀、增强个人意志力、太阳神祈祷、金色水晶充能",
    avoid:"低调隐忍、孤独冥想、秘密计划、夜间仪式" },

  { id:1, name:"月亮", symbol:"☽", color:"#C8D8E8",
    keywords:"情感 · 直觉 · 梦想",
    meaning:"家庭沟通、旅行出发、心理疗愈、占卜问事、处理情感关系、女性事务",
    magic:"月光冥想、水晶净化、梦境工作、女神仪式、占卜塔罗、月亮水制作",
    avoid:"重大决策、商业谈判、手术、法律文件" },

  { id:2, name:"火星", symbol:"♂", color:"#FF6B6B",
    keywords:"行动 · 勇气 · 激情",
    meaning:"运动健身、竞技比赛、手术开刀、勇敢开始新事业、保护自己、面对冲突",
    magic:"红色蜡烛驱邪、保护魔法、战士祈祷、增强勇气与斗志、破除障碍",
    avoid:"和平谈判、艺术创作、情感修复、重要签约" },

  { id:3, name:"水星", symbol:"☿", color:"#98E8C8",
    keywords:"沟通 · 商业 · 写作",
    meaning:"签合同、商业谈判、学习考试、写作演讲、短途旅行、发布信息、网络事务",
    magic:"书写咒语、信息魔法、思维清晰冥想、墨丘利祈祷、学业加持、口才提升",
    avoid:"休息静养、情感表达、体力劳动、长途旅行" },

  { id:4, name:"木星", symbol:"♃", color:"#FFB347",
    keywords:"扩张 · 运气 · 成长",
    meaning:"法律事务、高等教育、金融投资、宗教活动、国际事务、祈求好运、慈善捐助",
    magic:"财富魔法、扩张仪式、蓝紫色蜡烛、木星祈祷、吸引丰盛、许愿仪式",
    avoid:"节制消费、细节工作、小事琐务、节食减重" },

  { id:5, name:"金星", symbol:"♀", color:"#FFB6C1",
    keywords:"爱情 · 美丽 · 和谐",
    meaning:"约会求爱、艺术创作、美容购物、社交聚会、化解矛盾、增进友谊、美化环境",
    magic:"爱情魔法、玫瑰仪式、粉红蜡烛、吸引力法则、美化祈祷、感情加深",
    avoid:"冲突对抗、艰苦劳动、财务决策、手术" },

  { id:6, name:"土星", symbol:"♄", color:"#B8C8D8",
    keywords:"结构 · 纪律 · 规划",
    meaning:"长期规划、组织架构、结束旧事、法律文件、边界设定、清除障碍、整理断舍离",
    magic:"驱散负能量、断除旧缘、黑色蜡烛净化、土星魔法、结界保护、封印仪式",
    avoid:"新事开始、欢聚享乐、感情升温、冒险投机" },
];

const WEEK_RULERS = [
  { name:"太阳日", symbol:"☀", color:"#FFD700" },
  { name:"月亮日", symbol:"☽", color:"#C8D8E8" },
  { name:"火星日", symbol:"♂", color:"#FF6B6B" },
  { name:"水星日", symbol:"☿", color:"#98E8C8" },
  { name:"木星日", symbol:"♃", color:"#FFB347" },
  { name:"金星日", symbol:"♀", color:"#FFB6C1" },
  { name:"土星日", symbol:"♄", color:"#B8C8D8" },
];

// 迦勒底顺序：土木火日金水月
const CHALDEAN  = [6, 4, 2, 0, 5, 3, 1];
// 每周几白天第1小时起始索引
const DAY_START = [3, 6, 2, 5, 1, 4, 0];

// ── 完整NOAA日出日落算法 ──────────────────────────────
function calcSunTimes(dateObj, lat, lon) {
  const rad = Math.PI / 180;
  const jd  = new Date(Date.UTC(
    dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 12
  )).getTime() / 86400000 + 2440587.5;

  const T  = (jd - 2451545.0) / 36525.0;
  const L0 = (280.46646 + 36000.76983*T + 0.0003032*T*T) % 360;
  const M  = (357.52911 + 35999.05029*T - 0.0001537*T*T) % 360;
  const Mr = M * rad;
  const C  = (1.914602 - 0.004817*T - 0.000014*T*T)*Math.sin(Mr)
           + (0.019993 - 0.000101*T)*Math.sin(2*Mr)
           + 0.000289*Math.sin(3*Mr);
  const omega = (125.04 - 1934.136*T) * rad;
  const lam   = (L0 + C - 0.00569 - 0.00478*Math.sin(omega)) * rad;
  const eps0  = 23 + (26 + (21.448 - T*(46.815 + T*(0.00059 - T*0.001813)))/60)/60;
  const eps   = (eps0 + 0.00256*Math.cos(omega)) * rad;
  const dec   = Math.asin(Math.sin(eps)*Math.sin(lam));
  const y     = Math.tan(eps/2)**2;
  const L0r   = L0 * rad;
  const EqT   = 4*(180/Math.PI)*(
      y*Math.sin(2*L0r)
    - 2*0.016708634*Math.sin(Mr)
    + 4*0.016708634*y*Math.sin(Mr)*Math.cos(Mr)
    - 0.5*y*y*Math.sin(4*L0r)
    - 1.25*0.016708634**2*Math.sin(2*Mr)
  );
  const cosH = (Math.sin(-0.8333*rad) - Math.sin(lat*rad)*Math.sin(dec))
             / (Math.cos(lat*rad)*Math.cos(dec));
  if (Math.abs(cosH) > 1) {
    const base = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    return { sunrise: new Date(base.getTime()+6*3600000), sunset: new Date(base.getTime()+18*3600000) };
  }
  const HA   = Math.acos(cosH)*(180/Math.PI);
  const sn   = 720 - 4*lon - EqT;
  const base = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));
  return {
    sunrise: new Date(base.getTime() + (sn - HA*4)*60000),
    sunset:  new Date(base.getTime() + (sn + HA*4)*60000),
  };
}

// ── 计算某天24个行星时 ───────────────────────────────
function calcAllHours(date, lat, lon) {
  const yesterday = new Date(date.getTime() - 86400000);
  const tomorrow  = new Date(date.getTime() + 86400000);
  const st0 = calcSunTimes(yesterday, lat, lon);
  const st1 = calcSunTimes(date,      lat, lon);
  const st2 = calcSunTimes(tomorrow,  lat, lon);

  const weekday = date.getDay();
  const hours   = [];

  // 白天12小时
  const dLen = (st1.sunset - st1.sunrise) / 12;
  for (let i = 0; i < 12; i++) {
    const s = new Date(st1.sunrise.getTime() + i*dLen);
    const e = new Date(s.getTime() + dLen);
    hours.push({ planet: PLANETS[CHALDEAN[(DAY_START[weekday]+i)%7]],
      start:s, end:e, hourNum:i+1, isDay:true, seq:i+1 });
  }
  // 夜晚12小时
  const nLen = (st2.sunrise - st1.sunset) / 12;
  for (let i = 0; i < 12; i++) {
    const s = new Date(st1.sunset.getTime() + i*nLen);
    const e = new Date(s.getTime() + nLen);
    hours.push({ planet: PLANETS[CHALDEAN[(DAY_START[weekday]+12+i)%7]],
      start:s, end:e, hourNum:i+1, isDay:false, seq:i+13 });
  }
  return hours.sort((a,b) => a.start-b.start);
}

// ── 按公历日期展示（00:00-23:59）────────────────────
function getDisplayHours(date, lat, lon) {
  const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0,0,0);
  const dayEnd   = new Date(dayStart.getTime() + 86400000);
  const yesterday = new Date(date.getTime()-86400000);
  const prev = calcAllHours(yesterday, lat, lon);
  const curr = calcAllHours(date,      lat, lon);
  return [...prev,...curr]
    .filter(h => h.end > dayStart && h.start < dayEnd)
    .sort((a,b) => a.start-b.start);
}

// ── 当前行星时 ────────────────────────────────────────
function getCurrentHour(lat, lon) {
  const now  = new Date();
  const prev = calcAllHours(new Date(now.getTime()-86400000), lat, lon);
  const curr = calcAllHours(now, lat, lon);
  return [...prev,...curr].find(h => h.start<=now && h.end>now) || null;
}

// ── 格式化工具 ────────────────────────────────────────
function fmtTime(d) {
  return d.getHours().toString().padStart(2,'0')+':'+d.getMinutes().toString().padStart(2,'0');
}
function fmtDate(d) {
  const days = ['周日','周一','周二','周三','周四','周五','周六'];
  return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日 ${days[d.getDay()]}`;
}
function getSunTimes(date, lat, lon) { return calcSunTimes(date, lat, lon); }
function getWeekRuler(date) { return WEEK_RULERS[date.getDay()]; }
