//
//  GameView.swift
//  mysticrobots
//
//  Created by agora on 2020-05-26.
//  Copyright © 2020 SunnySystems. All rights reserved.
//

import SwiftUI

struct GameView : View {
        
    //@ObservedObject var boardLogic : BoardLogic = BoardLogic(height: 16)
    @ObservedObject var gameLogic : GameLogic = GameLogic()
    
    init() {
        //boardLogic.gameLogic = gameLogic
        gameLogic.startNewBoard()
    }
    
    var isDragging = false
    
    @GestureState private var dragging = false
    @GestureState private var isTapped = false

    var body : some View {
        
        GeometryReader { geo in
            
            ZStack {
                Color.black.edgesIgnoringSafeArea(.all)
                
                VStack(alignment: .leading, spacing: 2) {
                    
                    VStack {
                        HStack {
                            
                            Button(action: {
                                self.gameLogic.restart()
                            }) {
                                Image(systemName: "arrow.clockwise.circle.fill").font(.system(size: 60)).foregroundColor(.white)
                            }.padding(.trailing, 20)
                            
                            Spacer()
                            Text(self.gameLogic.elapsedTime.stringFormatted()).foregroundColor(.white).font(.system(size: 30))
                            Spacer()
                            
                            Button(action: {
                                self.gameLogic.startNewBoard()
                            }) {
                                Image(systemName: "shuffle").font(.system(size: 30)).foregroundColor(.white)
                            }
                            
                            
                        }.padding()
                        
                        VStack {
                            HStack {
                                ScrollView(.horizontal, showsIndicators: false) {
                                    HStack(alignment: .top, spacing: 0) {
                                        ForEach(self.gameLogic.moveViews().reversed(), id: \.self) { moveView in
                                            moveView.padding(.all, 5)
                                        }
                                    }
                                }
                                
                                if self.gameLogic.moves.count > 0 {
                                    Text("\(self.gameLogic.moves.count)").foregroundColor(.white).font(.system(size: 20)).padding(.trailing, 20)
                                }
                            }.frame(minHeight: 30)
                        }
                        
                        
                    }.alert(isPresented: self.$gameLogic.solved) {
                        let alert = Alert(title: Text("Great job!"), message: Text("Level complete in \(self.gameLogic.moves.count) moves and it took you \(self.gameLogic.elapsedTime.stringFromTimeInterval()) and \(self.gameLogic.attempts) attempts"), dismissButton: .default(Text("OK"), action: {
                            self.gameLogic.startNewBoard()
                        }))
                        return alert
                    }
                    
                    BoardView(boardLogic: self.gameLogic.boardLogic)
                    
                    HStack {
                        RobotButton(color: .red, isSelected: self.gameLogic.boardLogic.selectedRobot == Robot(.red))
                            .gesture(DragGesture(minimumDistance: 0).updating(self.$isTapped, body: { (_, isTapped, _) in
                                self.gameLogic.boardLogic.select(robot: Robot(.red))
                            }))
                            .simultaneousGesture(self.dragGesture)
                        
                        RobotButton(color: .green, isSelected: (self.gameLogic.boardLogic.selectedRobot == Robot(.green)))
                            .gesture(DragGesture(minimumDistance: 0).updating(self.$isTapped, body: { (_, isTapped, _) in
                                self.gameLogic.boardLogic.select(robot: Robot(.green))
                            }))
                            .simultaneousGesture(self.dragGesture)
                        
                        RobotButton(color: .blue, isSelected: self.gameLogic.boardLogic.selectedRobot == Robot(.blue))                          .gesture(DragGesture(minimumDistance: 0).updating(self.$isTapped, body: { (_, isTapped, _) in
                            self.gameLogic.boardLogic.select(robot: Robot(.blue))
                        }))
                            .simultaneousGesture(self.dragGesture)
                        
                        
                        RobotButton(color: .yellow, isSelected: self.gameLogic.boardLogic.selectedRobot == Robot(.yellow))                         .gesture(DragGesture(minimumDistance: 0).updating(self.$isTapped, body: { (_, isTapped, _) in
                            self.gameLogic.boardLogic.select(robot: Robot(.yellow))
                        }))
                            .simultaneousGesture(self.dragGesture)
                        
                        
                        
                        }.padding(.top, 0).padding(.bottom, 20)
                    
                   
                }
            }
        }
    }
    
    // Dragging functions
    
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
                if let bot = self.gameLogic.boardLogic.selectedRobot?.color {
                    let square = try! self.gameLogic.boardLogic.findRobot(bot)
                    
                    self.gameLogic.boardLogic.highlightPath(directions: [direction], for: square)
                }
                
                //print(direction)
        }
        .onEnded { value in
            let direction = self.dragDirection(value: value)
            if let bot = self.gameLogic.boardLogic.selectedRobot?.color {
                self.gameLogic.boardLogic.moveRobot(bot, direction)
            }
            //print(direction)
        }
        .updating($dragging) { (value, state, transaction) in
            //print("\(state) \(transaction)")
        }
    }
}

struct GameView_Previews: PreviewProvider {
    static var previews: some View {
        GameView()
    }
}
