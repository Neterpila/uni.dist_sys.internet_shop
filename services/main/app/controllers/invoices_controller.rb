class InvoicesController < ActionController::Base
	def show
		send_data (RestClient.get "http://localhost:3000/invoice/25").body, disposition: 'attachment', filename: "Faktura"
	end
end
