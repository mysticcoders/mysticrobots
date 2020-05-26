//
//  BoardLogic.swift
//  mysticrobots
//
//  Created by agora on 2020-05-25.
//  Copyright © 2020 SunnySystems. All rights reserved.
//

import SwiftUI
import Combine

class BoardLogic : ObservableObject {
    
    @Published var gameLogic = GameLogic()
    
    @Published var grid : [[SquareLogic]]
    
    @Published var selectedRobot : Robot?
    
    var gameLogicObserver : AnyCancellable?
            
    func select(robot: Robot) {
        if let square = try? self.findRobot(robot.color) {
            self.selectedRobot = square.robot
            self.selectedRobot?.square = square
            highlightPath(directions: Sides.all, for: square)
        }
    }
    
    var height : Int = 16
    
    var lastIndex : Int {
        return grid.count-1
    }
    
    func findRobot(_ bot: RobotColor) throws -> SquareLogic  {
        
        if let square = allSquares().first(where: { $0.robot?.color == bot }) {
            return square
        } else {
            print("Robot is missing - not possible")
            throw LogicError.runtimeError("Robot is missing")
        }
    }
    
    init(height: Int) {
        
        grid = Array<[SquareLogic]>()
        self.height = height
        resetBoard()
        
        gameLogicObserver = gameLogic.objectWillChange.sink {
            self.objectWillChange.send()
        }
    }
    
    private func placeRobots() {
        
        for robotColor in RobotColor.allCases {
            let square = randomEmptySquare()
            var robot = Robot(robotColor)
            square.robot = robot
            robot.square = square
            //square.makeRandomWalls()
        }
        
    }
    
    private func placeGoal() {
        
        let square = randomEmptySquare()
        square.goal = Goal(RobotColor.random())
        square.makeRandomWalls()
        
    }
    
    private func placeWalls() {
        
        //outside border
        
        row(on: .north).forEach { $0.walls[.north] = true }
        row(on: .south).forEach { $0.walls[.south] = true }
        row(on: .east).forEach { $0.walls[.east] = true }
        row(on: .west).forEach { $0.walls[.west] = true }
        
        //two side walls on each border of the board: divide each row in half and add a random wall on each half, excluding corner and adjacent pieces
        
        let halfRanges = ((2...height/2-1),(height/2+2...height-3))
        
        row(on: .north)[halfRanges.0.randomElement()!].walls[.east] = true
        row(on: .north)[halfRanges.1.randomElement()!].walls[.west] = true
        
        row(on: .south)[halfRanges.0.randomElement()!].walls[.east] = true
        row(on: .south)[halfRanges.1.randomElement()!].walls[.west] = true
        
        row(on: .east)[halfRanges.0.randomElement()!].walls[.north] = true
        row(on: .east)[halfRanges.1.randomElement()!].walls[.south] = true
        
        row(on: .west)[halfRanges.0.randomElement()!].walls[.north] = true
        row(on: .west)[halfRanges.1.randomElement()!].walls[.south] = true
        
        
        //center thing
        let centerSquares : [BoardCoordinate] = [BoardCoordinate(x: grid.count/2-1, y: grid.count/2-1),
                                                 BoardCoordinate(x: grid.count/2-1, y: grid.count / 2),
                                                 BoardCoordinate(x: grid.count/2, y: grid.count / 2 - 1 ),
                                                 BoardCoordinate(x: grid.count/2, y: grid.count / 2 )]
        
        for coord in centerSquares {
            let square = squareAt(coord)
            square.walls[.east] = true
            square.walls[.west] = true
            square.walls[.south] = true
            square.walls[.north] = true
        }
        
        //random L walls, three per each quadrant seems to be good
        
        let firstQuadrant = randomRange().filter( { return $0.coordinate.x < height/2 && $0.coordinate.y < height/2 })
        let thirdQuadrant = randomRange().filter( { return $0.coordinate.x > height/2 && $0.coordinate.y < height/2 })
        let secondQuadrant = randomRange().filter( { return $0.coordinate.x < height/2 && $0.coordinate.y > height/2 })
        let fourthQuadrant = randomRange().filter( { return $0.coordinate.x > height/2 && $0.coordinate.y > height/2 })
        
        for quadrant in [firstQuadrant, secondQuadrant, thirdQuadrant, fourthQuadrant] {
            let numberOfWalledSquares = 3
            
            var chosenSquares : [SquareLogic] = []
            
            while chosenSquares.count < numberOfWalledSquares {
                let square = quadrant.randomElement()!
                let isGood = square.isEmpty && surroundingSquares(for: square).filter { !$0.isEmpty }.count == 0
                
                if isGood {
                    chosenSquares.append(square)
                    square.makeRandomWalls()
                }
            }
        }
    }
    
