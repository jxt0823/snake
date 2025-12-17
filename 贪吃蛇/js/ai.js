// AI蛇全局变量
let ai_snake = [];
let ai_dir = "LEFT";
const AI_MOVE_PROB = 0.1; // 随机改变方向的概率

// 初始化AI蛇（依赖game和config对象）
function initAISnake(startPos) {
    if (!startPos) {
        // 动态计算地图网格尺寸
        const gridWidth = Math.floor(game.mapWidth / config.gridSize);
        const gridHeight = Math.floor(game.mapHeight / config.gridSize);
        const centerX = Math.floor(gridWidth / 2);
        const centerY = Math.floor(gridHeight / 2);
        
        startPos = [
            [centerX, centerY],
            [centerX - 1, centerY],
            [centerX - 2, centerY]
        ];
    }
    ai_snake = startPos;
    ai_dir = "LEFT";
    console.log('AI蛇已初始化，位置：', ai_snake);
}

// 更新AI蛇方向
function updateAISnake(stateSnake) {
    if (stateSnake) {
        ai_snake = stateSnake;
    }
    console.log('AI蛇状态更新，位置：', ai_snake);
    
    // 随机改变方向（避免180度转向）
    if (Math.random() < AI_MOVE_PROB) {
        const currentDir = ai_dir;
        let newDir;
        do {
            newDir = randomAIDir();
        } while (
            (currentDir === "UP" && newDir === "DOWN") ||
            (currentDir === "DOWN" && newDir === "UP") ||
            (currentDir === "LEFT" && newDir === "RIGHT") ||
            (currentDir === "RIGHT" && newDir === "LEFT")
        );
        ai_dir = newDir;
    }

    return ai_dir;
}

// 移动AI蛇（处理碰撞和位置更新）
function moveAISnake(obstacles, gridWidth, gridHeight) {
    if (!ai_snake || ai_snake.length === 0) return [];

    const [headX, headY] = ai_snake[0];
    let [newX, newY] = [headX, headY];

    // 根据当前方向计算新位置
    switch (ai_dir) {
        case "UP":
            newY -= 1;
            break;
        case "DOWN":
            newY += 1;
            break;
        case "LEFT":
            newX -= 1;
            break;
        case "RIGHT":
            newX += 1;
            break;
    }

    // 碰撞检测（边界、自身、障碍物）
    const isColliding = checkCollision(newX, newY, obstacles, gridWidth, gridHeight);
    if (isColliding) {
        // 碰撞后尝试转向
        const validDirs = getValidDirections(headX, headY, obstacles, gridWidth, gridHeight);
        if (validDirs.length > 0) {
            ai_dir = validDirs[Math.floor(Math.random() * validDirs.length)];
            // 按新方向移动
            switch (ai_dir) {
                case "UP":
                    newY = headY - 1;
                    break;
                case "DOWN":
                    newY = headY + 1;
                    break;
                case "LEFT":
                    newX = headX - 1;
                    break;
                case "RIGHT":
                    newX = headX + 1;
                    break;
            }
        } else {
            // 无有效方向，保持原位
            return ai_snake;
        }
    }

    // 更新蛇身位置（添加新头部，移除尾部）
    ai_snake.unshift([newX, newY]);
    ai_snake.pop();

    return ai_snake;
}

// 碰撞检测工具函数
function checkCollision(x, y, obstacles, gridWidth, gridHeight) {
    // 边界碰撞
    if (x < 0 || y < 0 || x >= gridWidth || y >= gridHeight) {
        return true;
    }

    // 自身碰撞
    if (ai_snake.slice(1).some(([sx, sy]) => sx === x && sy === y)) {
        return true;
    }

    // 障碍物碰撞（适配矩形障碍物）
    return obstacles.some(obs => 
        x < obs.x + obs.width &&
        x + 1 > obs.x &&
        y < obs.y + obs.height &&
        y + 1 > obs.y
    );
}

// 获取所有有效移动方向
function getValidDirections(headX, headY, obstacles, gridWidth, gridHeight) {
    const directions = [];
    // 检查四个方向是否可移动
    if (!checkCollision(headX, headY - 1, obstacles, gridWidth, gridHeight)) {
        directions.push("UP");
    }
    if (!checkCollision(headX, headY + 1, obstacles, gridWidth, gridHeight)) {
        directions.push("DOWN");
    }
    if (!checkCollision(headX - 1, headY, obstacles, gridWidth, gridHeight)) {
        directions.push("LEFT");
    }
    if (!checkCollision(headX + 1, headY, obstacles, gridWidth, gridHeight)) {
        directions.push("RIGHT");
    }
    return directions;
}

// 随机生成方向
function randomAIDir() {
    const dirs = ["UP", "DOWN", "LEFT", "RIGHT"];
    return dirs[Math.floor(Math.random() * dirs.length)];
}

// 绘制AI蛇
function drawAISnake(ctx, viewOffsetX, viewOffsetY, gridSize, cellPad) {
    if (!ai_snake || ai_snake.length === 0) return;

    ai_snake.forEach(([x, y], index) => {
        // 计算绘制位置（考虑视口偏移）
        const drawX = x * gridSize - viewOffsetX;
        const drawY = y * gridSize - viewOffsetY;

        // 只绘制视口内的部分
        if (drawX > -gridSize && drawX < ctx.canvas.width + gridSize &&
            drawY > -gridSize && drawY < ctx.canvas.height + gridSize) {

            // 头部和身体使用不同颜色
            ctx.fillStyle = index === 0 ? "#00FF00" : "#4CAF50";
            // 绘制圆角矩形
            drawRoundedRect(
                ctx,
                drawX + cellPad / 2,
                drawY + cellPad / 2,
                gridSize - cellPad,
                gridSize - cellPad,
                6
            );
        }
    });
}

// 绘制圆角矩形（蛇身/AI蛇身通用）
function drawRoundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fill();
}

// 暴露AI蛇状态（供调试）
function getAISnakeState() {
    return {
        snake: [...ai_snake],
        direction: ai_dir
    };
}