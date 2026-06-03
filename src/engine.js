// ═══════════════════════════════════════════════════════════════
// 行星时核心算法 v4.0
// 使用 IANA 时区数据库，正确处理全球所有时区 + 历史夏令时
// 中国1986-1991夏令时、欧洲冬夏令时、美国历史规则等全部自动处理
// ═══════════════════════════════════════════════════════════════

// ── 行星数据 ─────────────────────────────────────────────────
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
  { name:"太阳日", symbol:"☀", color:"#FFD700" },
  { name:"月亮日", symbol:"☽", color:"#C8D8E8" },
  { name:"火星日", symbol:"♂", color:"#FF6B6B" },
  { name:"水星日", symbol:"☿", color:"#98E8C8" },
  { name:"木星日", symbol:"♃", color:"#FFB347" },
  { name:"金星日", symbol:"♀", color:"#FFB6C1" },
  { name:"土星日", symbol:"♄", color:"#B8C8D8" },
];

const CHALDEAN  = [6, 4, 2, 0, 5, 3, 1];
const DAY_START = [3, 6, 2, 5, 1, 4, 0];

// ── 核心：获取指定地点指定时间的UTC偏移（分钟）──────────────
// 使用浏览器内置 Intl API + IANA 时区数据库
// 自动处理：夏令时/冬令时、历史时区规则、中国1986-1991夏令时等
function getUTCOffsetMinutes(ianaTimezone, dateUTC) {
  try {
    // 利用 Intl.DateTimeFormat 解析本地时间各字段
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: ianaTimezone,
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false
    });
    const parts = fmt.formatToParts(dateUTC);
    const get = type => parseInt(parts.find(p => p.type === type)?.value || '0');
    let year = get('year'), month = get('month')-1, day = get('day');
    let hour = get('hour'), minute = get('minute'), second = get('second');
    if (hour === 24) hour = 0;
    // 构建"本地时间当作UTC"的Date对象
    const localAsUTC = Date.UTC(year, month, day, hour, minute, second);
    // 差值即为UTC偏移（分钟）
    return Math.round((localAsUTC - dateUTC.getTime()) / 60000);
  } catch(e) {
    return 0; // fallback
  }
}

// ── 完整NOAA日出日落算法（返回UTC毫秒时间戳）────────────────
function calcSunTimesUTC(year, month, day, lat, lon) {
  const rad = Math.PI / 180;
  // 用UTC正午构建JD
  const noonUTC = Date.UTC(year, month, day, 12, 0, 0);
  const jd = noonUTC / 86400000 + 2440587.5;

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
  if (Math.abs(cosH) > 1) return null; // 极昼/极夜

  const HA = Math.acos(cosH) * (180/Math.PI);
  const sn = 720 - 4*lon - EqT; // 分钟，从UTC午夜起
  const midnightUTC = Date.UTC(year, month, day, 0, 0, 0);
  return {
    sunrise: midnightUTC + (sn - HA*4)*60000,
    sunset:  midnightUTC + (sn + HA*4)*60000,
  };
}

// ── 带时区的日出日落（返回Date对象，在指定时区显示正确）──────
// ianaTimezone: 如 "Asia/Shanghai", "Europe/Rome", "America/New_York"
// 若为 null，使用浏览器本地时区
function calcSunTimes(dateObj, lat, lon, ianaTimezone) {
  const tz = ianaTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const y = dateObj.getFullYear(), m = dateObj.getMonth(), d = dateObj.getDate();
  const result = calcSunTimesUTC(y, m, d, lat, lon);
  if (!result) {
    // 极昼/极夜 fallback：用指定时区的当天06:00和18:00
    const offset = getUTCOffsetMinutes(tz, new Date(Date.UTC(y, m, d, 12)));
    return {
      sunrise: new Date(Date.UTC(y, m, d, 6, 0, 0) - offset*60000),
      sunset:  new Date(Date.UTC(y, m, d, 18, 0, 0) - offset*60000),
    };
  }
  return {
    sunrise: new Date(result.sunrise),
    sunset:  new Date(result.sunset),
  };
}

// ── 格式化时间（指定时区）────────────────────────────────────
function fmtTimeInTZ(dateObj, ianaTimezone) {
  const tz = ianaTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: tz,
    hour: '2-digit', minute: '2-digit', hour12: false
  }).format(dateObj);
}

