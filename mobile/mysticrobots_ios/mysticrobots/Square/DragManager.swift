//
//  DragManager.swift
//  mysticrobots
//
//  Created by agora on 2020-06-01.
//  Copyright © 2020 SunnySystems. All rights reserved.
//

import Foundation
import SwiftUI

class DragManager {
    
    @GestureState private var isTapped = false
    @GestureState private var dragging = false
    
    let minimumSwipeDistance : CGFloat = 25
    
    var isDragging = false
    var direction : Sides = .east
    
    var onTouchDown : ()->()?
    var onSwipe : (_ direction: Sides)->()?
    
    init(onTouchDown : @escaping ()->(), onSwipe: @escaping (_ direction: Sides)->()) {
        self.onTouchDown = onTouchDown
        self.onSwipe = onSwipe
    }
    
    var dragGesture : some Gesture  {
        DragGesture(minimumDistance: 0)
            .onChanged { value in
                let direction = self.dragDirection(value: value)
                print("Drag: \(direction)")
        }
        .onEnded { value in
            self.direction = self.dragDirection(value: value)
            let trans = abs( self.direction.isHorizontal() ? value.translation.width : value.translation.height)
            
            if trans > self.minimumSwipeDistance {
                print("End Drag: \(self.direction)")
                self.onSwipe(self.direction)
            } else {
                print("Swipe too short: \(trans)")
            }
            
            self.isDragging = false

        }
        .updating($dragging) { (value, state, transaction) in
            if !self.isDragging {
                self.isDragging = true
                print("Start Drag: \(value.startLocation)")
                self.onTouchDown()
            }
        }
    }
    
    func dragDirection(value: DragGesture.Value) -> Sides {
        let horizontalDrag = value.location.x - value.startLocation.x
        let verticalDrag = value.location.y - value.startLocation.y
        
        if abs(horizontalDrag) > abs(verticalDrag) {
            return horizontalDrag > 0.0 ? .east : .west
        } else {
            return verticalDrag > 0.0 ? .south : .north
        }
    }
}
