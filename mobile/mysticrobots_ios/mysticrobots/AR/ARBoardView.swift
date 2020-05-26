//
//  ContentView.swift
//  mysticrobots
//
//  Created by agora on 2020-05-19.
//  Copyright © 2020 SunnySystems. All rights reserved.
//

import SwiftUI
import RealityKit

struct ARBoardView : View {
    var body: some View {
        return ARViewContainer().edgesIgnoringSafeArea(.all)
    }
}

struct ARViewContainer: UIViewRepresentable {
    
    func makeUIView(context: Context) -> ARView {
        
        let arView = ARView(frame: .zero)
        
        // Load the "Box" scene from the "Experience" Reality File
        let boxAnchor = try! Experience.loadBoard()
        
        // Add the box anchor to the scene
        arView.scene.anchors.append(boxAnchor)
        
        return arView
        
    }
    
    func updateUIView(_ uiView: ARView, context: Context) {}
    
}

#if DEBUG
struct ARBoardView_Previews : PreviewProvider {
    static var previews: some View {
        ARBoardView()
    }
}
#endif
