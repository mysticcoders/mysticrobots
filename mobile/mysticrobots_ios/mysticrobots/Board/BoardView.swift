//
//  Board.swift
//  mysticrobots
//
//  Created by agora on 2020-05-22.
//  Copyright © 2020 SunnySystems. All rights reserved.
//

import SwiftUI

struct BoardView: View {
    
    @Binding var boardLogic : BoardLogic
    
    private func squareHeightFor(view size: CGSize) -> CGFloat {
        return CGFloat((size.width - CGFloat(boardLogic.grid.count * 2)) / CGFloat(boardLogic.grid.count) )
    }
    
    var body: some View {
        GeometryReader { geo in

        ZStack {
            Color.black.edgesIgnoringSafeArea(.all)

            VStack(alignment: .center, spacing: 2) {
                ForEach(self.boardLogic.grid, id: \.self) { row in
                    HStack(alignment: .top, spacing: 2) {
                        ForEach(row, id: \.id) { square in
                            Square(logic: square).frame(width: self.squareHeightFor(view: geo.size), height: self.squareHeightFor(view: geo.size), alignment: .center)
                                .padding(.all, 0)
                        }
                    }
                }
            }
        }
        }
    }
}

#if DEBUG
struct BoardView_Previews: PreviewProvider {
    static var previews: some View {
        BoardView(boardLogic: .constant(BoardLogic(height: 16)))
    }
}
#endif
