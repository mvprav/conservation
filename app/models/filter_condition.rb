class FilterCondition
  @date_to=""
  @date_from=""
  def initialize(attr={})
    @location_id=attr["location_id"]||=""
    @category_id=attr["category_id"]||=""
    @date_from=attr["date_from"]||=""
    @date_to=attr["date_to"]||=""
  end

  def condition
    @condition={}
    if(!@location_id.empty?)
      @condition.merge!({:location_id=>@location_id})
    end
    if(!@category_id.empty?)
      @condition.merge!({:category_id=>@category_id})
    end
    if(!@date_from.empty? && !@date_to.empty?) 
      @condition.merge!({:incident_date=>Date.parse(@date_from)..Date.parse(@date_to)})
    end
    return @condition
  end
end
