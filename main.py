# Simple pong

player = [Button.A, Button.B]
server = 0
receiver = 1
court = [0, 1, 2, 3, 4]
baseline = 3

def serve(from_x, from_y):
    # Serves a ball by putting is_inplay True and establishes the initial speed of the game
    global is_returned
    global is_inplay
    is_inplay = True
    is_returned = False
    serving_speed = 10000

    for setserve in range(0,3):
        pause(150)
        led.plot_brightness(from_x, from_y, 9)
        pause(150)
        led.plot_brightness(from_x, from_y, ballbright)

    return serving_speed

def evaluate_turn(position, current_speed, return_speed):
    # Evaluates whether the rally is still in play and if so the new pace of the game
    speedup_factor = 3  # Smaller here means returns speed up more quickly
    global is_returned
    global is_inplay
    if is_returned:
        if position == baseline:
            is_inplay = True
            current_speed = current_speed - (return_speed // speedup_factor)
        else:
            is_inplay = False
            if position < baseline:
                music.play_sound_effect(music.builtin_sound_effect(soundExpression.sad),
                    SoundExpressionPlayMode.UNTIL_DONE)
                basic.show_string("Fault")
            if position > baseline:
                music.play_sound_effect(music.builtin_sound_effect(soundExpression.yawn),
                    SoundExpressionPlayMode.UNTIL_DONE)
                basic.show_string("Miss")
    else:
        is_inplay = False
        basic.show_string("Ace")
        music.play_sound_effect(music.builtin_sound_effect(soundExpression.soaring),
                            SoundExpressionPlayMode.UNTIL_DONE)
    return current_speed

def wait_for_hit(receivingplayer, speed):
    # Waits and indicates if the play has pressed a button and how long the receiving player waited
    global is_returned
    is_returned = False
    for tick in range(0, speed):
        if input.button_is_pressed(receivingplayer):
            is_returned = True
            music.play_tone(Note.C, music.beat(BeatFraction.HALF))
#           music.play_sound_effect(music.builtin_sound_effect(soundExpression.spring), SoundExpressionPlayMode.UNTIL_DONE)
            break
    return tick

# Game state global vars
is_inplay = False
is_returned = False
rally_speed = 0

while True:

    # The rally loop
    bally = randint(0,4)

    for ballx in court:
        # The ball moving loop
        position = court.index(ballx)
        ballbright = position + 5
        if not is_inplay:
            rally_speed = serve(ballx, bally)
        led.plot_brightness(ballx, bally, ballbright)
        pause(1000)
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
        