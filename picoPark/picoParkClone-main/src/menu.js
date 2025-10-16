
function startGame() {
    document.getElementById("c").style.display = ""
    document.getElementById("menu").style.display = "none"
    document.getElementById("restartLevel").style.display = ""
    if (!mainGame.matter.running) {
        startMainGame()
        setInterval(() => {
            if (window.hostConnection) hostConnection.broadcast(JSON.stringify({
                startGame:true,
            }))
        }, 3000);
    }
    // Hide game cards when starting
    if (typeof hideGameCards === 'function') {
        hideGameCards()
    }
}
function hideGame() {
    document.getElementById("menu").style.display = ""
    document.getElementById("c").style.display = "none"
    // Show game cards when pausing/stopping
    if (typeof showGameCards === 'function') {
        showGameCards()
    }
}

function setRoomCode(c) {
    document.getElementById("roomCode").textContent = c
}

function addPlayerToMenu(name) {
    const memberItem = document.createElement('div')
    memberItem.className = 'member-item'
    memberItem.innerHTML = `${name}`
    document.getElementById("memberlist").appendChild(memberItem)
}

// Hook player additions to refresh level
;(function(){
    const origAdd = PlayerHandler.prototype.addPlayer
    PlayerHandler.prototype.addPlayer = function(options){
        options = options||{}
        const p = origAdd.call(this, options)
        if (this.game && typeof this.game.refreshForPlayerCountChange === 'function') {
            try{ this.game.refreshForPlayerCountChange() }catch(e){}
        }
        return p
    }
})()