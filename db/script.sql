CREATE TABLE person (
    id INT IDENTITY PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    birth_date DATE NULL,
    creation_date DATE NOT NULL DEFAULT GETDATE(),
    change_date DATE NOT NULL DEFAULT GETDATE(),
)

CREATE TABLE bin_person (
    id INT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    birth_date DATE NULL,
    creation_date DATE NOT NULL,
    change_date DATE NOT NULL DEFAULT GETDATE(),
    deactivation_date DATE NOT NULL DEFAULT GETDATE(),
)

CREATE TABLE student (
    id INT PRIMARY KEY FOREIGN KEY REFERENCES person(id),
    register_code CHAR(10) NOT NULL,
    creation_date DATE NOT NULL DEFAULT GETDATE(),
    change_date DATE NOT NULL DEFAULT GETDATE(),
)


CREATE TABLE bin_student (
    id INT PRIMARY KEY,
    register_code CHAR(10) NOT NULL,
    creation_date DATE NOT NULL DEFAULT GETDATE(),
    change_date DATE NOT NULL DEFAULT GETDATE(),
    deactivation_date DATE NOT NULL DEFAULT GETDATE(),
)

CREATE TABLE school_class (
    id INT IDENTITY PRIMARY KEY,
    name varchar(100) NOT NULL,
    creation_date DATE NOT NULL DEFAULT GETDATE(),
    change_date DATE NOT NULL DEFAULT GETDATE(),
)

CREATE TABLE bin_school_class (
    id INT PRIMARY KEY,
    name varchar(100) NOT NULL,
    creation_date DATE NOT NULL DEFAULT GETDATE(),
    change_date DATE NOT NULL DEFAULT GETDATE(),
    deactivation_date DATE NOT NULL DEFAULT GETDATE(),
)

CREATE TABLE teacher (
    id INT PRIMARY KEY FOREIGN KEY REFERENCES person(id),
    graduation VARCHAR(200) NOT NULL,
    creation_date DATE NOT NULL DEFAULT GETDATE(),
    change_date DATE NOT NULL DEFAULT GETDATE(),
)

CREATE TABLE bin_teacher (
    id INT PRIMARY KEY,
    graduation VARCHAR(200) NOT NULL,
    creation_date DATE NOT NULL DEFAULT GETDATE(),
    change_date DATE NOT NULL DEFAULT GETDATE(),
    deactivation_date DATE NOT NULL DEFAULT GETDATE(),
)

CREATE TABLE discipline (
    id INT IDENTITY PRIMARY KEY,
    name varchar(100) NOT NULL,
    teacher_id INT NOT NULL FOREIGN KEY REFERENCES teacher(id),
    creation_date DATE NOT NULL DEFAULT GETDATE(),
    change_date DATE NOT NULL DEFAULT GETDATE(),
)

CREATE TABLE bin_discipline (
    id INT PRIMARY KEY,
    name varchar(100) NOT NULL,
    teacher_id INT NOT NULL,
    creation_date DATE NOT NULL DEFAULT GETDATE(),
    change_date DATE NOT NULL DEFAULT GETDATE(),
    deactivation_date DATE NOT NULL DEFAULT GETDATE(),
)

CREATE TABLE studyloads (
    discipline_id INT NOT NULL FOREIGN KEY REFERENCES discipline(id),
    school_class_id INT NOT NULL FOREIGN KEY REFERENCES school_class(id),
    PRIMARY KEY (discipline_id, school_class_id),
    creation_date DATE NOT NULL DEFAULT GETDATE(),
)


CREATE TABLE bin_studyloads (
    discipline_id INT NOT NULL,
    school_class_id INT NOT NULL,
    PRIMARY KEY (discipline_id, school_class_id),
    creation_date DATE NOT NULL DEFAULT GETDATE(),
    deactivation_date DATE NOT NULL DEFAULT GETDATE(),
)
