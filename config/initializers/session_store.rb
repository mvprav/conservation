# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_conservation_session',
  :secret      => '9e87c80a3bcb2d9774a3f404b5bb0315bf877bd6b7afb93a9a8ea30ad1181db5dd22e6ed52d5383ea2379e335573f36e3bf2b711771b20c0a8f129650dcefc05'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
