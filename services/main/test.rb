require 'rest-client'
require 'json'

# begin
# 	response = RestClient.post "http://localhost:3002?user_id=2", :content_type => 'application/json'
# 	require 'pry'
# 	binding.pry
# rescue => e
# 	require 'pry'
# 	binding.pry
# end


begin 
	response = RestClient.get "http://localhost:3002?user_id=3", :content_type => 'application/json'
	require 'pry'
	binding.pry
  rescue => e
	require 'pry'
	binding.pry
  end