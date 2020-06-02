//
//  SquareLogic.swift
//  mysticrobots
//
//  Created by agora on 2020-05-25.
//  Copyright © 2020 SunnySystems. All rights reserved.
//

import SwiftUI

/// Logic for each square of the board
class SquareLogic : ObservableObject, Codable {
    
    var id = UUID()
    
    var coordinate = BoardCoordinate.zero
    var walls : SquareWalls = SquareWalls()
    
    @Published var robot : Robot?
    @Published var goal : Goal?
    @Published var isHighlighted : Bool = false
    
    @Published var hightlightColor : Color = Color.white
    
    weak var boardLogic : BoardLogic?
    
    enum CodingKeys: String, CodingKey {
        case coordinate, walls, robot, goal
    }
    
    init(_ coordinate: BoardCoordinate, boardLogic: BoardLogic?) {
        self.coordinate = coordinate
        self.boardLogic = boardLogic
    }
    
    required init(from decoder: Decoder) throws {
        
        let container = try decoder.container(keyedBy: CodingKeys.self)
        coordinate = try container.decode(BoardCoordinate.self, forKey: .coordinate)
        walls = try container.decode(SquareWalls.self, forKey: .walls)
        if container.contains(.robot) {
            robot = try container.decode(Robot.self, forKey: .robot)
        }
        if container.contains(.goal) {
            goal = try container.decode(Goal.self, forKey: .goal)
        }
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(coordinate, forKey: .coordinate)
        try container.encode(walls, forKey: .walls)
        
        if let robot = robot {
            try container.encode(robot, forKey: .robot)
        }
        if let goal = goal {
            try container.encode(goal, forKey: .goal)
        }

    }
    
    var isEmpty : Bool {
        return walls.all.count == 0
    }
    
    var isGoal : Bool {
        return goal != nil
    }
    
    var isRobot : Bool {
        return robot != nil
    }
    
    func moveRobotIn(_ robot: Robot) {
        self.robot = robot
        if self.goal != nil && robot.color == goal!.color {
            print("GREAT SUCCESS!!!!")
        }
    }
    
    func hightlight(_ color: Color = Color.white) {
        hightlightColor = color
        isHighlighted = true
    }
    
    func noHightlight() {
        hightlightColor = Color.white
        isHighlighted = false
    }
    
    func canFinish(_ bot: Robot) -> Bool {
        if let goal = self.goal {
            return goal.color == bot.color
        } else {
            return false
        }
    }
    
    func canEnter(from side: Sides, roboStop: Bool = true) -> Bool {
        
        if roboStop && isRobot { return false }
                
        let wallsAllow = !walls[side]
        
        return wallsAllow
    }
    
    func canLeave(to side: Sides) -> Bool {
        //if goal != nil { return false }
        
        let wallsAllow = !walls[side]
        
        return wallsAllow
        
    }
    
    func onTap() {
        if let bot = self.robot {
            boardLogic?.select(robot: bot)
            //boardLogic?.highlightPath(directions: Sides.all, for: self)
        } else {
            //check surrounding squares for robot, perhaps it's there
            if let botSquare = boardLogic!.surroundingSquares(for: self).first(where: { $0.robot != nil }) {
                print("Found bot nearby")
                boardLogic?.select(robot: botSquare.robot!)
            }
        }
        
        //print("\(coordinate.x):\(coordinate.y) Walls: \(walls.all) \(self.robot != nil ? self.robot!.color.color().description : "")")
        //boardLogic?.randomRange().forEach { $0.isHighlighted.toggle() }
        //boardLogic?.surroundingSquares(for: self).forEach { $0.isHighlighted.toggle() }
        
    }
    
    ///creates randomly arranged L shaped walls
    func makeRandomWalls() {
        
        walls[Sides.random(vertical: true)] = true
        walls[Sides.random(vertical: false)] = true
        
    }
    
    
    
}

extension SquareLogic : CustomStringConvertible {
    var description: String {
        return "(\(coordinate.x):\(coordinate.y))"
    }
}

extension SquareLogic : Identifiable, Hashable {
    
    
    //makes view iteration possible
    static func == (lhs: SquareLogic, rhs: SquareLogic) -> Bool {
        return lhs.id == rhs.id
    }
    
    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
}
