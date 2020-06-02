//
//  RobotButton.swift
//  mysticrobots
//
//  Created by agora on 2020-05-25.
//  Copyright © 2020 SunnySystems. All rights reserved.
//

import SwiftUI

struct RobotButton : View {
    
    @State var color : RobotColor
    @State var isSelected : Bool = false
    
    var body : some View {
        ZStack {
            Image("robot").resizable().scaledToFit()
                .foregroundColor(color.color())
                .shadow(color: isSelected ? .white : .clear, radius: 20, x: 0, y: 0)
        }
    }
    
}

struct RobotButton_Previews: PreviewProvider {
    static var previews: some View {
        RobotButton(color: .green)
    }
}
