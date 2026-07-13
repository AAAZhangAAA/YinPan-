/* 影盘集 · 资源数据文件（由后台导出，已含新增资源） */
const CATEGORIES = [
  {
    "name": "纪录片",
    "icon": "🎞️",
    "subs": [
      "自然",
      "历史",
      "科学",
      "科技",
      "美食",
      "人文",
      "社会",
      "军事",
      "旅行",
      "人物传记",
      "动物",
      "宇宙"
    ]
  },
  {
    "name": "电影",
    "icon": "🎬",
    "subs": [
      "动作",
      "喜剧",
      "科幻",
      "悬疑",
      "爱情",
      "剧情",
      "恐怖",
      "犯罪",
      "动画",
      "战争",
      "奇幻",
      "冒险",
      "武侠",
      "警匪"
    ]
  },
  {
    "name": "电视剧",
    "icon": "📺",
    "subs": [
      "国产剧",
      "美剧",
      "韩剧",
      "日剧",
      "英剧",
      "港剧",
      "泰剧",
      "台剧",
      "动漫",
      "网剧"
    ]
  },
  {
    "name": "综艺",
    "icon": "🎤",
    "subs": [
      "国产综艺",
      "欧美综艺",
      "韩国综艺",
      "真人秀",
      "访谈",
      "音乐",
      "脱口秀",
      "美食综艺"
    ]
  },
  {
    "name": "插件工具",
    "icon": "🧩",
    "subs": [
      "浏览器插件",
      "下载工具",
      "实用工具",
      "影音播放",
      "字幕工具",
      "网盘工具",
      "剪辑软件",
      "系统优化"
    ]
  }
];

