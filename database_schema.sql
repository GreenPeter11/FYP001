-- =================================================================
-- FYP ResearchHub Database Schema (PostgreSQL for Neon)
-- A single, idempotent script to create the entire database.
-- =================================================================

-- =====================================================
-- CREATE CUSTOM ENUM TYPES
-- =====================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'school_type') THEN
        CREATE TYPE school_type AS ENUM('SABE', 'SMG', 'SoE', 'SoICT', 'SoS');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM('student', 'admin', 'supervisor');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
        CREATE TYPE project_status AS ENUM('pending', 'approved', 'rejected', 'under_review');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vote_type_enum') THEN
        CREATE TYPE vote_type_enum AS ENUM('upvote', 'downvote');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
        CREATE TYPE notification_type AS ENUM('info', 'success', 'warning', 'error');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_action_type') THEN
        CREATE TYPE admin_action_type AS ENUM('project_approval', 'project_rejection', 'user_ban', 'user_unban', 'question_moderation', 'answer_moderation');
    END IF;
END$$;


-- =====================================================
-- CORE TABLES (Users, Projects, Q&A)
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    school school_type NOT NULL,
    department VARCHAR(50),
    role user_role DEFAULT 'student',
    profile_picture VARCHAR(255),
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_student_id ON users (student_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);

