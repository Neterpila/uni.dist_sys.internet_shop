class SearchController < ActionController::Base
    def index
        @search = OpenStruct.new(name: "a", email: "b", password: "p",password_confirmation: "c")
    end

    def show
    end
end