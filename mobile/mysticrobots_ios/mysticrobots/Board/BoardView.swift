//
//  Board.swift
//  mysticrobots
//
//  Created by agora on 2020-05-22.
//  Copyright © 2020 SunnySystems. All rights reserved.
//

import SwiftUI

struct BoardView: View {
    var body: some View {
        ZStack {
            Color.black.edgesIgnoringSafeArea(.all)
            Board()
        }
    }
}

struct Board : View {
    
    @ObservedObject var boardLogic = BoardLogic(height: 16)
        
    private func squareHeightFor(view size: CGSize) -> CGFloat {
        return CGFloat((size.width - CGFloat(boardLogic.grid.count * 2)) / CGFloat(boardLogic.grid.count) )
    }
    
    private var isDragging = false
    
    func dragDirection(value: DragGesture.Value) -> Sides {
        let horizontalDrag = value.location.x - value.startLocation.x
        let verticalDrag = value.location.y - value.startLocation.y
        
        if abs(horizontalDrag) > abs(verticalDrag) {
            return horizontalDrag > 0.0 ? .east : .west
        } else {
            return verticalDrag > 0.0 ? .south : .north
        }
    }

    var dragGesture : some Gesture  {
        DragGesture()
            .onChanged { value in
                let direction = self.dragDirection(value: value)
                if let bot = self.boardLogic.selectedRobot?.color {
                    let square = try! self.boardLogic.findRobot(bot)
                    
                    self.boardLogic.highlightPath(directions: [direction], for: square)
                }
                
                //print(direction)
        }
        .onEnded { value in
            let direction = self.dragDirection(value: value)
            if let bot = self.boardLogic.selectedRobot?.color {
                self.boardLogic.moveRobot(bot, direction)
            }
            //print(direction)
        }
        .updating($dragging) { (value, state, transaction) in
            //print("\(state) \(transaction)")
        }
    }
    @GestureState private var dragging = false
    @GestureState private var isTapped = false
        
    
    var body : some View {
        
        GeometryReader { geo in
            
            ZStack {
                Color.black.edgesIgnoringSafeArea(.all)
                
                VStack(alignment: .leading, spacing: 2) {
                    
                    VStack {
                        HStack {
                            Text(self.boardLogic.gameLogic.elapsedTime.stringFormatted()).foregroundColor(.white).font(.system(size: 30))
                            Spacer()

                            Text("Moves: \(self.boardLogic.gameLogic.moves.count)").foregroundColor(.white).font(.system(size: 30))
                        }.padding()
                        
                        ScrollView(.horizontal, showsIndicators: true) {
                            HStack {
                                ForEach(self.boardLogic.gameLogic.moveViews(), id: \.self) { moveView in
                                    moveView
                                }
                            }
                        }
                        
                    }
                    
                    Spacer()

                    Group {
                        ForEach(self.boardLogic.grid, id: \.self) { row in
                            HStack(alignment: .top, spacing: 2) {
                                ForEach(row, id: \.id) { square in
                                    Square(logic: square).frame(width: self.squareHeightFor(view: geo.size), height: self.squareHeightFor(view: geo.size), alignment: .center)
                                        .padding(.all, 0)
                                }
                            }
                        }
                    }
                    
                    HStack {
                        RobotButton(color: .red, isSelected: self.boardLogic.selectedRobot == Robot(.red))
                            .gesture(DragGesture(minimumDistance: 0).updating(self.$isTapped, body: { (_, isTapped, _) in
                                self.boardLogic.select(robot: Robot(.red))
                            }))
                            .simultaneousGesture(self.dragGesture)
                    
                        RobotButton(color: .green, isSelected: self.boardLogic.selectedRobot == Robot(.green))
                            .gesture(DragGesture(minimumDistance: 0).updating(self.$isTapped, body: { (_, isTapped, _) in
                                self.boardLogic.select(robot: Robot(.green))
                            }))
                            .simultaneousGesture(self.dragGesture)
                        
                        RobotButton(color: .blue, isSelected: self.boardLogic.selectedRobot == Robot(.blue))                          .gesture(DragGesture(minimumDistance: 0).updating(self.$isTapped, body: { (_, isTapped, _) in
                            self.boardLogic.select(robot: Robot(.blue))
                        }))
                            .simultaneousGesture(self.dragGesture)

                        
                        RobotButton(color: .yellow, isSelected: self.boardLogic.selectedRobot == Robot(.yellow))                         .gesture(DragGesture(minimumDistance: 0).updating(self.$isTapped, body: { (_, isTapped, _) in
                            self.boardLogic.select(robot: Robot(.yellow))
                        }))
                            .simultaneousGesture(self.dragGesture)

                       

                    }.padding()
                    
                    Spacer()
                    
                    HStack {
                        Spacer()
                        Button(action: {
                            self.boardLogic.resetBoard()
                        }) {
                            Image(systemName: "arrow.clockwise.circle.fill").font(.system(size: 60)).foregroundColor(.white)
                        }
                        Spacer()

                    }
                }
            }
        }
    }
}

#if DEBUG
struct BoardView_Previews: PreviewProvider {
    static var previews: some View {
        BoardView()
    }
}
#endif
