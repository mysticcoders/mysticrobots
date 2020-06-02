//
//  Robot.swift
//  mysticrobots
//
//  Created by agora on 2020-05-25.
//  Copyright © 2020 SunnySystems. All rights reserved.
//

import SwiftUI

struct Robot : Comparable, Codable, Equatable {
    
    var color : RobotColor
    var square : SquareLogic?
    
    init(_ color: RobotColor) {
        self.color = color
    }
    
    enum CodingKeys : CodingKey {
        case color
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(color, forKey: .color)
    }
    
    static func == (lhs: Robot, rhs: Robot) -> Bool {
        return lhs.color == rhs.color
    }
    
    static func < (lhs: Robot, rhs: Robot) -> Bool {
        return lhs.color == rhs.color
    }
}
