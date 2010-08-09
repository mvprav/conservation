Factory.define :user do |user|
  user.name "praveen"
  user.email "a@a.com"
  user.password "password"
  user.password_confirmation "password"  
end

Factory.define :report do |report|
  report.title "some title"
  report.description "description"
end
