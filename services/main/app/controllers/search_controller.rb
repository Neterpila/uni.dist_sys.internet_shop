class SearchController < ActionController::Base
    def index
        @results = get_results
    end

    private

    def get_results
        [
        OpenStruct.new(id: 1, name: "Cegła (szt.)", category: "Materiały budowlane", quantity: 10, price: 10),
         OpenStruct.new(id: 2, name: "NVIDIA RTX 3090Ti", category: "Elektronika", quantity: 15, price: 20),
         OpenStruct.new(id: 3, name: "Zestaw Lego Rynek Glówny", category: "Rozrywka", quantity: 13, price: 15),
         OpenStruct.new(id: 4, name: "Captain Morgan Spiced Gold", category: "Alkohole", quantity: 1, price: 12)
        ]
    end
end