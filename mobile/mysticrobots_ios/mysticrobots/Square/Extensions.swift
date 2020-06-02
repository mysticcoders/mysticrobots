//
//  Extensions.swift
//  mysticrobots
//
//  Created by agora on 2020-05-25.
//  Copyright © 2020 SunnySystems. All rights reserved.
//

import Foundation
import SwiftUI

extension TimeInterval {
    func stringFormatted() -> String {
        //let ms = Int(self.truncatingRemainder(dividingBy: 1) * 1000)
        let formatter = DateComponentsFormatter()
        formatter.allowedUnits = [.minute, .second]
        formatter.unitsStyle = .positional
        formatter.zeroFormattingBehavior = .pad
        
        return formatter.string(from: self)! // + ".\(ms)"
    }

}

extension Color {
    struct Mystic {
        static var yellow : Color {
            return Color(red: 1, green: 1, blue: 0)
        }
        static var red : Color {
            return Color(red: 1, green: 0, blue: 0)
        }
        static var green : Color {
            return Color(red: 0, green: 128/255, blue: 0)
        }
        static var blue : Color {
            return Color(red: 0, green: 0, blue: 1.0)
        }
        static var boardBackground : Color {
            return Color(red: 226/255, green: 206/255, blue: 170/255)
        }

    }
}

extension TimeInterval{
    
    func stringFromTimeInterval() -> String {
        
        let time = NSInteger(self)
        
        let seconds = time % 60
        let minutes = (time / 60) % 60
        let hours = (time / 3600)
        
        var formatString = ""
        if hours == 0 {
            if minutes == 0 {
                return String(format: "%0.2d seconds", seconds)
            } else {
                if(minutes < 10) {
                    formatString = "%2d:%0.2d"
                }else {
                    formatString = "%0.2d:%0.2d"
                }
                
                return String(format: formatString,minutes,seconds)

            }
            
        } else {
            formatString = "%2d:%0.2d:%0.2d"
            return String(format: formatString,hours,minutes,seconds)
        }
    }
}
