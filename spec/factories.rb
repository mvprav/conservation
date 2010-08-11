Factory.define :user do |user|
  user.name "praveen"
  user.email "a@a.com"
  user.password "password"
  user.password_confirmation "password"  
end

Factory.define :report do |report|
  report.title "some title"
  report.description "description"
  report.association :category
  report.association :location
  report.incident_date Date.today
end


Factory.define :category do |category|
  category.name "forest fire"
end

Factory.define :location do |location|
  location.name "nagarhole"
end