// ── 获取指定时区的"日期开始"（00:00:00）UTC时间戳 ──────────
function getLocalMidnightUTC(year, month, day, ianaTimezone) {
  const tz = ianaTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  // 在指定时区的当天00:00对应的UTC
  const approxUTC = Date.UTC(year, month, day, 12); // 用正午作为起点
  const offset = getUTCOffsetMinutes(tz, new Date(approxUTC));
  // 当地00:00 = UTC 00:00 - offset分钟
  return Date.UTC(year, month, day, 0, 0, 0) - offset * 60000;
}

// ── 计算某天24个行星时（核心函数）────────────────────────────
// date: Date对象（代表查询日期）
// lat, lon: 坐标
// ianaTimezone: IANA时区字符串，null则用本地时区
function calcAllHours(date, lat, lon, ianaTimezone) {
  const tz = ianaTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const y = date.getFullYear(), m = date.getMonth(), d = date.getDate();

  // 计算三天的日出日落（UTC时间戳）
  const st0 = calcSunTimesUTC(y, m, d-1, lat, lon);
  const st1 = calcSunTimesUTC(y, m, d,   lat, lon);
  const st2 = calcSunTimesUTC(y, m, d+1, lat, lon);

  // 用对应时区确定"当天"的星期几
  const weekdayFmt = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, weekday: 'short'
  });
  const weekdayMap = {Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
  // 用正午时间获取星期几（避免跨日问题）
  const noonUTC = Date.UTC(y, m, d, 12);
  const weekdayStr = weekdayFmt.format(new Date(noonUTC));
  const weekday = weekdayMap[weekdayStr] ?? date.getDay();

  if (!st1 || !st0 || !st2) {
    return []; // 极地情况暂不处理
  }

  const hours = [];

  // 白天12小时
  const dLen = (st1.sunset - st1.sunrise) / 12;
  for (let i = 0; i < 12; i++) {
    const s = new Date(st1.sunrise + i*dLen);
    const e = new Date(s.getTime() + dLen);
    hours.push({
      planet: PLANETS[CHALDEAN[(DAY_START[weekday]+i)%7]],
      start:s, end:e, hourNum:i+1, isDay:true, seq:i+1,
      startStr: fmtTimeInTZ(s, tz), endStr: fmtTimeInTZ(e, tz)
    });
  }

  // 夜晚12小时
  const nLen = (st2.sunrise - st1.sunset) / 12;
  for (let i = 0; i < 12; i++) {
    const s = new Date(st1.sunset + i*nLen);
    const e = new Date(s.getTime() + nLen);
    hours.push({
      planet: PLANETS[CHALDEAN[(DAY_START[weekday]+12+i)%7]],
      start:s, end:e, hourNum:i+1, isDay:false, seq:i+13,
      startStr: fmtTimeInTZ(s, tz), endStr: fmtTimeInTZ(e, tz)
    });
  }

  return hours.sort((a,b) => a.start-b.start);
}

// ── 按指定时区的公历日期展示（00:00-23:59）──────────────────
function getDisplayHours(date, lat, lon, ianaTimezone) {
  const tz = ianaTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
  const dayStartUTC = getLocalMidnightUTC(y, m, d, tz);
  const dayEndUTC   = dayStartUTC + 86400000;

  const prevDate = new Date(y, m, d-1);
  const prev = calcAllHours(prevDate, lat, lon, tz);
  const curr = calcAllHours(date,     lat, lon, tz);

  return [...prev,...curr]
    .filter(h => h.end.getTime() > dayStartUTC && h.start.getTime() < dayEndUTC)
    .sort((a,b) => a.start-b.start);
}

// ── 当前行星时（用设备本地时区）─────────────────────────────
function getCurrentHour(lat, lon) {
  const now = new Date();
  const tz  = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const prevDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()-1);
  const prev = calcAllHours(prevDate, lat, lon, tz);
  const curr = calcAllHours(now,      lat, lon, tz);
  return [...prev,...curr].find(h => h.start<=now && h.end>now) || null;
}

// ── 日出日落（用于UI显示）────────────────────────────────────
function getSunTimes(date, lat, lon, ianaTimezone) {
  return calcSunTimes(date, lat, lon, ianaTimezone);
}

// ── 格式化工具 ────────────────────────────────────────────────
function fmtTime(d, ianaTimezone) {
  if (ianaTimezone) return fmtTimeInTZ(d, ianaTimezone);
  const h = d.getHours().toString().padStart(2,'0');
  const min = d.getMinutes().toString().padStart(2,'0');
  return `${h}:${min}`;
}

