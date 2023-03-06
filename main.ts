let bally: number;
let returned: boolean;
let position: number;
let ballbright: number;
//  Simple pong
let player = [Button.A, Button.B]
let server = 0
let receiver = 1
let court = [0, 1, 2, 3, 4]
let baseline = 3
function serve(from_x: number, from_y: number): boolean[] {
    /** serves a ball and returns True to indicate the game is now in play and resets the speed of the game */
    let serving_speed = 10000
    let is_inplay = true
    for (let setserve = 0; setserve < 3; setserve++) {
        pause(150)
        led.plotBrightness(from_x, from_y, 9)
        pause(150)
        led.plotBrightness(from_x, from_y, ballbright)
    }
    return [is_inplay, serving_speed]
}

function evaluate_turn(is_returned: boolean, position: number, current_speed: number, return_speed: number): boolean[] {
    /** evaluates whether the rally is still in play and if so the new pace of the game */
    let is_inplay = true
    let speedup_factor = 3
    //  smaller means returns speed up more quickly
    if (is_returned) {
        if (position == baseline) {
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
        basic.showString("Ace")
        is_inplay = false
    }
    
    return [is_inplay, current_speed]
}

function wait_for_hit(receivingplayer: number, speed: number): boolean[] {
    let tick: number;
    /** waits and indicates if the play has pressed a button and how long he/she waited */
    let returned = false
    for (tick = 0; tick < speed; tick++) {
        if (input.buttonIsPressed(receivingplayer)) {
            returned = true
            break
        }
        
    }
    return [returned, tick]
}

let is_inplay = false
let rally_speed = 0
while (true) {
    //  the rally loop
    bally = randint(0, 4)
    returned = false
    for (let ballx of court) {
        //  the ball moving loop
        position = _py.py_array_index(court, ballx)
        ballbright = position + 5
        if (!is_inplay) {
            let [is_inplay, rally_speed] = serve(ballx, bally)
            led.plotBrightness(ballx, bally, ballbright)
        }
        
        let [returned, return_force] = wait_for_hit(player[receiver], rally_speed)
        led.plotBrightness(ballx, bally, 0)
        if (returned) {
            break
        }
        
    }
    let [is_inplay, rally_speed] = evaluate_turn(returned, position, rally_speed, return_force)
    // clear the button buffer
    input.buttonIsPressed(Button.A)
    input.buttonIsPressed(Button.B)
    player.reverse()
    court.reverse()
}
