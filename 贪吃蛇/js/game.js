document.addEventListener('DOMContentLoaded', function() {
    // 游戏配置
    const config = {
        gridSize: 20,
        initialSpeed: 150,
        minSpeed: 80,
        initialSnakeLength: 1,
        //吃到好果和坏果的加减分数
        goodFoodScore: 5,
        badFoodScore: -10,
        //不同难度下的障碍物数量
        maxObstacles: {
            easy: 15,
            normal: 25,
            hard: 35
        },
        //地图配置（实现地图可以拓展）
        maps:{
            'classroom':{
                name:'教室',
                background:'../assets/classroombackground.png',
                scale:1.0,//背景缩放比例，教室模式下，地图就是画布大小
                fixed:false,
                //从画布的左上角开始绘制
                startX:0,
                startY:0
            },
            'playground':{
                name: '操场',
                background: '../assets/playgroundbackground.png',
                scale: 2.0, //缩放比例，放大两倍
                fixed: false,
                //从30%位置开始绘制
                startX: 0.3,
                startY: 0.3
            },
            'library': {
                name: '图书馆',
                background: '../assets/librarybackground.png',
                scale: 3,//缩放比例，放大三倍
                fixed: false,
                //从30%的位置开始绘制
                startX: 0.3,
                startY: 0.3
            }
        },
        //障碍物图片配置
        obstacleSVGs: {
            classroom: [
                { 
                    name: '长凳子',
                    file: '../assets/obstacles/长凳子.svg',
                    width: 32,
                    height: 32
                },
                { 
                    name: '小凳子',
                    file: '../assets/obstacles/小凳子.svg',
                    width: 24,
                    height: 32
                },
                { 
                    name: '桌子',
                    file: '../assets/obstacles/桌子.svg',
                    width: 40,
                    height: 32
                },
                { 
                    name: '长桌子',
                    file: '../assets/obstacles/长桌子.svg',
                    width: 48,
                    height: 32
                },
                { 
                    name: '半侧面柜子',
                    file: '../assets/obstacles/半侧面柜子.svg',
                    width: 24,
                    height: 40
                },
                { 
                    name: '显微镜',
                    file: '../assets/obstacles/显微镜.svg',
                    width: 20,
                    height: 20
                },
                { 
                    name: '尺子',
                    file: '../assets/obstacles/尺子.svg',
                    width: 13,
                    height: 10
                },
                { 
                    name: '计算器',
                    file: '../assets/obstacles/计算器.svg',
                    width: 16,
                    height: 20
                },
                { 
                    name: '铅笔',
                    file: '../assets/obstacles/铅笔.svg',
                    width: 6,
                    height: 20
                },
                { 
                    name: '地球仪',
                    file: '../assets/obstacles/地球仪.svg',
                    width: 33,
                    height: 40
                },{
                    name: '书包',
                    file: '../assets/obstacles/书包.svg',
                    width: 28,
                    height: 23
                }
            ],
            playground: [
                { 
                    name: '橄榄球',
                    file: '../assets/obstacles/橄榄球.svg',
                    width: 32,
                    height: 32
                },
                { 
                    name: '篮球',
                    file: '../assets/obstacles/篮球.svg',
                    width: 32,
                    height: 40
                },
                { 
                    name: '乒乓球',
                    file: '../assets/obstacles/乒乓球.svg',
                    width: 32,
                    height: 32
                },
                { 
                    name: '足球',
                    file: '../assets/obstacles/足球.svg',
                    width: 40,
                    height: 24
                },
                {
                    name: '哑铃',
                    file: '../assets/obstacles/哑铃.svg',
                    width: 40,
                    height: 24
                },
                {
                    name: '滑板',
                    file: '../assets/obstacles/滑板.svg',
                    width: 35,
                    height: 20
                }
            ],
            library: [
                { 
                    name: '小沙发',
                    file: '../assets/obstacles/小沙发.svg',
                    width: 24,
                    height: 16
                },
                { 
                    name: '柜子',
                    file: '../assets/obstacles/柜子.svg',
                    width: 20,
                    height: 33
                },
                { 
                    name: '半侧面柜子',
                    file: '../assets/obstacles/半侧面柜子.svg',
                    width: 24,
                    height: 40
                },
                {
                    name: '长桌子',
                    file: '../assets/obstacles/长桌子.svg',
                    width: 45,
                    height: 20
                },
                {
                    name: '小凳子',
                    file: '../assets/obstacles/小凳子.svg',
                    width: 24,
                    height: 32
                },
                { 
                    name: '桌子',
                    file: '../assets/obstacles/桌子.svg',
                    width: 40,
                    height: 32
                }
            ]
        },
    // 食物配置
    foodConfigs: {
        classroom: {
            type: 'text',
            color: '#4A90E2',
            textColor: '#FFFFFF',
            fontSize: 14,
            borderColor: '#2C3E50'
        },
        playground: {
            type: 'image',
            goodCount: 3,
            badCount: 2,
            goodItems: [
                { 
                    name: 'apple', 
                    file: 'assets/food/playground/apple.svg',
                    width: 24, 
                    height: 24,
                    glowColor: '#4CAF50'
                },
                { 
                    name: 'orange', 
                    file: 'assets/food/playground/orange.svg',
                    width: 24, 
                    height: 24,
                    glowColor: '#FF9800'
                },
                { 
                    name: 'watermelon', 
                    file: 'assets/food/playground/watermelon.svg',
                    width: 28, 
                    height: 28,
                    glowColor: '#E91E63'
                }
            ],
            badItems: [
                { 
                    name: '棒棒糖', 
                    file: '../assets/bad/棒棒糖.svg',
                    width: 22, 
                    height: 28,
                    borderColor: '#795548'
                },
                { 
                    name: '爆米花', 
                    file: '../assets/bad/爆米花.svg',
                    width: 28, 
                    height: 24,
                    borderColor: '#FF9800'
                },
                { 
                    name: '冰淇淋', 
                    file: '../assets/bad/冰淇淋.svg',
                    width: 26, 
                    height: 20,
                    borderColor: '#FF5722'
                },
                { 
                    name: '饼干', 
                    file: '../assets/bad/饼干.svg',
                    width: 20, 
                    height: 21,
                    borderColor: '#FF5722'
                },
                { 
                    name: '蛋糕', 
                    file: '../assets/bad/蛋糕.svg',
                    width: 33, 
                    height: 33,
                    borderColor: '#FF5722'
                },
                { 
                    name: '汉堡', 
                    file: '../assets/bad/汉堡.svg',
                    width: 28, 
                    height: 25,
                    borderColor: '#FF5722'
                },
                { 
                    name: '可乐', 
                    file: '../assets/bad/可乐.svg',
                    width: 29, 
                    height: 22,
                    borderColor: '#FF5722'
                },
                { 
                    name: '披萨', 
                    file: '../assets/bad/披萨.svg',
                    width: 43, 
                    height: 38,
                    borderColor: '#FF5722'
                },
                { 
                    name: '巧克力', 
                    file: '../assets/bad/巧克力.svg',
                    width: 14, 
                    height: 22,
                    borderColor: '#FF5722'
                },
                { 
                    name: '热狗', 
                    file: '../assets/bad/热狗.svg',
                    width: 20, 
                    height: 27,
                    borderColor: '#FF5722'
                },
                { 
                    name: '薯条', 
                    file: '../assets/bad/薯条.svg',
                    width: 23, 
                    height: 23,
                    borderColor: '#FF5722'
                },
                { 
                    name: '糖果', 
                    file: '../assets/bad/糖果.svg',
                    width: 15, 
                    height: 15,
                    borderColor: '#FF5722'
                },
                { 
                    name: '甜甜圈', 
                    file: '../assets/bad/甜甜圈.svg',
                    width: 23, 
                    height: 20,
                    borderColor: '#FF5722'
                },
                { 
                    name: '炸鸡腿', 
                    file: '../assets/bad/炸鸡腿.svg',
                    width: 18, 
                    height: 25,
                    borderColor: '#FF5722'
                }
            ]
        },
        library: {
            type: 'image',
            goodCount: 2,
            badCount: 3,
            goodItems: [
                { 
                    name: '大学语文', 
                    file: '../assets/good/大学语文.svg',
                    width: 24, 
                    height: 32,
                    glowColor: '#4CAF50'
                },
                { 
                    name: '尺子', 
                    file: '../assets/good/尺子.svg',
                    width: 20, 
                    height: 12,
                    glowColor: '#2196F3'
                },
                { 
                    name: '笔记本电脑', 
                    file: '../assets/good/笔记本电脑.svg',
                    width: 20, 
                    height: 32,
                    glowColor: '#9C27B0'
                },
                { 
                    name: '地球仪', 
                    file: '../assets/good/地球仪.svg',
                    width: 25, 
                    height: 25,
                    glowColor: '#9C27B0'
                },
                { 
                    name: '高等数学', 
                    file: '../assets/good/高等数学.svg',
                    width: 28, 
                    height: 32,
                    glowColor: '#9C27B0'
                },
                { 
                    name: '计算器', 
                    file: '../assets/good/计算器.svg',
                    width: 20, 
                    height: 20,
                    glowColor: '#9C27B0'
                },
                { 
                    name: '铅笔', 
                    file: '../assets/good/铅笔.svg',
                    width: 15, 
                    height: 8,
                    glowColor: '#9C27B0'
                },
                { 
                    name: '书包', 
                    file: '../assets/good/书包.svg',
                    width: 35, 
                    height: 35,
                    glowColor: '#9C27B0'
                },
                { 
                    name: '书本', 
                    file: '../assets/good/书本.svg',
                    width: 20, 
                    height: 26,
                    glowColor: '#9C27B0'
                },
                { 
                    name: '书本2', 
                    file: '../assets/good/书本2.svg',
                    width: 22, 
                    height: 30,
                    glowColor: '#9C27B0'
                },
                { 
                    name: '数学', 
                    file: '../assets/good/数学.svg',
                    width: 33, 
                    height: 25,
                    glowColor: '#9C27B0'
                },
                { 
                    name: '橡皮', 
                    file: '../assets/good/橡皮.svg',
                    width: 12, 
                    height: 8,
                    glowColor: '#9C27B0'
                },
                { 
                    name: '英语', 
                    file: '../assets/good/英语.svg',
                    width: 25, 
                    height: 31,
                    glowColor: '#9C27B0'
                },
                { 
                    name: '英语2', 
                    file: '../assets/good/英语2.svg',
                    width: 27, 
                    height: 29,
                    glowColor: '#9C27B0'
                }
            ],
            badItems: [
                { 
                    name: '棒棒糖', 
                    file: '../assets/bad/棒棒糖.svg',
                    width: 22, 
                    height: 28,
                    borderColor: '#795548'
                },
                { 
                    name: '爆米花', 
                    file: '../assets/bad/爆米花.svg',
                    width: 28, 
                    height: 24,
                    borderColor: '#FF9800'
                },
                { 
                    name: '冰淇淋', 
                    file: '../assets/bad/冰淇淋.svg',
                    width: 26, 
                    height: 20,
                    borderColor: '#FF5722'
                },
                { 
                    name: '饼干', 
                    file: '../assets/bad/饼干.svg',
                    width: 20, 
                    height: 21,
                    borderColor: '#FF5722'
                },
                { 
                    name: '蛋糕', 
                    file: '../assets/bad/蛋糕.svg',
                    width: 33, 
                    height: 33,
                    borderColor: '#FF5722'
                },
                { 
                    name: '汉堡', 
                    file: '../assets/bad/汉堡.svg',
                    width: 28, 
                    height: 25,
                    borderColor: '#FF5722'
                },
                { 
                    name: '可乐', 
                    file: '../assets/bad/可乐.svg',
                    width: 29, 
                    height: 22,
                    borderColor: '#FF5722'
                },
                { 
                    name: '披萨', 
                    file: '../assets/bad/披萨.svg',
                    width: 43, 
                    height: 38,
                    borderColor: '#FF5722'
                },
                { 
                    name: '巧克力', 
                    file: '../assets/bad/巧克力.svg',
                    width: 14, 
                    height: 22,
                    borderColor: '#FF5722'
                },
                { 
                    name: '热狗', 
                    file: '../assets/bad/热狗.svg',
                    width: 20, 
                    height: 27,
                    borderColor: '#FF5722'
                },
                { 
                    name: '薯条', 
                    file: '../assets/bad/薯条.svg',
                    width: 23, 
                    height: 23,
                    borderColor: '#FF5722'
                },
                { 
                    name: '糖果', 
                    file: '../assets/bad/糖果.svg',
                    width: 15, 
                    height: 15,
                    borderColor: '#FF5722'
                },
                { 
                    name: '甜甜圈', 
                    file: '../assets/bad/甜甜圈.svg',
                    width: 23, 
                    height: 20,
                    borderColor: '#FF5722'
                },
                { 
                    name: '炸鸡腿', 
                    file: '../assets/bad/炸鸡腿.svg',
                    width: 18, 
                    height: 25,
                    borderColor: '#FF5722'
                }
            ]
        }
    }
    };
    // 游戏状态
    let game = {
        canvas: null,
        ctx: null,
        snake: [],
        obstacles: [],
        direction: {x: 1, y: 0},
        nextDirection: {x: 1, y: 0},
        score: 0,
        highScore: 0,
        speed: config.initialSpeed,
        gameLoop: null,
        isPaused: true,
        isGameOver: false,
        lastUpdateTime: 0,
        elapsedTime: 0,
        selectedMode: 'infinite',
        selectedTime: 0,
        selectedMap: 'classroom',
        selectedCat: '1',
        selectedDifficulty: 'normal',
        catProperties: {},
        foodCount: 0,
        questions: [],
        currentQuestion: null,
        //图书馆模式特有状态相关属性
        libraryLights: false,//图书馆灯光是否激活
        lightStartTime: 0,//灯光启动时间
        lightAngle: 0,//灯光角度
        lightDirection: 1,//灯光旋转方向，顺时针旋转
        reviveUsed: false,
        defenseActive: false,
        magicActive: false,
        mapImage:null,
        mapScale:1.0,
        //地图绘制的相关属性
        viewOffsetX:0,//水平和竖直的偏移量
        viewOffsetY:0,
        mapWidth:0,//地图实际宽高度
        mapHeight:0,
        isMapFixed:true,
        worldSnake:[],//“蛇”相对于地图中的位置
        worldSFood:{x:0,y:0},//食物相对于地图中的位置
        worldObstacles:[],//障碍物相对于地图中的位置
        //障碍物相关属性
        svgImages: {}, 
        imagesLoaded: false,
        //食物相关属性
        food: [], 
        foodImages: {},
        currentQuestion: null,
        classroomQuestions: [],
        // 相机跟随参数（提升响应速度）
        cameraLerpFactor: 0.2, // 插值系数（越大越灵敏，0.2→0.5提升响应）
        cameraDeadZone: 20,// 相机死区（像素，蛇头偏离中心超过此值才移动）
        maxCameraSpeed: 50,
    };
//游戏前准备
    //初始化游戏
    function initGame() {
        //获取画布和上下文
        game.canvas = document.getElementById('gameCanvas');
        game.ctx = game.canvas.getContext('2d');
        //设置画布尺寸
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        //从本地存储加载游戏设置
        loadGameSettings();
        //初始化地图系统()
        initMapSystem();
        //加载食物svg图片
        loadFoodSVGs();
        //加载问题数据
        loadQuestions().then(() => {
            // 问题加载完成后生成食物
            generateFood();
        });
        //初始化游戏元素
        initSnake();
        // 在 game.js 中找到调用 initAISnake 的位置（约617行），修改为：
       if(game.selectedMode==='ai'){
         initAISnake([[5, 5], [4, 5], [3, 5]]); }
        generateObstacles();
        // 加载最高分
        loadHighScore();
        // 设置事件监听器
        setupEventListeners();
        // 更新UI显示
        updateUI();
        // 显示开始提示
        document.getElementById('gameStartTip').style.display = 'block';
    }

    // 加载问题数据
    async function loadQuestions() {
        try {
            const response = await fetch('./question.json');
            const data = await response.json();
            game.classroomQuestions = data;
        } catch (error) {

            game.classroomQuestions = [
                {
                    question: "中国的首都是哪个城市？",
                    answers: [
                        { text: "北京", correct: true },
                        { text: "上海", correct: false },
                        { text: "广州", correct: false },
                        { text: "深圳", correct: false }
                    ]
                },
                {
                    question: "以下哪个是质数？",
                    answers: [
                        { text: "4", correct: false },
                        { text: "7", correct: true },
                        { text: "8", correct: false },
                        { text: "9", correct: false }
                    ]
                },
                {
                    "question": "《静夜思》的作者是谁？",
                    "answers": [
                        {"text": "李白", "correct": true},
                        {"text": "杜甫", "correct": false},
                        {"text": "白居易", "correct": false},
                        {"text": "王维", "correct": false}
                    ]
                },
                {
                    "question": "以下哪个字的部首是“氵”？",
                    "answers": [
                        {"text": "林", "correct": false},
                        {"text": "河", "correct": true},
                        {"text": "山", "correct": false},
                        {"text": "土", "correct": false}
                    ]
                },
                {
                    "question": "“春风又绿江南岸”的下一句是？",
                    "answers": [
                        {"text": "明月何时照我还", "correct": true},
                        {"text": "轻舟已过万重山", "correct": false},
                        {"text": "疑是银河落九天", "correct": false},
                        {"text": "霜叶红于二月花", "correct": false}
                    ]
                },
                {
                    "question": "“破釜沉舟”这个成语与哪位历史人物有关？",
                    "answers": [
                        {"text": "项羽", "correct": true},
                        {"text": "刘邦", "correct": false},
                        {"text": "韩信", "correct": false},
                        {"text": "张良", "correct": false}
                    ]
                },
                {
                    "question": "分数1/2转换成小数是？",
                    "answers": [
                        {"text": "0.5", "correct": true},
                        {"text": "0.4", "correct": false},
                        {"text": "0.6", "correct": false},
                        {"text": "0.7", "correct": false}
                    ]
                },
                {
                    "question": "8和12的最大公因数是？",
                    "answers": [
                        {"text": "4", "correct": true},
                        {"text": "2", "correct": false},
                        {"text": "6", "correct": false},
                        {"text": "8", "correct": false}
                    ]
                },
                {
                    "question": "一个数的倒数是它本身，这个数是？",
                    "answers": [
                        {"text": "1", "correct": true},
                        {"text": "2", "correct": false},
                        {"text": "0", "correct": false},
                        {"text": "3", "correct": false}
                    ]
                },
                {
                    "question": "三角形的内角和是多少度？",
                    "answers": [
                        {"text": "180度", "correct": true},
                        {"text": "90度", "correct": false},
                        {"text": "360度", "correct": false},
                        {"text": "270度", "correct": false}
                    ]
                },
                {
                    "question": "0不能作为？",
                    "answers": [
                        {"text": "除数", "correct": true},
                        {"text": "被除数", "correct": false},
                        {"text": "因数", "correct": false},
                        {"text": "加数", "correct": false}
                    ]
                },
                {
                    "question": "1平方千米等于多少公顷？",
                    "answers": [
                        {"text": "100", "correct": true},
                        {"text": "10", "correct": false},
                        {"text": "1000", "correct": false},
                        {"text": "50", "correct": false}
                    ]
                },
                {
                    "question": "把3米长的绳子平均分成5段，每段长多少米？",
                    "answers": [
                        {"text": "0.6米", "correct": true},
                        {"text": "0.5米", "correct": false},
                        {"text": "0.8米", "correct": false},
                        {"text": "0.7米", "correct": false}
                    ]
                },
                {
                    "question": "最小的合数是？",
                    "answers": [
                        {"text": "4", "correct": true},
                        {"text": "2", "correct": false},
                        {"text": "3", "correct": false},
                        {"text": "5", "correct": false}
                    ]
                },
                {
                    "question": "“teacher”的中文意思是？",
                    "answers": [
                        {"text": "老师", "correct": true},
                        {"text": "学生", "correct": false},
                        {"text": "医生", "correct": false},
                        {"text": "护士", "correct": false}
                    ]
                },
                {
                    "question": "“water”的中文意思是？",
                    "answers": [
                        {"text": "水", "correct": true},
                        {"text": "牛奶", "correct": false},
                        {"text": "果汁", "correct": false},
                        {"text": "茶", "correct": false}
                    ]
                },
                {
                    "question": "“数字5”的英文是？",
                    "answers": [
                        {"text": "five", "correct": true},
                        {"text": "four", "correct": false},
                        {"text": "six", "correct": false},
                        {"text": "seven", "correct": false}
                    ]
                },
                {
                    "question": "“school”的中文意思是？",
                    "answers": [
                        {"text": "学校", "correct": true},
                        {"text": "家庭", "correct": false},
                        {"text": "公园", "correct": false},
                        {"text": "医院", "correct": false}
                    ]
                },
                {
                    "question": "“father”的中文意思是？",
                    "answers": [
                        {"text": "爸爸", "correct": true},
                        {"text": "妈妈", "correct": false},
                        {"text": "爷爷", "correct": false},
                        {"text": "奶奶", "correct": false}
                    ]
                },
                {
                    "question": "下列哪种现象属于光的反射？",
                    "answers": [
                        {"text": "镜子成像", "correct": true},
                        {"text": "筷子在水中变弯", "correct": false},
                        {"text": "小孔成像", "correct": false},
                        {"text": "彩虹", "correct": false}
                    ]
                },
                {
                    "question": "物体的质量不随下列哪个因素改变？",
                    "answers": [
                        {"text": "位置", "correct": true},
                        {"text": "形状", "correct": false},
                        {"text": "状态", "correct": false},
                        {"text": "温度", "correct": false}
                    ]
                },
                {
                    "question": "压强的单位是？",
                    "answers": [
                        {"text": "帕斯卡", "correct": true},
                        {"text": "牛顿", "correct": false},
                        {"text": "焦耳", "correct": false},
                        {"text": "瓦特", "correct": false}
                    ]
                },
                {
                    "question": "下列哪种能源属于可再生能源？",
                    "answers": [
                        {"text": "太阳能", "correct": true},
                        {"text": "煤炭", "correct": false},
                        {"text": "石油", "correct": false},
                        {"text": "天然气", "correct": false}
                    ]
                },
                {
                    "question": "电流的单位是？",
                    "answers": [
                        {"text": "安培", "correct": true},
                        {"text": "伏特", "correct": false},
                        {"text": "欧姆", "correct": false},
                        {"text": "瓦特", "correct": false}
                    ]
                },
                {
                    "question": "力的三要素不包括？",
                    "answers": [
                        {"text": "力的大小", "correct": false},
                        {"text": "力的方向", "correct": false},
                        {"text": "力的作用点", "correct": false},
                        {"text": "力的速度", "correct": true}
                    ]
                },
                {
                    "question": "下列哪种现象属于熔化？",
                    "answers": [
                        {"text": "冰变成水", "correct": true},
                        {"text": "水变成冰", "correct": false},
                        {"text": "水变成水蒸气", "correct": false},
                        {"text": "水蒸气变成水", "correct": false}
                    ]
                },
                {
                    "question": "凸透镜对光线有什么作用？",
                    "answers": [
                        {"text": "会聚", "correct": true},
                        {"text": "发散", "correct": false},
                        {"text": "反射", "correct": false},
                        {"text": "折射", "correct": false}
                    ]
                },
                {
                    "question": "功的单位是？",
                    "answers": [
                        {"text": "焦耳", "correct": true},
                        {"text": "瓦特", "correct": false},
                        {"text": "牛顿", "correct": false},
                        {"text": "帕斯卡", "correct": false}
                    ]
                },
                {
                    "question": "氧气的化学式是？",
                    "answers": [
                        {"text": "O₂", "correct": true},
                        {"text": "O", "correct": false},
                        {"text": "O₃", "correct": false},
                        {"text": "2O", "correct": false}
                    ]
                },
                {
                    "question": "二氧化碳的化学式是？",
                    "answers": [
                        {"text": "CO₂", "correct": true},
                        {"text": "CO", "correct": false},
                        {"text": "C₂O", "correct": false},
                        {"text": "C₂O₃", "correct": false}
                    ]
                },
                {
                    "question": "下列哪种物质是酸？",
                    "answers": [
                        {"text": "盐酸", "correct": true},
                        {"text": "氢氧化钠", "correct": false},
                        {"text": "氯化钠", "correct": false},
                        {"text": "碳酸钠", "correct": false}
                    ]
                },
                {
                    "question": "金属活动性顺序中，排在氢前面的金属能与酸反应生成？",
                    "answers": [
                        {"text": "氢气", "correct": true},
                        {"text": "氧气", "correct": false},
                        {"text": "二氧化碳", "correct": false},
                        {"text": "氮气", "correct": false}
                    ]
                },
                {
                    "question": "水的相对分子质量是？",
                    "answers": [
                        {"text": "18", "correct": true},
                        {"text": "16", "correct": false},
                        {"text": "20", "correct": false},
                        {"text": "12", "correct": false}
                    ]
                },
                {
                    "question": "下列哪种物质是碱？",
                    "answers": [
                        {"text": "氢氧化钙", "correct": true},
                        {"text": "硫酸", "correct": false},
                        {"text": "硝酸钾", "correct": false},
                        {"text": "氧化铜", "correct": false}
                    ]
                },
                {
                    "question": "化学变化的本质特征是？",
                    "answers": [
                        {"text": "有新物质生成", "correct": true},
                        {"text": "状态改变", "correct": false},
                        {"text": "颜色改变", "correct": false},
                        {"text": "放热", "correct": false}
                    ]
                },
                {
                    "question": "铁在氧气中燃烧生成的物质是？",
                    "answers": [
                        {"text": "四氧化三铁", "correct": true},
                        {"text": "氧化铁", "correct": false},
                        {"text": "氧化亚铁", "correct": false},
                        {"text": "氢氧化铁", "correct": false}
                    ]
                },
                {
                    "question": "下列哪种元素是金属元素？",
                    "answers": [
                        {"text": "钠", "correct": true},
                        {"text": "碳", "correct": false},
                        {"text": "氧", "correct": false},
                        {"text": "氮", "correct": false}
                    ]
                },
                {
                    "question": "氯化钠的化学式是？",
                    "answers": [
                        {"text": "NaCl", "correct": true},
                        {"text": "Na₂Cl", "correct": false},
                        {"text": "NaCl₂", "correct": false},
                        {"text": "Na₂Cl₂", "correct": false}
                    ]
                },
                {
                    "question": "实验室制取氧气常用的药品不包括？",
                    "answers": [
                        {"text": "水", "correct": true},
                        {"text": "高锰酸钾", "correct": false},
                        {"text": "氯酸钾", "correct": false},
                        {"text": "过氧化氢", "correct": false}
                    ]
                },
                {
                    "question": "下列哪种气体能使澄清石灰水变浑浊？",
                    "answers": [
                        {"text": "二氧化碳", "correct": true},
                        {"text": "氧气", "correct": false},
                        {"text": "氢气", "correct": false},
                        {"text": "氮气", "correct": false}
                    ]
                },
                {
                    "question": "原子的中心是？",
                    "answers": [
                        {"text": "原子核", "correct": true},
                        {"text": "电子", "correct": false},
                        {"text": "质子", "correct": false},
                        {"text": "中子", "correct": false}
                    ]
                },
                {
                    "question": "下列哪种物质属于有机物？",
                    "answers": [
                        {"text": "甲烷", "correct": true},
                        {"text": "碳酸钙", "correct": false},
                        {"text": "二氧化碳", "correct": false},
                        {"text": "水", "correct": false}
                    ]
                },
                {
                    "question": "硫酸的化学式是？",
                    "answers": [
                        {"text": "H₂SO₄", "correct": true},
                        {"text": "HSO₄", "correct": false},
                        {"text": "H₂SO₃", "correct": false},
                        {"text": "H₂S", "correct": false}
                    ]
                },
                {
                    "question": "下列哪种变化属于物理变化？",
                    "answers": [
                        {"text": "水蒸发", "correct": true},
                        {"text": "铁生锈", "correct": false},
                        {"text": "蜡烛燃烧", "correct": false},
                        {"text": "食物腐烂", "correct": false}
                    ]
                },
                {
                    "question": "氮气的化学式是？",
                    "answers": [
                        {"text": "N₂", "correct": true},
                        {"text": "N", "correct": false},
                        {"text": "N₃", "correct": false},
                        {"text": "2N", "correct": false}
                    ]
                }
            ];
        }
    }
    // 加载食物SVG图片
    function loadFoodSVGs() {
        const mapType = game.selectedMap;
        if (mapType === 'classroom') return;
        const foodConfig = config.foodConfigs[mapType];
        if (!foodConfig) return;
        // 合并好/坏果配置
        const allFoodItems = [...foodConfig.goodItems, ...foodConfig.badItems];
        let loadedCount = 0;
        const totalCount = allFoodItems.length;
        allFoodItems.forEach(item => {
            const img = new Image();
            img.onload = () => {
                game.foodImages[`${mapType}_${item.name}`] = img;
                loadedCount++;
                if (loadedCount === totalCount) console.log(`${mapType}食物SVG加载完成`);
            };
            img.onerror = () => console.error(`加载失败：${svg.file}`);
            img.src = item.file;
        });
    }
    //初始化地图系统的函数
    function initMapSystem(){
        game.cameraLerpFactor = 0.025; // 相机响应速度
        game.cameraDeadZone = 10;    // 死区
        //获取当前选择的地图配置
        const mapConfig = config.maps[game.selectedMap];
        game.mapScale = mapConfig.scale;
        game.isMapFixed = mapConfig.fixed;
        //先初始化画布尺寸
        const gameArea = document.querySelector('.game-area');
        const size = Math.min(gameArea.clientWidth, gameArea.clientHeight) - 40;
        const gridSize = config.gridSize;
        game.canvas.width = Math.floor(size / gridSize) * gridSize;
        game.canvas.height = Math.floor(size / gridSize) * gridSize;
        //根据缩放比例计算实际地图的长宽
        game.mapWidth = game.canvas.width * game.mapScale;
        game.mapHeight = game.canvas.height * game.mapScale;
         console.log("画布中心:", game.canvas.width / 2, game.canvas.height / 2);      
       
        //设置初始视口位置
        if(game.isMapFixed){
            game.viewOffsetX = 0;
            game.viewOffsetY = 0;
        }else{
            game.viewOffsetX=(game.mapWidth - game.canvas.width) * mapConfig.startX;
            game.viewOffsetY = (game.mapHeight - game.canvas.height) * mapConfig.startY;
        }
        //显示地图背景图片
        game.mapImage=new Image();
        game.mapImage.onload=function(){
            if(!game.isPaused){
                drawGame();//如果处于开始的状态，则绘制地图
            }
        }
        game.mapImage.src=mapConfig.background;//使用当前选择的地图的背景图片（对应地址）
        //加载障碍物svg的图片
        loadobstacleSVGs();
        //更新游戏区域的类名
        gameArea.classList.remove('classroom-mode', 'playground-mode', 'library-mode');
        gameArea.classList.add(`${game.selectedMap}-mode`);
    }
    function loadobstacleSVGs() {
        const mapType = game.selectedMap;
        const svgConfigs = config.obstacleSVGs[mapType] || [];
        if (svgConfigs.length === 0) {
            game.imagesLoaded = true;
            return;
        }
        let loadedCount = 0;
        const totalCount = svgConfigs.length;
        svgConfigs.forEach(svgConfig => {
            const img = new Image();
            img.onload = function() {
                console.log(`SVG图片加载成功: ${svgConfig.file}`);
                loadedCount++;
                // 存储到缓存
                const cacheKey = `${mapType}_${svgConfig.name}`;
                game.svgImages[cacheKey] = img;
                // 检查是否全部加载完成
                if (loadedCount === totalCount) {
                    game.imagesLoaded = true;
                    console.log(`所有${mapType}的SVG图片加载完成`);
                    // 重新绘制游戏
                    if (!game.isPaused) {
                        drawGame();
                    }
                }
            };
            img.onerror = function() {
                console.error(`SVG图片加载失败: ${svgConfig.file}`);
                loadedCount++;
                // 加载失败时，设置为null
                const cacheKey = `${mapType}_${svgConfig.name}`;
                game.svgImages[cacheKey] = null;
                if (loadedCount === totalCount) {
                    game.imagesLoaded = true;
                }
            };
            img.src = svgConfig.file;
        });
    }
    //网格坐标与世界坐标的相互转换
    function gridToWorld(gridX, gridY) {
        return {
            x: gridX * config.gridSize,
            y: gridY * config.gridSize
        };
    }

    // 调整画布尺寸
    function resizeCanvas() {
        const gameArea = document.querySelector('.game-area');
        const size = Math.min(gameArea.clientWidth, gameArea.clientHeight) - 40;
        // 确保尺寸是网格大小的倍数
        const gridSize = config.gridSize;
        game.canvas.width = Math.floor(size / gridSize) * gridSize;
        game.canvas.height = Math.floor(size / gridSize) * gridSize;
        //重新计算地图尺寸
        if (game.selectedMap && config.maps[game.selectedMap]) {
            game.mapWidth = game.canvas.width * game.mapScale;
            game.mapHeight = game.canvas.height * game.mapScale;
            clampViewport();//重新限制视口
        }
        // 如果游戏已经开始，重新绘制
        if (!game.isPaused) {
            drawGame();
        }
    }
    //限制视口不超出地图边界
    function clampViewport() {
        const maxOffsetX = Math.max(0, game.mapWidth - game.canvas.width);
        const maxOffsetY = Math.max(0, game.mapHeight - game.canvas.height);
        game.viewOffsetX = Math.max(0, Math.min(Math.round(game.viewOffsetX), maxOffsetX));
        game.viewOffsetY = Math.max(0, Math.min(Math.round(game.viewOffsetY), maxOffsetY));
    }
    // 从本地存储加载游戏设置
    function loadGameSettings() {
        // 加载游戏模式
        console.log('开始加载游戏设置...');
        // 1. 加载地图选择 - 需要解析JSON
        try {
            const savedMapData = localStorage.getItem('selectedMap');
            let savedMapId = 'classroom'; // 默认值
            
            if (savedMapData) {
                // 尝试解析JSON
                try {
                    const mapData = JSON.parse(savedMapData);
                    savedMapId = mapData.id;
                    console.log('✓ 从JSON解析地图:', mapData);
                } catch (e) {
                    // 如果不是JSON，可能是旧版本的字符串
                    console.log('地图数据不是JSON，尝试作为字符串处理:', savedMapData);
                    savedMapId = savedMapData;
                }
            }
            // 检查地图是否存在
            if (savedMapId && config.maps[savedMapId]) {
                game.selectedMap = savedMapId;
                console.log('✓ 设置地图为:', savedMapId);
            } else {
                game.selectedMap = 'classroom';
                console.warn('✗ 地图不存在，使用默认: classroom');
            }
        } catch (error) {
            console.error('加载地图设置失败:', error);
            game.selectedMap = 'classroom';
        }
        // 2. 更新地图显示
        const mapConfig = config.maps[game.selectedMap];
        if (mapConfig) {
            document.getElementById('currentMap').textContent = mapConfig.name;
            console.log('✓ 地图名称更新为:', mapConfig.name);
        }
        const savedMode = localStorage.getItem('selectedGameMode');
        if (savedMode) {
            game.selectedMode = savedMode;
            document.getElementById('gameModeDisplay').textContent = 
                game.selectedMode === 'time' ? '限时模式' : '无限模式';
            // 如果是限时模式，加载时间设置
            if (game.selectedMode === 'time') {
                const savedTime = localStorage.getItem('selectedTime');
                if (savedTime) {
                    game.selectedTime = parseInt(savedTime);
                    document.getElementById('remainingTime').textContent = formatTime(game.selectedTime);
                    // 根据时间设置目标分数
                    const targetScore = Math.floor(game.selectedTime / 60) * 100;
                    document.getElementById('targetScore').textContent = targetScore;
                }
                // 显示时间目标区域
                document.getElementById('timeTargetContainer').style.display = 'block';
            } else {
                document.getElementById('timeTargetContainer').style.display = 'none';
            }
        }
        // 加载猫咪
        const savedCat = localStorage.getItem('selectedKitten');
        if (savedCat) {
            try {
                const catData = JSON.parse(savedCat);
                game.selectedCat = catData.id;
                // 更新猫咪图片
                const catImage = document.getElementById('selectedCatImage');
                catImage.src = `../assets/${game.selectedCat}.png`;
                catImage.alt = catData.name;
                // 更新猫咪信息
                document.getElementById('catName').textContent = catData.name;
                document.getElementById('catAbility').textContent = catData.desc;
                // 设置猫咪属性
                setCatProperties(game.selectedCat);
                // 显示对应的特殊状态
                updateSpecialStatus();
            } catch (e) {
                console.error('解析猫咪数据失败:', e);
            }
        }
        //获取开始页面中设置的难度（以此难度设置挡板即障碍物的数量），默认为普通难度
        const savedDifficulty = localStorage.getItem('gameDifficulty') || 'normal';
        game.selectedDifficulty = savedDifficulty;
    }
    // 设置猫咪属性
    function setCatProperties(catId) {
        switch(catId) {
            case '1': // 敏捷猫猫
                game.catProperties = {
                    speedMultiplier: 1.05,
                    defense: false,
                    revive: false,
                    magic: false
                };
                game.speed = Math.floor(config.initialSpeed / game.catProperties.speedMultiplier);
                break;
            case '2': // 防御猫猫
                game.catProperties = {
                    speedMultiplier: 1.0,
                    defense: true,
                    revive: false,
                    magic: false
                };
                break;
            case '3': // 幸运猫猫
                game.catProperties = {
                    speedMultiplier: 1.0,
                    defense: false,
                    revive: true,
                    reviveCount: 1,
                    extraLength: 5,
                    extraScore: 5,
                    magic: false
                };
                // 初始额外长度和分数
                game.score = game.catProperties.extraScore;
                updateUI();
                break;
            case '4': // 魔法猫猫
                game.catProperties = {
                    speedMultiplier: 1.0,
                    defense: false,
                    revive: false,
                    magic: true,
                    magicActive: false
                };
                break;
            default:
                game.catProperties = {
                    speedMultiplier: 1.0,
                    defense: false,
                    revive: false,
                    magic: false
                };
        }
    }
    // 更新特殊状态显示
    function updateSpecialStatus() {
        const defenseStatus = document.getElementById('defenseStatus');
        const luckStatus = document.getElementById('luckStatus');
        const magicStatus = document.getElementById('magicStatus');
        // 防御状态
        if (game.catProperties.defense) {
            defenseStatus.style.display = 'flex';
        } else {
            defenseStatus.style.display = 'none';
        }
        // 幸运状态
        if (game.catProperties.revive) {
            luckStatus.style.display = 'flex';
            document.getElementById('reviveCount').textContent = game.catProperties.reviveCount;
        } else {
            luckStatus.style.display = 'none';
        }
        // 魔法状态
        if (game.catProperties.magic) {
            magicStatus.style.display = 'flex';
        } else {
            magicStatus.style.display = 'none';
        }
    }
    // 初始化蛇
    function initSnake() {
        game.snake = [];
        game.worldSnake=[];//"蛇"在地图中的位置
        //计算起始位置

        const viewportGridWidth = Math.floor(game.canvas.width / config.gridSize);
        const viewportGridHeight = Math.floor(game.canvas.height / config.gridSize);
        const startGridX = Math.floor(viewportGridWidth / 2);
        const startGridY = Math.floor(viewportGridHeight / 2);
        //设置初始长度
        let initialLength = config.initialSnakeLength;
        if (game.catProperties&&game.catProperties.extraLength) {
            initialLength += game.catProperties.extraLength;//如果是幸运猫猫，会增加其的初始长度
        }
        for (let i = 0; i < initialLength; i++) {
            game.snake.push({
                x: startGridX - i,
                y: startGridY
            });
            //计算在整个地图中的坐标
            const worldPos = gridToWorld(startGridX - i, startGridY);
            game.worldSnake.push(worldPos);
            //如果不是固定的，要确保"蛇"在视口中，初始化相机
            if(!game.isMapFixed){
                centerViewportOnSnake();
                clampViewport();
            }
        }
    }
    //居中视口到蛇的位置
    function centerViewportOnSnake() {
        if (game.snake.length === 0) return;
        const head = game.snake[0];
        const worldHead = gridToWorld(head.x, head.y);
        // 调整视口，使蛇头居中
        game.viewOffsetX = worldHead.x - game.canvas.width / 2;
        game.viewOffsetY = worldHead.y - game.canvas.height / 2;
        // 限制视口不超出地图边界
        clampViewport();
    }
    // 生成障碍物
    function generateObstacles() {
        game.obstacles = [];
        const maxObstacles = config.maxObstacles[game.selectedDifficulty];
        const gridWidth = Math.floor(game.mapWidth/config.gridSize);
        const gridHeight = Math.floor(game.mapHeight/config.gridSize);
        // 获取当前地图的SVG配置
        const svgConfigs = config.obstacleSVGs[game.selectedMap] || [];
        for (let i = 0; i < maxObstacles; i++) {
            let obstacle;
            let isValid = false;
            let attempts = 0;
            while (!isValid && attempts < 100) {
                // 随机选择一个SVG图案
                const svgIndex = svgConfigs.length > 0 ? Math.floor(Math.random() * svgConfigs.length) : -1;
                const svgConfig = svgIndex !== -1 ? svgConfigs[svgIndex] : null;
                // 计算网格大小
                const width = svgConfig ? Math.ceil(svgConfig.width/config.gridSize) : 1;
                const height = svgConfig ? Math.ceil(svgConfig.height/config.gridSize) : 1;
                // 随机位置
                const x = Math.floor(Math.random() * (gridWidth - width));
                const y = Math.floor(Math.random() * (gridHeight - height));
                obstacle = {
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    type: svgConfig ? svgConfig.name : 'default',
                    svgConfig: svgConfig,
                    rotation: Math.random() > 0.7 ? Math.floor(Math.random() * 4) * 90 : 0
                };
                // 检查有效性
                isValid = true;
                //1.检查是否与蛇起始位置重叠
                for (const segment of game.snake) {
                    if (segment.x >= obstacle.x && segment.x < obstacle.x + obstacle.width &&
                        segment.y >= obstacle.y && segment.y < obstacle.y + obstacle.height) {
                        isValid = false;
                        break;
                    }
                }
                //2.检查是否与其他障碍物重叠
                if (isValid) {
                    for (const existingObstacle of game.obstacles) {
                        if (rectanglesOverlap(obstacle, existingObstacle)) {
                            isValid = false;
                            break;
                        }
                    }
                }
                //3.检查是否超出地图边界
                if (isValid) {
                    const mapGridWidth = Math.floor(game.mapWidth / config.gridSize);
                    const mapGridHeight = Math.floor(game.mapHeight / config.gridSize);
                    if (
                        obstacle.x < 0 || 
                        obstacle.y < 0 || 
                        obstacle.x + obstacle.width > mapGridWidth || 
                        obstacle.y + obstacle.height > mapGridHeight
                    ) {
                        isValid = false;
                    }
                }
                attempts++;
            }
            if (isValid) {
                game.obstacles.push(obstacle);
            }
        }
    }
    // 检查矩形重叠
    function rectanglesOverlap(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }
    function generateFood() {
        game.food = [];
        // 适配地图缩放：基于地图实际尺寸计算网格
        const gridWidth = Math.floor(game.mapWidth / config.gridSize);
        const gridHeight = Math.floor(game.mapHeight / config.gridSize);

        // 根据地图类型生成对应食物
        switch(game.selectedMap) {
            case 'classroom':
                generateClassroomFood(gridWidth, gridHeight);
                break;
            case 'playground':
                generatePlaygroundFood(gridWidth, gridHeight);
                break;
            case 'library':
                generateLibraryFood(gridWidth, gridHeight);
                break;
        }
    }
    // 生成教室食物（文字答案：统一颜色，长度匹配文字）
    function generateClassroomFood(gridWidth, gridHeight) {
        game.food = [];
        game.currentQuestion = null;
        // 随机选择题目
        const questionIndex = Math.floor(Math.random() * game.classroomQuestions.length);
        game.currentQuestion = game.classroomQuestions[questionIndex];
        // 更新问题显示
        const questionTextEl = document.getElementById('questionText');
        if (questionTextEl) {
            questionTextEl.textContent = game.currentQuestion.question;
        }
        game.currentQuestion.used = true;
        let positions = []; 
        // 为每个答案生成文字食物
        game.currentQuestion.answers.forEach(answer => {
            let food;
            let isValid = false;
            let attempts = 0;
            while (!isValid && attempts < 100) {
                // 生成随机位置
                const x = Math.floor(Math.random() * (gridWidth - answer.text.length)) + 1;
                const y = Math.floor(Math.random() * (gridHeight - 1)) + 1;
                // 检查是否与其他答案位置太近
                let tooClose = false;
                for (const pos of positions) {
                    const distance = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
                    if (distance < 10||distance>80) {//间距
                        tooClose = true;
                        break;
                    }
                }
                if (tooClose) {
                    attempts++;
                    continue;
                }
                food = {
                    x: x,
                    y: y,
                    text: answer.text,
                    isGood: answer.correct,
                    length: answer.text.length,
                    type: 'text',
                    style: config.foodConfigs.classroom
                };
                // 验证位置：不与蛇、障碍物、其他食物重叠
                isValid = isPositionValid(food.x, food.y, food.length, 1);
                if (isValid) {
                    game.food.push(food);
                }
                attempts++;
            }
            if (isValid) {
                game.food.push(food);
            } else {
                console.warn('无法为答案生成有效位置:', answer.text);
            }
        });
        if (game.food.length < game.currentQuestion.answers.length) {
            console.log('食物生成不完整，重新生成');
            setTimeout(() => generateClassroomFood(gridWidth, gridHeight), 100);
        }
    }
    // 生成操场食物
    function generatePlaygroundFood(gridWidth, gridHeight) {
        const playgroundConfig = config.foodConfigs.playground;
        const goodCount = playgroundConfig.goodCount;
        const badCount = playgroundConfig.badCount;
        // 生成好果
        for (let i = 0; i < goodCount; i++) {
            generateImageFood(
                gridWidth, gridHeight,
                playgroundConfig.goodItems,
                true
            );
        }
        // 生成坏果
        for (let i = 0; i < badCount; i++) {
            generateImageFood(
                gridWidth, gridHeight,
                playgroundConfig.badItems,
                false
            );
        }
    }
    // 生成图书馆食物
    function generateLibraryFood(gridWidth, gridHeight) {
        const libraryConfig = config.foodConfigs.library;
        const goodCount = libraryConfig.goodCount;
        const badCount = libraryConfig.badCount;
        // 生成好果
        for (let i = 0; i < goodCount; i++) {
            generateImageFood(
                gridWidth, gridHeight,
                libraryConfig.goodItems,
                true
            );
        }
        // 生成坏果
        for (let i = 0; i < badCount; i++) {
            generateImageFood(
                gridWidth, gridHeight,
                libraryConfig.badItems,
                false
            );
        }
    }
    // 生成图片食物（操场/图书馆通用）
    function generateImageFood(gridWidth, gridHeight, itemList, isGood) {
        let food;
        let isValid = false;
        let attempts = 0;
        // 随机选一个SVG配置项
        const randomItem = itemList[Math.floor(Math.random() * itemList.length)];
        while (!isValid && attempts < 100) {
            const foodLength = Math.ceil(randomItem.width / config.gridSize);
            food = {
                x: Math.floor(Math.random() * (gridWidth - foodLength)) + 1,
                y: Math.floor(Math.random() * (gridHeight - 1)) + 1,
                text: randomItem.name,
                isGood: isGood,
                length: foodLength,
                type: 'image',
                svgConfig: randomItem
            };
            isValid = isPositionValid(food.x, food.y, food.length, 1);
            attempts++;
        }
        if (isValid) {
            game.food.push(food);
        }
    }
    // 检查位置是否有效
    function isPositionValid(x, y, width = 1, height = 1) {
        // 1. 检查是否超出地图边界（替换为地图网格尺寸）
        const gridWidth = Math.floor(game.mapWidth/config.gridSize);
        const gridHeight = Math.floor(game.mapHeight / config.gridSize);
        if (x < 0 || y < 0 || x + width > gridWidth || y + height > gridHeight) {
            return false;
        }
        // 2. 如果是固定地图，确保食物在视口内
        if (game.isMapFixed) {
            const viewportGridWidth = Math.floor(game.canvas.width / config.gridSize);
            const viewportGridHeight = Math.floor(game.canvas.height / config.gridSize);
            if (x >= viewportGridWidth || y >= viewportGridHeight) {
                return false;
            }
        }
        // 3. 检查是否与蛇身重叠
        for (const segment of game.snake) {
            if (segment.x >= x && segment.x < x + width &&
                segment.y >= y && segment.y < y + height) {
                return false;
            }
        }
        // 4. 检查是否与障碍物重叠
        for (const obstacle of game.obstacles) {
            if (x < obstacle.x + obstacle.width &&
                x + width > obstacle.x &&
                y < obstacle.y + obstacle.height &&
                y + height > obstacle.y) {
                return false;
            }
        }
        // 5. 检查是否与现有食物重叠
        for (const food of game.food) {
            if (x < food.x + food.length &&
                x + width > food.x &&
                y < food.y + 1 &&
                y + height > food.y) {
                return false;
            }
        }
        return true;
    }
//绘制游戏
    function drawGame(){
        const ctx = game.ctx;
        //清除画布
        ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
        ctx.save();
        if(!game.isMapFixed && game.mapImage && game.mapImage.complete){
            ctx.translate(-game.viewOffsetX, -game.viewOffsetY);
        }
        //绘制地图背景
        drawMapBackground();
        //绘制游戏元素
        drawGameElements();
        //恢复状态
        ctx.restore();
        //绘制图书馆灯光效果
        if (game.selectedMap === 'library' && game.libraryLights) {
            drawLightEffect();
        }
    }
    // 触发图书馆灯光效果
    function triggerLibraryLights() {
        if (game.selectedMap !== 'library') return;
        
        game.libraryLights = true;
        game.lightStartTime = Date.now();
        game.lightAngle = 0;
        game.lightDirection = 1; // 顺时针
        game.lastHitTime = 0; // 初始化上次扣分时间
    }
    // 绘制图书馆灯光效果
    function drawLightEffect() {
        if (!game.libraryLights || game.selectedMap !== 'library') return;
        
        const ctx = game.ctx;
        const currentTime = Date.now();
        const lightActiveTime = currentTime - game.lightStartTime;
        
        // 灯光效果持续6秒
        if (lightActiveTime > 6000) {
            game.libraryLights = false;
            return;
        }
        // 更新灯光角度
        game.lightAngle += 0.2; 
        if (game.lightAngle >= 360) game.lightAngle -= 360;
        // 画布中心坐标
        const centerX = game.canvas.width / 2;
        const centerY = game.canvas.height / 2;
        const radius = Math.max(game.canvas.width, game.canvas.height) * 0.6;
        // 绘制灯光扇形
        ctx.save();
        
        // 创建扇形渐变
        const gradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 200, 0.15)');
        gradient.addColorStop(0.7, 'rgba(255, 255, 200, 0.05)');
        gradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
        
        // 扇形角度（20度）
        const scanRange = 10; // 每边10度
        
        // 计算扇形起始和结束角度（弧度）
        const startAngle = (game.lightAngle - scanRange) * Math.PI / 180;
        const endAngle = (game.lightAngle + scanRange) * Math.PI / 180;
        
        // 绘制扇形
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // 绘制扇形边框（视觉效果）
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.lineTo(centerX, centerY);
        ctx.closePath();
        
        ctx.strokeStyle = 'rgba(255, 255, 200, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
        
        // 检查蛇头是否在灯光范围内
        checkLightHit();
    }

    // 检查灯光是否照射到蛇头
    function checkLightHit() {
        if (!game.libraryLights || game.snake.length === 0) return;
        
        const currentTime = Date.now();
        const head = game.snake[0];
        
        // 将蛇头网格坐标转换为画布坐标
        const worldHeadX = head.x * config.gridSize;
        const worldHeadY = head.y * config.gridSize;
        const headCanvasX = worldHeadX - game.viewOffsetX;
        const headCanvasY = worldHeadY - game.viewOffsetY;
        
        // 画布中心坐标
        const centerX = game.canvas.width / 2;
        const centerY = game.canvas.height / 2;
        
        // 计算蛇头到中心的距离和角度
        const dx = headCanvasX - centerX;
        const dy = headCanvasY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > lightRadius) return;
        
        // 计算蛇头角度（弧度）
        const headAngleRad = Math.atan2(dy, dx);
        let headAngle = headAngleRad * 180 / Math.PI;
        
        // 标准化角度到0-360度
        if (headAngle < 0) headAngle += 360;
        
        // 计算角度差（考虑360度循环）
        let angleDiff = Math.abs(headAngle - game.lightAngle);
        angleDiff = Math.min(angleDiff, 360 - angleDiff);
        
        // 扇形半径（与drawLightEffect中一致）
        const radius = Math.max(game.canvas.width, game.canvas.height) * 0.6;
        const scanRange = 10; // 每边10度，总共20度
        
        // 检查是否在扇形区域内
        if (distance <= radius && angleDiff <= scanRange) {
            // 避免连续扣分：每500ms检查一次
            if (!game.lastHitTime || currentTime - game.lastHitTime > 500) {
                game.score = Math.max(0, game.score - 5);
                updateUI();
                game.lastHitTime = currentTime;
                
                // 显示扣分提示
                showTemporaryMessage("被灯光照射！-5分", "warning");
            }
        }
    }

    // 在drawGame函数中调用灯光效果
    function drawGame() {
        const ctx = game.ctx;
        
        // 清除画布
        ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
        
        // 保存画布状态
        ctx.save();
        
        // 如果不是固定地图，进行视口偏移
        if (!game.isMapFixed && game.mapImage && game.mapImage.complete) {
            ctx.translate(-game.viewOffsetX, -game.viewOffsetY);
        }
        
        // 绘制地图背景
        drawMapBackground();
        
        // 绘制游戏元素
        drawGameElements();
        
        // 恢复画布状态
        ctx.restore();
        
        // 绘制图书馆灯光效果（在顶部）
        drawLightEffect();
    }
    function drawMapBackground() {
        const ctx = game.ctx;
        // 如果有地图图片，绘制图片
        if (game.mapImage && game.mapImage.complete) {
            // 绘制整个地图
            ctx.drawImage(
                game.mapImage,
                0, 0, game.mapImage.width, game.mapImage.height,
                0, 0, game.mapWidth, game.mapHeight
            );
        } 
    }

    function drawGameElements(){
        drawObstacles();//绘制障碍物
        drawFood();//绘制食物
        drawSnake();//绘制蛇
        if (game.selectedMode === 'ai' && typeof drawAISnake === 'function') {
        // 传入必要的绘制参数
        drawAISnake(
            game.ctx, 
            game.viewOffsetX,  // 视口X偏移（对应camX）
            game.viewOffsetY,  // 视口Y偏移（对应camY）
            config.gridSize,   // 网格大小（GRID）
            2                  // 单元格内边距（CELL_PAD，与玩家蛇保持一致）
        );
    }
        
        //恢复画布状态（消除绘制地图图片时对画布上下文的影响）
        if(game.mapImage&&game.mapImage.complete){
            game.ctx.restore();
        }
    }
    //绘制障碍物
    function drawObstacles() {
        const ctx = game.ctx;
        const gridSize = config.gridSize;
        game.obstacles.forEach(obstacle => {
            const worldPos = gridToWorld(obstacle.x, obstacle.y);
            const x = worldPos.x - game.viewOffsetX;
            const y = worldPos.y - game.viewOffsetY;
            //只绘制视口内的障碍物
            if (x < -gridSize || x > game.canvas.width + gridSize ||
                y < -gridSize || y > game.canvas.height + gridSize) {
                return;
            }
            //读取缓存的SVG图片
            const cacheKey = `${game.selectedMap}_${obstacle.type}`;
            const img = game.svgImages[cacheKey];
            if (img && img.complete) {
                ctx.save();
                ctx.translate(
                    x + obstacle.width * gridSize / 2,
                    y + obstacle.height * gridSize / 2
                );
                ctx.rotate(obstacle.rotation * Math.PI / 180);
                ctx.drawImage(
                    img,
                    -obstacle.width * gridSize / 2,
                    -obstacle.height * gridSize / 2,
                    obstacle.width * gridSize,
                    obstacle.height * gridSize
                );
                ctx.restore();
            } else {
                ctx.fillStyle = 'rgba(120, 120, 120, 0.8)';
                ctx.fillRect(
                    x,
                    y,
                    obstacle.width * gridSize,
                    obstacle.height * gridSize
                );
            }
        });
    }
    //绘制食物
    function drawFood() {
        const ctx = game.ctx;
        const gridSize = config.gridSize;
        game.food.forEach(food => {
            const worldPos = gridToWorld(food.x, food.y);
            const x = worldPos.x - game.viewOffsetX;
            const y = worldPos.y - game.viewOffsetY;
            if (x < -gridSize || x > game.canvas.width + gridSize ||
                y < -gridSize || y > game.canvas.height + gridSize) {
                return;
            }
            if (food.type === 'text') {
                // 教室模式：绘制文字食物
                const style = food.style;
                const foodWidth = food.length * gridSize; // 文字长度对应宽度
                // 绘制背景
                ctx.fillStyle = style.color;
                ctx.fillRect(x, y, foodWidth, gridSize);
                // 绘制文字
                ctx.fillStyle = style.textColor;
                ctx.font = `${style.fontSize}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(food.text, x + foodWidth/2, y + gridSize/2);
                // 绘制边框
                ctx.strokeStyle = style.borderColor;
                ctx.strokeRect(x, y, foodWidth, gridSize);
            } else if (food.type === 'image') {
                // 操场/图书馆：绘制SVG食物
                const imgKey = `${game.selectedMap}_${food.text}`;
                const img = game.foodImages[imgKey];
                if (img && img.complete) {
                    const foodWidth = food.length * gridSize;
                    // 绘制SVG图片
                    ctx.drawImage(img, x, y, foodWidth, gridSize);
                    // 坏果：绘制边框
                    if (!food.isGood && food.svgConfig.borderColor) {
                        ctx.strokeStyle = food.svgConfig.borderColor;
                        ctx.lineWidth = 2;
                        ctx.strokeRect(x, y, foodWidth, gridSize);
                    }
                } else {
                    // SVG加载失败：绘制备用矩形（好果绿/坏果红）
                    ctx.fillStyle = food.isGood ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)';
                    ctx.fillRect(x, y, food.length * gridSize, gridSize);
                }
            }
        });
    }
    // 绘制蛇
    function drawSnake() {
        const ctx = game.ctx;
        const gridSize = config.gridSize;
        const CELL_PAD = 2;
        const BODY_ROUND = 4;
        const BODY_ALPHA = 0.95; 
        const HIGHLIGHT_ALPHA = BODY_ALPHA * 0.6;
        //猫咪ID对应的颜色
        const catColorMap = {
            '1': { 
                main: `rgba(160, 160, 160, ${BODY_ALPHA})`, 
                highlight: `rgba(190, 190, 190, ${HIGHLIGHT_ALPHA})` 
            },
            '2': { 
                main: `rgba(30, 30, 30, ${BODY_ALPHA})`, 
                highlight: `rgba(60, 60, 60, ${HIGHLIGHT_ALPHA})` 
            },
            '3': { 
                main: `rgba(245, 245, 245, ${BODY_ALPHA})`, 
                highlight: `rgba(255, 255, 255, ${HIGHLIGHT_ALPHA})` 
            },
            '4': { 
                main: `rgba(255, 140, 0, ${BODY_ALPHA})`, 
                highlight: `rgba(255, 165, 0, ${HIGHLIGHT_ALPHA})` 
            }
        };
        //获取当前猫咪的颜色
        const currentColor = catColorMap[game.selectedCat] || catColorMap['1'];
        // 绘制蛇身
        for (let i = 1; i < game.snake.length; i++) {
            const segment = game.snake[i];
            const worldPos = gridToWorld(segment.x, segment.y);
            const x = worldPos.x - game.viewOffsetX;
            const y = worldPos.y - game.viewOffsetY;
            ctx.fillStyle = currentColor.highlight;
            drawRoundedRect(
                ctx,
                x + CELL_PAD / 2,
                y + CELL_PAD / 2,
                gridSize - CELL_PAD,
                gridSize - CELL_PAD,
                BODY_ROUND
            );
        }
        // 绘制蛇头
        if (game.snake.length > 0) {
            const head = game.snake[0];
            const worldHead = gridToWorld(head.x, head.y);
            const angle = dirToAngle(game.direction);
            const cx = (worldHead.x - game.viewOffsetX) + gridSize / 2;
            const cy = (worldHead.y - game.viewOffsetY) + gridSize / 2;
            const headScale = 1.6; // 猫头放大倍数
            const headSize = gridSize * headScale;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle);
            try {
                // 尝试绘制猫咪图片
                const catImage = document.getElementById('selectedCatImage');
                if (catImage && catImage.complete && catImage.naturalWidth !== 0) {
                    ctx.drawImage(
                        catImage,
                        -headSize/2,
                        -headSize/2,
                        headSize,
                        headSize
                    );
                } else {
                    // 图片未加载，使用优化的备用样式
                    drawOptimizedCatHead(ctx, headSize, CELL_PAD, BODY_ROUND, game.direction);
                }
            } catch (e) {
                // 绘制优化的猫咪头部图形
                drawOptimizedCatHead(ctx, headSize, CELL_PAD, BODY_ROUND, game.direction);
            }
            
            ctx.restore();
        }
    }
    // 绘制圆角矩形（蛇身核心）
    function drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.arcTo(x + width, y, x + width, y + radius, radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
        ctx.lineTo(x + radius, y + height);
        ctx.arcTo(x, y + height, x, y + height - radius, radius);
        ctx.lineTo(x, y + radius);
        ctx.arcTo(x, y, x + radius, y, radius);
        ctx.closePath();
        ctx.fill();
    }
    // 方向转角度
    function dirToAngle(direction) {
        if (direction.x === 0 && direction.y === -1) return -Math.PI / 2; // UP
        if (direction.x === 0 && direction.y === 1) return Math.PI / 2;  // DOWN
        if (direction.x === -1 && direction.y === 0) return Math.PI;     // LEFT
        return 0;                                                       // RIGHT
    }
    // 绘制优化的猫咪头部（备用样式）
    function drawOptimizedCatHead(ctx, headSize, cellPad, bodyRound, direction) {
        // 猫头主体（黄色系，和蛇身匹配）
        ctx.fillStyle = "rgba(255, 204, 0, 0.95)";
        drawRoundedRect(
            ctx,
            -headSize/2 + cellPad/2,
            -headSize/2 + cellPad/2,
            headSize - cellPad,
            headSize - cellPad,
            bodyRound + 2
        );
        // 猫头眼睛（根据方向调整位置）
        ctx.fillStyle = "black";
        const eyeSize = headSize * 0.2;
        if (direction.x === 1 && direction.y === 0) { // RIGHT
            ctx.fillRect(headSize*0.2, -eyeSize/2, eyeSize, eyeSize);
            ctx.fillRect(headSize*0.2, eyeSize/2, eyeSize, eyeSize);
        } else if (direction.x === -1 && direction.y === 0) { // LEFT
            ctx.fillRect(-headSize*0.4, -eyeSize/2, eyeSize, eyeSize);
            ctx.fillRect(-headSize*0.4, eyeSize/2, eyeSize, eyeSize);
        } else if (direction.x === 0 && direction.y === -1) { // UP
            ctx.fillRect(-eyeSize/2, -headSize*0.4, eyeSize, eyeSize);
            ctx.fillRect(eyeSize/2, -headSize*0.4, eyeSize, eyeSize);
        } else if (direction.x === 0 && direction.y === 1) { // DOWN
            ctx.fillRect(-eyeSize/2, headSize*0.2, eyeSize, eyeSize);
            ctx.fillRect(eyeSize/2, headSize*0.2, eyeSize, eyeSize);
        }
        // 猫头高光
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        const highlightSize = eyeSize * 0.4;
        if (direction.x === 1 && direction.y === 0) { // RIGHT
            ctx.fillRect(headSize*0.2 + 2, -eyeSize/2 + 2, highlightSize, highlightSize);
            ctx.fillRect(headSize*0.2 + 2, eyeSize/2 + 2, highlightSize, highlightSize);
        } else if (direction.x === -1 && direction.y === 0) { // LEFT
            ctx.fillRect(-headSize*0.4 + 2, -eyeSize/2 + 2, highlightSize, highlightSize);
            ctx.fillRect(-headSize*0.4 + 2, eyeSize/2 + 2, highlightSize, highlightSize);
        } else if (direction.x === 0 && direction.y === -1) { // UP
            ctx.fillRect(-eyeSize/2 + 2, -headSize*0.4 + 2, highlightSize, highlightSize);
            ctx.fillRect(eyeSize/2 + 2, -headSize*0.4 + 2, highlightSize, highlightSize);
        } else if (direction.x === 0 && direction.y === 1) { // DOWN
            ctx.fillRect(-eyeSize/2 + 2, headSize*0.2 + 2, highlightSize, highlightSize);
            ctx.fillRect(eyeSize/2 + 2, headSize*0.2 + 2, highlightSize, highlightSize);
        }
    }

    // 加载最高分
    function loadHighScore() {
        const scoreKey = `highScore_${game.selectedMap}_${game.selectedDifficulty}`;
        const savedHighScore = localStorage.getItem(scoreKey);
        if (savedHighScore) {
            game.highScore = parseInt(savedHighScore);
            document.getElementById('highScoreDisplay').textContent = game.highScore;
            document.getElementById('highScore').textContent = game.highScore;
        } else {
            game.highScore = 0;
        }
    }
    // 保存最高分
    function saveHighScore() {
        const scoreKey = `highScore_${game.selectedMap}_${game.selectedDifficulty}`;
        if (game.score > game.highScore) {
            game.highScore = game.score;
            localStorage.setItem(scoreKey, game.highScore.toString());
        }
    }

    let keyPressState = {
        isHolding: false,
        holdKey: null,
        holdStartTime: 0,
        accelerateTimer: null,
        baseSpeed: 0
    };
// 设置事件监听器
function setupEventListeners() {
    // 键盘控制
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // 游戏控制按钮
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('pause-btn').addEventListener('click', togglePause);
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    document.getElementById('back-btn').addEventListener('click', goBackToStart);
    // 游戏结束弹窗按钮
    document.getElementById('restartFromEnd').addEventListener('click', restartGame);
    document.getElementById('backToStart').addEventListener('click', goBackToStart);
    
    // 复活弹窗按钮事件
    document.getElementById('confirmRevive').addEventListener('click', () => {
        doRevive();
        document.getElementById('reviveModal').style.display = 'none';
        document.getElementById('modalOverlay').style.display = 'none';
        game.lastUpdateTime = Date.now();
        gameLoop();
    });

    document.getElementById('cancelRevive').addEventListener('click', () => {
        document.getElementById('reviveModal').style.display = 'none';
        document.getElementById('modalOverlay').style.display = 'none';
        endGame(false, "你放弃了复活机会，游戏结束！");
    });
}
    
    //键盘
    function handleKeyDown(e) {
        const scrollKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'W', 'a', 'A', 's', 'S', 'd', 'D'];
        if (scrollKeys.includes(e.key)) {
            e.preventDefault();
        }
        if ((game.isGameOver || game.isPaused) && e.key === ' ') {
            startGame();
            return;
        }
        let isDirectionKey = true;
        switch(e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (game.direction.y === 0) {
                    game.nextDirection = {x: 0, y: -1};
                }
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (game.direction.y === 0) {
                    game.nextDirection = {x: 0, y: 1};
                }
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (game.direction.x === 0) {
                    game.nextDirection = {x: -1, y: 0};
                }
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (game.direction.x === 0) {
                    game.nextDirection = {x: 1, y: 0};
                }
                break;
            case 'Escape':
                togglePause();
                isDirectionKey = false;
                break;
            default:
                isDirectionKey = false;
        }
        if (isDirectionKey && !game.isPaused && !game.isGameOver) {
            if (!keyPressState.isHolding) {
                keyPressState.isHolding = true;
                keyPressState.holdKey = e.key;
                keyPressState.holdStartTime = Date.now();
                keyPressState.baseSpeed = game.speed;
                keyPressState.accelerateTimer = setInterval(() => {
                    const holdDuration = Date.now() - keyPressState.holdStartTime;
                    if (holdDuration > 300 && game.speed > config.minSpeed) {
                        game.speed = Math.max(config.minSpeed, game.speed -5);
                    }
                }, 100);
            }
        }  
    }
    function handleKeyUp(e) {
        const directionKeys = ['ArrowUp', 'w', 'W', 'ArrowDown', 's', 'S', 'ArrowLeft', 'a', 'A', 'ArrowRight', 'd', 'D'];
        if (!directionKeys.includes(e.key) || e.key !== keyPressState.holdKey) return;

        if (keyPressState.isHolding) {
            keyPressState.isHolding = false;
            clearInterval(keyPressState.accelerateTimer);
            keyPressState.accelerateTimer = null;
            
            if (!game.isPaused && !game.isGameOver) {
                const recoverTimer = setInterval(() => {
                    if (game.speed < keyPressState.baseSpeed) {
                        game.speed = Math.min(keyPressState.baseSpeed, game.speed+5);
                    } else {
                        clearInterval(recoverTimer);
                    }
                }, 100);
            }
        }
    }
    
    // 开始游戏
    function startGame() {
        if (game.isGameOver) {
            restartGame();
            return;
        }
        game.isPaused = false;
        game.isGameOver = false;
        game.lastUpdateTime = Date.now();
        // 隐藏开始提示
        document.getElementById('gameStartTip').style.display = 'none';
        // 更新按钮状态
        document.getElementById('start-btn').disabled = true;
        document.getElementById('pause-btn').disabled = false;
        document.getElementById('restart-btn').disabled = false;
        // 隐藏游戏结束弹窗
        document.getElementById('gameOverModal').style.display = 'none';
        // 非教室模式：启动果实定时刷新
        if (game.selectedMap !== 'classroom') {
            if (game.foodRefreshTimer) clearInterval(game.foodRefreshTimer);
            game.foodRefreshTimer = setInterval(() => {
                if (!game.isPaused && !game.isGameOver) {
                    game.food = [];
                    generateFood();
                }
            }, 10000);
        }
        // 开始游戏循环
        if (game.gameLoop) {
            cancelAnimationFrame(game.gameLoop);
        }
        gameLoop();
    }
    
    // 切换暂停状态
    function togglePause() {
        if (game.isGameOver) return;
        game.isPaused = !game.isPaused;
        if (game.isPaused) {
            document.getElementById('pause-btn').innerHTML = '<i class="fas fa-play"></i> 继续游戏';
        } else {
            document.getElementById('pause-btn').innerHTML = '<i class="fas fa-pause"></i> 暂停游戏';
            game.lastUpdateTime = Date.now();
            gameLoop();
        }
    }
    // 重新开始游戏
    function restartGame() {
        // 重置游戏状态
        game.score = 0;
        game.speed = config.initialSpeed;
        if (game.catProperties.speedMultiplier) {
            game.speed = Math.floor(config.initialSpeed / game.catProperties.speedMultiplier);
        }
        game.elapsedTime = 0;
        game.foodCount = 0;
        game.reviveUsed = false;
        game.defenseActive = false;
        game.magicActive = false;
        game.libraryLights = false;
        game.isPaused = true;
        game.isGameOver = false;
        game.gameLoop = null;
        setCatProperties(game.selectedCat);

        // 清除果实定时刷新定时器
        if (game.foodRefreshTimer) {
            clearInterval(game.foodRefreshTimer);
            game.foodRefreshTimer = null;
        }
        // 隐藏复活弹窗和遮罩
        document.getElementById('reviveModal').style.display = 'none';
        document.getElementById('modalOverlay').style.display = 'none';
        // 重新初始化游戏元素
        initSnake();
        if(game.selectedMode==='ai'){
       initAISnake([[5, 5], [4, 5], [3, 5]]); }
             
        generateObstacles();
        generateFood();
        // 重置UI
        updateUI();  
        // 隐藏游戏结束弹窗
        document.getElementById('gameOverModal').style.display = 'none';
        // 显示开始提示
        document.getElementById('gameStartTip').style.display = 'block';
        // 重置按钮状态
        document.getElementById('start-btn').disabled = false;
        document.getElementById('pause-btn').disabled = true;
        document.getElementById('pause-btn').innerHTML = '<i class="fas fa-pause"></i> 暂停游戏';
        // 停止游戏循环
        if (game.gameLoop) {
            cancelAnimationFrame(game.gameLoop);
            game.gameLoop = null;
        }
        
        game.isPaused = true;
        game.isGameOver = false;
    }
    // 返回开始界面
    function goBackToStart() {
        if (confirm('确定要返回开始界面吗？当前游戏进度将丢失。')) {
            if (game.foodRefreshTimer) {
                clearInterval(game.foodRefreshTimer);
                game.foodRefreshTimer = null;
            }
            window.location.href = 'start.html';
        }
    }
    
    // 游戏主循环
    function gameLoop() {
        if (game.isPaused || game.isGameOver) return;
        const currentTime = Date.now();
        const deltaTime = currentTime - game.lastUpdateTime;
        // 更新游戏时间
        game.elapsedTime += deltaTime;
        // 检查限时模式
        if (game.selectedMode === 'time') {
            const remainingTime = game.selectedTime * 1000 - game.elapsedTime;
            if (remainingTime <= 0) {
                // 时间到，检查是否达到目标分数
                const targetScore = parseInt(document.getElementById('targetScore').textContent);
                if (game.score >= targetScore) {
                    endGame(true, "时间到！恭喜你完成了挑战！");
                } else {
                    endGame(false, "时间到！未能达到目标分数。");
                }
                return;
            }
            // 更新剩余时间显示
            document.getElementById('remainingTime').textContent = 
                formatTime(Math.ceil(remainingTime / 1000));
        }
        // 更新计时器显示
        document.getElementById('timer').textContent = formatTime(Math.floor(game.elapsedTime / 1000));
        // 更新蛇的移动
        if (deltaTime >= game.speed) {
            updateGame();
         // 在gameLoop的更新阶段添加
if (game.selectedMode === 'ai') {
    const gridWidth = Math.floor(game.mapWidth / config.gridSize);
    const gridHeight = Math.floor(game.mapHeight / config.gridSize);
    updateAISnake(); // 更新方向
    moveAISnake(game.obstacles, gridWidth, gridHeight); // 移动AI蛇
}


        game.lastUpdateTime = currentTime;
        
        }
            
        // 绘制游戏
        drawGame();
        // 继续游戏循环
        game.gameLoop = requestAnimationFrame(gameLoop);
    }
    function updateGame() {
        // 更新方向
        game.direction = {...game.nextDirection};
        
        // 计算新的蛇头位置
        const head = {...game.snake[0]};
        head.x += game.direction.x;
        head.y += game.direction.y;
        
        // 检查边界碰撞
        const gridWidth = Math.floor(game.mapWidth / config.gridSize);
        const gridHeight = Math.floor(game.mapHeight / config.gridSize);
        if (head.x < 0 || head.y < 0 || head.x >= gridWidth || head.y >= gridHeight) {
            handleCollision();
            return;
        }
        
        // 检查自我碰撞（从i=1开始跳过蛇头）
        let selfCollision = false;
        for (let i = 1; i < game.snake.length; i++) {
            if (head.x === game.snake[i].x && head.y === game.snake[i].y) {
                selfCollision = true;
                break;
            }
        }
        if (selfCollision) {
            handleCollision();
            return;
        }
        // 检查障碍物碰撞
        let obstacleCollision = false;
        for (const obstacle of game.obstacles) {
            // 蛇头的矩形范围（1x1网格）
            const headRect = {
                x: head.x,
                y: head.y,
                width: 1,
                height: 1
            };
            // 严格的矩形重叠判断
            if (rectanglesOverlap(headRect, obstacle)) {
                console.log("障碍物碰撞", head, "障碍物：", obstacle); // 调试日志
                obstacleCollision = true;
                break;
            }
        }
        if (obstacleCollision) {
            handleCollision();
            return;
        }
        
        // 检查食物碰撞
        let foodEaten = false;
        let eatenFoodIndex = -1;
        let eatenFood = null;
        
        for (let i = 0; i < game.food.length; i++) {
            const food = game.food[i];
            const foodXRange = [food.x, food.x + food.length - 1];
            const foodYRange = [food.y, food.y];
            
            if (head.x >= foodXRange[0] && head.x <= foodXRange[1] && head.y === foodYRange[0]) {
                eatenFoodIndex = i;
                eatenFood = food;
                foodEaten = true;
                break;
            }
        }
        
        if (foodEaten && eatenFood) {
            if (eatenFood.isGood) {
                // 好果处理
                let scoreToAdd = config.goodFoodScore * eatenFood.length;
                
                if (game.magicActive && game.catProperties.magic) {
                    scoreToAdd *= 2;
                    game.magicActive = false;
                    updateSpecialStatus();
                }
                
                game.score += scoreToAdd;
                game.foodCount++;
                
                // 增加蛇长度
                game.snake.unshift({...head});
                
                // 加速逻辑
                if (game.foodCount % 5 === 0 && game.speed > config.minSpeed) {
                    game.speed -= config.speedIncrement;
                }
                
                // 教室模式：仅正确答案刷新题目
                if (game.selectedMap === 'classroom' && eatenFood.isGood) {
                    // 移除所有当前食物
                    game.food = [];
                    // 延迟生成新题目
                    setTimeout(() => {
                        if (!game.isPaused && !game.isGameOver) {
                            generateFood();
                            showTemporaryMessage("回答正确！进入下一题", "success");
                        }
                    }, 300);
                } else if (game.selectedMap !== 'classroom') {
                    // 非教室模式：补充果实
                    game.food.splice(eatenFoodIndex, 1);
                    if (game.food.length < 3) {
                        setTimeout(() => generateFood(), 300);
                    }
                }
            } else {
                // 坏果处理
                let scoreToDeduct = config.badFoodScore * eatenFood.length;
                
                if (game.catProperties.defense) {
                    scoreToDeduct = Math.floor(scoreToDeduct / 2);
                    game.defenseActive = true;
                    setTimeout(() => {
                        game.defenseActive = false;
                        updateSpecialStatus();
                    }, 3000);
                }
                
                if (game.catProperties.magic && !game.magicActive) {
                    game.magicActive = true;
                    scoreToDeduct = 0;
                } else if (game.catProperties.magic && game.magicActive) {
                    game.magicActive = false;
                    scoreToDeduct = 0;
                }
                
                game.score = Math.max(0, game.score + scoreToDeduct);
                
                // 教室模式：吃错答案只扣分，不换题
                if (game.selectedMap === 'classroom') {
                    showTemporaryMessage("回答错误！再试一次", "warning");
                    // 移除这个错误答案，保留其他答案
                    game.food.splice(eatenFoodIndex, 1);
                } else {
                    game.food.splice(eatenFoodIndex, 1);
                    if (game.food.length < 8) {
                        setTimeout(() => generateFood(), 300);
                    }
                }
                //图书馆模式下，吃到坏果触发灯光
                if (game.selectedMap === 'library') {
                    triggerLibraryLights();
                }
            }
            
            updateUI();
        }
        // 未吃到食物则移动蛇
        if (!foodEaten) {
            game.snake.pop();
            game.snake.unshift(head);
        }
        game.worldSnake = game.snake.map(segment => gridToWorld(segment.x, segment.y));
        if (!game.isMapFixed && game.snake.length > 0) {
            updateCamera();
        }
    }
    //添加相机跟随模式
    function updateCamera() {
        if (game.isMapFixed) return;
        const head = game.snake[0];
        const worldHead = gridToWorld(head.x, head.y);
        // 1. 计算屏幕中心的目标相机位置（直接以蛇头为中心）
        const targetOffsetX = worldHead.x - game.canvas.width / 2;
        const targetOffsetY = worldHead.y - game.canvas.height / 2;
        // 2. 计算蛇头与屏幕中心的偏移量（判断是否进入死区）
        const currentHeadScreenX = worldHead.x - game.viewOffsetX;
        const currentHeadScreenY = worldHead.y - game.viewOffsetY;
        const deltaX = currentHeadScreenX - game.canvas.width / 2;
        const deltaY = currentHeadScreenY - game.canvas.height / 2;
        // 3. 死区判断：仅当偏移超过阈值时才移动相机（提升响应）
        if (Math.abs(deltaX) > game.cameraDeadZone || Math.abs(deltaY) > game.cameraDeadZone) {
            // 4. 提升插值系数（0.5→更快响应），移除过度平滑导致的延迟
            game.viewOffsetX += (targetOffsetX - game.viewOffsetX) * game.cameraLerpFactor;
            game.viewOffsetY += (targetOffsetY - game.viewOffsetY) * game.cameraLerpFactor;
        }
        // 5. 强制限制视口边界（防止蛇移出画面）
        clampViewport();
        // 6. 紧急修正：如果蛇头超出屏幕，直接瞬移相机（兜底逻辑）
        const headScreenX = worldHead.x - game.viewOffsetX;
        const headScreenY = worldHead.y - game.viewOffsetY;
        if (
            headScreenX < 0 || headScreenX > game.canvas.width ||
            headScreenY < 0 || headScreenY > game.canvas.height
        ) {
            game.viewOffsetX = targetOffsetX;
            game.viewOffsetY = targetOffsetY;
            clampViewport();
        }
    }
    // 处理碰撞（复活弹窗逻辑）
    function handleCollision() {
        // 检查复活条件
        if (game.catProperties.revive && game.catProperties.reviveCount > 0 && !game.reviveUsed) {
            game.isPaused = true;
            // 显示复活弹窗
            document.getElementById('reviveModal').style.display = 'flex';
            document.getElementById('modalOverlay').style.display = 'block';
            return;
        }

        // 无复活机会，直接结束游戏
        endGame(false, "游戏结束！");
    }

    // 执行复活逻辑
    function doRevive() {
        game.catProperties.reviveCount--;
        game.reviveUsed = true;
        updateSpecialStatus();
        
        // 蛇头回退到安全位置
        const safeSegment = game.snake[3] || game.snake[0];
        game.snake.unshift({...safeSegment});
        game.snake.splice(-1, 1);
        
        // 重置方向防止再次碰撞
        game.direction = {x: 0, y: 0};
        game.nextDirection = {x: 0, y: 0};
        
        // 复活提示
        showTemporaryMessage("复活成功！", "success");
        
        // 恢复游戏状态
        game.isPaused = false;
    }

    // 结束游戏
    function endGame(isSuccess) {
        game.isGameOver = true;
        game.isPaused = true;
        
        // 保存最高分
        saveHighScore();
        
        // 清除果实定时刷新
        if (game.foodRefreshTimer) {
            clearInterval(game.foodRefreshTimer);
            game.foodRefreshTimer = null;
        }
        
        // 更新游戏结果弹窗
        document.getElementById('gameResult').textContent = isSuccess ? "挑战成功！" : "游戏结束";
        document.getElementById('finalTime').textContent = formatTime(Math.floor(game.elapsedTime / 1000));
        document.getElementById('finalScore').textContent = game.score;
        document.getElementById('finalLength').textContent = game.snake.length;
        document.getElementById('highScore').textContent = game.highScore;
        
        // 显示游戏结束弹窗
        document.getElementById('gameOverModal').style.display = 'flex';
        
        // 停止游戏循环
        if (game.gameLoop) {
            cancelAnimationFrame(game.gameLoop);
            game.gameLoop = null;
        }
    }

    // 更新UI显示
    function updateUI() {
        // 更新分数
        document.getElementById('currentScore').textContent = game.score;
        document.getElementById('currentScoreDisplay').textContent = game.score;
        
        // 更新长度
        document.getElementById('snakeLength').textContent = game.snake.length;
        
        // 更新最高分
        if (game.score > game.highScore) {
            game.highScore = game.score;
            document.getElementById('highScoreDisplay').textContent = game.highScore;
        }
        
        // 更新特殊状态
        updateSpecialStatus();
    }

    // 显示临时消息
    function showTemporaryMessage(message, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `temporary-message message-${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 15px 30px;
            border-radius: 10px;
            color: white;
            font-weight: bold;
            z-index: 100;
            animation: fadeInOut 2s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;
        
        // 根据类型设置背景色
        if (type === 'success') {
            messageEl.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
        } else if (type === 'warning') {
            messageEl.style.background = 'linear-gradient(45deg, #ff9800, #f57c00)';
        } else {
            messageEl.style.background = 'linear-gradient(45deg, #2196F3, #1976D2)';
        }
        
        document.querySelector('.game-area').appendChild(messageEl);
        
        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                30% { transform: translate(-50%, -50%) scale(1); }
                80% { opacity: 1; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        // 2秒后移除消息
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
            if (style.parentNode) {
                style.remove();
            }
        }, 2000);
    }
    // 格式化时间显示
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
        // 初始化游戏
        initGame();
});