function fmtDate(d, ianaTimezone) {
  const tz = ianaTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const days = ['周日','周一','周二','周三','周四','周五','周六'];
  const fmt = new Intl.DateTimeFormat('zh-CN', {
    timeZone: tz, year:'numeric', month:'long', day:'numeric'
  });
  // 获取星期几
  const wdFmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short' });
  const wdMap = {Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
  const wd = wdMap[wdFmt.format(d)] ?? d.getDay();
  return `${fmt.format(d)} ${days[wd]}`;
}

function getWeekRuler(date, ianaTimezone) {
  const tz = ianaTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const wdFmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short' });
  const wdMap = {Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
  const wd = wdMap[wdFmt.format(date)] ?? date.getDay();
  return WEEK_RULERS[wd];
}

// ── 通过城市名反查IANA时区（调用 nominatim + 时区API）────────
async function getTimezoneByCoords(lat, lon) {
  try {
    const r = await fetch(
      `https://timeapi.io/api/TimeZone/coordinate?latitude=${lat}&longitude=${lon}`
    );
    const j = await r.json();
    return j.timeZone || null;
  } catch {
    // fallback：根据经度粗略估算
    return null;
  }
}

// ── 根据经度粗略估算IANA时区（离线fallback）─────────────────
function guessTimezoneByLonLat(lat, lon) {
  // 常用地区精确匹配
  const regions = [
    { tz:'Asia/Shanghai',     latR:[18,54],  lonR:[73,135] },
    { tz:'Europe/Rome',       latR:[36,48],  lonR:[6,19]   },
    { tz:'Europe/London',     latR:[49,61],  lonR:[-8,2]   },
    { tz:'Europe/Paris',      latR:[42,51],  lonR:[-5,8]   },
    { tz:'Europe/Berlin',     latR:[47,55],  lonR:[6,15]   },
    { tz:'Europe/Madrid',     latR:[36,44],  lonR:[-9,4]   },
    { tz:'Europe/Athens',     latR:[35,42],  lonR:[20,27]  },
    { tz:'Europe/Moscow',     latR:[55,60],  lonR:[37,40]  },
    { tz:'America/New_York',  latR:[25,47],  lonR:[-82,-67]},
    { tz:'America/Chicago',   latR:[25,49],  lonR:[-100,-83]},
    { tz:'America/Denver',    latR:[31,49],  lonR:[-115,-99]},
    { tz:'America/Los_Angeles',latR:[32,49], lonR:[-125,-114]},
    { tz:'America/Sao_Paulo', latR:[-34,-8], lonR:[-54,-43]},
    { tz:'Asia/Tokyo',        latR:[24,46],  lonR:[122,154]},
    { tz:'Asia/Seoul',        latR:[33,38],  lonR:[124,132]},
    { tz:'Asia/Kolkata',      latR:[8,37],   lonR:[68,98]  },
    { tz:'Asia/Dubai',        latR:[22,27],  lonR:[51,57]  },
    { tz:'Australia/Sydney',  latR:[-38,-28],lonR:[147,154]},
    { tz:'Africa/Cairo',      latR:[22,32],  lonR:[25,37]  },
    { tz:'Africa/Johannesburg',latR:[-35,-22],lonR:[16,33] },
    { tz:'Pacific/Auckland',  latR:[-47,-34],lonR:[166,179]},
  ];
  for (const r of regions) {
    if (lat>=r.latR[0]&&lat<=r.latR[1]&&lon>=r.lonR[0]&&lon<=r.lonR[1]) return r.tz;
  }
  // 最终fallback：经度换算
  const offset = Math.round(lon/15);
  const zones = ['Etc/GMT+12','Etc/GMT+11','Etc/GMT+10','Etc/GMT+9','Etc/GMT+8',
    'Etc/GMT+7','Etc/GMT+6','Etc/GMT+5','Etc/GMT+4','Etc/GMT+3','Etc/GMT+2',
    'Etc/GMT+1','UTC','Etc/GMT-1','Etc/GMT-2','Etc/GMT-3','Etc/GMT-4',
    'Etc/GMT-5','Etc/GMT-6','Etc/GMT-7','Etc/GMT-8','Etc/GMT-9','Etc/GMT-10',
    'Etc/GMT-11','Etc/GMT-12'];
  return zones[Math.min(Math.max(12-offset, 0), 24)] || 'UTC';
}
