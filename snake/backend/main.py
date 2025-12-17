import random
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

GRID_W = 100
GRID_H = 100

# ======================
# 工具函数
# ======================

def spawn_food(snakes, obstacles):
    if not snakes or not snakes[0]:
        hx, hy = GRID_W//2, GRID_H//2
    else:
        hx, hy = snakes[0][0]

    while True:
        x = hx + random.randint(-8, 8)
        y = hy + random.randint(-8, 8)

        if (
            0 <= x < GRID_W
            and 0 <= y < GRID_H
            and (x, y) not in obstacles
            and all((x, y) not in s for s in snakes)
        ):
            return (x, y)


def new_game():
    player = [(10, 10), (9, 10), (8, 10)]
    ai = [(20, 20), (19, 20), (18, 20)]

    obstacles = []
    for _ in range(30):
        while True:
            obs = (random.randint(0, GRID_W - 1), random.randint(0, GRID_H - 1))
            if obs not in player and obs not in ai:
                obstacles.append(obs)
                break

    food = spawn_food([player, ai], obstacles)

    return {
        "player": player,
        "ai": ai,
        "food": food,
        "obstacles": obstacles,
        "score": 0,
        "game_over": False,
        "dir": "RIGHT",
        "ai_dir": "LEFT",
    }


def move_snake(snake, direction, grow=False):
    if not snake:
        return
    x, y = snake[0]

    if direction == "UP":
        y -= 1
    elif direction == "DOWN":
        y += 1
    elif direction == "LEFT":
        x -= 1
    elif direction == "RIGHT":
        x += 1

    new_head = (x, y)
    snake.insert(0, new_head)

    if not grow:
        snake.pop()


def random_ai_dir():
    return random.choice(["UP", "DOWN", "LEFT", "RIGHT"])


# ====== 额外合并自 e:\cs\backend\main.py 的 chunk-style websocket 路由（命名避免冲突） ======
TICK_RATE = 0.15
CHUNK_SIZE = 20
_chunks = {}