    func path(_ side: Sides, fromSquare: SquareLogic) -> [SquareLogic] {
        
        var fullPath : [SquareLogic] = []
        var possiblePath : [SquareLogic] = []
        
        guard let bot = fromSquare.robot else {
            print("path from non-robotic square, not accounted for...")
            return []
        }
        
        if !fromSquare.canLeave(to: side) {
            return []
        }
        
        switch side {
            case .east: fullPath = grid[fromSquare.coordinate.y].filter { $0.coordinate.x > fromSquare.coordinate.x }
            case .west: fullPath = grid[fromSquare.coordinate.y].filter { $0.coordinate.x < fromSquare.coordinate.x }.reversed()
            case .north: fullPath = squares(column: fromSquare.coordinate.x).filter { $0.coordinate.y < fromSquare.coordinate.y }.reversed()
            case .south: fullPath = squares(column: fromSquare.coordinate.x).filter { $0.coordinate.y > fromSquare.coordinate.y }
        }
                
        for square in fullPath {
            
            //if can move to nextSquare - add to path
            if square.canEnter(from: side.opposite) {
                
                if square.isGoal {
                    if square.canFinish(bot) {
                        possiblePath.append(square)
                        return possiblePath
                    } else {
                        return possiblePath
                    }
                } else {
                    possiblePath.append(square)
                }
                
            } else {
                return possiblePath
            }
            
            //if cannot leave current square, return finished path
            if !square.canLeave(to: side) {
                return possiblePath
            }
        }
        
        return possiblePath
    }
    
    func highlightOff() {
        self.allSquares().forEach( { $0.noHightlight() } )
    }
    
    func highlightPath(directions: [Sides], for square: SquareLogic) {
        
        highlightOff()
        
        let highlightColor : Color = square.isRobot ? square.robot!.color.color() : Color.white
        
        for direction in directions {
            self.path(direction, fromSquare: square).forEach { $0.hightlight(highlightColor) }
        }
        
    }
    
    func moveRobot(_ bot: RobotColor, _ direction: Sides) {
        do {
            let robotSquare = try findRobot(bot)
            let botPath = path(direction, fromSquare: robotSquare)
            if let destination = botPath.last {
                
                let move = Move(start: robotSquare.coordinate, end: destination.coordinate, direction: direction, bot: Robot(bot), date: Date())
                
                robotSquare.robot = nil
                destination.robot = Robot(bot)
                print("Moved robot from \(robotSquare.coordinate.stringValue()) to \(destination.coordinate.stringValue())")
                
                if destination.isGoal && destination.goal!.color == bot {
                    print("SUCCESS!! Level completed")
                    self.gameLogic.recordGoalMove(move)
                } else {
                    self.gameLogic.recordMove(move)
                }
                
                highlightOff()
            }
            
        } catch {
            print(error)
        }
        
    }
    
    func gridDescription() {
        
        grid.enumerated().forEach { rowIndex, row in
            row.enumerated().forEach { columnIndex, square in
                
                print("\(rowIndex):\(columnIndex) : \(square.walls.all.count) walls")
                
            }
        }
    }
}


/// Board Generators and accessors

extension BoardLogic {
    
    func resetBoard() {
        
        grid = Array<[SquareLogic]>()
        
        for rowIndex in 0...height-1 {
            var row = Array<SquareLogic>()
            for columnIndex in 0...height-1 {
                let square = SquareLogic(BoardCoordinate(x: columnIndex, y: rowIndex), boardLogic: self)
                row.append(square)
            }
            grid.append(row)
            
        }
        
        placeWalls()
        placeRobots()
        placeGoal()
        
        gameLogic.reset()
    }
    
    func squareAt(_ coordinate: BoardCoordinate) -> SquareLogic {
        return grid[coordinate.y][coordinate.x]
    }
    
    func randomEmptySquare() -> SquareLogic {
        var square : SquareLogic
        repeat {
            square = randomRange().randomElement()!
        } while surroundingSquares(for: square).filter { return $0.isEmpty && !$0.isGoal }.isEmpty
        return square
    }
    
    func allSquares() -> [SquareLogic] {
        return grid.flatMap { row in
            return row
        }
    }
    
    func squares(column: Int) -> [SquareLogic] {
        return grid.map { row in
            return row[column]
        }
    }
    
    private enum LogicError: Error {
        case runtimeError(String)
    }
    
    /// four center pieces + 1 surronding
    func isCenter(square: SquareLogic) -> Bool {
        let indexRangeCenter = height/2-2...height/2+1
        
        let centerRange = grid.flatMap { row in
            return row.filter { square in
                return indexRangeCenter.contains(square.coordinate.x) && indexRangeCenter.contains(square.coordinate.y)
            }
        }
        
        return centerRange.contains(square)
    }
    
    
    ///side rows on each side
    func row(on side: Sides) -> [SquareLogic] {
        switch side {
            case .east: return grid.map { row in return row.last! }
            case .west: return grid.map { row in return row.first! }
            case .north: return grid[0]
            case .south: return grid[lastIndex]
        }
    }
    
    ///all empty squares that can have random things (excludes 2 rows on each side, and three in the center)
    func randomRange() -> [SquareLogic] {
        let xBound = 1...height-2
        
        return grid.flatMap { row in
            return row.filter { square in return xBound.contains(square.coordinate.x) && xBound.contains(square.coordinate.y) && square.isEmpty && !isCenter(square: square) }
        }
    }
    
    func surroundingSquares(for square: SquareLogic) -> [SquareLogic] {
        let xRange = square.coordinate.x-1...square.coordinate.x+1
        let yRange = square.coordinate.y-1...square.coordinate.y+1
        
        let surroundingSquares : [SquareLogic] = squaresFor(xRange: xRange, yRange: yRange)
        
        return surroundingSquares.filter { $0 != square }
    }
    
    func squaresFor(xRange:ClosedRange<Int>, yRange: ClosedRange<Int>) -> [SquareLogic] {
        return grid.flatMap { row in
            return row.filter { square in
                return xRange.contains(square.coordinate.x) && yRange.contains(square.coordinate.y)
            }
        }
    }
    
}
