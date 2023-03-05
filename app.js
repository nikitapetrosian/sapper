var fieldSize = 10
var fildsCount = fieldSize * fieldSize - fieldSize
var field = new Array(fieldSize)
var mines = new Array(fieldSize)
var btn, btnHero
var colors = ["black", "blue", "#070", "red", "#007", "#700", "#088", "yellow", "magenta"]
var play
var si
var time, scores
var timeElement, scoresElement

function showMines() {
    mines.forEach(function (item) {
        minedButton = document.getElementById("b" + item.y + item.x)
        minedButton.innerHTML = field[item.y][item.x][1] == 1 ? "⛳" : "💣"
        minedButton.style.color = colors[0]
    })

    stopGame()
}

function fillCell(y, x, elem) {
    if (elem == undefined) {
        elem = document.getElementById("b" + y + x)
    }

    if (field[y][x][0] < 0) {
        stopGame()
        showMines()
        elem.style.backgroundColor = "red"
        btnHero.className = "hero_dead"
    } else {
        elem.innerHTML = field[y][x][0] ? field[y][x][0] : ""
    }
    elem.style.color = colors[Math.max(0, field[y][x][0])]
    elem.disabled = true
}

function lookCell(y, x) {
    var xl = x - 1, xr = x + 1, yb = y + 1, yt = y - 1

    field[y][x][1] = -1
    fildsCount--

    if (y > 0) {
        if (field[yt][x][1] > -1) {
            if (field[yt][x][0] == 0) {
                lookCell(yt, x)
            } else {
                field[yt][x][1] = -1
                fildsCount--
                fillCell(yt, x)
            }
        }

        if (xl > -1 && field[yt][xl][1] > -1 && field[yt][xl][0] > 0) {
            field[yt][xl][1] = -1
            fildsCount--
            fillCell(yt, xl)
        }

        if (xr < fieldSize && field[yt][xr][1] > -1 && field[yt][xr][0] > 0) {
            field[yt][xr][1] = -1
            fildsCount--
            fillCell(yt, xr)
        }
    }

    if (xr < fieldSize) {
        if (field[y][xr][1] > -1) {
            if (field[y][xr][0] == 0) {
                lookCell(y, xr)
            } else {
                field[y][xr][1] = -1
                fildsCount--
                fillCell(y, xr)
            }
        }

        if (yt > -1 && field[yt][xr][1] > -1 && field[yt][xr][0] > 0) {
            field[yt][xr][1] = -1
            fildsCount--
            fillCell(yt, xr)
        }

        if (yb < fieldSize && field[yb][xr][1] > -1 && field[yb][xr][0] > 0) {
            field[yb][xr][1] = -1
            fildsCount--
            fillCell(yb, xr)
        }
    }

    if (yb < fieldSize) {
        if (field[yb][x][1] > -1) {
            if (field[yb][x][0] == 0) {
                lookCell(yb, x)
            } else {
                field[yb][x][1] = -1
                fildsCount--
                fillCell(yb, x)
            }
        }

        if (xl > -1 && field[yb][xl][1] > -1 && field[yb][xl][0] > 0) {
            field[yb][xl][1] = -1
            fildsCount--
            fillCell(yb, xl)
        }

        if (xr < fieldSize && field[yb][xr][1] > -1 && field[yb][xr][0] > 0) {
            field[yb][xr][1] = -1
            fildsCount--
            fillCell(yb, xr)
        }
    }

    if (x > 0) {
        if (field[y][xl][1] > -1) {
            if (field[y][xl][0] == 0) {
                lookCell(y, xl)
            } else {
                field[y][xl][1] = -1
                fildsCount--
                fillCell(y, xl)
            }
        }

        if (yt > -1 && field[yt][xl][1] > -1 && field[yt][xl][0] > 0) {
            field[yt][xl][1] = -1
            fildsCount--
            fillCell(yt, xl)
        }

        if (yb < fieldSize && field[yb][xl][1] > -1 && field[yb][xl][0] > 0) {
            field[yb][xl][1] = -1
            fildsCount--
            fillCell(yb, xl)
        }
    }

    fillCell(y, x)
}