def _chunk_key(x, y):
    return (x // CHUNK_SIZE, y // CHUNK_SIZE)

def _generate_chunk(cx, cy):
    random.seed(cx * 10007 + cy)
    obs = set()
    for _ in range(random.randint(4, 10)):
        ox = cx * CHUNK_SIZE + random.randint(0, CHUNK_SIZE - 1)
        oy = cy * CHUNK_SIZE + random.randint(0, CHUNK_SIZE - 1)
        obs.add((ox, oy))
    return obs

def _get_obstacles_chunk(snake):
    hx, hy = snake[0]
    cx, cy = _chunk_key(hx, hy)
    result = set()
    for dx in [-1, 0, 1]:
        for dy in [-1, 0, 1]:
            key = (cx + dx, cy + dy)
            if key not in _chunks:
                _chunks[key] = _generate_chunk(*key)
            result |= _chunks[key]
    return list(result)

def _spawn_food_chunk(snake, obstacles):
    while True:
        x = snake[0][0] + random.randint(-8, 8)
        y = snake[0][1] + random.randint(-8, 8)
        if (x, y) not in snake and (x, y) not in obstacles:
            return (x, y)

def _new_game_chunk():
    snake = [(0, 0), (-1, 0), (-2, 0)]
    obstacles = _get_obstacles_chunk(snake)
    return {
        "snake": snake,
        "direction": "RIGHT",
        "food": _spawn_food_chunk(snake, obstacles),
        "obstacles": obstacles,
        "score": 0,
        "game_over": False
    }

def _move_snake_chunk(state):
    if state.get("game_over"):
        return

    dx, dy = {
        "UP": (0, -1),
        "DOWN": (0, 1),
        "LEFT": (-1, 0),
        "RIGHT": (1, 0)
    }[state["direction"]]

    head = state["snake"][0]
    new_head = (head[0] + dx, head[1] + dy)

    obstacles = _get_obstacles_chunk(state["snake"])

    if new_head in state["snake"] or new_head in obstacles:
        state["game_over"] = True
        return

    state["snake"].insert(0, new_head)

    if new_head == state["food"]:
        state["score"] += 1
        state["food"] = _spawn_food_chunk(state["snake"], obstacles)
    else:
        state["snake"].pop()

    state["obstacles"] = obstacles


@app.websocket("/ws_chunk")
async def ws_endpoint_chunk(ws: WebSocket):
    await ws.accept()
    state = _new_game_chunk()
    last_dir = state["direction"]
    print("? WebSocket(chunk) 已连接")

    try:
        while True:
            try:
                msg = await asyncio.wait_for(ws.receive_text(), timeout=TICK_RATE)
                if msg == "RESET":
                    state = _new_game_chunk()
                    last_dir = state["direction"]
                else:
                    opposite = {"UP": "DOWN", "DOWN": "UP", "LEFT": "RIGHT", "RIGHT": "LEFT"}
                    if msg != opposite.get(last_dir):
                        state["direction"] = msg
                        last_dir = msg
            except asyncio.TimeoutError:
                pass

            _move_snake_chunk(state)

            await ws.send_json({
                "snake": state["snake"],
                "food": state["food"],
                "obstacles": state["obstacles"],
                "score": state["score"],
                "game_over": state["game_over"]
            })

    except WebSocketDisconnect:
        print("? 客户端断开 (chunk)")



# ======================
# WebSocket
# ======================

@app.websocket("/ws")
async def ws_endpoint(ws: WebSocket):
    await ws.accept()

    state = new_game()

    try:
        while True:
            try:
                msg = await asyncio.wait_for(ws.receive_text(), timeout=0.15)
            except asyncio.TimeoutError:
                msg = None

            # ===== 玩家输入 =====
            if msg in ["UP", "DOWN", "LEFT", "RIGHT"]:
                current_head = state["player"][0]
                next_head = state["player"][1] if len(state["player"]) > 1 else None
                if next_head:
                    cx, cy = current_head
                    nx, ny = next_head
                    if msg == "UP" and (cx, cy-1) == next_head:
                        continue
                    if msg == "DOWN" and (cx, cy+1) == next_head:
                        continue
                    if msg == "LEFT" and (cx-1, cy) == next_head:
                        continue
                    if msg == "RIGHT" and (cx+1, cy) == next_head:
                        continue
                state["dir"] = msg

            if msg == "RESET":
                state = new_game()
                continue

            if msg in ["A_STAR", "GREEDY", "BFS", "DFS"]:
                pass

            # ===== 玩家蛇 =====
            if not state["game_over"]:
                move_snake(state["player"], state["dir"])

                # 撞墙判定
                hx, hy = state["player"][0]
                if not (0 <= hx < GRID_W and 0 <= hy < GRID_H):
                    state["game_over"] = True

                # 撞自己
                if state["player"][0] in state["player"][1:]:
                    state["game_over"] = True

                # 撞障碍
                if state["player"][0] in state["obstacles"]:
                    state["game_over"] = True

                # 撞AI蛇
                if state["player"][0] in state["ai"]:
                    state["game_over"] = True

                # 吃食物
                if state["player"][0] == state["food"]:
                    state["score"] += 1
                    state["player"].pop()
                    move_snake(state["player"], state["dir"], grow=True)
                    state["food"] = spawn_food(
                        [state["player"], state["ai"]],
                        state["obstacles"],
                    )

            # ===== AI 蛇 =====
            if random.random() < 0.2:
                state["ai_dir"] = random_ai_dir()

            old_head = state["ai"][0]
            move_snake(state["ai"], state["ai_dir"])

            ax, ay = state["ai"][0]
            if not (0 <= ax < GRID_W and 0 <= ay < GRID_H):
                state["ai"].pop(0)
                state["ai"].insert(0, old_head)
                state["ai_dir"] = random_ai_dir()

            # ===== 发送数据 =====
            await ws.send_json(
                {
                    "snake": state["player"],
                    "ai_snake": state["ai"],
                    "food": state["food"],
                    "obstacles": state["obstacles"],
                    "score": state["score"],
                    "game_over": state["game_over"],
                }
            )

    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except Exception as e:
        print("Error:", e)