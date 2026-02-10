/**
 * Returns a playful completion message factoring in move efficiency and elapsed time.
 * Move efficiency compares the player's total moves to the combined per-robot optimal.
 * Time adds a secondary layer of snark or praise.
 */
export function getCompletionMessage(totalMoves, optimalMoves, elapsedMs) {
    const ratio = optimalMoves > 0 ? totalMoves / optimalMoves : totalMoves
    const minutes = elapsedMs / 60000

    if (ratio <= 1.2) {
        if (minutes < 3) return "Optimal. The robots want to know if you're single."
        if (minutes < 8) return "Flawless moves. Rollie barely had time to nap."
        return "Perfect efficiency, but the robots aged a year waiting."
    }

    if (ratio <= 1.8) {
        if (minutes < 2) return "Fast and sharp. Gumball is impressed, and he's hard to impress."
        if (minutes < 5) return "Solid work. The robots would high-five you if they had hands."
        if (minutes < 10) return "Good moves, but Blubber started doodling halfway through."
        return "Nice path-finding. The robots reorganized their sock drawers while they waited."
    }

    if (ratio <= 2.5) {
        if (minutes < 3) return "Quick but chaotic. Yolo respects the energy."
        if (minutes < 8) return "Not bad. Gumball only had to close his eye twice."
        return "The scenic route at scenic-route speed. Blubber took a scenic nap."
    }

    if (ratio <= 3.5) {
        if (minutes < 5) return "A lot of moves, but at least it was over fast. Like ripping off a bandage."
        if (minutes < 10) return "The robots have started a book club to pass the time."
        return "Rollie wrote a memoir while you were solving that. It's called 'Waiting.'"
    }

    if (minutes < 5) return "That was... a journey. Yolo appreciated the extra sightseeing."
    if (minutes < 15) return "The robots have filed a formal complaint with management."
    return "The robots considered evolving legs and walking home themselves."
}

export default getCompletionMessage
