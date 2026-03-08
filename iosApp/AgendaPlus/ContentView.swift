import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack(spacing: 16) {
            Text("AgendaPlus iOS")
                .font(.largeTitle)
                .padding(.top, 40)

            Text("This is a scaffold. Run pod install on macOS to integrate the KMM shared module.")
                .multilineTextAlignment(.center)
                .padding()

            Spacer()
        }
        .padding()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
