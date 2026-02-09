/**
 * Returns a playful completion message based on total move count
 */
export function getCompletionMessage(totalMoves) {
    if (totalMoves <= 8) {
        return "Flawless. The robots are in awe of your efficiency."
    }
    if (totalMoves <= 12) {
        return "Impressive. Rollie is telling everyone about your moves."
    }
    if (totalMoves <= 16) {
        return "Solid work. Gumball only had to close his eye once."
    }
    if (totalMoves <= 20) {
        return "Not bad. Blubber has seen worse. Not much worse, but worse."
    }
    if (totalMoves <= 28) {
        return "The scenic route. Yolo appreciated the extra sightseeing."
    }
    if (totalMoves <= 40) {
        return "The robots have started a book club to pass the time."
    }
    return "The robots have filed a formal complaint with management."
}

export default getCompletionMessage
