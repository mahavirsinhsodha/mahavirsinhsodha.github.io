Do
    ' Set the time interval randomly between 30 and 60 seconds
    timeToSleep = (7000 + Int((8000 - 7000 + 1) * Rnd))
    WScript.Sleep timeToSleep

    ' Show the message box
    MsgBox "I'm watching you...", vbSystemModal, "System Alert"

Loop