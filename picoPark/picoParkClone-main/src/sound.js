class SoundManager {
    constructor() {
        this.sounds = {}
        this.enabled = true
        this.volume = 0.5
        
        // 创建音频上下文
        this.audioContext = null
        this.initAudioContext()
        
        // 预定义音效
        this.createSounds()
    }
    
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
        } catch (e) {
            console.warn('Web Audio API not supported')
        }
    }
    
    createSounds() {
        // 跳跃音效
        this.sounds.jump = this.createTone(440, 0.1, 'sine')
        
        // 收集钥匙音效
        this.sounds.key = this.createTone(880, 0.2, 'triangle')
        
        // 开门音效
        this.sounds.door = this.createTone(220, 0.5, 'sawtooth')
        
        // 按钮点击音效
        this.sounds.click = this.createTone(660, 0.05, 'square')
        
        // 游戏结束音效
        this.sounds.gameOver = this.createTone(165, 1.0, 'sine')
        
        // 关卡完成音效
        this.sounds.levelComplete = this.createMelody([440, 554, 659, 880], 0.2)
        
        // 玩家死亡音效
        this.sounds.death = this.createTone(110, 0.8, 'sawtooth')
    }
    
    createTone(frequency, duration, waveType = 'sine') {
        return () => {
            if (!this.enabled || !this.audioContext) return
            
            const oscillator = this.audioContext.createOscillator()
            const gainNode = this.audioContext.createGain()
            
            oscillator.connect(gainNode)
            gainNode.connect(this.audioContext.destination)
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
            oscillator.type = waveType
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
            gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01)
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)
            
            oscillator.start(this.audioContext.currentTime)
            oscillator.stop(this.audioContext.currentTime + duration)
        }
    }
    
    createMelody(frequencies, noteDuration) {
        return () => {
            if (!this.enabled || !this.audioContext) return
            
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    this.createTone(freq, noteDuration)()
                }, index * noteDuration * 1000)
            })
        }
    }
    
    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]()
        }
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume))
    }
    
    toggle() {
        this.enabled = !this.enabled
        return this.enabled
    }
}

// 全局音效管理器
window.soundManager = new SoundManager()

// 为现有功能添加音效
document.addEventListener('DOMContentLoaded', () => {
    // 按钮点击音效
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
            window.soundManager.play('click')
        }
    })
    
    // 输入框焦点音效
    document.addEventListener('focus', (e) => {
        if (e.target.tagName === 'INPUT') {
            window.soundManager.play('click')
        }
    }, true)
})
