class InvoicesController < ActionController::Base
	def show
		begin
			@response = RestClient.get "http://localhost:3000/invoice/#{order_id}"
		rescue => e
			flash[:danger] = "Nie udało się pobrać faktury"
			redirect_to "/payments/#{order_id}" and return
		end
		send_data @response.body, disposition: 'attachment', filename: "Faktura"
	end

	def order_id
		params["id"]
	end
end
