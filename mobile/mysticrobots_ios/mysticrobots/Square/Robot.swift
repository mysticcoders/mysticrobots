//
//  Robot.swift
//  mysticrobots
//
//  Created by agora on 2020-05-25.
//  Copyright © 2020 SunnySystems. All rights reserved.
//

import SwiftUI

struct Robot : Comparable {
    
    var color : RobotColor
    var square : SquareLogic?
    
    init(_ color: RobotColor) {
        self.color = color
    }
    
    static func < (lhs: Robot, rhs: Robot) -> Bool {
        return lhs.color == rhs.color
    }
}
