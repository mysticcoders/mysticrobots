//
//  Solver.swift
//  mysticrobots
//
//  Created by agora on 2020-05-28.
//  Copyright © 2020 SunnySystems. All rights reserved.
//

import Foundation

class Node : Equatable {
    
    static func == (lhs: Node, rhs: Node) -> Bool {
        return lhs.square.coordinate == rhs.square.coordinate && lhs.enteredFrom == rhs.enteredFrom
    }
    
    var square: SquareLogic
    var children: [Node] = []
    weak var parent: Node?
    var enteredFrom : Sides?
    var step : Int = 0
    
    init(square: SquareLogic) {
        self.square = square
    }
    
    func add(child: Node) {
        children.append(child)
        child.parent = self
    }
}

extension Node: CustomStringConvertible {
    var description: String {
        var text = "\(square)"
        if !children.isEmpty {
            text += " {" + children.map { $0.description }.joined(separator: ", ") + "} "
        }
        return text
    }
}

class Solver {
    
    var board : BoardLogic
    
    var recursiveDepth : Int = 0
        
    init(_ board: BoardLogic) {
        self.board = board
    }

    
    func getChildrenOf(node: Node, excludeSide: Sides?, stopper: RobotColor, maxRecursions: Int = 100) -> [Node] {
        
        var children : [Node] = []
        
        var possibleDirections : [Sides] = Sides.all.filter { side in node.square.canLeave(to: side)  }
        
        if excludeSide != nil {
            possibleDirections.removeAll(where: { $0 == excludeSide!.opposite } )
        }
        
        for direction in possibleDirections {
            if let endSquare = board.path(direction, fromSquare: node.square, roboStop: false).last {
                let endNode = Node(square: endSquare)
                endNode.enteredFrom = direction.opposite
                node.add(child: endNode)
                
                if !children.contains(where:  { return $0 == endNode }) {
                    children.append(endNode)
                }
            }
        }
        
        for child in children {
            if child.square.isRobot && child.square.robot?.color == stopper {
                print("Found HIM!")
                return children
            } else {
                if recursiveDepth > maxRecursions {
                    print("Reached recursive depth for \(child)")
                    return children
                } else {
                    print("Getting children of \(node.square) : \(possibleDirections)")

                    recursiveDepth += 1
                   _ = getChildrenOf(node: child, excludeSide: child.enteredFrom?.opposite, stopper: stopper)
                }
                
            }
        }
        
        return children
    }
    
    func solution() -> Node {
        let goalSquare = try! board.findGoal()
        let goalColor = goalSquare.goal!.color
        let solvingRobotSquare = try! board.findRobot(goalColor)
        let solvingRobot = solvingRobotSquare.robot!
        
        let root = Node(square: goalSquare)
        
        _ = getChildrenOf(node: root, excludeSide: nil, stopper: solvingRobot.color)
        
        print(root)
        
        return root
        
//        let result : [SquareLogic] = root.children.compactMap { $0.square }
//
//        return result
        
    }
}