CREATE TABLE IF NOT EXISTS projects (
    project_id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    abstract TEXT NOT NULL,
    full_description TEXT,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    school school_type NOT NULL,
    department VARCHAR(50) NOT NULL,
    submission_year INT NOT NULL,
    keywords TEXT,
    supervisor_names TEXT,
    team_members TEXT,
    project_file_path VARCHAR(500),
    project_file_size INT,
    status project_status DEFAULT 'pending',
    views_count INT DEFAULT 0,
    downloads_count INT DEFAULT 0,
    rating_average DECIMAL(3,2) DEFAULT 0.00,
    rating_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by INT REFERENCES users(user_id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects (user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects (status);
CREATE INDEX IF NOT EXISTS idx_projects_school_year ON projects (school, submission_year);

CREATE TABLE IF NOT EXISTS questions (
    question_id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    school school_type,
    tags TEXT,
    views_count INT DEFAULT 0,
    answers_count INT DEFAULT 0,
    votes_count INT DEFAULT 0,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_questions_user_id ON questions (user_id);

CREATE TABLE IF NOT EXISTS answers (
    answer_id SERIAL PRIMARY KEY,
    question_id INT NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    votes_count INT DEFAULT 0,
    is_accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers (question_id);
CREATE INDEX IF NOT EXISTS idx_answers_user_id ON answers (user_id);


-- =====================================================
-- ACTIVITY & ENGAGEMENT TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS project_ratings (
    rating_id SERIAL PRIMARY KEY,
    project_id INT NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (project_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_project_ratings_project_id ON project_ratings (project_id);
CREATE INDEX IF NOT EXISTS idx_project_ratings_user_id ON project_ratings (user_id);

CREATE TABLE IF NOT EXISTS project_views (
    view_id SERIAL PRIMARY KEY,
    project_id INT NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_project_views_project_id ON project_views (project_id);

CREATE TABLE IF NOT EXISTS project_downloads (
    download_id SERIAL PRIMARY KEY,
    project_id INT NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_project_downloads_project_id ON project_downloads (project_id);

CREATE TABLE IF NOT EXISTS question_votes (
    vote_id SERIAL PRIMARY KEY,
    question_id INT NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    vote_type vote_type_enum NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (question_id, user_id)
);

CREATE TABLE IF NOT EXISTS answer_votes (
    vote_id SERIAL PRIMARY KEY,
    answer_id INT NOT NULL REFERENCES answers(answer_id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    vote_type vote_type_enum NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (answer_id, user_id)
);

CREATE TABLE IF NOT EXISTS bookmarks (
    bookmark_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    project_id INT REFERENCES projects(project_id) ON DELETE CASCADE,
    question_id INT REFERENCES questions(question_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, project_id),
    UNIQUE (user_id, question_id)
);


-- =====================================================
-- ADMIN & NOTIFICATION TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type notification_type DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    related_project_id INT REFERENCES projects(project_id) ON DELETE CASCADE,
    related_question_id INT REFERENCES questions(question_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications (user_id);

CREATE TABLE IF NOT EXISTS admin_actions (
    action_id SERIAL PRIMARY KEY,
    admin_user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    action_type admin_action_type NOT NULL,
    target_user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    target_project_id INT REFERENCES projects(project_id) ON DELETE SET NULL,
    target_question_id INT REFERENCES questions(question_id) ON DELETE SET NULL,
    target_answer_id INT REFERENCES answers(answer_id) ON DELETE SET NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_user_id ON admin_actions (admin_user_id);


-- =====================================================
-- SESSIONS & AUTHENTICATION
-- =====================================================
CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions (user_id);

CREATE TABLE IF NOT EXISTS password_resets (
    reset_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets (token);


-- =====================================================
-- INSERT DEFAULT ADMIN USER
-- =====================================================
INSERT INTO users (full_name, email, student_id, password_hash, school, department, role) 
VALUES ('Admin User', 'admin@fyp.com', 'ADMIN001', 'your_hashed_password', 'SoICT', 'CS', 'admin')
ON CONFLICT (email) DO NOTHING;


-- =====================================================
-- CREATE VIEWS FOR REPORTING
-- =====================================================

CREATE OR REPLACE VIEW project_stats AS
SELECT 
    p.project_id,
    p.title,
    u.full_name as author_name,
    p.school,
    p.department,
    p.submission_year,
    p.status,
    p.views_count,
    p.downloads_count,
    p.rating_average,
    p.rating_count,
    p.created_at
FROM projects p
JOIN users u ON p.user_id = u.user_id;

CREATE OR REPLACE VIEW user_stats AS
SELECT 
    u.user_id,
    u.full_name,
    u.email,
    u.school,
    u.department,
    COUNT(DISTINCT p.project_id) as total_projects,
    SUM(p.views_count) as total_views,
    SUM(p.downloads_count) as total_downloads,
    AVG(p.rating_average) as avg_rating,
    COUNT(DISTINCT q.question_id) as total_questions,
    COUNT(DISTINCT a.answer_id) as total_answers
FROM users u
LEFT JOIN projects p ON u.user_id = p.user_id
LEFT JOIN questions q ON u.user_id = q.user_id
LEFT JOIN answers a ON u.user_id = a.user_id
GROUP BY u.user_id;

CREATE OR REPLACE VIEW leaderboard_data AS
SELECT 
    u.user_id,
    u.full_name,
    u.school,
    u.department,
    COUNT(DISTINCT p.project_id) as project_count,
    SUM(p.views_count) as total_views,
    SUM(p.downloads_count) as total_downloads,
    AVG(p.rating_average) as avg_rating,
    COUNT(DISTINCT q.question_id) as question_count,
    COUNT(DISTINCT a.answer_id) as answer_count,
    (
        COALESCE(COUNT(DISTINCT p.project_id), 0) * 10 + 
        COALESCE(SUM(p.views_count), 0) + 
        COALESCE(SUM(p.downloads_count), 0) * 5 + 
        COALESCE(COUNT(DISTINCT q.question_id), 0) * 3 + 
        COALESCE(COUNT(DISTINCT a.answer_id), 0) * 5
    ) as total_score
FROM users u
LEFT JOIN projects p ON u.user_id = p.user_id AND p.status = 'approved'
LEFT JOIN questions q ON u.user_id = q.user_id
LEFT JOIN answers a ON u.user_id = a.user_id
WHERE u.role = 'student'
GROUP BY u.user_id
ORDER BY total_score DESC;


-- =====================================================
-- VERIFICATION CHECK
-- =====================================================
SELECT 'Database schema setup complete.' as status;