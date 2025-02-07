CREATE DATABASE task_app_db;

CREATE TABLE user (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, mail VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);

INSERT INTO user (name, mail, password) VALUES ('Noé', 'example@mail.com', 'c0ntr453ñ4');
UPDATE user SET mail = 'example@email.dom' WHERE id=1;

CREATE TABLE task (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, status ENUM('pending', 'ongoing', 'completed', 'archived') DEFAULT 'pending', id_user INT NULL, priority ENUM('low', 'medium', 'high') DEFAULT 'medium', FOREIGN KEY (id_user) REFERENCES user(id) ON DELETE SET NULL);

INSERT INTO task (title, description, status, priority, id_user) VALUES ('task1', 'description task 1', 'pending', 'low', NULL), ('task2', 'description task 2', 'pending', 'medium', NULL), ('task3', 'description task 3', 'pending', 'high', NULL);