//
//  Square.swift
//  mysticrobots
//
//  Created by agora on 2020-05-22.
//  Copyright © 2020 SunnySystems. All rights reserved.
//

import Foundation
import UIKit
import SwiftUI

///View for each square of the board
struct Square : View {
    
    var id = UUID()
    
    @ObservedObject var logic : SquareLogic
    
    var body : some View {
        ZStack {
            
            if logic.isHighlighted {
                Color.Mystic.boardBackground
                logic.hightlightColor.blendMode(.screen).opacity(0.9)
            } else {
                Color.Mystic.boardBackground

            }
            
            ForEach(wallViews(), id: \.id) { wall in
                wall
            }
            
            if logic.isRobot && logic.isGoal {
                GoalView(color: logic.goal!.color)
            } else {
                if logic.robot != nil {
                    RobotView(robot: logic.robot!)
                }
                
                if logic.goal != nil {
                    GoalView(color: logic.goal!.color)
                }
            }
            
            
            
        }.onTapGesture {
            self.logic.onTap()
        }
    }
    
    /// outputs borders(walls) according to walls in the Square
    private func wallViews() -> [WallView] {
        var result : [WallView] = []
        for wall in logic.walls.all {
            result.append(WallView(edge: sideToEdge(wall)))
        }
        return result
    }
    
}

class SquareWalls {
    
    var sides: Dictionary<Sides,Bool>
    
    subscript(side: Sides) -> Bool {
        get {
            return sides[side] ?? false
        }
        
        set {
            sides[side] = true
        }
    }
    
    init() {
        sides = [:]
    }
    
    var all : Array<Sides> {
        return sides.keys.compactMap { return $0.self }
    }
    
    func addWall(on side : Sides) {
        sides[side] = true
    }
    
    var isEmpty : Bool {
        return sides.count == 0
    }
    
}

struct BoardCoordinate {
    var x : Int
    var y : Int
    
    static var zero : BoardCoordinate {
        return BoardCoordinate(x: 0, y: 0)
    }
    
    static func random(range: Range<Int>) -> BoardCoordinate {
        return BoardCoordinate(x: Int.random(in: range), y: Int.random(in: range))
    }
    
    static func random(x: ClosedRange<Int>, y: ClosedRange<Int>) -> BoardCoordinate {
        return BoardCoordinate(x: Int.random(in: x), y: Int.random(in: y))
    }
    
    func incremented(towards: Sides) -> BoardCoordinate {
        switch towards {
            case .east: return BoardCoordinate(x: x+1, y: y)
            case .west: return BoardCoordinate(x: x-1, y: y)
            case .north: return BoardCoordinate(x: x, y: y-1)
            case .south: return BoardCoordinate(x: x, y: y+1)
        }
    }
    
    func stringValue() -> String {
        return "\(x):\(y)"
    }
}



extension Square : Hashable, Identifiable {
    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
    
    static func == (lhs: Square, rhs: Square) -> Bool {
        return lhs.id == rhs.id
    }
    
    private func sideToEdge(_ side: Sides) -> Edge {
        switch side {
            case .east: return .trailing
            case .west: return .leading
            case .north: return .top
            case .south: return .bottom
        }
    }
    
}
