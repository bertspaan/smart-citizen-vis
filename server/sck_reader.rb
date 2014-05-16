class SCKReader

  SCK_HOST = 'http://smartcitizen.me'
  SCK_PATH = "/devices/view/%s.json"

  def http_get(connection, path)
    response = nil
    begin
      response = connection.get do |req|
        req.url path
        req.options[:timeout] = 30
        req.options[:open_timeout] = 15
      end
    rescue Exception => e
    end
    response
  end

  def get_data_as_feature(sensor_id)
    feature = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: []
      }
    }

    connection = Faraday.new(url: SCK_HOST) do |c|
      c.use Faraday::Request::UrlEncoded
      c.use Faraday::Adapter::NetHttp
    end

    resp = http_get(connection, SCK_PATH % [sensor_id])
    if resp and resp.status == 200
      content = resp.body.force_encoding("UTF-8").gsub!("\xEF\xBB\xBF".force_encoding("UTF-8"), '')
      h = JSON.parse(content, {symbolize_names: true})

      return nil if h == [] or not h

      properties = {}
      if h and h[:Device]
        properties = {
          title: h[:Device][:title],
          exposure: h[:Device][:exposure],
          position: h[:Device][:position],
          elevation: h[:Device][:elevation].to_f
        }
        feature[:geometry][:coordinates] = [
          h[:Device][:geo_long].gsub(/(\d+)\.(\d{6})\d+/, '\1.\2').to_f,
          h[:Device][:geo_lat].gsub(/(\d+)\.(\d{6})\d+/, '\1.\2').to_f
        ]
      end

      if h[:Feed]
        h[:Feed].each do |item|
          properties[:sensor_id] = sensor_id
          properties[:update] = item[:values].first[:t]

          value = item[:values].first[:y]
          case item[:key]
          when 'hum'
            properties[:humidity] = value
          when 'temp'
            properties[:temperature] = value
          when 'co'
            properties[:co] = value
          when 'no2'
            properties[:no2] = value
          when 'light'
            properties[:light] = value
          when 'noise'
            properties[:noise] = value
          when 'battery'
            properties[:battery] = value
          when 'nets'
            properties[:nets] = value
          end
        end
      end
      feature[:properties] = properties
    else
      return nil
    end
    feature
  end
end