# encoding: utf-8
require 'sinatra'

# configure do | sinatraApp |
#   set :environment, :production
#   if defined?(PhusionPassenger)
#     PhusionPassenger.on_event(:starting_worker_process) do |forked|
#       if forked
#         # We're in smart spawning mode.
#         #CitySDK_Services.memcache_new
#       end
#       # Else we're in direct spawning mode. We don't need to do anything.
#     end
#   end
# end

class SCK < Sinatra::Base

  @@memcached = Dalli::Client.new('127.0.0.1:11211', {expires_in: 3600, compress: true, namespace: 'sck'})

  scheduler = Rufus::Scheduler.new
  sensor_ids = JSON.parse(File.open('sensor_ids.json').read)

  scheduler.every '10m', first_in: 1 do
    sensor_ids.each do |sensor_id|
      puts "Now reading sensor #{sensor_id}..."
      r = SCKReader.new
      feature = r.get_data_as_feature sensor_id
      success = feature ? 'Data received!' : 'No data received..'
      puts "   #{success}"
      SCK.write_feature_to_cache sensor_id, feature if feature
    end
  end

  def self.write_feature_to_cache(sensor_id, feature)
    @@memcached.set(sensor_id, feature) if feature
  end

  def self.read_feature_from_cache(sensor_id)
    @@memcached.get(sensor_id)
  end

  after do
    content_type 'application/json'
  end

  get '/' do
    {
      type: "FeatureCollection",
      features: sensor_ids.map { |sensor_id| SCK.read_feature_from_cache sensor_id }.delete_if { |feature| not feature }
    }.to_json
  end

end


