# Exciting Quiz Machine!

Fully functional version at this URI: https://b-dionysus.github.io/homework4-quiz/

# Description
What an exciting quiz game! First we check to see if someone on this computer has attempted the quiz already. If they have, we'll tell them their previous high score in an attempt to motivate them to do better this time!

Then we present them with a question, and some possible answers (in this case all of the quiz questions have four possible answers, but there's no reason they couldn't have more, or fewer). An ominous timer ticks down in the corner. If the user get a question correct, they get a point and a new question. If not, the timer is reduced and they get an incorrect mark and a new question.

The quiz continues until the user has answered every question correctly (they get as many chances to answer them as they want) or until they finally run out of time. At that point, they see their final score (time let plus right answers, minus wrong answers). They enter their name (prefilled, if they have tried the game previously) and then see an overall scoreboard, the the highest scores from everyone who has ever played the game, throughout the world!! Technically, this is just as competitive as the World Series.


# Bugs / ToDo
The user is asked to enter their name, and I tried my best to sanitize the user input. I haven't been able to hack it yet, but I worry that I've left myself open to some sort of exploit or other. So the remaining ToDo would be to get someone more security knowledgable than I am to audit the php code.
