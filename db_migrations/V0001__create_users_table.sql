CREATE TABLE t_p79854776_minecraft_hosting_so.users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  session_token VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);