const RESOURCES = [
  {
    "id": "d-001",
    "title": "地球脉动 第三季",
    "brief": "BBC 自然史诗，4K 极致画质记录地球生灵。",
    "description": "大卫·爱登堡解说的自然纪录片巅峰，从深海到高山，呈现地球生命的壮丽。\n4K 高码率版本，画面治愈，适合大屏收藏。",
    "category": "纪录片",
    "subcategory": "自然",
    "cover": "",
    "tags": [
      "自然",
      "BBC",
      "4K",
      "治愈"
    ],
    "recommended": true,
    "date": "2026-07-12",
    "links": [
      {
        "name": "夸克网盘",
        "url": "https://pan.example.com/s/d001qk",
        "password": "earth"
      },
      {
        "name": "阿里云盘",
        "url": "https://pan.example.com/s/d001al",
        "password": ""
      }
    ]
  },
  {
    "id": "d-002",
    "title": "河西走廊",
    "brief": "国产历史人文纪录片，丝路千年风云。",
    "description": "以河西走廊为线索的史诗级历史纪录片，画面与配乐俱佳。\n适合了解西北历史与文化交流。",
    "category": "纪录片",
    "subcategory": "历史",
    "cover": "",
    "tags": [
      "历史",
      "人文",
      "国产"
    ],
    "recommended": true,
    "date": "2026-07-09",
    "links": [
      {
        "name": "百度网盘",
        "url": "https://pan.example.com/s/d002bd",
        "password": "hxl"
      }
    ]
  },
  {
    "id": "d-003",
    "title": "舌尖上的中国 第四季",
    "brief": "美食纪录片常青树，烟火气里看中国。",
    "description": "围绕食物展开的人文美食纪录片，地道风味与市井温情并存。\n下饭神作，适合慢慢看。",
    "category": "纪录片",
    "subcategory": "美食",
    "cover": "",
    "tags": [
      "美食",
      "人文",
      "国产"
    ],
    "recommended": false,
    "date": "2026-06-30",
    "links": [
      {
        "name": "夸克网盘",
        "url": "https://pan.example.com/s/d003qk",
        "password": "sjs"
      }
    ]
  },
  {
    "id": "d-004",
    "title": "宇宙时空之旅",
    "brief": "硬核科普纪录片，带你看懂宇宙。",
    "description": "尼尔·德格拉斯·泰森主持的科学纪录片，深入浅出讲宇宙与物理。\n科普入门与视觉盛宴兼得。",
    "category": "纪录片",
    "subcategory": "科学",
    "cover": "",
    "tags": [
      "科学",
      "科普",
      "宇宙"
    ],
    "recommended": false,
    "date": "2026-06-21",
    "links": [
      {
        "name": "阿里云盘",
        "url": "https://pan.example.com/s/d004al",
        "password": ""
      }
    ]
  },
  {
    "id": "m-001",
    "title": "星际穿越 4K 收藏版",
    "brief": "诺兰科幻神作，4K 修复 + 原声大碟，硬核科幻迷必收。",
    "description": "克里斯托弗·诺兰执导的太空科幻史诗，4K 重制修复版，附带 DTS-HD 原声与花絮。\n适合家庭影院收藏，画质与音轨均为顶级规格。",
    "category": "电影",
    "subcategory": "科幻",
    "cover": "",
    "tags": [
      "科幻",
      "4K",
      "诺兰",
      "家庭影院"
    ],
    "recommended": true,
    "date": "2026-07-10",
    "links": [
      {
        "name": "夸克网盘",
        "url": "https://pan.example.com/s/m001qk",
        "password": "stlx"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.example.com/s/m001bd",
        "password": "8888"
      }
    ]
  },
  {
    "id": "m-002",
    "title": "盗梦空间 导演剪辑版",
    "brief": "梦境嵌套烧脑经典，多版本合集，含导演评论音轨。",
    "description": "层层梦境的烧脑之作，本资源为导演剪辑版，附带诺兰评论音轨与概念设定集。\n适合二刷三刷反复品味细节。",
    "category": "电影",
    "subcategory": "悬疑",
    "cover": "",
    "tags": [
      "悬疑",
      "烧脑",
      "导演剪辑"
    ],
    "recommended": false,
    "date": "2026-06-28",
    "links": [
      {
        "name": "夸克网盘",
        "url": "https://pan.example.com/s/m002qk",
        "password": "dream"
      }
    ]
  },
  {
    "id": "m-003",
    "title": "你好，李焕英 高清版",
    "brief": "温情喜剧催泪佳作，合家欢观影首选。",
    "description": "贾玲导演处女作，笑中带泪的穿越温情故事。\n1080P 高清版本，适合节假日家庭观影。",
    "category": "电影",
    "subcategory": "喜剧",
    "cover": "",
    "tags": [
      "喜剧",
      "温情",
      "国产"
    ],
    "recommended": false,
    "date": "2026-06-15",
    "links": [
      {
        "name": "百度网盘",
        "url": "https://pan.example.com/s/m003bd",
        "password": "2024"
      },
      {
        "name": "阿里云盘",
        "url": "https://pan.example.com/s/m003al",
        "password": ""
      }
    ]
  },
  {
    "id": "m-004",
    "title": "疯狂的麦克斯：狂暴之路",
    "brief": "末世废土飙车爽片，动作戏教科书级。",
    "description": "乔治·米勒执导的末世动作爽片，全程高能追逐戏。\n4K 版色彩与运镜极佳，动作片爱好者收藏首选。",
    "category": "电影",
    "subcategory": "动作",
    "cover": "",
    "tags": [
      "动作",
      "末世",
      "4K"
    ],
    "recommended": true,
    "date": "2026-07-02",
    "links": [
      {
        "name": "夸克网盘",
        "url": "https://pan.example.com/s/m004qk",
        "password": "maxx"
      }
    ]
  },
  {
    "id": "m-005",
    "title": "爱在黎明破晓前 三部曲",
    "brief": "浪漫爱情经典三部曲，台词向神作。",
    "description": "理查德·林克莱特「爱在」系列全三部，跨越十八年的爱情对话。\n适合安静的夜晚一个人慢慢看。",
    "category": "电影",
    "subcategory": "爱情",
    "cover": "",
    "tags": [
      "爱情",
      "文艺",
      "台词"
    ],
    "recommended": false,
    "date": "2026-05-30",
    "links": [
      {
        "name": "百度网盘",
        "url": "https://pan.example.com/s/m005bd",
        "password": "love"
      }
    ]
  },
  {
    "id": "t-001",
    "title": "繁花 全 30 集",
    "brief": "王家卫美学沪语剧，年代感拉满。",
    "description": "王家卫首部剧集，以上海黄河路为背景的九十年代商战风情画。\n全 30 集 1080P，画面质感极佳。",
    "category": "电视剧",
    "subcategory": "国产剧",
    "cover": "",
    "tags": [
      "国产剧",
      "王家卫",
      "年代"
    ],
    "recommended": true,
    "date": "2026-07-08",
    "links": [
      {
        "name": "夸克网盘",
        "url": "https://pan.example.com/s/t001qk",
        "password": "fh2024"
      },
      {
        "name": "阿里云盘",
        "url": "https://pan.example.com/s/t001al",
        "password": ""
      }
    ]
  },
  {
    "id": "t-002",
    "title": "权力的游戏 全八季",
    "brief": "史诗奇幻剧巅峰，全集打包。",
    "description": "HBO 史诗奇幻巨制全八季合集，含未删减版与制作特辑。\n前几季质量封神，适合入坑与收藏。",
    "category": "电视剧",
    "subcategory": "美剧",
    "cover": "",
    "tags": [
      "美剧",
      "奇幻",
      "史诗"
    ],
    "recommended": false,
    "date": "2026-06-20",
    "links": [
      {
        "name": "百度网盘",
        "url": "https://pan.example.com/s/t002bd",
        "password": "got8"
      }
    ]
  },
  {
    "id": "t-003",
    "title": "请回答 1988 全 20 集",
    "brief": "韩剧封神温情之作，邻里友情家庭。",
    "description": "韩国国民级情景剧，双门洞五个家庭的温暖日常。\n笑点与泪点齐飞，治愈系必看。",
    "category": "电视剧",
    "subcategory": "韩剧",
    "cover": "",
    "tags": [
      "韩剧",
      "温情",
      "治愈"
    ],
    "recommended": true,
    "date": "2026-07-05",
    "links": [
      {
        "name": "夸克网盘",
        "url": "https://pan.example.com/s/t003qk",
        "password": "1988"
      }
    ]
  },
  {
    "id": "t-004",
    "title": "重启人生 全 11 集",
    "brief": "日剧轻治愈，重生轮回小确幸。",
    "description": "满岛光主演，关于重生与平凡生活的轻盈日剧。\n节奏舒服，适合下饭观看。",
    "category": "电视剧",
    "subcategory": "日剧",
    "cover": "",
    "tags": [
      "日剧",
      "治愈",
      "轻喜剧"
    ],
    "recommended": false,
    "date": "2026-06-10",
    "links": [
      {
        "name": "阿里云盘",
        "url": "https://pan.example.com/s/t004al",
        "password": ""
      }
    ]
  },
  {
    "id": "v-001",
    "title": "快乐再出发 第一季",
    "brief": "0713 再就业男团，真实又好笑。",
    "description": "老男孩们的穷游综艺，真诚有趣反套路。\n低成本高口碑，下饭神综。",
    "category": "综艺",
    "subcategory": "国产综艺",
    "cover": "",
    "tags": [
      "国产综艺",
      "搞笑",
      "治愈"
    ],
    "recommended": true,
    "date": "2026-07-03",
    "links": [
      {
        "name": "夸克网盘",
        "url": "https://pan.example.com/s/v001qk",
        "password": "klzb"
      }
    ]
  },
  {
    "id": "v-002",
    "title": "克拉克森的农场 第二季",
    "brief": "英式幽默农耕纪实，笑着看荒野求生。",
    "description": "杰里米·克拉克森的农场真人秀，笑料与意外并存。\n自然治愈又搞笑，强烈推荐。",
    "category": "综艺",
    "subcategory": "欧美综艺",
    "cover": "",
    "tags": [
      "欧美综艺",
      "纪实",
      "幽默"
    ],
    "recommended": false,
    "date": "2026-06-22",
    "links": [
      {
        "name": "阿里云盘",
        "url": "https://pan.example.com/s/v002al",
        "password": ""
      }
    ]
  },
  {
    "id": "v-003",
    "title": "种地吧 第一季",
    "brief": "十个少年真实种地，劳作治愈系。",
    "description": "少年们从零开始务农的纪实综艺，质朴真诚。\n节奏慢但很解压。",
    "category": "综艺",
    "subcategory": "国产综艺",
    "cover": "",
    "tags": [
      "国产综艺",
      "纪实",
      "治愈"
    ],
    "recommended": false,
    "date": "2026-05-28",
    "links": [
      {
        "name": "百度网盘",
        "url": "https://pan.example.com/s/v003bd",
        "password": "zd01"
      }
    ]
  },
  {
    "id": "p-001",
    "title": "网盘直链下载助手（浏览器插件）",
    "brief": "一键解析网盘直链，破除客户端限速。",
    "description": "支持主流网盘直链解析的浏览器扩展，告别限速客户端。\n安装后点击网盘页面即可生成直链，配合下载工具使用。",
    "category": "插件工具",
    "subcategory": "浏览器插件",
    "cover": "",
    "tags": [
      "浏览器插件",
      "网盘",
      "下载"
    ],
    "recommended": true,
    "date": "2026-07-12",
    "links": [
      {
        "name": "蓝奏云",
        "url": "https://pan.example.com/s/p001lz",
        "password": "plugin"
      },
      {
        "name": "GitHub 发布页",
        "url": "https://pan.example.com/s/p001gh",
        "password": ""
      }
    ]
  },
  {
    "id": "p-002",
    "title": "IDM 下载加速工具（便携版）",
    "brief": "多线程下载神器，提速拉满，免安装。",
    "description": "Internet Download Manager 便携破解版，支持断点续传与多线程加速。\n解压即用，配合浏览器插件食用更佳。",
    "category": "插件工具",
    "subcategory": "下载工具",
    "cover": "",
    "tags": [
      "下载工具",
      "加速",
      "便携"
    ],
    "recommended": true,
    "date": "2026-07-06",
    "links": [
      {
        "name": "夸克网盘",
        "url": "https://pan.example.com/s/p002qk",
        "password": "idm6"
      }
    ]
  },
  {
    "id": "p-003",
    "title": "油猴脚本合集（Tampermonkey）",
    "brief": "数十个实用脚本，去广告/解锁/美化一网打尽。",
    "description": "精选常用油猴脚本集合，覆盖视频解析、广告过滤、界面美化。\n需先安装 Tampermonkey 插件，再导入脚本。",
    "category": "插件工具",
    "subcategory": "浏览器插件",
    "cover": "",
    "tags": [
      "油猴",
      "浏览器插件",
      "脚本"
    ],
    "recommended": false,
    "date": "2026-06-26",
    "links": [
      {
        "name": "蓝奏云",
        "url": "https://pan.example.com/s/p003lz",
        "password": "js01"
      }
    ]
  },
  {
    "id": "p-004",
    "title": "本地字幕匹配工具（实用工具）",
    "brief": "自动下载匹配字幕，看片无语言障碍。",
    "description": "拖入视频自动识别并下载匹配字幕，支持多语言。\n体积小巧，常驻后台使用。",
    "category": "插件工具",
    "subcategory": "实用工具",
    "cover": "",
    "tags": [
      "实用工具",
      "字幕",
      "看片"
    ],
    "recommended": false,
    "date": "2026-06-12",
    "links": [
      {
        "name": "阿里云盘",
        "url": "https://pan.example.com/s/p004al",
        "password": ""
      }
    ]
  },
  {
    "id": "p-005",
    "title": "广告终结者（浏览器插件）",
    "brief": "全网广告拦截，干净清爽的上网体验。",
    "description": "轻量广告拦截扩展，屏蔽视频前贴片、弹窗与悬浮广告。\n规则库可自动更新，内存占用低。",
    "category": "插件工具",
    "subcategory": "浏览器插件",
    "cover": "",
    "tags": [
      "浏览器插件",
      "去广告",
      "实用"
    ],
    "recommended": false,
    "date": "2026-06-02",
    "links": [
      {
        "name": "蓝奏云",
        "url": "https://pan.example.com/s/p005lz",
        "password": "ad02"
      }
    ]
  },
  {
    "id": "d-qwev84",
    "title": "成为沃伦·巴菲特 Becoming Warren Buffett (2017)",
    "brief": "身价净值超过600亿美元，沃伦•巴菲特是真正的独一无二的亿万富翁。",
    "description": "身价净值超过600亿美元，沃伦•巴菲特是真正的独一无二的亿万富翁。",
    "category": "纪录片",
    "cover": "https://movie.douban.com/photos/photo/2423142675/",
    "tags": [],
    "recommended": false,
    "date": "2026-07-13",
    "links": [
      {
        "name": "夸克",
        "url": "https://pan.quark.cn/s/f9fd56f04dd7",
        "password": ""
      }
    ],
    "subcategory": "人物传记"
  }
];
