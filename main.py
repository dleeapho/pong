# Simple pong

player = [Button.A, Button.B]
server = 0
receiver = 1
court = [0, 1, 2, 3, 4]
baseline = 3
is_inplay = False
is_returned = False
rally_speed = 0

def serve(from_x, from_y):
    # serves a ball and returns True to indicate the game is now in play and resets the speed of the game"
    serving_speed = 10000
    global is_inplay
    is_inplay = True
    for setserve in range(0,3):
        pause(150)
        led.plot_brightness(from_x, from_y, 9)
        pause(150)
        led.plot_brightness(from_x, from_y, ballbright)
    return serving_speed;

def evaluate_turn(position, current_speed, return_speed):
    # evaluates whether the rally is still in play and if so the new pace of the game "
    global is_inplay
    is_inplay = True
    speedup_factor = 3  # smaller means returns speed up more quickly
    if is_returned:
        if position == baseline:
            current_speed = current_speed - (return_speed // speedup_factor)
        else:
            is_inplay = False
            if position < baseline:
                basic.show_string("Fault")
            if position > baseline:
                basic.show_string("Miss")
    else:
        basic.show_string("Ace")
        is_inplay = False
    return current_speed;

def wait_for_hit(receivingplayer, speed):
    # waits and indicates if the play has pressed a button and how long he/she waited"
    global is_returned
    is_returned = False
    for tick in range(0, speed):
        if input.button_is_pressed(receivingplayer):
            is_returned = True
            break
    return tick




while True:
    # the rally loop
    bally = randint(0,4)
    #is_returned = False
    return_force = 0

    for ballx in court:
        # the ball moving loop
        position = court.index(ballx)
        ballbright = position + 5
        if not is_inplay:
            rally_speed = serve(ballx, bally)
            led.plot_brightness(ballx, bally, ballbright)
        return_force = wait_for_hit(player[receiver], rally_speed)
        led.plot_brightness(ballx, bally, 0)
        if is_returned:
            break
    rally_speed = evaluate_turn(position, rally_speed, return_force)
    #clear the button buffer
    input.button_is_pressed(Button.A)
    input.button_is_pressed(Button.B)

    player.reverse()
    court.reverse()
        