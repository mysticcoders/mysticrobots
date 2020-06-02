//
//  GameLogic.swift
//  mysticrobots
//
//  Created by agora on 2020-05-25.
//  Copyright © 2020 SunnySystems. All rights reserved.
//

import Foundation
import SwiftUI

struct Move : Hashable {
    
    var id = UUID()
    
    var start : BoardCoordinate
    var end : BoardCoordinate
    var direction : Sides
    var bot : Robot
    var date : Date
    
    static func == (lhs: Move, rhs: Move) -> Bool {
        return lhs.id == rhs.id
    }
    
    func hash(into hasher: inout Hasher) {
        hasher.combine(start.x)
        hasher.combine(start.y)
        hasher.combine(date)
    }
}

class GameLogic : ObservableObject {
    
    @ObservedObject var boardLogic : BoardLogic

    @Published var elapsedTime : TimeInterval = 0
    
    var moves : [Move] = []
    var startTime : Date = Date()
    var attempts : Int = 1
    
    var timer : Timer?
    
    init() {
        self.boardLogic = BoardLogic(height: 16)
        self.boardLogic.game = self
        self.boardLogic.randomBoard()
    }
    
    @Published var solved : Bool = false
    
    
    func simpleSuccess() {
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(.success)
    }
    
    func recordMove(_ move: Move) {
        self.moves.append(move)
        simpleSuccess()
    }
    
    func recordGoalMove(_ move: Move) {
        self.moves.append(move)
        self.timer?.invalidate()
        self.solved = true
    }
    
    func resetTimer() {
        startTime = Date()
        self.timer  = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { timer in
            if !self.solved {
                self.elapsedTime = Date().timeIntervalSince(self.startTime)
                self.objectWillChange.send()
            }
        }
    }
    
    func startNewBoard() {
        boardLogic.randomBoard()
        self.moves = []
        attempts = 1
        resetTimer()
    }
    
    func restart() {
        
        if moves.count > 0 {
            attempts += 1
        }
        self.moves = []
        
        resetTimer()
        
    }
    
    func moveViews() -> [MoveView] {
        var result : [MoveView] = []
        for move in moves {
            result.append(MoveView(move: move))
        }
        return result
    }
    
}

struct MoveView : View, Hashable {
    
    let id = UUID()
    
    let move : Move
    
    func iconImageFor(_ side: Sides) -> Image {
        switch side {
            case .east: return Image(systemName: "arrow.right.circle")
            case .west: return Image(systemName: "arrow.left.circle")
            case .north: return Image(systemName: "arrow.up.circle")
            case .south: return Image(systemName: "arrow.down.circle")
        }
    }
    
    var body : some View {
        ZStack {
            iconImageFor(move.direction).font(.system(size: 30)).foregroundColor(move.bot.color.color()).padding(.all, 0)
        }
    }
    
    static func == (lhs: MoveView, rhs: MoveView) -> Bool {
        return lhs.id == rhs.id
    }
}
