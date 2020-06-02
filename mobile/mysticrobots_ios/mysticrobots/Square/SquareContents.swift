//
//  SquareContents.swift
//  mysticrobots
//
//  Created by agora on 2020-05-22.
//  Copyright © 2020 SunnySystems. All rights reserved.
//

import Foundation
import SwiftUI

enum Sides : Int, CustomStringConvertible, Codable {
    case east, west, north, south
    
    func isVertical() -> Bool {
        return self == .north || self == .south
    }
    
    func isHorizontal() -> Bool {
        return self == .east || self == .west
    }
    
    static var all : [Sides] {
        return [.east, .west, .north, .south]
    }
    
    static func random(vertical: Bool) -> Sides {
        if vertical {
            return [Sides.north, Sides.south].randomElement()!
        } else {
            return [Sides.east, Sides.west].randomElement()!
        }
    }
    
    var opposite : Sides {
        switch self {
            case .east: return .west
            case .west: return .east
            case .north: return .south
            case .south: return .north
        }
    }
    
    var description: String {
        switch self {
            case .east: return "East"
            case .west: return "West"
            case .north: return "North"
            case .south: return "South"
        }
    }
}

struct WallView : View, Hashable {
    
    static func == (lhs: WallView, rhs: WallView) -> Bool {
        return lhs.id == rhs.id
    }
    
    let id = UUID()
    var edge : Edge
    
    var body : some View {
        ZStack {
            EdgeBorder(width: 2, edge: edge).foregroundColor(Color.black)
        }
    }
}

struct GoalView : View, Hashable {
    
    let id = UUID()
    let color : RobotColor
    
    var body : some View {
        ZStack {
            Image("star").resizable().padding(3).foregroundColor(color.color()).shadow(color: Color.black.opacity(0.4), radius: 3, x: 0, y: 0)
        }
    }
    
    static func == (lhs: GoalView, rhs: GoalView) -> Bool {
        return lhs.id == rhs.id
    }
    
    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
}

enum RobotColor : Int, CaseIterable, Codable {
    case green, red, blue, yellow
    
    static func random() -> RobotColor {
        return RobotColor.allCases.randomElement()!
    }
    
    func color() -> Color {
        switch self {
            case .green: return Color.Mystic.green
            case .red:  return Color.Mystic.red
            case .blue: return Color.Mystic.blue
            case .yellow: return Color.Mystic.yellow
        }
    }
}

struct RobotView : View, Hashable {
    
    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
    
    let id = UUID()
    let robot : Robot
    
    var body : some View {
        ZStack {
            Image("robot").resizable().foregroundColor(robot.color.color()).padding(3).shadow(color: Color.black.opacity(0.4), radius: 5, x: 1, y: 1)
        }
    }
    
    static func == (lhs: RobotView, rhs: RobotView) -> Bool {
        return lhs.id == rhs.id
    }
}


struct EdgeBorder: Shape, Hashable {
    
    let id = UUID()
    
    var width: CGFloat
    var edge: Edge
    
    func path(in rect: CGRect) -> Path {
        var x: CGFloat {
            switch edge {
                case .top, .bottom, .leading: return rect.minX
                case .trailing: return rect.maxX - width
            }
        }
        
        var y: CGFloat {
            switch edge {
                case .top, .leading, .trailing: return rect.minY
                case .bottom: return rect.maxY - width
            }
        }
        
        var w: CGFloat {
            switch edge {
                case .top, .bottom: return rect.width
                case .leading, .trailing: return self.width
            }
        }
        
        var h: CGFloat {
            switch edge {
                case .top, .bottom: return self.width
                case .leading, .trailing: return rect.height
            }
        }
        
        return Path( CGRect(x: x, y: y, width: w, height: h) )
    }
}

extension View {
    func border(width: CGFloat, edge: Edge, color: Color) -> some View {
        ZStack {
            self
            EdgeBorder(width: width, edge: edge).foregroundColor(color)
        }
    }
}
