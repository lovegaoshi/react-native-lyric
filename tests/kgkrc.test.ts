import parseKrc from "../src/util/parser/parseKrc";

export const KGKRC = `
    [id:$00000000]
    [ar:李荣浩]
    [ti:麻雀]
    [by:]
    [hash:c8d14c58fb34aaa6e12e7a3da456632b]
    [al:]
    [sign:]
    [qq:]
    [total:252786]
    [offset:0]
    [language:eyJjb250ZW50IjpbXSwidmVyc2lvbiI6MX0=]
    [56,649]<0,446,0>李<446,50,0>荣<496,50,0>浩 <546,0,0>- <546,52,0>麻<598,51,0>雀
    [705,203]<0,0,0>作<0,51,0>词<51,51,0>：<102,0,0>李<102,50,0>荣<152,51,0>浩
    [908,152]<0,0,0>作<0,50,0>曲<50,51,0>：<101,0,0>李<101,51,0>荣<152,0,0>浩
    [1060,201]<0,50,0>编<50,50,0>曲<100,0,0>：<100,50,0>李<150,51,0>荣<201,0,0>浩
    [1261,252]<0,50,0>制<50,50,0>作<100,0,0>人<100,50,0>：<150,51,0>李<201,0,0>荣<201,51,0>浩
    [1513,203]<0,51,0>吉<51,0,0>他<51,50,0>：<101,51,0>李<152,0,0>荣<152,51,0>浩
    [1716,203]<0,51,0>贝<51,0,0>斯<51,51,0>：<102,0,0>李<102,51,0>荣<153,50,0>浩
    [1919,254]<0,0,0>和<0,51,0>音<51,50,0>编<101,0,0>写<101,51,0>：<152,51,0>李<203,0,0>荣<203,51,0>浩
    [2173,202]<0,50,0>和<50,0,0>音<50,51,0>：<101,50,0>李<151,0,0>荣<151,51,0>浩
    [2375,253]<0,50,0>录<50,0,0>音<50,51,0>师<101,51,0>：<152,0,0>李<152,50,0>荣<202,51,0>浩
    [2628,201]<0,0,0>混<0,50,0>音<50,0,0>师<50,51,0>：<101,50,0>李<151,0,0>荣<151,50,0>浩
    [2829,353]<0,50,0>音<50,0,0>乐<50,51,0>制<101,50,0>作<151,0,0>助<151,51,0>理<202,50,0>：<252,0,0>青<252,51,0>格<303,50,0>乐
    [3182,455]<0,0,0>录<0,52,0>音<52,50,0>工<102,0,0>作<102,50,0>室<152,50,0>：<202,0,0>北<202,51,0>京<253,0,0>一<253,50,0>样<303,51,0>音<354,0,0>乐<354,50,0>录<404,51,0>音<455,0,0>室
    [3637,505]<0,51,0>混<51,49,0>音<100,0,0>工<100,50,0>作<150,52,0>室<202,0,0>：<202,51,0>北<253,50,0>京<303,0,0>一<303,51,0>样<354,50,0>音<404,0,0>乐<404,51,0>录<455,50,0>音<505,0,0>室
    [4142,355]<0,51,0>母<51,50,0>带<101,0,0>后<101,52,0>期<153,0,0>制<153,51,0>作<204,49,0>人<253,0,0>：<253,51,0>李<304,51,0>荣<355,0,0>浩
    [4497,457]<0,51,0>母<51,51,0>带<102,0,0>后<102,51,0>期<153,51,0>处<204,0,0>理<204,51,0>工<255,50,0>程<305,0,0>师<305,50,0>：<355,51,0>周<406,0,0>天<406,51,0>澈
    [4954,968]<0,0,0>母<0,51,0>带<51,50,0>后<101,0,0>期<101,51,0>处<152,50,0>理<202,0,0>录<202,51,0>音<253,50,0>室<303,156,0>：<459,509,0>Studio21A
    [23029,2329]<0,354,0>山<354,305,0>隔<659,455,0>壁<1114,254,0>还<1368,253,0>是<1621,708,0>山
    [25561,2179]<0,203,0>都<203,404,0>有<607,304,0>一<911,407,0>个<1318,861,0>伴
    [28549,2553]<0,406,0>相<406,355,0>信<761,354,0>海<1115,384,0>枯<1499,448,0>石<1947,606,0>烂
    [31102,2275]<0,304,0>也<304,357,0>许<661,402,0>我<1063,353,0>笨<1416,859,0>蛋
    [34238,2529]<0,407,0>飞<407,354,0>太<761,403,0>慢<1164,252,0>会<1416,353,0>落<1769,760,0>单
    [36767,2274]<0,302,0>太<302,457,0>快<759,303,0>会<1062,305,0>受<1367,907,0>伤
    [39678,4467]<0,304,0>哦<304,359,0>日<663,355,0>子<1018,355,0>不<1373,202,0>就<1575,554,0>都<2129,615,0>这<2744,1723,0>样
    [45663,2378]<0,356,0>天<356,305,0>会<661,404,0>晴<1065,201,0>就<1266,354,0>会<1620,758,0>暗
    [48041,2327]<0,354,0>我<354,355,0>早<709,301,0>就<1010,405,0>习<1415,912,0>惯
    [51079,2626]<0,455,0>一<455,353,0>日<808,402,0>为<1210,252,0>了<1462,407,0>三<1869,757,0>餐
    [53705,2530]<0,303,0>不<303,354,0>至<657,405,0>于<1062,405,0>寒<1467,1063,0>酸
    [56948,1721]<0,355,0>为<355,303,0>给<658,407,0>你<1065,202,0>取<1267,454,0>暖
    [58669,3180]<0,747,0>我<747,302,0>把<1049,354,0>翅<1403,354,0>膀<1757,306,0>折<2063,1117,0>断
    [62202,2732]<0,356,0>我<356,301,0>遭<657,356,0>遇<1013,354,0>那<1367,303,0>些<1670,354,0>苦<2024,708,0>难
    [64934,2364]<0,354,0>你<354,843,0>却<1197,254,0>不<1451,913,0>管
    [67469,3469]<0,761,0>我<761,681,0>飞<1442,457,0>翔<1899,253,0>在<2152,252,0>乌<2404,202,0>云<2606,253,0>之<2859,610,0>中
    [70938,2834]<0,203,0>你<203,556,0>看<759,555,0>着<1314,202,0>我<1516,203,0>无<1719,203,0>动<1922,307,0>于<2229,605,0>衷
    [73772,2975]<0,203,0>有<203,509,0>多<712,654,0>少<1366,318,0>次<1684,411,0>波<2095,272,0>涛<2367,253,0>汹<2620,355,0>涌
    [76747,2121]<0,303,0>在<303,708,0>我 <1011,351,0>心<1362,759,0>中
    [78868,3342]<0,560,0>你<560,760,0>飞<1320,609,0>向<1929,151,0>了<2080,201,0>雪<2281,203,0>山<2484,251,0>之<2735,607,0>巅
    [82210,2783]<0,355,0>我<355,406,0>留<761,557,0>在<1318,254,0>你<1572,203,0>回<1775,150,0>忆<1925,305,0>里<2230,553,0>面
    [84993,5340]<0,252,0>你<252,566,0>成<818,506,0>仙<1324,303,0>我<1627,304,0>替<1931,716,0>你<2647,556,0>留<3203,772,0>守<3975,453,0>人<4428,912,0>间
    [90466,5478]<0,313,0>麻<313,1010,0>雀<1323,354,0>也<1677,960,0>有<2637,503,0>明<3140,2338,0>天
    [116357,2310]<0,302,0>天<302,291,0>会<593,302,0>晴<895,303,0>就<1198,353,0>会<1551,759,0>暗
    [118667,2280]<0,356,0>我<356,252,0>早<608,354,0>就<962,406,0>习<1368,912,0>惯
    [121755,2488]<0,408,0>一<408,355,0>日<763,404,0>为<1167,204,0>了<1371,404,0>三<1775,713,0>餐
    [124243,2533]<0,404,0>不<404,356,0>至<760,354,0>于<1114,354,0>寒<1468,1065,0>酸
    [127484,1977]<0,356,0>为<356,352,0>给<708,356,0>你<1064,254,0>取<1318,659,0>暖
    [129461,3138]<0,659,0>我<659,405,0>把<1064,304,0>翅<1368,355,0>膀<1723,354,0>折<2077,1061,0>断
    [132817,2682]<0,353,0>我<353,356,0>遭<709,302,0>遇<1011,353,0>那<1364,202,0>些<1566,458,0>苦<2024,658,0>难
    [135499,2438]<0,354,0>你<354,921,0>却<1275,253,0>不<1528,910,0>管
    [137937,3390]<0,809,0>我<809,658,0>飞<1467,609,0>翔<2076,203,0>在<2279,200,0>乌<2479,152,0>云<2631,303,0>之<2934,456,0>中
    [141383,2715]<0,180,0>你<180,611,0>看<791,606,0>着<1397,203,0>我<1600,202,0>无<1802,203,0>动<2005,255,0>于<2260,455,0>衷
    [144201,3039]<0,202,0>有<202,660,0>多<862,608,0>少<1470,203,0>次<1673,356,0>波<2029,304,0>涛<2333,353,0>汹<2686,353,0>涌
    [147240,2120]<0,302,0>在<302,708,0>我 <1010,403,0>心<1413,707,0>中
    [149360,3241]<0,656,0>你<656,710,0>飞<1366,557,0>向<1923,203,0>了<2126,203,0>雪<2329,203,0>山<2532,305,0>之<2837,404,0>巅
    [152765,2783]<0,203,0>我<203,605,0>留<808,506,0>在<1314,204,0>你<1518,201,0>回<1719,204,0>忆<1923,305,0>里<2228,555,0>面
    [155548,5337]<0,253,0>你<253,580,0>成<833,558,0>仙<1391,201,0>我<1592,358,0>替<1950,631,0>你<2581,659,0>留<3240,831,0>守<4071,355,0>人<4426,911,0>间
    [161086,5010]<0,305,0>麻<305,1010,0>雀<1315,356,0>也<1671,1063,0>有<2734,406,0>明<3140,1870,0>天
    [186226,3140]<0,560,0>我<560,710,0>飞<1270,506,0>翔<1776,202,0>在<1978,202,0>乌<2180,151,0>云<2331,355,0>之<2686,454,0>中
    [189440,2829]<0,202,0>你<202,606,0>看<808,606,0>着<1414,202,0>我<1616,153,0>无<1769,203,0>动<1972,251,0>于<2223,606,0>衷
    [192269,3037]<0,253,0>有<253,608,0>多<861,555,0>少<1416,253,0>次<1669,307,0>波<1976,352,0>涛<2328,304,0>汹<2632,405,0>涌
    [195306,2028]<0,252,0>在<252,737,0>我 <989,379,0>心<1368,660,0>中
    [197334,3397]<0,659,0>你<659,710,0>飞<1369,557,0>向<1926,203,0>了<2129,202,0>雪<2331,202,0>山<2533,304,0>之<2837,560,0>巅
    [200731,2831]<0,253,0>我<253,607,0>留<860,505,0>在<1365,203,0>你<1568,202,0>回<1770,203,0>忆<1973,302,0>里<2275,556,0>面
    [203562,5380]<0,252,0>你<252,604,0>成<856,557,0>仙<1413,203,0>我<1616,353,0>替<1969,657,0>你<2626,678,0>留<3304,708,0>守<4012,455,0>人<4467,913,0>间
    [209125,252786]<0,255,0>麻<255,1011,0>雀<1266,301,0>也<1567,1115,0>有<2682,456,0>明<3138,2379,0>天
    `;

test("parse krc", () => {
  const content = parseKrc(KGKRC);
  expect(content).not.toBe(undefined);
});
