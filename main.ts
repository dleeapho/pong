let bally: number;
let position: number;
let ballbright: number;
let return_force: number;
//  Simple pong
let player = [Button.A, Button.B]
let server = 0
let receiver = 1
let court = [0, 1, 2, 3, 4]
let baseline = 3
function serve(from_x: number, from_y: number): number {
    //  Serves a ball by putting is_inplay True and establishes the initial speed of the game
    
    
    is_inplay = true
    is_returned = false
    let serving_speed = 10000
    for (let setserve = 0; setserve < 3; setserve++) {
        pause(150)
        led.plotBrightness(from_x, from_y, 9)
        pause(150)
        led.plotBrightness(from_x, from_y, ballbright)
    }
    return serving_speed
}

function evaluate_turn(position: number, current_speed: number, return_speed: number): number {
    //  Evaluates whether the rally is still in play and if so the new pace of the game
    let speedup_factor = 3
    //  Smaller here means returns speed up more quickly
    
    
    if (is_returned) {
        if (position == baseline) {
            is_inplay = true
            current_speed = current_speed - Math.idiv(return_speed, speedup_factor)
        } else {
            is_inplay = false
            if (position < baseline) {
                basic.showString("Fault")
            }
            
            if (position > baseline) {
                basic.showString("Miss")
            }
            
        }
        
    } else {
        is_inplay = false
        basic.showString("Ace")
    }
    
    return current_speed
}

function wait_for_hit(receivingplayer: number, speed: number): number {
    let tick: number;
    //  Waits and indicates if the play has pressed a button and how long the receiving player waited
    
    is_returned = false
    for (tick = 0; tick < speed; tick++) {
        if (input.buttonIsPressed(receivingplayer)) {
            is_returned = true
            break
        }
        
    }
    return tick
}

//  Game state global vars
let is_inplay = false
let is_returned = false
let rally_speed = 0
while (true) {
    //  The rally loop
    bally = randint(0, 4)
    for (let ballx of court) {
        //  The ball moving loop
        position = _py.py_array_index(court, ballx)
        ballbright = position + 5
        if (!is_inplay) {
            rally_speed = serve(ballx, bally)
        }
        
        led.plotBrightness(ballx, bally, ballbright)
        pause(1000)
        return_force = wait_for_hit(player[receiver], rally_speed)
        led.plotBrightness(ballx, bally, 0)
        if (is_returned) {
            break
        }
        
    }
    rally_speed = evaluate_turn(position, rally_speed, return_force)
    // clear the button buffer
    input.buttonIsPressed(Button.A)
    input.buttonIsPressed(Button.B)
    player.reverse()
    court.reverse()
}
