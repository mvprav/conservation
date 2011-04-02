Factory.sequence(:email){|n| "a#{n}@a.com"}

Factory.define :user do |user|
  user.name "praveen"
  user.firstname "mvp"
  user.address :address
  user.city :Bangalore
  user.country :India
  user.phone_number "1231231231"
  user.postal_code "560001"
  user.email {Factory.next(:email)}
  user.password "password"
  user.password_confirmation "password"  
end

Factory.define :report do |report|
  report.title "some title"
  report.description "description"
  report.association :category
  report.association :location
  report.incident_date Date.today
  report.association :user
  report.lat '1.2'
  report.lng '1.3'
end


Factory.define :category do |category|
  category.name "forest fire"
end

Factory.define :location do |location|
  location.name "nagarhole"
end
