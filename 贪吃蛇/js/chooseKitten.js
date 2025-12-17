document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const catsSlider = document.getElementById('catsSlider');
    const kittenOptions = document.querySelectorAll('.kitten-option');
    const confirmBtn = document.getElementById('confirmBtn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const navIndicator = document.getElementById('navIndicator');
    
    // 状态变量
    let currentIndex = 0;
    let selectedKitten = null;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = null;
    
    // 初始化
    init();
    
    function init() {
        // 尝试从本地存储恢复之前的选择
        restorePreviousSelection();
        
        // 如果没有恢复成功，默认选中第一个小猫
        if (currentIndex === 0 && !selectedKitten) {
            selectKitten(0);
        }
        
        centerSelectedKitten();
        
        // 为每个小猫选项添加点击事件
        kittenOptions.forEach((option, index) => {
            // 点击选择小猫（排除"敬请期待"）
            option.addEventListener('click', () => {
                // 如果是"敬请期待"卡片，不执行选择
                if (option.classList.contains('disabled')) {
                    showMessage('喵喵喵，请选择其他小猫！', 'warning');
                    return;
                }
                selectKitten(index);
                centerSelectedKitten();
            });
            
            // 触摸事件处理（移动端滑动）
            option.addEventListener('touchstart', touchStart(index));
            option.addEventListener('touchend', touchEnd);
            option.addEventListener('touchmove', touchMove);
            
            // 鼠标事件处理（桌面端拖动）
            option.addEventListener('mousedown', touchStart(index));
            option.addEventListener('mouseup', touchEnd);
            option.addEventListener('mouseleave', touchEnd);
            option.addEventListener('mousemove', touchMove);
            
            // 鼠标悬停效果（自定义）
            option.addEventListener('mouseenter', () => {
                if (!isDragging && !option.classList.contains('disabled')) {
                    option.style.transform = 'translateY(-15px) translateZ(20px)';
                }
            });
            
            option.addEventListener('mouseleave', () => {
                if (!isDragging && !option.classList.contains('selected') && !option.classList.contains('disabled')) {
                    option.style.transform = 'translateY(0) translateZ(0)';
                }
            });
        });
        
        // 导航按钮事件
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                let newIndex = currentIndex - 1;
                // 如果跳转到"敬请期待"，继续向前跳转
                if (kittenOptions[newIndex].classList.contains('disabled')) {
                    newIndex = Math.max(0, newIndex - 1);
                }
                selectKitten(newIndex);
                centerSelectedKitten();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentIndex < kittenOptions.length - 1) {
                let newIndex = currentIndex + 1;
                // 如果跳转到"敬请期待"，继续向后跳转
                if (newIndex < kittenOptions.length && kittenOptions[newIndex].classList.contains('disabled')) {
                    newIndex = Math.min(kittenOptions.length - 1, newIndex + 1);
                }
                selectKitten(newIndex);
                centerSelectedKitten();
            }
        });
        
        // 确认按钮点击事件
        confirmBtn.addEventListener('click', confirmSelection);
        
        // 键盘导航事件
        document.addEventListener('keydown', handleKeyDown);
        
        // 防止拖拽时图片被选中
        document.addEventListener('dragstart', (e) => e.preventDefault());
        
        // 窗口大小变化时重新居中选中的小猫
        window.addEventListener('resize', centerSelectedKitten);
        
        // 初始化导航指示器
        createNavigationDots();
        
        // 更新导航按钮状态
        updateNavButtons();
    }
    
    // 尝试从本地存储恢复之前的选择
    function restorePreviousSelection() {
        try {
            const savedSelection = localStorage.getItem('selectedKitten');
            if (savedSelection) {
                const kittenData = JSON.parse(savedSelection);
                const kittenId = kittenData.id;
                
                // 查找匹配的小猫
                kittenOptions.forEach((option, index) => {
                    if (option.getAttribute('data-kitten') === kittenId) {
                        // 找到匹配的小猫，选中它
                        selectKitten(index);
                        // 显示恢复消息
                        setTimeout(() => {
                            showMessage(`已恢复上次选择: ${kittenData.name}`, 'info');
                        }, 300);
                        return;
                    }
                });
            }
        } catch (error) {
            console.error('恢复上次选择时出错:', error);
            // 如果恢复失败，使用默认选择
            selectKitten(0);
        }
    }
    
    // 选择小猫
    function selectKitten(index) {
        // 如果是"敬请期待"卡片，不执行选择
        if (kittenOptions[index].classList.contains('disabled')) {
            return;
        }
        
        // 移除之前选中的样式
        kittenOptions.forEach(option => {
            option.classList.remove('selected');
            // 重置悬停效果
            if (!isDragging && option !== kittenOptions[index] && !option.classList.contains('disabled')) {
                option.style.transform = 'translateY(0) translateZ(0)';
            }
        });
        
        // 添加新的选中样式
        kittenOptions[index].classList.add('selected');
        currentIndex = index;
        
        // 如果这个是可以选择的小猫（有data-kitten属性且不是0）
        const selectedOption = kittenOptions[index];
        const kittenId = selectedOption.getAttribute('data-kitten');
        if (kittenId && kittenId !== '0') {
            selectedKitten = kittenId;
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = `确认选择`;
        } else {
            // "敬请期待"选项不可选择
            selectedKitten = null;
            confirmBtn.disabled = true;
            confirmBtn.innerHTML = '请选择有效的小猫';
        }
        
        // 更新导航指示器
        updateNavigationDots();
        
        // 更新导航按钮状态
        updateNavButtons();
    }
    
    // 更新导航按钮状态
    function updateNavButtons() {
        // 禁用条件：如果是第一个卡片或之前没有可选择的卡片
        prevBtn.disabled = currentIndex === 0 || 
            (currentIndex === 1 && kittenOptions[0].classList.contains('disabled'));
        
        // 禁用条件：如果是最后一个卡片或是"敬请期待"之前的最后一个可选择的卡片
        nextBtn.disabled = currentIndex === kittenOptions.length - 1 || 
            (currentIndex === kittenOptions.length - 2 && kittenOptions[kittenOptions.length - 1].classList.contains('disabled'));
        
        if (prevBtn.disabled) {
            prevBtn.style.opacity = '0.5';
            prevBtn.style.cursor = 'not-allowed';
        } else {
            prevBtn.style.opacity = '1';
            prevBtn.style.cursor = 'pointer';
        }
        
        if (nextBtn.disabled) {
            nextBtn.style.opacity = '0.5';
            nextBtn.style.cursor = 'not-allowed';
        } else {
            nextBtn.style.opacity = '1';
            nextBtn.style.cursor = 'pointer';
        }
    }
    
    // 将选中的小猫居中显示
    function centerSelectedKitten() {
        const containerWidth = catsSlider.parentElement.offsetWidth;
        const optionWidth = kittenOptions[0].offsetWidth + 30; // 包括gap
        const optionOffset = optionWidth * currentIndex;
        const centerPosition = (containerWidth / 2) - (optionWidth / 2) - optionOffset;
        
        // 应用平滑动画
        catsSlider.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        catsSlider.style.transform = `translateX(${centerPosition}px)`;
        
        currentTranslate = centerPosition;
        prevTranslate = centerPosition;
        
        // 动画结束后移除过渡，以便拖动
        setTimeout(() => {
            catsSlider.style.transition = '';
        }, 500);
    }
    
    // 触摸/鼠标拖动开始
    function touchStart(index) {
        return function(event) {
            // 如果是"敬请期待"卡片，不允许拖动
            if (kittenOptions[index].classList.contains('disabled')) {
                return;
            }
            
            isDragging = true;
            startPos = getPositionX(event);
            currentIndex = index;
            
            // 停止任何正在进行的动画
            cancelAnimationFrame(animationID);
            
            // 移除过渡效果以便实时拖动
            catsSlider.style.transition = 'none';
            
            // 添加激活状态
            event.currentTarget.style.cursor = 'grabbing';
            catsSlider.style.cursor = 'grabbing';
        };
    }
    
    // 触摸/鼠标拖动结束
    function touchEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        
        // 移除激活状态
        kittenOptions.forEach(option => {
            if (!option.classList.contains('disabled')) {
                option.style.cursor = 'pointer';
            }
        });
        catsSlider.style.cursor = 'grab';
        
        // 计算拖动距离并确定是否切换到下一个/上一个
        const movedBy = currentTranslate - prevTranslate;
        const optionWidth = kittenOptions[0].offsetWidth + 30;
        
        // 如果拖动距离超过选项宽度的30%，则切换到下一个/上一个
        if (Math.abs(movedBy) > optionWidth * 0.3) {
            if (movedBy > 0 && currentIndex > 0) {
                // 向右拖动，切换到上一个
                let newIndex = currentIndex - 1;
                // 跳过"敬请期待"卡片
                while (newIndex >= 0 && kittenOptions[newIndex].classList.contains('disabled')) {
                    newIndex--;
                }
                if (newIndex >= 0) {
                    selectKitten(newIndex);
                }
            } else if (movedBy < 0 && currentIndex < kittenOptions.length - 1) {
                // 向左拖动，切换到下一个
                let newIndex = currentIndex + 1;
                // 跳过"敬请期待"卡片
                while (newIndex < kittenOptions.length && kittenOptions[newIndex].classList.contains('disabled')) {
                    newIndex++;
                }
                if (newIndex < kittenOptions.length) {
                    selectKitten(newIndex);
                }
            }
        }
        
        // 居中显示选中的小猫
        centerSelectedKitten();
    }
    
    // 触摸/鼠标拖动中
    function touchMove(event) {
        if (!isDragging) return;
        
        event.preventDefault();
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
        
        // 应用拖动效果
        catsSlider.style.transform = `translateX(${currentTranslate}px)`;
    }
    
    // 获取事件位置（兼容触摸和鼠标事件）
    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }
    
    // 键盘导航处理
    function handleKeyDown(event) {
        switch(event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                if (currentIndex > 0) {
                    let newIndex = currentIndex - 1;
                    // 跳过"敬请期待"卡片
                    while (newIndex >= 0 && kittenOptions[newIndex].classList.contains('disabled')) {
                        newIndex--;
                    }
                    if (newIndex >= 0) {
                        selectKitten(newIndex);
                        centerSelectedKitten();
                    }
                }
                break;
                
            case 'ArrowRight':
                event.preventDefault();
                if (currentIndex < kittenOptions.length - 1) {
                    let newIndex = currentIndex + 1;
                    // 跳过"敬请期待"卡片
                    while (newIndex < kittenOptions.length && kittenOptions[newIndex].classList.contains('disabled')) {
                        newIndex++;
                    }
                    if (newIndex < kittenOptions.length) {
                        selectKitten(newIndex);
                        centerSelectedKitten();
                    }
                }
                break;
                
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (selectedKitten) {
                    confirmSelection();
                }
                break;
        }
    }
    
    // 创建导航指示器
    function createNavigationDots() {
        navIndicator.innerHTML = '';
        
        // 只显示可选择的卡片的指示点
        kittenOptions.forEach((option, index) => {
            if (option.classList.contains('disabled')) return;
            
            const dot = document.createElement('div');
            dot.className = 'nav-dot';
            if (index === currentIndex) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                selectKitten(index);
                centerSelectedKitten();
            });
            
            navIndicator.appendChild(dot);
        });
    }
    
    // 更新导航指示器
    function updateNavigationDots() {
        const dots = navIndicator.querySelectorAll('.nav-dot');
        let dotIndex = 0;
        
        kittenOptions.forEach((option, index) => {
            if (option.classList.contains('disabled')) return;
            
            if (dots[dotIndex]) {
                if (index === currentIndex) {
                    dots[dotIndex].classList.add('active');
                } else {
                    dots[dotIndex].classList.remove('active');
                }
            }
            dotIndex++;
        });
    }
    
    // 确认选择
    function confirmSelection() {
        if (!selectedKitten) {
            showMessage('请先选择一个有效的小猫！', 'warning');
            return;
        }
        
        const selectedOption = kittenOptions[currentIndex];
        const kittenName = selectedOption.querySelector('h2').textContent;
        const kittenDesc = selectedOption.querySelector('p').textContent;
        
        // 显示确认动画
        confirmBtn.innerHTML = '✓ 已确认';
        confirmBtn.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
        
        // 保存选择到本地存储
        localStorage.setItem('selectedKitten', JSON.stringify({
            id: selectedKitten,
            name: kittenName,
            desc: kittenDesc,
            selectedAt: new Date().toISOString()
        }));
        
        // 显示成功消息
        showMessage(`成功选择: ${kittenName}! 已保存选择`, 'success');
        
        setTimeout(() => {
            window.location.href = 'start.html';
        }, 1500);
    }
    
    // 显示消息
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
    
    // 添加鼠标滚轮支持
    catsSlider.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY > 0) {
            // 向下滚动，向右切换
            if (currentIndex < kittenOptions.length - 1) {
                let newIndex = currentIndex + 1;
                // 跳过"敬请期待"卡片
                while (newIndex < kittenOptions.length && kittenOptions[newIndex].classList.contains('disabled')) {
                    newIndex++;
                }
                if (newIndex < kittenOptions.length) {
                    selectKitten(newIndex);
                    centerSelectedKitten();
                }
            }
        } else {
            // 向上滚动，向左切换
            if (currentIndex > 0) {
                let newIndex = currentIndex - 1;
                // 跳过"敬请期待"卡片
                while (newIndex >= 0 && kittenOptions[newIndex].classList.contains('disabled')) {
                    newIndex--;
                }
                if (newIndex >= 0) {
                    selectKitten(newIndex);
                    centerSelectedKitten();
                }
            }
        }
    }, { passive: false });
});