document.addEventListener('DOMContentLoaded', function() {
    // 获取所有选择按钮
    const selectBtns = document.querySelectorAll('.select-btn');
    let selectedMap = null;
    
    // 选择地图功能
    selectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 获取地图名称
            const mapName = this.getAttribute('data-map');
            const mapCard = this.closest('.map-card');
            
            // 移除所有卡片的选中状态
            document.querySelectorAll('.map-card').forEach(card => {
                card.style.borderColor = '#FFD700';
                card.querySelector('.select-btn').innerHTML = '<i class="fas fa-play-circle"></i> 选择';
                card.querySelector('.select-btn').style.background = 'linear-gradient(45deg, #FF9800, #FF5722)';
            });
            
            // 设置当前选中状态
            selectedMap = mapName;
            mapCard.style.borderColor = '#4CAF50';
            this.innerHTML = '<i class="fas fa-check-circle"></i> 已选择';
            this.style.background = 'linear-gradient(45deg, #4CAF50, #2E7D32)';
            
            // 显示确认消息
            showMessage(`已选择${mapCard.querySelector('.map-name').textContent}地图`, 'success');
            
            // 保存到本地存储
            localStorage.setItem('selectedMap', JSON.stringify({
                id: mapName,
                name: mapCard.querySelector('.map-name').textContent,
                selectedAt: new Date().toISOString()
            }));
            
            // 延迟跳转到游戏页面
            setTimeout(() => {
                window.location.href = 'game.html';
            }, 1500);
        });
    });
    
    // 左上角返回按钮功能
    document.getElementById('topBackBtn').addEventListener('click', function() {
        window.location.href = 'start.html';
    });
    
    // 显示消息函数
    function showMessage(message, type) {
        // 移除之前的消息
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // 创建新消息
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            font-size: 0.95rem;
        `;
        
        // 移动端适配消息位置
        if (window.innerWidth <= 768) {
            messageEl.style.top = '70px';
            messageEl.style.right = 'auto';
            messageEl.style.left = '50%';
            messageEl.style.transform = 'translateX(-50%)';
            messageEl.style.width = '90%';
            messageEl.style.textAlign = 'center';
        }
        
        // 根据类型设置背景色
        if (type === 'success') {
            messageEl.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
        } else if (type === 'warning') {
            messageEl.style.background = 'linear-gradient(45deg, #ff9800, #f57c00)';
        } else {
            messageEl.style.background = 'linear-gradient(45deg, #2196F3, #1976D2)';
        }
        
        document.body.appendChild(messageEl);
        
        // 3秒后移除消息
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 3000);
    }
    
    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case '1':
                // 选择教室地图
                document.querySelector('[data-map="classroom"]').click();
                break;
            case '2':
                // 选择操场地图
                document.querySelector('[data-map="playground"]').click();
                break;
            case '3':
                // 选择图书馆地图
                document.querySelector('[data-map="library"]').click();
                break;
            case 'Escape':
            case 'Backspace':
                // 返回
                window.location.href = 'start.html';
                break;
        }
    });
    
    // 确保页面加载完成后没有滚动条
    window.addEventListener('load', function() {
        document.body.style.overflow = 'hidden';
        // 针对不同屏幕尺寸调整
        if (window.innerHeight < document.body.offsetHeight) {
            document.body.style.overflowY = 'auto';
            document.body.style.maxHeight = '100vh';
        }
    });
});