function check() {
    var y = Number(btn.id.charAt(1))
    var x = Number(btn.id.charAt(2))
    var cell = field[y][x]

    if (cell[1] == 1) {
        return
    }

    if (cell[0] == 0) {
        lookCell(y, x)
    } else {
        cell[1] = -1
        fillCell(y, x, btn)
        fildsCount--
    }

    if (play && fildsCount == 0) {
        stopGame()
        showMines()
        btnHero.className = "hero_win"
    }

    return false
}

function mark() {
    var y = Number(btn.id.charAt(1))
    var x = Number(btn.id.charAt(2))
    var cell = field[y][x]

    if (cell[1] == -1) {
        return
    }

    cell[1] = (cell[1] + 1) % 3

    switch (cell[1]) {
        case 0:
            btn.innerHTML = ""
            break
        case 1:
            btn.innerHTML = "🚩"
            break
        case 2:
            btn.innerHTML = "?"
            break
    }
    btn.style.color = "black"

    return false
}

function mouseGotDown(event) {
    if (play && event.which == 1) {
        btnHero.className = "hero_check"
    }
}

function initField() {
    var fieldHTML = document.getElementById("field")
    var text = ""

    for (var i = 0; i < fieldSize; i++) {
        field[i] = new Array(fieldSize)
        text += '<div class="row">\n'

        for (var j = 0; j < fieldSize; j++) {
            field[i][j] = new Array(0, 0)
            text += '<div class="cell"><button id="b' + i + j + '" class="field"></button></div>\n'
        }

        text += "</div>\n"
    }

    fieldHTML.innerHTML = text
}

function setMine(y, x) {
    field[y][x][0] = -1

    var xs, xe, ys, ye, eMax = fieldSize - 1

    xs = Math.max(0, x - 1)
    xe = Math.min(x + 1, eMax)
    ys = Math.max(0, y - 1)
    ye = Math.min(y + 1, eMax)

    for (var i = ys; i <= ye; i++) {
        for (var j = xs; j <= xe; j++) {
            if (field[i][j][0] < 0) {
                continue
            }

            field[i][j][0]++
        }
    }
}

function toMine() {
    for (var i = 0; i < fieldSize; i++) {
        while (true) {
            var x = Math.floor(Math.random() * 10)
            var y = Math.floor(Math.random() * 10)

            if (field[y][x][0] > -1) {
                setMine(y, x)
                mines[i] = { "x": x, "y": y }

                break
            }
        }
    }
}

function formatNumber(number) {
    if (number < 10) {
        return "00" + number
    }

    if (number < 100) {
        return "0" + number
    }

    return number
}

function setNextSecond() {
    time++
    if (time > 999) {
        stopGame()
        showMines()
        return
    }

    timeElement.innerHTML = formatNumber(time)
}

function startGame() {
    play = true
    fildsCount = fieldSize * fieldSize - fieldSize
    time = 0
    scores = 0
    timeElement.innerHTML = formatNumber(time)
    scoresElement.innerHTML = formatNumber(scores)
    btnHero.className = "hero_none"

    si = setInterval(setNextSecond, 1000)
}

function stopGame() {
    play = false

    clearInterval(si)
}

window.onload = function () {
    logsElement = document.getElementById("logs")
    timeElement = document.getElementById("clock")
    scoresElement = document.getElementById("scores")
    btnHero = document.getElementById("hero")
    btnHero.onclick = function () {
        var result = confirm("Начать новую игру?")
        if (result) {
            initField()
            toMine()
            startGame()
        }
    }

    initField()
    toMine()
    startGame()
}

document.body.onmousedown = function (e) {
    var elem = e ? e.target : window.event.srcElement
    if (elem.id != "hero") {

        if (!play) {
            btn = null
            return
        }

        if (!/b\d{2}/.test(elem.id)) {
            btn = null
            return
        }

        btn = elem
        btn.onclick = check
        btn.oncontextmenu = mark
        mouseGotDown(e)
    }
}

document.body.onmouseup = function () {
    if (play) {
        btnHero.className = "hero_none"
    }
}