document.addEventListener('DOMContentLoaded', () => {
    var logicBoard = [];
    var board = document.querySelector('.content');
    var snake = [
        [0, 0], //proximo movimiento de la serpiente
        [0, 3], //cabeza de la serpiente
        [0, 2], // Cuerpo hasta n 
        [0, 1],
    ];
    var snake_head_next = [0,1]; //Controlador de direccion de la serpiente
    var gameOver = false;
    var FPS = 150;
    var score = document.querySelector('#score');
    var routines = [];
    var restartButton = document.querySelector(' #tryAgain ');

    restartButton.addEventListener('click', () => {
        window.location.reload();
    });
    

    /**
     * Renderiza la serpiente mediante la asignación de clases css
     */
    function RenderSnake(){
        let head = true;
        let predictionContent = true;
        for(const snakePart of snake ){
            if (predictionContent){
                predictionContent = false;
                continue;
            }
            else if (head){
                logicBoard[snakePart[0]][snakePart[1]].className = 'snake head';
                head = false;
            }
            else
                logicBoard[snakePart[0]][snakePart[1]].className = 'snake';
        }
    }

    /**
     * Genera el tablero y estable la cabeza de la serpiente en el [0][0] del logicBoard
     */
    function CreateGrid(){
        let cells_x = board.dataset.cells_x;
        let cells_y = board.dataset.cells_y;

        for(let i = 0; i < cells_x; i++){
            logicBoard.push([]);
            for(let j = 0; j < cells_y; j++){
                let cell = document.createElement('div');
                cell.style.width = `${board.clientWidth / cells_x}px`;
                cell.style.height = `${board.clientHeight / cells_y}px`;
                cell.setAttribute('class', 'cell');
                cell.setAttribute('data-i', i);
                cell.setAttribute('data-j', j);
                board.append(cell);
                logicBoard[i].push(cell);
            }
        }
        RenderSnake();
    }

    /**
     * Determina si la serpiente se puede mover o es game-over
     */
    function isInBoard(i, j) {
        if(i < 0 || i >= logicBoard.length) return false;
        else if(j < 0 || j >= logicBoard[i].length) return false;
        else if (logicBoard[i][j].className.includes('snake')) return false;
        else if (logicBoard[i][j].className.includes('apple')){
            let appleCell = logicBoard[i][j];
            snake.splice(1,0, [appleCell.dataset.i, appleCell.dataset.j]);
            score.innerHTML = `${parseInt(score.innerHTML) + 1}`;
            FPS -= 10;

            return true;
        } 
        else return true;
    }

    /**
     * Controla el siguiente movimiento de la cabeza de la serpiente para el próximo frame
     */
    function Controller(e){
        if([83, 87, 68, 65].indexOf(e.keyCode) !== -1){
            snake_head_next = [0,0];
            switch(e.keyCode){
                case 83:
                    snake_head_next[0] = 1;
                    break;
                case 87:
                    snake_head_next[0] = -1;
                    break;
                case 68:
                    snake_head_next[1] = 1;
                    break;   
                case 65:
                    snake_head_next[1] = -1;
                    break;
            }
        }
    }

    /**
     * Calcula y mueve la lógica de la serpiente
     */
    function MoveSnake(){
        //Se hacen los calculos de la cabeza de la serpiente
        snake[0][0] = snake[1][0] + snake_head_next[0];
        snake[0][1] = snake[1][1] + snake_head_next[1];

        if(isInBoard(snake[0][0], snake[0][1])){
            //Se asignan las nuevas posiciones
            for (let i = snake.length - 1; i > 0; i--){
                logicBoard[snake[i][0]][snake[i][1]].className = 'cell';
                //console.log(`[${i}] ${snake[i]} -> [${i - 1}] ${snake[i - 1]}`)
                snake[i][0] = snake[i - 1][0];
                snake[i][1] = snake[i - 1][1];
            }
            RenderSnake();

            return true;
        }

        gameOver = true;
        return false;
    }

    /**
     * Rutina principal del juego
     */
    function GameRoutine(){
        routines.push(setInterval(() => {
            while(true){
                const row = Math.floor(Math.random() * board.dataset.cells_x);
                const slot = Math.floor(Math.random() * board.dataset.cells_y);
                const cell = logicBoard[row][slot];

                if(cell.className.includes('snake')) continue;
                else{
                    cell.className += " apple";
                    break;
                }
            }
        }, 3000));

        routines.push(setInterval(() => {
            console.log(snake.length);
            if(!gameOver && MoveSnake()){
                RenderSnake();
            }
            else{
                document.querySelector('.overlay').style.display = 'flex';
                clearInterval(routines[0]);
                clearInterval(routines[1]);
            }
        }, FPS));
    }

    CreateGrid();
    document.addEventListener('keyup', Controller);
    GameRoutine();

});