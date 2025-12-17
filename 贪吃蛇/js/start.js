document.addEventListener('DOMContentLoaded', function() {
    // 获取元素
    const timeModeCard = document.getElementById('timeMode');
    const infiniteModeCard = document.getElementById('infiniteMode');
    const aiModeCard = document.getElementById('aiMode');
    const onlineModeCard = document.getElementById('onlineMode'); // 新增联机模式卡片
    const chooseCatOption = document.getElementById('chooseCatOption');
    const instructionsOption = document.getElementById('instructionsOption');
    const settingsOption = document.getElementById('settingsOption');
    
    // 获取限时模式的开始按钮
    const timeModeStartBtn = timeModeCard.querySelector('.start-btn');
    
    // 当前选择的模式和时间
    let selectedMode = null;
    let selectedTime = null;
    
    // 游戏模式卡片点击事件
    timeModeCard.addEventListener('click', function(e) {
        // 如果点击的是时间选项或开始按钮，不执行卡片选择
        if (e.target.closest('.time-option') || e.target.closest('.start-btn')) {
            return;
        }
        
        // 切换限时模式卡片的选择状态
        toggleTimeModeSelection();
    });
    
    infiniteModeCard.addEventListener('click', function(e) {
        // 如果点击的是开始按钮，不执行卡片选择
        if (e.target.closest('.start-btn')) {
            return;
        }
        
        selectMode('infinite');
    });
    
    aiModeCard.addEventListener('click', function(e) {
        // 如果点击的是开始按钮，不执行卡片选择
        if (e.target.closest('.start-btn')) {
            return;
        }
        
        selectMode('ai');
    });

    // 新增：联机模式卡片点击事件
    onlineModeCard.addEventListener('click', function(e) {
        // 如果点击的是开始按钮，不执行卡片选择
        if (e.target.closest('.start-btn')) {
            return;
        }
        
        selectMode('online');
    });
    
    // 限时模式时间选项点击事件
    const timeOptions = timeModeCard.querySelectorAll('.time-option');
    timeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 移除其他选项的选择状态
            timeOptions.forEach(opt => opt.classList.remove('selected'));
            
            // 设置当前选项为选中状态
            this.classList.add('selected');
            
            // 保存选择的时间
            selectedTime = parseInt(this.getAttribute('data-time'));
            
            // 激活开始按钮
            timeModeCard.classList.add('has-selected-time');
            
            // 修改按钮文本为"开始游戏"
            timeModeStartBtn.innerHTML = '<i class="fas fa-play-circle"></i> 开始游戏';
            
            // 保存选择的模式
            selectedMode = 'time';
        });
    });
    
    // 开始按钮点击事件
    const startButtons = document.querySelectorAll('.start-btn');
    startButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            
            const modeCard = this.closest('.mode-card');
            const mode = modeCard.getAttribute('data-mode');
            
            // 根据模式开始游戏
            if (mode === 'time') {
                startTimeMode();
            } else if (mode === 'infinite') {
                startInfiniteMode();
            } else if (mode === 'ai') {
                startAIMode();
            } else if (mode === 'online') { // 新增：联机模式处理
                showCustomMessage('暂未开发，敬请期待', '<div style="text-align:center; padding:20px 0; font-size:1.5rem; font-weight:bold;">v我50助力开发</div><img src="../assets/payment.png" alt="This is 付款码" style="display:block; margin:0 auto; max-width:100%; max-height:300px; width:auto; height:auto; border-radius:10px; border:2px solid #FFD700; box-shadow:0 5px 15px rgba(0,0,0,0.3);">', 'warning');
            }
        });
    });
    
    // 底部选项点击事件
    chooseCatOption.addEventListener('click', function() {
        goToChooseCat();
    });
    
    instructionsOption.addEventListener('click', function() {
        showInstructions();
    });
    
    settingsOption.addEventListener('click', function() {
        showSettings();
    });
    
    // 切换限时模式选择状态
    function toggleTimeModeSelection() {
        // 移除其他模式的选择状态
        infiniteModeCard.classList.remove('selected');
        aiModeCard.classList.remove('selected');
        onlineModeCard.classList.remove('selected'); // 新增：移除联机模式选中状态
        
        // 切换限时模式的选择状态
        timeModeCard.classList.toggle('selected');
        
        if (timeModeCard.classList.contains('selected')) {
            selectedMode = 'time';
        } else {
            selectedMode = null;
            selectedTime = null;
            timeModeCard.classList.remove('has-selected-time');
            timeOptions.forEach(opt => opt.classList.remove('selected'));
            
            // 恢复按钮文本为"点击选择时间"
            timeModeStartBtn.innerHTML = '<i class="fas fa-play-circle"></i> 点击选择时间';
        }
    }
    
    // 选择模式（无限模式、人机模式、联机模式）
    function selectMode(mode) {
        // 移除所有模式的选择状态
        timeModeCard.classList.remove('selected', 'has-selected-time');
        infiniteModeCard.classList.remove('selected');
        aiModeCard.classList.remove('selected');
        onlineModeCard.classList.remove('selected'); // 新增：移除联机模式选中状态
        
        // 清除时间选择
        selectedTime = null;
        timeOptions.forEach(opt => opt.classList.remove('selected'));
        
        // 恢复限时模式按钮文本
        timeModeStartBtn.innerHTML = '<i class="fas fa-play-circle"></i> 点击选择时间';
        
        // 设置当前选择的模式
        if (mode === 'infinite') {
            infiniteModeCard.classList.add('selected');
            selectedMode = 'infinite';
        } else if (mode === 'ai') {
            aiModeCard.classList.add('selected');
            selectedMode = 'ai';
        } else if (mode === 'online') { // 新增：联机模式选中状态
            onlineModeCard.classList.add('selected');
            selectedMode = 'online';
        }
    }
    
    // 开始限时模式游戏
    function startTimeMode() {
        if (!selectedTime) {
            showMessage('请先选择挑战时间！', 'warning');
            return;
        }
        
        const timeText = formatTime(selectedTime);
        showMessage(`已选择限时模式：${timeText}挑战！进入地图选择...`, 'success');
        
        // 保存选择的模式和时间到本地存储
        localStorage.setItem('selectedGameMode', 'time');
        localStorage.setItem('selectedTime', selectedTime);
        
        setTimeout(() => {
            window.location.href = 'chooseMap.html';
        }, 1500);
    }
    
    // 开始无限模式游戏
    function startInfiniteMode() {
        showMessage('已选择无限模式！进入地图选择...', 'success');
        
        // 保存选择的模式到本地存储
        localStorage.setItem('selectedGameMode', 'infinite');
        
        setTimeout(() => {
            window.location.href = 'chooseMap.html';
        }, 1500);
    }
    
    // 开始人机模式游戏
    function startAIMode() {
        showMessage('已选择人机对战模式！正在进入游戏...', 'success');
        
        // 保存选择的模式到本地存储
        localStorage.setItem('selectedGameMode', 'ai');
        
        setTimeout(() => {
            window.location.href = 'game.html';
        }, 1500);
    }
    
    // 跳转到猫咪选择页面
    function goToChooseCat() {
        showMessage('正在跳转到猫咪选择页面...', 'info');
        
        setTimeout(() => {
            window.location.href = 'chooseKitten.html';
        }, 1000);
    }
    
    // 显示游戏说明
    function showInstructions() {
        // 创建说明弹窗
        const instructions = `
        <div style="text-align:left; line-height:1.6;">
            <h3 style="color:#FFD700; margin-bottom:15px;">游戏说明</h3>
            <p><strong>游戏目标：</strong>控制猫咪收集食物，避开坏果和障碍物。</p>
            <p><strong>控制方式：</strong>使用方向键或WASD键控制猫咪移动。</p>
            
            <h4 style="color:#FFD700; margin-top:20px; margin-bottom:10px;">游戏模式说明：</h4>
            <p><strong>限时模式：</strong>选择挑战时间（1分钟、3分钟或5分钟），在限定时间内获得尽可能高的分数。</p>
            <p><strong>无限模式：</strong>没有时间限制，尽情享受游戏。躲避障碍，收集食物。</p>
            <p><strong>人机对战：</strong>与AI对手竞争，比对手更快收集食物，获得更高分数。</p>
        </div>
        `;
        
        // 显示自定义弹窗
        showCustomMessage('游戏说明', instructions, 'info');
    }
    
    // 显示设置
    function showSettings() {
        // 获取保存的游戏难度，默认值为normal
        const savedDifficulty = localStorage.getItem('gameDifficulty') || 'normal';
        // 获取保存的音量设置，默认70
        const savedVolume = localStorage.getItem('gameVolume') || '70';
        // 获取保存的音效设置，默认开启
        const savedBgMusic = localStorage.getItem('bgMusicEnabled') !== 'false';
        const savedSoundEffects = localStorage.getItem('soundEffectsEnabled') !== 'false';
        
        // 创建设置弹窗
        const settings = `
        <div style="text-align:left; line-height:1.6;">
            <h3 style="color:#FFD700; margin-bottom:15px;">游戏设置</h3>
            
            <div style="margin-bottom:20px;">
                <label style="display:block; margin-bottom:8px; font-weight:bold;">游戏音量：</label>
                <input type="range" id="volumeSlider" min="0" max="100" value="${savedVolume}" style="width:100%; height:10px; border-radius:5px; background:rgba(255,255,255,0.1); outline:none;">
            </div>
            
            <div style="margin-bottom:20px;">
                <label style="display:block; margin-bottom:8px; font-weight:bold;">游戏难度：</label>
                <select id="difficultySelect" style="width:100%; padding:10px; border-radius:8px; background:rgba(255,255,255,0.1); color:white; border:1px solid rgba(255,255,255,0.3); outline:none;">
                    <option value="easy" ${savedDifficulty === 'easy' ? 'selected' : ''} style="background: #333;color: white;padding: 10px;">简单</option>
                    <option value="normal" ${savedDifficulty === 'normal' ? 'selected' : ''} style="background: #333;color: white;padding: 10px;">普通</option>
                    <option value="hard" ${savedDifficulty === 'hard' ? 'selected' : ''} style="background: #333;color: white;padding: 10px;">困难</option>
                </select>
            </div>
            
            <div style="margin-bottom:20px;">
                <h4 style="color:#FFD700; margin-bottom:10px;">音效设置：</h4>
                <label style="display:flex; align-items:center; margin-bottom:10px;">
                    <input type="checkbox" id="bgMusicCheckbox" ${savedBgMusic ? 'checked' : ''} style="margin-right:10px;"> 开启背景音乐
                </label>
                <label style="display:flex; align-items:center;">
                    <input type="checkbox" id="soundEffectsCheckbox" ${savedSoundEffects ? 'checked' : ''} style="margin-right:10px;"> 开启游戏音效
                </label>
            </div>
        </div>
        `;
        
        // 显示自定义弹窗
        showCustomMessage('游戏设置', settings, 'info');
        
        // 添加设置保存逻辑
        setTimeout(() => {
            // 获取设置元素
            const difficultySelect = document.getElementById('difficultySelect');
            const volumeSlider = document.getElementById('volumeSlider');
            const bgMusicCheckbox = document.getElementById('bgMusicCheckbox');
            const soundEffectsCheckbox = document.getElementById('soundEffectsCheckbox');
            const closeBtn = document.getElementById('closePopupBtn');
            
            // 保存设置的函数
            function saveSettings() {
                // 保存难度到本地存储
                localStorage.setItem('gameDifficulty', difficultySelect.value);
                // 保存音量
                localStorage.setItem('gameVolume', volumeSlider.value);
                // 保存音效设置
                localStorage.setItem('bgMusicEnabled', bgMusicCheckbox.checked);
                localStorage.setItem('soundEffectsEnabled', soundEffectsCheckbox.checked);
                
                // 显示保存成功提示
                showMessage('设置已保存！', 'success');
            }
            
            // 难度选择变化时立即保存
            difficultySelect.addEventListener('change', saveSettings);
            
            // 音量变化时保存
            volumeSlider.addEventListener('input', saveSettings);
            
            // 音效复选框变化时保存
            bgMusicCheckbox.addEventListener('change', saveSettings);
            soundEffectsCheckbox.addEventListener('change', saveSettings);
            
            // 关闭按钮点击时保存设置
            closeBtn.addEventListener('click', saveSettings);
        }, 100);
    }
    
    // 格式化时间显示
    function formatTime(seconds) {
        if (seconds < 60) {
            return `${seconds}秒`;
        } else {
            const minutes = Math.floor(seconds / 60);
            return `${minutes}分钟`;
        }
    }
    
    // 显示简单消息
    function showMessage(message, type) {
        // 移除之前的消息
        const existingMessage = document.querySelector('.simple-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // 创建新消息
        const messageEl = document.createElement('div');
        messageEl.className = `simple-message message-${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
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
        
        document.body.appendChild(messageEl);
        
        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // 3秒后移除消息
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
            if (style.parentNode) {
                style.remove();
            }
        }, 3000);
    }
    
    // 显示自定义消息弹窗
    function showCustomMessage(title, content, type) {
        // 移除之前的弹窗
        const existingPopup = document.querySelector('.custom-popup');
        if (existingPopup) {
            existingPopup.remove();
        }
        
        // 创建弹窗背景
        const popupOverlay = document.createElement('div');
        popupOverlay.className = 'custom-popup';
        popupOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        `;
        
        // 创建弹窗内容
        const popupContent = document.createElement('div');
        popupContent.style.cssText = `
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            padding: 30px;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            border: 2px solid rgba(255,255,255,0.2);
            position: relative;
        `;
        
        // 根据类型设置顶部边框颜色
        let topBorderColor = '#2196F3';
        if (type === 'success') topBorderColor = '#4CAF50';
        else if (type === 'warning') topBorderColor = '#ff9800';
        
        popupContent.innerHTML = `
            <div style="position:absolute; top:0; left:0; right:0; height:5px; background:${topBorderColor}; border-radius:20px 20px 0 0;"></div>
            <h3 style="color:#FFD700; margin-bottom:20px; font-size:1.8rem; text-align:center;">${title}</h3>
            <div>${content}</div>
            <div style="display:flex; justify-content:center; margin-top:25px;">
                <button id="closePopupBtn" style="background:rgba(255,255,255,0.2); border:2px solid rgba(255,255,255,0.3); color:white; padding:10px 30px; border-radius:50px; cursor:pointer; font-size:1.1rem; transition:all 0.3s ease;">
                    关闭
                </button>
            </div>
        `;
        
        popupOverlay.appendChild(popupContent);
        document.body.appendChild(popupOverlay);
        
        // 添加关闭弹窗功能
        const closeBtn = document.getElementById('closePopupBtn');
        closeBtn.addEventListener('click', function() {
            popupOverlay.remove();
        });
        
        // 点击背景关闭弹窗
        popupOverlay.addEventListener('click', function(e) {
            if (e.target === popupOverlay) {
                popupOverlay.remove();
            }
        });
    }
});